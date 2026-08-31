# i KISAN — Production Architecture & Integration Guide

**i KISAN** is an AI-powered agronomic decision support and farmer distress early-warning platform designed for Indian agriculture. This guide documents the full-stack architecture, API integration blueprints, and code locations for connecting real-time external services in production.

---

## 1. System Architecture Overview

The system utilizes a secure **full-stack architecture (Express + React + Vite + TypeScript)**:
- **Client (Frontend)**: React 19 single-page application with Tailwind CSS and multilingual audio support (English, Hindi, Odia, Telugu, Malayalam).
- **Server (Backend Proxy)**: Node.js Express server (`server.ts`) proxying all external API calls to safeguard private API keys and sensitive credentials.
- **Container Environment**: Hosted on Google Cloud Run with unified port 3000 ingress routing.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        i KISAN Frontend (SPA)                          │
│  - Multilingual UI (EN, HI, OR, TE, ML)                               │
│  - Disease Detection Lab (Leaf Camera/Upload)                          │
│  - Distress Risk & Simulation Engine                                   │
│  - Agrometeorology & Mandi Market Dashboards                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTP /api/*
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Express Backend (server.ts)                       │
│  - Secure API Key Ingestion (process.env.GEMINI_API_KEY, etc.)         │
│  - Image Payload Buffer & Validation (Base64 / Multipart)              │
│  - Structured JSON Schema Validation                                   │
└──────────────┬───────────────────┬───────────────────┬─────────────────┘
               │                   │                   │
               ▼                   ▼                   ▼
    ┌──────────────────────┐ ┌───────────┐ ┌──────────────────────┐
    │ Google Gemini API    │ │ Weather   │ │ Agmarknet / e-NAM    │
    │ (gemini-2.5-flash)   │ │ (IMD/OWM) │ │ (data.gov.in)        │
    └──────────────────────┘ └───────────┘ └──────────────────────┘
```

---

## 2. Google Gemini API Integration (Vision & Agronomic AI)

### Purpose
- **Leaf Pathogen Vision Analysis**: Diagnoses bacterial blights, fungal rusts, stem borers, and chlorosis from leaf photos.
- **Voice AI Advisory & Query Resolution**: Answers natural language farming questions in regional Indian dialects.
- **Distress Mitigation Suggestions**: Generates personalized action plans based on crop stage, soil type, and climate stress.

### Code Locations
- **Backend Handler**: `/server.ts` (Endpoint: `POST /api/disease-diagnose`)
- **Frontend Component**: `/src/components/disease/DiseaseDetection.tsx`
- **Voice / Natural Chat**: `/src/components/chat/VoiceAssistant.tsx` or `/src/services/voiceService.ts`

### Recommended Model & Configuration
- **Model**: `gemini-2.5-flash` via `@google/genai` SDK
- **Input**: Base64 encoded image string (`data:image/jpeg;base64,...`) and structured crop metadata (`cropName`, `growthStage`, `language`).
- **Output**: Strict JSON conforming to the `DiseaseDiagnosis` interface schema:

```typescript
// server.ts implementation snippet
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageData,
      },
    },
    `Analyze this crop leaf for diseases. Crop: ${cropName}. Output structured recommendations in ${language}.`,
  ],
  config: {
    systemInstruction: "You are an expert ICAR/KVK Plant Pathologist providing precise chemical dosage and organic bio-control remedies.",
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        diseaseName: { type: Type.STRING },
        scientificName: { type: Type.STRING },
        pathogenType: { type: Type.STRING },
        confidenceScore: { type: Type.NUMBER },
        severity: { type: Type.STRING },
        summary: { type: Type.STRING },
        symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
        chemicalRemedy: { type: Type.ARRAY, items: { type: Type.STRING } },
        organicRemedy: { type: Type.ARRAY, items: { type: Type.STRING } },
        preventionTips: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["diseaseName", "severity", "chemicalRemedy", "organicRemedy"],
    },
  },
});
```

---

## 3. Weather & Agrometeorology API Integration

### Purpose
- Fetches hyper-local district/block level forecasts (rainfall probability, relative humidity, wind speed, heatwave warnings).
- Calculates the **Weather Shock Index** parameter for the Farmer Distress Early Warning Score.

### Recommended Providers
1. **India Meteorological Department (IMD) / Mausam API** (Govt. of India)
2. **OpenWeatherMap One Call 3.0 API** or **Tomorrow.io Weather API**
3. **Open-Meteo** (Free open agrometeorological reanalysis for solar radiation and soil moisture)

### Code Locations
- **Backend Route to Implement**: `/server.ts` (Add `GET /api/weather?district={district}&state={state}`)
- **Frontend Weather Display**: `/src/components/dashboard/WeatherSummaryCard.tsx`
- **Data Hook / Service**: `/src/services/weatherService.ts` or `/src/context/AppContext.tsx`

### Production Integration Blueprint

```typescript
// server.ts
app.get("/api/weather", async (req, res) => {
  try {
    const { district, state } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${district},${state},IN&units=metric&appid=${apiKey}`
    );
    const data = await weatherRes.json();
    
    // Transform into standard format required by WeatherSummaryCard
    res.json({
      temperature: Math.round(data.list[0].main.temp),
      humidity: data.list[0].main.humidity,
      rainfallChance: Math.round((data.list[0].pop || 0) * 100),
      windSpeed: Math.round(data.list[0].wind.speed * 3.6),
      forecast: data.list.slice(0, 5).map((item: any) => ({
        day: new Date(item.dt_txt).toLocaleDateString("en-IN", { weekday: "short" }),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch live weather" });
  }
});
```

---

## 4. Mandi & Market Price API Integration

### Purpose
- Tracks APMC daily modal arrivals, minimum, maximum, and modal wholesale rates across state mandis.
- Flags **Price Drop Risk** when the current market price falls below the Minimum Support Price (MSP) or recent 30-day moving average.

### Recommended Providers
1. **data.gov.in Agmarknet API** (`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`)
2. **e-NAM (National Agriculture Market) Real-Time Ticker API**

### Code Locations
- **Backend Route to Implement**: `/server.ts` (Add `GET /api/mandi-prices?crop={cropName}&state={state}`)
- **Frontend Marketplace View**: `/src/components/marketplace/MandiPrices.tsx`
- **Home Dashboard Preview**: `/src/components/dashboard/MandiPreviewCard.tsx`

### Production Integration Blueprint

```typescript
// server.ts
app.get("/api/mandi-prices", async (req, res) => {
  try {
    const { crop, state } = req.query;
    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&filters[state]=${encodeURIComponent(String(state))}&filters[commodity]=${encodeURIComponent(String(crop))}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    res.json({
      records: data.records.map((r: any) => ({
        mandiName: r.market,
        district: r.district,
        currentPrice: parseFloat(r.modal_price),
        minPrice: parseFloat(r.min_price),
        maxPrice: parseFloat(r.max_price),
        arrivalDate: r.arrival_date,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mandi price records" });
  }
});
```

---

## 5. Distress Early-Warning Engine Calculation

The **Distress Risk Index** (`/src/components/distress/DistressSimulator.tsx` and `/src/components/dashboard/DistressRiskCard.tsx`) aggregates 4 core indices:

$$\text{Distress Score} = (0.35 \times W_s) + (0.25 \times P_v) + (0.25 \times M_d) + (0.15 \times D_b)$$

- $W_s$ (Weather Shock): Rainfall deficit percentage or extreme heat anomaly.
- $P_v$ (Pest Vulnerability): Confidence and severity from Gemini Disease Detection.
- $M_d$ (Market Deficit): Difference between MSP/Cost of Production and local Mandi modal rates.
- $D_b$ (Debt Burden): Kisan Credit Card (KCC) loan repayment schedule against harvest countdown.

---

## 6. Production Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```env
# Gemini API Key (Secret, Server-Side Only)
GEMINI_API_KEY=your_gemini_api_key_here

# OpenWeatherMap or IMD API Key
WEATHER_API_KEY=your_weather_api_key_here

# Open Government Data (data.gov.in) Mandi API Key
DATA_GOV_IN_API_KEY=your_data_gov_in_api_key_here
```

### Build & Deployment Scripts
- **Development**: `npm run dev` (Boots `tsx server.ts` with Vite middleware)
- **Production Build**: `npm run build` (Compiles client to `dist/` and backend bundle to `dist/server.cjs`)
- **Start**: `npm start` (Runs Node production server on port 3000)
