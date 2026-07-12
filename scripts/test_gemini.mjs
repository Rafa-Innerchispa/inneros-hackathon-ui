import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const key = process.env.GEMINI_API_KEY || "";
if (!key) {
  console.log("FAIL: GEMINI_API_KEY vacía");
  process.exit(1);
}

console.log("key_format:", key.startsWith("AQ.") ? "AQ_auth_key" : key.startsWith("AIza") ? "AIza_standard" : "unknown");

const ai = new GoogleGenAI({
  apiKey: key,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } },
});

const models = [
  "gemini-2.0-flash",
  "gemini-2.5-flash-preview-05-20",
  "gemini-2.5-flash",
  "gemini-3.5-flash",
];

for (const model of models) {
  try {
    const r = await ai.models.generateContent({
      model,
      contents: "Responde solo: OK",
    });
    console.log(`OK model=${model} text=${(r.text || "").slice(0, 40)}`);
    break;
  } catch (e) {
    const msg = e?.message || String(e);
    console.log(`FAIL model=${model} err=${msg.slice(0, 180)}`);
  }
}
