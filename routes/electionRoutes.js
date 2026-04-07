import express from "express";
const router = express.Router();
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/predictions", (req, res) => {
  const mockData = {
    totalSeats: 543,
    predictions: [
      { alliance: "NDA", predictedSeats: 300, color: "#FF9933" },
      { alliance: "I.N.D.I.A", predictedSeats: 200, color: "#138808" },
      { alliance: "Others", predictedSeats: 43, color: "#808080" },
    ],
  };
  res.json(mockData);
});

router.post("/simulate", async (req, res) => {
  try {
    const { scenario } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Act as an expert Indian political analyst. The user presents this hypothetical scenario: "${scenario}". Based on historical data and current political dynamics, predict the likely shift in seat shares out of 543 Lok Sabha seats. Give a concise analysis.`;

    const result = await model.generateContent(prompt);
    res.json({ simulationResult: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Failed to run simulation" });
  }
});

export default router;
