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

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { transcript, language } = await req.json();

    const prompt = `
You are a multilingual agricultural voice assistant designed for Indian farmers and buyers.

The user has spoken the following input:
"${transcript}"

Detected language: ${language}

Your responsibilities:
1. Understand the user's intent even if the input is in Hindi, Punjabi, English, or a mix.
2. Normalize the meaning internally.
3. Extract structured information.
4. Respond in the SAME language and conversational tone as the user.
5. Keep the reply short, natural, and suitable for voice interaction.

STRICT OUTPUT RULES:
* Return ONLY a valid JSON object.
* Do NOT include markdown, code blocks, explanations, or extra text.

JSON format:
{
"intent": "bid" | "sell" | "navigation" | "social" | "unknown",
"target": "analytics" | "auctions" | "orders" | "home" | null,
"crop": "wheat" | "rice" | "corn" | "mustard" | "potato" | "onion" | null,
"amount": number | null, 
"price": number | null,
"reply": string
}

INTENT RULES:
* "sell" → farmer wants to create a new crop listing/auction (extract crop, amount in quintals, and price).
* "bid" → buyer wants to place a bid.
* "navigation" → user wants to open a section.
* "social" → greetings.

CROP RULES (Map to these exact English IDs):
* गेहूं / wheat / kanak → "wheat"
* चावल / rice / chawal → "rice"
* मक्का / makki / maize / corn → "corn"
* सरसों / sarson / mustard → "mustard"

EXAMPLES:
Input: "Main 50 quintal kanak vechni hai 2500 de rate te" (Punjabi)
Output:
{"intent":"sell","target":null,"crop":"wheat","amount":50,"price":2500,"reply":"Tuhadi 50 quintal kanak di nilami 2500 rupaye te shuru kar diti gayi hai."}

Input: "mujhe 100 quintal chawal bechna hai 3000 par" (Hindi)
Output:
{"intent":"sell","target":null,"crop":"rice","amount":100,"price":3000,"reply":"Theek hai, 100 quintal chawal ki nilami 3000 rupaye par shuru ho gayi hai."}

Input: "bhai 2000 ka bid laga de wheat pe"
Output:
{"intent":"bid","target":null,"crop":"wheat","amount":2000,"price":null,"reply":"Theek hai, wheat ke liye 2000 ka bid laga diya."}
`;

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
