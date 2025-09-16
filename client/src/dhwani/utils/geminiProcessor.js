// // Install the new Google GenAI SDK: npm install @google/genai
// import { GoogleGenAI } from '@google/genai';

// // You'll need to add your Gemini API key here
// const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY ||;

// export class GeminiProcessor {
//   constructor() {
//     if (!GEMINI_API_KEY) {
//       console.error('Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file');
//       return;
//     }

//     // Initialize the new GoogleGenAI client
//     this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
//   }

//   async processComplaintText(text, language = 'en') {
//     if (!GEMINI_API_KEY || !this.ai) {
//       throw new Error('Gemini API key not configured');
//     }

//     try {
//       const prompt = this.buildPrompt(text, language);

//       // Use the new generateContent method from 2025 API
//       const response = await this.ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: prompt,
//         config: {
//           thinkingConfig: {
//             thinkingBudget: 0 // Disable thinking for faster response
//           }
//         }
//       });

//       if (!response.text) {
//         throw new Error('No response from Gemini API');
//       }

//       // Parse JSON response
//       const cleanedResponse = this.cleanJsonResponse(response.text);
//       return JSON.parse(cleanedResponse);

//     } catch (error) {
//       console.error('Gemini processing error:', error);

//       // Fallback to pattern matching if API fails
//       return this.fallbackProcessing(text, language);
//     }
//   }

//   buildPrompt(text, language) {
//     const languageInstruction = language.includes('hi')
//       ? 'The input text is in Hindi/Hinglish. Please extract information and translate title/description to English while preserving meaning.'
//       : 'The input text is in English.';

//     return `
//       ${languageInstruction}

//       Extract complaint information from this user input: "${text}"

//       Analyze the text and return ONLY a valid JSON object with these fields:
//       {
//         "title": "Brief, clear title of the complaint (max 100 chars)",
//         "description": "Detailed description of the issue",
//         "category": "Choose the most appropriate from: Water Supply, Drainage, Street Light, Road/Pothole, Waste Management, Traffic, Noise Pollution, Others",
//         "departmentName": "Choose the most appropriate from: Water Department, PWD, Electricity Board, Municipal Corporation, Traffic Police, Health Department, Others"
//       }

//       Guidelines:
//       - For water issues: category="Water Supply", departmentName="Water Department"
//       - For roads/potholes: category="Road/Pothole", departmentName="PWD"
//       - For street lights: category="Street Light", departmentName="Electricity Board"
//       - For garbage/waste: category="Waste Management", departmentName="Municipal Corporation"
//       - For traffic issues: category="Traffic", departmentName="Traffic Police"
//       - For noise: category="Noise Pollution", departmentName="Municipal Corporation"

//       Return ONLY the JSON object, no additional text or formatting.
//     `;
//   }

//   cleanJsonResponse(response) {
//     // Remove markdown code blocks and extra formatting
//     let cleaned = response.trim();
//     cleaned = cleaned.replace(/```
//     cleaned = cleaned.replace(/```\n?/g, '');
//     cleaned = cleaned.replace(/^\s*[\r\n]/gm, ''); // Remove empty lines

//     // Find the JSON object
//     const jsonStart = cleaned.indexOf('{');
//     const jsonEnd = cleaned.lastIndexOf('}') + 1;

//     if (jsonStart !== -1 && jsonEnd !== -1) {
//       cleaned = cleaned.substring(jsonStart, jsonEnd);
//     }

//     return cleaned;
//   }

//   fallbackProcessing(text, language) {
//     console.log('Using fallback processing for:', text);

//     const lowerText = text.toLowerCase();
//     let category = 'Others';
//     let departmentName = 'Municipal Corporation';

//     // Pattern matching for different complaint types
//     if (lowerText.includes('water') || lowerText.includes('पानी') || lowerText.includes('नल')) {
//       category = 'Water Supply';
//       departmentName = 'Water Department';
//     } else if (lowerText.includes('light') || lowerText.includes('बत्ती') || lowerText.includes('बिजली')) {
//       category = 'Street Light';
//       departmentName = 'Electricity Board';
//     } else if (lowerText.includes('road') || lowerText.includes('pothole') || lowerText.includes('सड़क') || lowerText.includes('गड्ढा')) {
//       category = 'Road/Pothole';
//       departmentName = 'PWD';
//     } else if (lowerText.includes('garbage') || lowerText.includes('waste') || lowerText.includes('कचरा') || lowerText.includes('गंदगी')) {
//       category = 'Waste Management';
//       departmentName = 'Municipal Corporation';
//     } else if (lowerText.includes('traffic') || lowerText.includes('ट्रैफिक') || lowerText.includes('जाम')) {
//       category = 'Traffic';
//       departmentName = 'Traffic Police';
//     } else if (lowerText.includes('drain') || lowerText.includes('sewer') || lowerText.includes('नाली')) {
//       category = 'Drainage';
//       departmentName = 'Municipal Corporation';
//     }

//     return {
//       title: text.substring(0, 80) + (text.length > 80 ? '...' : ''),
//       description: text,
//       category,
//       departmentName
//     };
//   }
// }

// export default new GeminiProcessor();

// client/src/dhwani/utils/geminiProcessor.js
// client/src/dhwani/utils/geminiProcessor.js

import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: "AIzaSyCUc76CujvG2rmno14et27fmNM1TE_Quuw",
});

