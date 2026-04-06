import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

// Log the API key (first few characters for debugging)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY is not set in environment variables");
  process.exit(1);
}

console.log(`API key found (first 4 chars): ${apiKey.substring(0, 4)}...`);

// Initialize the API client
const genAI = new GoogleGenerativeAI(apiKey);

async function testGeminiAPI() {
  try {
    // List available models
    console.log("Attempting to list available models...");
    const result = await genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
      .generateContent("Hello, what's the weather like today?");
    
    console.log("API test successful!");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("API test failed with error:");
    console.error(JSON.stringify(error, null, 2));
    
    // Provide troubleshooting advice
    console.log("\nTroubleshooting tips:");
    console.log("1. Check if your API key is valid and not expired");
    console.log("2. Verify that billing is enabled for your Google Cloud project");
    console.log("3. Make sure the Gemini API is enabled in your Google Cloud project");
    console.log("4. Check if you have any API restrictions (IP, referrer, etc.)");
    console.log("5. Try generating a new API key from Google AI Studio");
  }
}

testGeminiAPI();