import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type ParsedData = {
  intent: "bid" | "sell" | "navigation" | "social" | "unknown";
  target: "analytics" | "auctions" | "orders" | "home" | null;
  crop: "wheat" | "rice" | "corn" | "mustard" | "potato" | "onion" | null;
  amount: number | null;
  price: number | null;
  reply: string;
};

export async function POST(req: Request) {
  const { transcript, language } = await req.json();

  const systemPrompt = `
You are a multilingual agricultural voice assistant designed for Indian farmers and buyers.
User Input: "${transcript}"
Detected Language: ${language}

YOUR TASK:
1. Understand intent (Hindi, Punjabi, English, Hinglish).
2. Normalize meaning (do NOT translate blindly).
3. Extract structured intent.
4. Reply in the SAME language/tone (max 8–10 words).

STRICT OUTPUT: Return ONLY valid JSON. No markdown.

JSON FORMAT:
{
  "intent": "bid" | "sell" | "navigation" | "social" | "unknown",
  "target": "analytics" | "auctions" | "orders" | "home" | null,
  "crop": "wheat" | "rice" | "corn" | "mustard" | "potato" | "onion" | null,
  "amount": number | null,
  "price": number | null,
  "reply": string
}

CROP MAPPING:
गेहूं/gehu/kanak -> "wheat", चावल/chawal/chaul -> "rice", मक्का/makki/corn -> "corn"

EXAMPLES:
Input: "hello, orders dikha" -> {"intent":"navigation","target":"orders","crop":null,"amount":null,"price":null,"reply":"Yeh rahe aapke orders."}
Input: "ki haal aa" -> {"intent":"social","target":null,"crop":null,"amount":null,"price":null,"reply":"Vadiya ji! Daso ki madad karaan?"}
`;

  // ==========================================
  // TIER 1: GEMINI (Primary Cloud Brain)
  // ==========================================
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini Key");

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: systemPrompt,
      config: { temperature: 0.1 },
    });

    const text = result.text
      ?.replace(/```json/gi, "")
      ?.replace(/```/g, "")
      ?.trim();
    const parsedData = JSON.parse(text || "");

    return NextResponse.json({
      success: true,
      data: parsedData,
      source: "tier-1-gemini",
    });
  } catch (geminiError: any) {
    console.warn(
      "⚠️ Tier 1 (Gemini) Failed or Timeout. Initializing Edge-AI...",
    );

    // ==========================================
    // TIER 2: OLLAMA (Local Edge-AI Fallback)
    // ==========================================
    try {
      console.log("🔄 Routing to Local Node (Ollama on port 11434)...");

      const ollamaRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "mistral", // 🚀 Updated to use your existing model
          prompt: systemPrompt,
          stream: false,
          format: "json",
        }),
      });

      if (!ollamaRes.ok) throw new Error("Ollama node offline");

      const ollamaData = await ollamaRes.json();
      const text = ollamaData.response;

      return NextResponse.json({
        success: true,
        data: JSON.parse(text),
        source: "tier-2-edge-ollama",
      });
    } catch (ollamaError: any) {
      console.warn("🚨 Tier 2 (Ollama) Failed. Is the local terminal running?");

      // ==========================================
      // TIER 3: LOCAL REGEX (The Unkillable Failsafe)
      // ==========================================
      console.log("⚙️ Executing Tier 3 Hardcoded Failsafe...");

      const input = transcript.toLowerCase();
      const safeData: ParsedData = {
        intent: "unknown",
        target: null,
        crop: null,
        amount: null,
        price: null,
        reply:
          language === "hi"
            ? "मैं अभी ऑफ़लाइन मोड में हूँ, पर काम कर रहा हूँ।"
            : "Operating in offline mode.",
      };

      const numbers = input.match(/\d+/g)?.map(Number) || [];
      if (input.match(/wheat|kanak|gehu|गेहूं|ਕਣਕ/i)) safeData.crop = "wheat";
      if (input.match(/rice|chawal|chaul|चावल|ਚੌਲ/i)) safeData.crop = "rice";

      if (input.match(/sell|bechna|vechni|बेचना|ਵੇਚਣਾ/i)) {
        safeData.intent = "sell";
        safeData.amount = numbers[0] || null;
        safeData.price = numbers[1] || null;
        safeData.reply = `Offline Mode: Processing ${safeData.crop || "crop"} listing.`;
      } else if (input.match(/bid|bol|बोली|ਬੋਲੀ/i)) {
        safeData.intent = "bid";
        safeData.amount = numbers[0] || null;
        safeData.reply = `Offline Mode: Bid placed for ${numbers[0] || ""}.`;
      } else if (input.match(/mandi|data|analytics|chart/i)) {
        safeData.intent = "navigation";
        safeData.target = "analytics";
        safeData.reply = "Opening offline data view.";
      }

      return NextResponse.json({
        success: true,
        data: safeData,
        source: "tier-3-local-regex",
      });
    }
  }
}