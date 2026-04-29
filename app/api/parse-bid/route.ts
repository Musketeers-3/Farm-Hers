import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// ⚡ STRICT SYNC WITH frontend/client.tsx VALID_SCREENS
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
    | null;
  crop: "wheat" | "rice" | "corn" | "mustard" | "potato" | "onion" | null;
  amount: number | null;
  price: number | null;
  reply: string;
};

export async function POST(req: Request) {
  // ⚡ DESTRUCTURING CONTEXT PIPELINE FROM BOLO
  const { transcript, language, context } = await req.json();

  const systemPrompt = `
You are Bolo, a warm, respectful, and highly intelligent agricultural voice assistant for Indian farmers. 
You are speaking to hard-working farmers. You must NEVER sound robotic. NEVER just repeat the user's words.

User Input: "${transcript}"
Detected Language: ${language}
Context (Last Crop): ${context?.lastCrop || "None"}

YOUR MISSION:
1. Extract intent. Use "Context" if the crop is omitted.
2. Normalize target screens EXACTLY to: ["sell", "auction", "tracking", "market", "profile", "notifications", "earnings", "demands", "pools"].
   - Rules: "mandi", "bhav", "rate", "daam" -> "market". "orders" -> "tracking". "corporate", "company" -> "demands".
3. Calculate Standard KGs for "amount" (1 'man'=40kg, 1 'bori'=50kg, 1 'quintal'=100kg).
4. Craft a "reply" (max 8-10 words). It MUST be empathetic, helpful, and natural.
   - 🚀 CRITICAL: You MUST reply in Romanized Hindi (Hinglish) or Romanized Punjabi (Punglish). NEVER use Devanagari (हिंदी) or Gurmukhi (ਪੰਜਾਬੀ) scripts. This is required for our TTS engine.

FEW-SHOT EXAMPLES FOR THE "reply" FIELD:
Input: "aajkal ka rate kya hai" -> Reply: "Mandi ke taza bhav yeh rahe, bhaiyya."
Input: "ki haal aa" -> Reply: "Main vadiya ji! Daso, kivein madad karaan?"
Input: "2 bori kanak bechni hai" -> Reply: "Bilkul, main tuhadi 100 kilo kanak list kar dinda haan."
Input: "sell my potatoes" -> Reply: "Sure, let's get your potatoes listed on the market."

STRICT OUTPUT: Return ONLY valid JSON matching this schema exactly.
{
  "intent": "bid" | "sell" | "navigation" | "social" | "unknown",
  "target": "sell" | "auction" | "tracking" | "market" | "profile" | "notifications" | "earnings" | "demands" | "pools" | null,
  "crop": "wheat" | "rice" | "corn" | "mustard" | "potato" | "onion" | null,
  "amount": number | null,
  "price": number | null,
  "reply": "string (Romanized text only!)"
}
`;

  // ==========================================
  // TIER 1: GEMINI (Primary Cloud Brain)
  // ==========================================
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini Key");

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const result = await ai.models.generateContent({
      // 🚀 THE FIX: The active, free-tier-friendly 2026 model alias
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: {
        temperature: 0.1,
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
    console.error("GEMINI FATAL ERROR:", geminiError);
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
          model: "qwen2",
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
            ? "ऑफलाइन मोड में हूं, फिर भी मदद करता हूं।"
            : "Operating offline, but still here to help.",
      };

      const numbers = input.match(/\d+/g)?.map(Number) || [];

      // Crop detection - expanded patterns
      if (
        input.match(/wheat|kanak|gehu|gehu|गेहू|गेहूं|ਕਣਕ|कनक/i)
      ) {
        safeData.crop = "wheat";
      } else if (input.match(/rice|chawal|chaul|चावल|ਚੌਲ/i)) {
        safeData.crop = "rice";
      } else if (
        input.match(/corn|makka|makki|मक्का|ਮੱਕੀ|maize/i)
      ) {
        safeData.crop = "corn";
      } else if (
        input.match(/mustard|sarson|sarso|सरसों|ਸਰ੍ਹੋਂ/i)
      ) {
        safeData.crop = "mustard";
      } else if (input.match(/potato|aloo|आलू|ਆਲੂ/i)) {
        safeData.crop = "potato";
      } else if (input.match(/onion|pyaaz|piaj|प्याज|ਪਿਆਜ਼/i)) {
        safeData.crop = "onion";
      }

      // Intent detection - expanded patterns
      if (
        input.match(
          /sell|bechna|vechni|बेच|vech|bej|list|add|create|नीलाम/i,
        )
      ) {
        safeData.intent = "sell";
        safeData.amount = numbers[0] || 10; // Default to 10 if not specified
        safeData.price = numbers[1] || 2000; // Default price
        safeData.reply = safeData.crop
          ? language === "hi"
            ? `${safeData.crop} बेचने की तैयारी।`
            : `Preparing to sell ${safeData.crop}.`
          : "Preparing to list your crop.";
      } else if (
        input.match(/bid|bol|boli|buy|purchase|खरीद|khareed|बोली|lagao/i)
      ) {
        safeData.intent = "bid";
        safeData.amount = numbers[0] || 10;
        safeData.reply = safeData.crop
          ? language === "hi"
            ? `${safeData.crop} के लिए बोली लगाओ।`
            : `Place bid for ${safeData.crop}.`
          : "Place your bid.";
      } else if (
        input.match(
          /mandi|bhav|rate|price|market|daam|भाव|analytics|chart|daak|मंडी/i,
        )
      ) {
        safeData.intent = "navigation";
        safeData.target = "market";
        safeData.reply = language === "hi"
          ? "मंडी भाव दिखा रहा हूं।"
          : "Showing market rates.";
      } else if (
        input.match(/auction|nilam|नीलाम|leelam|bidding|लिस्ट/i)
      ) {
        safeData.intent = "navigation";
        safeData.target = "auction";
        safeData.reply = language === "hi"
          ? "नीलामी खोल रहा हूं।"
          : "Opening auctions.";
      } else if (
        input.match(
          /track|order|status|delivery|order|hawi|लेन|लेनदेन/i,
        )
      ) {
        safeData.intent = "navigation";
        safeData.target = "tracking";
        safeData.reply = language === "hi"
          ? "ऑर्डर स्टेटस दिखा रहा हूं।"
          : "Showing order status.";
      } else if (input.match(/hello|hi|hey|namaste|नमस्ते/i)) {
        safeData.intent = "social";
        safeData.reply = language === "hi"
          ? "नमस्ते! कैसे मदद कर सकता हूं?"
          : "Namaste! How can I help?";
      } else if (input.match(/pool|pool|joint|जोड़/i)) {
        safeData.intent = "navigation";
        safeData.target = "pools";
        safeData.reply = language === "hi"
          ? "पूल खोल रहा हूं।"
          : "Opening pools.";
      }. else if (input.match(/profile|account|मेरा/i)) {
        safeData.intent = "navigation";
        safeData.target = "profile";
        safeData.reply = language === "hi"
          ? "प्रोफाइल खोल रहा हूं।"
          : "Opening profile.";
      }

      return NextResponse.json({
        success: true,
        data: safeData,
        source: "tier-3-local-regex",
      });
    }
  }
}
