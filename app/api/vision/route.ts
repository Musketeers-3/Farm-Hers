import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ 1. Validate API Key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in .env.local");
    }

    const body = await req.json();
    const imageBase64: string = body.imageBase64;

    if (!imageBase64) {
      throw new Error("No image data provided.");
    }

    // ✅ 2. Initialize NEW SDK
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // ✅ 3. Prompt (tight + controlled)
    const prompt = `
You are an expert agricultural quality inspector.

Analyze the given crop image.

Return ONLY a valid JSON array (no markdown, no explanation).

Format:
[
  {
    "description": string,
    "score": number (0.70 to 0.99)
  }
]

Rules:
- Return exactly 3 or 4 items
- Scores must be realistic decimals
- Keep descriptions short and professional
`;

    // ✅ 4. Call Gemini (MULTIMODAL)
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0.2,
        responseMimeType: "application/json", // 🔥 forces JSON
      },
    });

    // ✅ 5. Extract response safely
    let text = result.text?.trim() || "";

    // 🧹 Clean just in case (Gemini sometimes gets creative)
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      // fallback if parsing fails
      parsed = [
        {
          description: "Quality analysis unavailable",
          score: 0.75,
        },
      ];
    }

    // ✅ 6. Return response
    return NextResponse.json({
      success: true,
      data: parsed,
    });

  } catch (error: any) {
    console.error("Gemini GenAI Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Image analysis failed",
      },
      { status: 500 }
    );
  }
}