import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyB2JgEMSTkFctdDBr6B3XnYnzRpP1mTanI",
});

// Fixed allow-list (must exactly match your backend’s expectations)
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

/**
 * Returns: { department, category, confidence }
 */
export async function getDeptAndCatJSON({ title, description }) {
  const systemInstruction = `
You read a complaint's title and description and output STRICT JSON:
{ "department": "<one of: Water Supply, Health and Medical, Sanitation, Electricity, Road and Transport, Education, Other>", "category": "<short label>", "confidence": 0.0-1.0 }
Rules:
- Department MUST match exactly one from the list.
- If unsure, choose "Other".
- Category must be concise (e.g., "Leakage", "Power Outage", "Garbage Accumulation", "Road Damage", "School Infrastructure").
- Output JSON only. No extra text. No backticks.
`.trim();

  const userContent = `
${systemInstruction}

Title: ${title || ""}
Description: ${description || ""}
`.trim();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", text: userContent }],
  });

  let text = (response?.text || "").trim();
  // Strip ```json or ``` if present
  text = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(text);

    const department = normalizeDepartment(parsed.department);
    const category = sanitizeCategory(parsed.category);
    const confidence =
      typeof parsed.confidence === "number"
        ? Math.max(0, Math.min(1, parsed.confidence))
        : null;

    return { department, category, confidence };
  } catch (e) {
    console.error("AI JSON parse failed:", text);
    return { department: "Other", category: "Other", confidence: null };
  }
}

// Usage example
(async () => {
  const complaint = {
    title: "Waste gathering near Bombay hospital",
    description:
      "Yesterday I saw a huge amount of medical waste near Bombay hospital, it can be very dangerous please take care of it",
  };

  const result = await getDeptAndCatJSON(complaint);
  console.log(result);
  // Expected output: { department: "Sanitation", category: "Medical Waste Accumulation", confidence: 0.9 }
})();
