import express from "express";
const router = express.Router();
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/", async (req, res) => {
  try {
    const newsResponse = await axios.get(
      `https://newsapi.org/v2/everything?q=indian+election&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`,
    );
    let articles = newsResponse.data.articles.slice(0, 5);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const analyzedArticles = await Promise.all(
      articles.map(async (article) => {
        const prompt = `Analyze the sentiment of this political news headline and return just ONE word (Positive, Negative, or Neutral): "${article.title}"`;
        const result = await model.generateContent(prompt);
        const sentiment = result.response.text().trim();

        return {
          ...article,
          sentiment,
        };
      }),
    );

    res.json({ articles: analyzedArticles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching or analyzing news" });
  }
});

export default router;
