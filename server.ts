import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

// Allow base64 leaf image payloads up to 20MB
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Helper to get GoogleGenAI client safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
  res.json({ status: "ok", geminiConfigured: hasGemini });
});

// Real-Time Weather API Proxy (Open-Meteo & Geocoding)
app.get("/api/weather", async (req, res) => {
  try {
    const lat = req.query.lat ? String(req.query.lat) : "20.19";
    const lon = req.query.lon ? String(req.query.lon) : "85.62";
    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_mean&timezone=auto&forecast_days=7`;
    
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) {
      return res.status(weatherRes.status).json({ error: "Failed to fetch weather from provider" });
    }
    const data = await weatherRes.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch weather" });
  }
});

// 1. Google Gemini Crop Disease Lab Diagnosis & Auto-Crop Identification
app.post("/api/disease-diagnose", async (req, res) => {
  try {
    const { image, cropName = "Auto-Detect", symptoms = [], symptomDescription = "", language = "en" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: "GEMINI_API_KEY is not set. Using offline agronomy knowledge base.",
      });
    }

    const contents: any[] = [];

    // Attach image if provided as base64
    if (image && typeof image === "string" && image.includes("base64,")) {
      const parts = image.split(";base64,");
      const mimeType = parts[0].replace("data:", "") || "image/jpeg";
      const base64Data = parts[1];

      contents.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    const languageNames: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      or: "Odia",
      te: "Telugu",
      ml: "Malayalam",
    };

    const targetLang = languageNames[language] || "English";

    const promptText = `Analyze this agricultural crop plant/leaf sample. 
1. AUTO-IDENTIFY THE CROP PLANT SPECIES: Examine the leaf shape, venation, texture, and visual characteristics to determine the exact crop name (e.g. Tomato, Rice/Paddy, Potato, Cotton, Wheat, Maize, Chilli, Brinjal, Onion, Sugarcane, Groundnut, Mustard, etc.).
2. DIAGNOSE DISEASE / PEST INFESTATION: Examine lesions, chlorosis, fungal spore bodies, or insect damage.
${cropName && cropName !== "Auto-Detect" ? `Hinted Crop: ${cropName}` : "Crop Identification: Auto-detect from image & symptoms"}
Selected Symptoms by Farmer: ${symptoms.join(", ") || "Visual inspection of photo"}
Farmer Voice Note / Description: ${symptomDescription || "None provided"}
Target Language: ${targetLang}

Research and return structured plant pathology diagnosis with accurate ICAR/KVK verified bio-control remedies and chemical dosages with exact dilution units in ${targetLang}.`;

    contents.push(promptText);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: `You are an expert ICAR (Indian Council of Agricultural Research) and State Agriculture University plant pathologist and botanist specializing in South Asian crop diagnostics and species identification.
First, accurately recognize and specify the crop plant name in 'cropName'. Then diagnose the issue, confidence percentage, severity ('Mild', 'Moderate', or 'Severe'), symptoms, immediate recommended actions, biological/organic remedies, chemical treatments with safe dosages, prevention tips, causes, and an agricultural advisory disclaimer in ${targetLang}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING, description: `Identified crop name (e.g. Tomato, Paddy / Rice, Potato, Wheat, Cotton) translated to ${targetLang}` },
            detectedIssue: { type: Type.STRING, description: "Common name of disease/pest and scientific name" },
            confidencePercent: { type: Type.NUMBER, description: "Confidence score between 75 and 99" },
            severity: { 
              type: Type.STRING,
              description: "One of: Mild, Moderate, Severe"
            },
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            biologicalTreatment: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            chemicalTreatment: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            preventionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            causes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            disclaimer: { type: Type.STRING },
          },
          required: [
            "cropName",
            "detectedIssue",
            "confidencePercent",
            "severity",
            "symptoms",
            "recommendedActions",
            "biologicalTreatment",
            "chemicalTreatment",
            "preventionTips",
            "causes",
            "disclaimer",
          ],
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty response received from Gemini");
    }

    const diagnosis = JSON.parse(response.text);

    return res.json({
      success: true,
      diagnosis: {
        ...diagnosis,
        cropName: diagnosis.cropName || (cropName !== "Auto-Detect" ? cropName : "Identified Crop"),
      },
      isGemini: true,
    });
  } catch (error: any) {
    console.error("Gemini Disease Diagnosis Error:", error);
    return res.status(200).json({
      success: false,
      error: error.message || "Gemini processing failed",
      fallback: true,
    });
  }
});

// 2. Google Gemini Agricultural Chatbot Assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], language = "en", farmerProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: "GEMINI_API_KEY is not set. Using offline agronomy assistant rules.",
      });
    }

    const languageNames: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      or: "Odia",
      te: "Telugu",
      ml: "Malayalam",
    };

    const targetLang = languageNames[language] || "English";

    // Build context-aware prompt
    const farmerContext = farmerProfile
      ? `Farmer Profile Context:
- Name: ${farmerProfile.fullName || "Kisan Brother"}
- Location: ${farmerProfile.district || "Khordha"}, ${farmerProfile.state || "Odisha"}, India
- Farm Size: ${farmerProfile.farmAreaAcres || 3} Acres (${farmerProfile.soilType || "Loamy"} Soil)
- Main Crop: ${farmerProfile.mainCrop || "Paddy (Rice)"} (Stage: ${farmerProfile.cropGrowthStage || "Grain Filling"})
- Irrigation: ${farmerProfile.irrigationType || "Borewell & Canal"}`
      : "Context: Smallholder farmer in India asking for agricultural guidance.";

    // Transform chat history into prompt context
    let formattedHistory = "";
    if (Array.isArray(history) && history.length > 0) {
      formattedHistory = "\nRecent Conversation:\n" + 
        history.slice(-4).map((h: any) => `${h.sender === "user" ? "Farmer" : "Assistant"}: ${h.text}`).join("\n");
    }

    const userPrompt = `${farmerContext}
${formattedHistory}

Current Farmer Question: "${message}"

Respond directly to the farmer in ${targetLang}. Provide a clear, actionable, expert agricultural recommendation (fertilizer dosage, weather precautions, disease control, market advice, or government schemes).
Also provide 3 relevant follow-up questions that the farmer can ask next.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: `You are 'i KISAN Agri AI' — an agricultural scientist and farmer advisor for Indian smallholder farmers.
- Keep answers practical, empathetic, and formatted with clean bullet points or short paragraphs.
- Include exact dosage specifications where chemical/biological remedies are mentioned (e.g. ml/liter water, kg/acre).
- Always output in valid JSON with 'text' (your complete response in ${targetLang}) and 'suggestedPrompts' (array of 3 short follow-up questions in ${targetLang}).`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: `Comprehensive agronomic response in ${targetLang}` },
            suggestedPrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `3 short quick-reply follow-up questions in ${targetLang}`,
            },
          },
          required: ["text", "suggestedPrompts"],
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty response received from Gemini Chat");
    }

    const data = JSON.parse(response.text);

    return res.json({
      success: true,
      text: data.text,
      suggestedPrompts: data.suggestedPrompts || [],
      isGemini: true,
    });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return res.status(200).json({
      success: false,
      error: error.message || "Gemini chat failed",
      fallback: true,
    });
  }
});

// Vite middleware for development vs static for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`i KISAN Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
