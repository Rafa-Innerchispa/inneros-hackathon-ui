import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const key = (process.env.GEMINI_API_KEY || "").trim();
const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

if (!key) {
  console.log("FAIL: empty key");
  process.exit(1);
}
console.log("format:", key.startsWith("AQ.") ? "AQ" : key.startsWith("AIza") ? "AIza" : "other");
console.log("model:", model);

async function tryRest(authHeader) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const headers = { "Content-Type": "application/json", ...authHeader };
  const fetchUrl = key.startsWith("AIza") ? `${url}?key=${encodeURIComponent(key)}` : url;
  const res = await fetch(fetchUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ contents: [{ parts: [{ text: "OK" }] }] }),
  });
  const data = await res.json();
  console.log("REST", Object.keys(authHeader)[0] || "query", "->", res.status, (data?.error?.message || "ok").slice(0, 80));
}

async function trySdk() {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const r = await ai.models.generateContent({ model, contents: "OK" });
    console.log("SDK -> ok", (r.text || "").slice(0, 40));
  } catch (e) {
    console.log("SDK -> fail", (e.message || e).slice(0, 100));
  }
}

await tryRest(key.startsWith("AQ.") ? { "x-goog-api-key": key } : {});
if (key.startsWith("AQ.")) await tryRest({ Authorization: `Bearer ${key}` });
await trySdk();
