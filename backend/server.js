const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // ✅ LOAD ENV

// ================== BASIC SETUP ==================
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// ================== DEBUG MODE ==================
const DEBUG = true;
const log = (...args) => DEBUG && console.log(...args);

// ================== GEMINI CONFIG ==================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Stable model
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});


// ================== SYSTEM PROMPT ==================
const SYSTEM_PROMPT = `
You are an expert Nutritional Co-Pilot. The user will upload a photo of a food label.
Your goal is NOT to transcribe the text. Your goal is to INFER INTENT and REASON.

1. Identify the Product
2. Infer what the user cares about
3. Analyze ingredients
4. Give a Green, Yellow, or Red verdict

Return strictly JSON:
{
  "product_name": "String",
  "inferred_intent": "String",
  "verdict": "Green | Yellow | Red",
  "reasoning": "String",
  "key_insights": ["String", "String", "String"]
}
`;

// ================== ROUTE ==================
app.post("/analyze", upload.single("label"), async (req, res) => {
  try {
    log("📥 Incoming /analyze request");

    if (!req.file) {
      log("❌ No file uploaded");
      return res.status(400).json({ error: "No image uploaded" });
    }

    log("🖼️ Image received:", req.file.mimetype, req.file.size, "bytes");

    const base64Image = req.file.buffer.toString("base64");

    // ================== GEMINI CALL ==================
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype || "image/jpeg",
        },
      },
    ]);

    const text = result.response.text();

    log("🧠 RAW GEMINI RESPONSE ↓↓↓");
    log(text);

    // ================== SAFE JSON EXTRACTION ==================
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Gemini did not return valid JSON");
    }

    const jsonString = text.substring(jsonStart, jsonEnd);

    let aiData;
    try {
      aiData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("❌ JSON PARSE ERROR:", parseError.message);
      console.error("❌ RAW TEXT:", text);

      return res.status(500).json({
        error: "Invalid JSON from Gemini",
        raw_response: text,
      });
    }

    log("✅ Parsed AI Data:", aiData);

    res.json(aiData);
  } catch (error) {
    // ================== FULL ERROR LOGGING ==================
    console.error("🔥 GEMINI ERROR MESSAGE:", error.message);
    console.error("🔥 GEMINI ERROR STACK:", error.stack);
    console.error("🔥 FULL ERROR OBJECT:", error);

    res.status(500).json({
      product_name: "Unknown",
    inferred_intent: "Analysis failed",
    verdict: "Yellow", // 👈 IMPORTANT fallback
    reasoning: error.message,
    key_insights: [
      "Gemini API error",
      "Check server logs",
      "Retry analysis",
    ]});
  }
});

// ================== SERVER START ==================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
