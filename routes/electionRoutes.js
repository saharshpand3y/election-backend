import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const {
      state,
      constituency,
      party,
      previousVote,
      expectedSwing,
      candidateType,
      alliance,
      sentiment,
    } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
        You are an expert Indian political data analyst. The user is simulating an election for a SPECIFIC local constituency.
        Scenario:
        - State: ${state || "Not specified"}
        - Constituency: ${constituency || "Not specified"}
        - Party: ${party || "Not specified"}
        - Previous Vote Share: ${previousVote}%
        - Expected Swing: ${expectedSwing > 0 ? "+" : ""}${expectedSwing}%
        - Candidate Type: ${candidateType}
        - Alliance Support: ${alliance ? "Yes" : "No"}
        - Public Sentiment Score (-1 to 1): ${sentiment}

        Based on these parameters, historical trends, and current political realities, calculate the estimated Win Probability (0 to 100) for this candidate in this specific constituency.
        
        Return the response STRICTLY as a raw, valid JSON object. Do not include markdown formatting, backticks, or text.
        Use exactly this structure where winProbability is a NUMBER (not a string):
        {
          "winProbability": 78.5
        }
        `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const predictionData = JSON.parse(cleanJson);

    res.json(predictionData);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate AI prediction" });
  }
});

export default router;
