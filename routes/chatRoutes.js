import express from "express";
const router = express.Router();
import { GoogleGenerativeAI } from "@google/generative-ai";
import auth from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("WARNING: GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ask", auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const systemPrompt = `You are an AI assistant for an Indian Election Prediction Platform called ElectPulse. Answer the user's political or election-related query accurately and neutrally. Query: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

export default router;
