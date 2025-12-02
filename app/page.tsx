"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [response, setResponse] = useState("");
  const [displayedText, setDisplayedText] = useState("Tap the mic and ask a question.");
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.start();
    setListening(true);

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setListening(false);

      // Start speaking animation
      setSpeaking(true);
      setDisplayedText("Thinking…");

      const res = await fetch("/api/agent", {
        method: "POST",
        body: JSON.stringify({ query: text }),
      });

      const data = await res.json();
      setResponse(data.reply);

      // Typing animation for text
      typeText(data.reply);

      // Speak it out
      const utterance = new SpeechSynthesisUtterance(data.reply);
      utterance.lang = "en-IN";
      utterance.onend = () => setSpeaking(false);
      speechSynthesis.speak(utterance);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const typeText = (text: string) => {
    setDisplayedText("");
    let i = 0;

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;

      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 25); // typing speed
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-8">
      <h1 className="text-3xl font-bold text-white">
        Weather Voice Assistant 🌤️
      </h1>

      <p className="text-center text-gray-300 max-w-md">
        Ask things like:
        <span className="block italic mt-1">
          “What’s the weather in Mumbai?”
          <br />
          “Will it rain in Pune tomorrow?”
        </span>
      </p>

      {/* MIC BUTTON */}
      <button
        onClick={startListening}
        className={`px-8 py-4 rounded-full text-lg font-semibold transition-all ${
          listening
            ? "bg-red-500 animate-pulse"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {listening ? "Listening..." : "🎤 Tap to Speak"}
      </button>

      {/* AI RESPONSE BOX */}
      <div className="bg-[#0f172a] border border-blue-500/40 p-6 rounded-xl max-w-lg w-full text-lg text-gray-100 shadow-md">
        <strong className="text-blue-300">Assistant:</strong>

        {/* Typing Text */}
        <div className="mt-2 min-h-[60px]">
          {displayedText}
        </div>

        {/* SPEAKING WAVE ANIMATION */}
        {speaking && (
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-1.5 h-6 bg-blue-400 animate-wave1 rounded"></div>
            <div className="w-1.5 h-6 bg-blue-400 animate-wave2 rounded"></div>
            <div className="w-1.5 h-6 bg-blue-400 animate-wave3 rounded"></div>
            <div className="w-1.5 h-6 bg-blue-400 animate-wave4 rounded"></div>
          </div>
        )}
      </div>

      {/* WAVE ANIMATIONS */}
      <style jsx>{`
        @keyframes wave1 {
          0% { height: 6px; }
          50% { height: 28px; }
          100% { height: 6px; }
        }

        @keyframes wave2 {
          0% { height: 12px; }
          50% { height: 34px; }
          100% { height: 12px; }
        }

        @keyframes wave3 {
          0% { height: 8px; }
          50% { height: 26px; }
          100% { height: 8px; }
        }

        @keyframes wave4 {
          0% { height: 14px; }
          50% { height: 32px; }
          100% { height: 14px; }
        }

        .animate-wave1 { animation: wave1 0.8s infinite ease-in-out; }
        .animate-wave2 { animation: wave2 0.8s infinite ease-in-out; }
        .animate-wave3 { animation: wave3 0.8s infinite ease-in-out; }
        .animate-wave4 { animation: wave4 0.8s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