// Fixed allow-list (must exactly match your backend's expectations)
export const ALLOWED_DEPARTMENTS = [
  "Water Supply",
  "Health and Medical",
  "Sanitation",
  "Electricity",
  "Road and Transport",
  "Education",
  "Other",
];

function normalizeDepartment(value) {
  if (!value) return "Other";
  const hit = ALLOWED_DEPARTMENTS.find(
    (d) => d.toLowerCase() === String(value).trim().toLowerCase()
  );
  return hit || "Other";
}

function sanitizeCategory(value) {
  if (!value) return "Other";
  return String(value).trim().slice(0, 60) || "Other";
}

function sanitizeText(value, maxLength = 200) {
  if (!value) return "";
  return String(value).trim().slice(0, maxLength);
}

/**
 * Process a single voice input sentence and extract all complaint details
 * @param {string} voiceInput - The complete voice input from user
 * @param {string} language - Language code (en/hi)
 * @returns {Object} - {title, description, departmentName, category}
 */
export async function processVoiceComplaint(voiceInput, language = "en") {
  const systemInstruction = `
You read a user's complaint voice input and output STRICT JSON with all necessary complaint details:
{ 
  "title": "<brief complaint title max 100 chars>", 
  "description": "<detailed description max 500 chars>",
  "departmentName": "<one of: Water Supply, Health and Medical, Sanitation, Electricity, Road and Transport, Education, Other>", 
  "category": "<short category label max 50 chars>"
}

Rules:
- Department MUST match exactly one from the list above
- If unsure about department, choose "Other"
- Title should be concise and descriptive
- Description should expand on the issue with details
- Category should be specific (e.g., "Water Leakage", "Power Outage", "Garbage Collection", "Road Damage", "School Infrastructure")
- If input is in Hindi/Hinglish, translate title and description to English but preserve meaning
- Output JSON only. No extra text. No backticks.

Department Mapping Guidelines:
- Water issues, taps, pipes, leakage, पानी, नल → "Water Supply"
- Hospital, medical, health, doctor, अस्पताल, डॉक्टर → "Health and Medical"  
- Garbage, waste, cleaning, toilets, drains, sewage, कचरा, गंदगी → "Sanitation"
- Power cuts, street lights, electrical, बिजली, बत्ती → "Electricity"
- Roads, potholes, traffic, transport, vehicles, सड़क, गड्ढा → "Road and Transport"
- Schools, colleges, education, teachers, स्कूल, शिक्षा → "Education"
- Everything else → "Other"
`.trim();

  const userContent = `
${systemInstruction}

Voice Input: "${voiceInput}"
Language: ${language}
`.trim();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", text: userContent }],
    });

    let text = (response?.text || "").trim();

    text = text.replace(/```[a-zA-Z]*|```/g, "").trim();
    console.log("Raw Gemini response:", text);

    const parsed = JSON.parse(text);

    // Normalize and validate all fields
    const result = {
      title: sanitizeText(parsed.title, 100) || "Complaint",
      description: sanitizeText(parsed.description, 500) || voiceInput,
      departmentName: normalizeDepartment(parsed.departmentName),
      category: sanitizeCategory(parsed.category),
    };

    console.log("Processed voice complaint:", result);
    return result;
  } catch (error) {
    console.error("Gemini processing failed:", error);

    // Fallback processing using pattern matching
    return fallbackProcessing(voiceInput);
  }
}

/**
 * Fallback processing when Gemini API fails
 */
function fallbackProcessing(voiceInput) {
  console.log("🔄 Using fallback processing for:", voiceInput);

  const lowerText = voiceInput.toLowerCase();
  let departmentName = "Other";
  let category = "General Issue";

  // Pattern matching for department
  if (
    hasKeywords(lowerText, ["water", "पानी", "नल", "tap", "pipe", "leakage"])
  ) {
    departmentName = "Water Supply";
    category = "Water Issue";
  } else if (
    hasKeywords(lowerText, [
      "hospital",
      "medical",
      "health",
      "doctor",
      "अस्पताल",
      "डॉक्टर",
    ])
  ) {
    departmentName = "Health and Medical";
    category = "Health Issue";
  } else if (
    hasKeywords(lowerText, [
      "garbage",
      "waste",
      "कचरा",
      "गंदगी",
      "toilet",
      "drain",
      "cleaning",
    ])
  ) {
    departmentName = "Sanitation";
    category = "Sanitation Issue";
  } else if (
    hasKeywords(lowerText, [
      "light",
      "बत्ती",
      "बिजली",
      "power",
      "electricity",
      "current",
    ])
  ) {
    departmentName = "Electricity";
    category = "Power Issue";
  } else if (
    hasKeywords(lowerText, [
      "road",
      "pothole",
      "सड़क",
      "गड्ढा",
      "traffic",
      "transport",
    ])
  ) {
    departmentName = "Road and Transport";
    category = "Road Issue";
  } else if (
    hasKeywords(lowerText, [
      "school",
      "college",
      "education",
      "स्कूल",
      "शिक्षा",
      "teacher",
    ])
  ) {
    departmentName = "Education";
    category = "Education Issue";
  }

  const result = {
    title: voiceInput.substring(0, 80) + (voiceInput.length > 80 ? "..." : ""),
    description: voiceInput,
    departmentName,
    category,
  };

  console.log("📝 Fallback result:", result);
  return result;
}

function hasKeywords(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

export default { processVoiceComplaint, ALLOWED_DEPARTMENTS };
