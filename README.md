

---

# 🌤️ Voice Weather Assistant

A fast, lightweight **voice-activated weather assistant** built using **Next.js**, **Google Gemini 2.5**, and **OpenWeatherMap**.
Speak naturally → The assistant fetches real-time weather data → Gemini generates a natural reply → The browser speaks it back to you.

---

## 🚀 How It Works

This app uses a simple but powerful pipeline:

### **1. Voice Input**

The user taps the mic →
Browser’s **Web Speech API** converts **voice → text** instantly.

### **2. Send Query to Next.js API**

Your backend receives the recognized text at:

```
/api/agent
```

### **3. Gemini Processing**

Gemini 2.5 Flash:

* Understands your question
* Extracts the city name
* Determines user intent (weather today, tomorrow, rain, temp, etc.)

### **4. Real-Time Weather API**

Backend calls **OpenWeatherMap** and retrieves:

* Temperature
* Condition
* Humidity
* Wind
* Forecast

### **5. Merge Weather + AI**

Gemini generates a **smart, friendly response** using the fresh data.

### **6. Voice Output**

Browser’s **SpeechSynthesis** API converts text → voice.
The UI also displays a **typing animation** of the response.

---

## 🛠️ Tech Stack

### **Frontend**

* Next.js 15
* TailwindCSS
* Web Speech API (speech → text)
* SpeechSynthesis API (text → speech)
* Typing animation UI

### **Backend (API Route)**

* Google Gemini 2.5 Flash (`@google/genai`)
* OpenWeatherMap API
* Next.js Server Actions / API Routes

---



---

## 📦 Installation

### 1. Clone Repo

```bash
git clone https://github.com/harshkandera/voice-weather.git
cd voice-weather
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_weather_api_key
```

### 4. Run Locally

```bash
npm run dev
```

Open:

👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔍 Example Queries

Try speaking:

* **“What’s the weather in Mumbai right now?”**
* **“Will it rain in Pune tomorrow?”**
* **“Tell me humidity in Delhi today.”**
* **“What’s the temperature in Jaipur?”**

---

## ✨ UI Features

* 🎤 **One-tap microphone**
* 🎧 **Voice response**
* ⌨️ **Smooth typing animation**
* 🌦️ **Smart weather detection**
* ⚡ **Fast response using Gemini 2.5 Flash**
* 🔄 **No backend server or LiveKit required**

---

## 📁 Project Structure (Simplified)

```bash
client/
│── app/
│   ├── page.tsx       # Main UI with mic + typing animation
│   └── api/agent/route.ts  # Weather + Gemini API backend
│── public/
│── styles/
│── package.json
│── README.md
```

---

## 🧠 Future Enhancements (Optional)

* 🌍 Support Hindi & Marathi voice commands
* 🌧️ 5-Day forecast integration
* 📱 Convert to PWA (Voice Weather App)
* 🗺️ Auto-detect city using geolocation
* 🎨 Add animated weather icons



