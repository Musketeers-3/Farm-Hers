import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export interface QualityCheckResult {
  grade: "A" | "B" | "C";
  moisture: string;
  foreignMatter: string;
  passed: boolean;
  reason: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY_VISION;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const body = await req.json();
    const imageBase64: string = body.imageBase64;
    if (!imageBase64) throw new Error("No image data provided");

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze this crop image and return a JSON object with these exact fields - no other text:
{"grade":"A","moisture":"< 12%","foreignMatter":"< 1%","passed":true,"reason":"brief reason"}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64,
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const rawText = result.text || "";
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    let parsed: QualityCheckResult;

    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Invalid AI response");
    }

    const data: QualityCheckResult = {
      grade: parsed.grade || "B",
      moisture: parsed.moisture || "Unknown",
      foreignMatter: parsed.foreignMatter || "Unknown",
      passed: parsed.passed ?? (parsed.grade === "A" || parsed.grade === "B"),
      reason: parsed.reason || "Quality assessment completed",
    };

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}