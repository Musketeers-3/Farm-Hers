import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type ParsedData = {
  intent: "bid" | "sell" | "navigation" | "social" | "unknown";
  target:
    | "sell"
    | "auction"
    | "tracking"
    | "market"
    | "profile"
    | "notifications"
    | "earnings"
    | "demands"
    | "pools"
    | null;
  crop: "wheat" | "rice" | "corn" | "mustard" | "potato" | "onion" | null;
  amount: number | null;
  price: number | null;
  reply: string;
};

export async function POST(req: Request) {
  const { transcript, language, context } = await req.json();

  const systemPrompt = `
You are Bolo, a warm, respectful, and highly intelligent agricultural voice assistant for Indian farmers. 
You are speaking to hard-working farmers. You must NEVER sound robotic. NEVER just repeat the user's words.

User Input: "${transcript}"
Detected Language: ${language}
Context (Last Crop): ${context?.lastCrop || "None"}

YOUR MISSION:
1. Extract intent (Hindi, Punjabi, English, Hinglish). Use "Context" if the crop is omitted.
2. Normalize target screens EXACTLY to: ["sell", "auction", "tracking", "market", "profile", "notifications", "earnings", "demands", "pools"].
   - Rules: "mandi", "bhav", "rate" -> "market". "orders" -> "tracking". "corporate", "company" -> "demands".
3. Calculate Standard KGs for "amount" (1 'man'=40kg, 1 'bori'=50kg, 1 'quintal'=100kg).
4. Craft a "reply" (max 8-10 words). It MUST be empathetic, helpful, and natural in the exact language spoken.

FEW-SHOT EXAMPLES FOR THE "reply" FIELD:
Input: "aajkal ka rate kya hai" -> Reply: "Mandi ke taza bhav yeh rahe, bhaiyya."
Input: "ki haal aa" -> Reply: "Main vadiya ji! Daso, kivein madad karaan?"
Input: "2 bori kanak bechni hai" -> Reply: "Bilkul, main tuhadi 100 kilo kanak list kar dinda haan."

STRICT OUTPUT: Return ONLY valid JSON matching this schema exactly.
{
  "intent": "bid" | "sell" | "navigation" | "social" | "unknown",
  "target": "sell" | "auction" | "tracking" | "market" | "profile" | "notifications" | "earnings" | "demands" | "pools" | null,
  "crop": "wheat" | "rice" | "corn" | "mustard" | "potato" | "onion" | null,
  "amount": number | null,
  "price": number | null,
  "reply": "string"
}
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
      config: {
        temperature: 0.1,
        // 🚀 FIXED: Guarantees 100% safe JSON parsing
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(result.text || "{}");

    return NextResponse.json({
      success: true,
      data: parsedData,
      source: "tier-1-gemini",
    });
  } catch (geminiError: any) {
    console.warn("⚠️ Tier 1 (Gemini) Failed. Initializing Edge-AI...");

    // ==========================================
    // TIER 2: OLLAMA (Local Edge-AI Fallback)
    // ==========================================
    try {
      console.log("🔄 Routing to Local Node (Ollama on port 11434)...");
      const ollamaRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "mistral",
          prompt: systemPrompt,
          stream: false,
          format: "json",
        }),
      });

      if (!ollamaRes.ok) throw new Error("Ollama node offline");
      const ollamaData = await ollamaRes.json();

      return NextResponse.json({
        success: true,
        data: JSON.parse(ollamaData.response),
        source: "tier-2-edge-ollama",
      });
    } catch (ollamaError: any) {
      console.warn("🚨 Tier 2 (Ollama) Failed. Triggering Tier 3 Failsafe.");

      // ==========================================
      // TIER 3: LOCAL REGEX (The Unkillable Failsafe)
      // ==========================================
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
            : language === "pa"
              ? "ਮੈਂ ਔਫਲਾਈਨ ਹਾਂ, ਪਰ ਕੰਮ ਕਰ ਰਿਹਾ ਹਾਂ।"
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
        safeData.reply = `Offline Mode: Bid placed for ₹${numbers[0] || ""}.`;
      } else if (input.match(/mandi|data|analytics|chart|bhav|rate/i)) {
        safeData.intent = "navigation";
        safeData.target = "market";
        safeData.reply = "Opening offline market view.";
      }

      return NextResponse.json({
        success: true,
        data: safeData,
        source: "tier-3-local-regex",
      });
    }
  }
}
