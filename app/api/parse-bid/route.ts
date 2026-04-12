import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("CRITICAL: GEMINI_API_KEY is missing from .env.local");
      return NextResponse.json(
        { success: false, error: "Missing API Key" },
        { status: 500 },
      );
    }

    // 🚀 Initialize the NEW SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { transcript, language } = await req.json();

    const prompt = `
You are a multilingual agricultural voice assistant designed for Indian farmers and buyers.

The user has spoken the following input:
"${transcript}"

Detected language: ${language}

Your responsibilities:

1. Understand the user's intent even if the input is in Hindi, Punjabi, English, or a mix (Hinglish/Punjabi-English).
2. Normalize the meaning internally (do not translate word-by-word blindly).
3. Extract structured information.
4. Respond in the SAME language and conversational tone as the user.
5. Keep the reply short, natural, and suitable for voice interaction.

STRICT OUTPUT RULES:

* Return ONLY a valid JSON object.
* Do NOT include markdown, code blocks, explanations, or extra text.
* Ensure JSON is parseable.

JSON format:
{
"intent": "bid" | "navigation" | "social" | "unknown",
"target": "analytics" | "auctions" | "orders" | "home" | null,
"crop": "wheat" | "rice" | "maize" | null,
"amount": number | null,
"reply": string
}

INTENT RULES:

* "bid" → user wants to place a bid or mention price
* "navigation" → user wants to open a section (orders, analytics, auctions, home)
* "social" → greetings or casual talk
* "unknown" → unclear meaning

LANGUAGE RULES:

* If input is Hindi → reply in natural Hindi
* If input is Punjabi → reply in natural Punjabi
* If input is Hinglish → reply in Hinglish
* If input is English → reply in English
* Match user's tone (casual, respectful, urgent)

CROP RULES:

* गेहूं / wheat → "wheat"
* चावल / rice → "rice"
* मक्का / makki / maize → "maize"

EXAMPLES:

Input: "bhai 2000 ka bid laga de wheat pe"
Output:
{"intent":"bid","target":null,"crop":"wheat","amount":2000,"reply":"Theek hai, wheat ke liye 2000 ka bid laga diya."}

Input: "mere orders dikha"
Output:
{"intent":"navigation","target":"orders","crop":null,"amount":null,"reply":"Yeh rahe aapke orders."}

Input: "mera data dikha"
Output:
{"intent":"navigation","target":"analytics","crop":null,"amount":null,"reply":"Yeh raha aapka data."}

Input: "ki haal aa, mera order dikha"
Output:
{"intent":"navigation","target":"orders","crop":null,"amount":null,"reply":"Tuhade orders eh rahe."}

Input: "hello"
Output:
{"intent":"social","target":null,"crop":null,"amount":null,"reply":"Hello! Ki madad chahidi hai?"}

`;

    // 🚀 Call the current stable model using the new syntax
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let responseText = response.text || "";

    responseText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    const cleanJson = responseText.slice(jsonStart, jsonEnd);

    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Gemini API Error in Route:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
