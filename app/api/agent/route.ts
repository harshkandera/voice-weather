import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY });

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const extractPrompt = `
You are a weather query analyzer.
User said: "${query}"

Return ONLY valid JSON:
{
  "city": "<city>",
  "intent": "current_weather" | "tomorrow_weather"
}

If user mentions "tomorrow" → intent = "tomorrow_weather".
Otherwise → "current_weather".
`;

    const extraction = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: extractPrompt,
      config: { responseMimeType: "application/json" }
    });

    const raw = extraction.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!raw) {
      throw new Error("No text returned from Gemini extraction step");
    }

    let city = null;
    let intent = "current_weather";

    try {
      const cleanJson = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      city = parsed.city;
      intent = parsed.intent;
    } catch (err) {
      console.error("JSON parsing error:", raw);

      return NextResponse.json({
        reply: "I couldn't understand that. Please say something like 'What's the weather in Mumbai?'",
      });
    }

    if (!city) {
      return NextResponse.json({
        reply: "I couldn't detect a city. Try asking: 'What's the weather in Mumbai?'",
      });
    }

    // -------- Step 2: Fetch weather data --------
    let data;

    // Check if API Key is available
    if (!process.env.OPENWEATHER_API_KEY) {
      console.error("Missing OPENWEATHER_API_KEY");
      return NextResponse.json({ reply: "Server configuration error: Missing Weather API Key." });
    }

    try {
      if (intent === "current_weather") {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        data = await res.json();
      } else {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        const forecast = await res.json();
        data = forecast.list?.[8]; // ~24 hours ahead
      }
    } catch (weatherErr) {
      console.error("Weather API Error:", weatherErr);
      return NextResponse.json({
        reply: `I couldn't find weather data for ${city}. Please check the city name.`,
      });
    }

    if (!data || (data.cod && data.cod !== 200 && data.cod !== "200")) {
      return NextResponse.json({
        reply: `I couldn't find weather data for ${city}. Try another one.`,
      });
    }

    // -------- Step 3: Ask Gemini to make a natural voice response --------
    const responsePrompt = `
Write a natural, friendly 1–2 sentence weather update for voice output.

City: ${city}
Intent: ${intent}
Weather Data: ${JSON.stringify(data)}

Examples:
"Let me check that for you... The weather in Mumbai is 28°C and sunny."
"Tomorrow in Pune there is a 60% chance of rain."
`;

    const final = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: responsePrompt,
    });

    // FIX: Access text directly here as well
    const reply = final.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({ reply });

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({
      reply: "Something went wrong while processing your request.",
    });
  }
}