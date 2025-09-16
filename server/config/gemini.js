// server/config/gemini.js
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// Initialize once with API key
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Return a wrapper object with generateContent
export const getGeminiModel = (modelName = "gemini-2.5-flash") => {
  return {
    generateContent: async (prompt) => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      return response; // response object
    },
  };
};
