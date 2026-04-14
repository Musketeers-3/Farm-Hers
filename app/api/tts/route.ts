import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text, language } = await req.json();

  // Map our app's language codes to Google's Neural Voice codes
  const googleLangCode = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
  
  // Select the highest quality "Neural2" or "Journey" voices available
  let voiceName = `${googleLangCode}-Neural2-A`;
  if (language === "hi") voiceName = "hi-IN-Neural2-A";
  if (language === "pa") voiceName = "pa-IN-Standard-A"; // Punjabi doesn't have Neural2 yet, but Standard is great
  if (language === "en") voiceName = "en-IN-Neural2-A";

  try {
    if (!process.env.GOOGLE_TTS_API_KEY) {
      throw new Error("Missing GOOGLE_TTS_API_KEY in .env.local");
    }

    const googleRes = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: text },
        voice: { languageCode: googleLangCode, name: voiceName }, 
        audioConfig: { audioEncoding: "MP3" },
      }),
    });

    if (!googleRes.ok) throw new Error("Google Cloud TTS API Error");

    const googleData = await googleRes.json();
    
    return NextResponse.json({ 
      success: true, 
      audioBase64: googleData.audioContent, 
      source: "google-cloud-tts" 
    });

  } catch (error: any) {
    console.warn("🚨 Google TTS Failed:", error.message, "-> Falling back to Browser TTS");
    
    // Tell the frontend to trigger the robotic browser voice as a failsafe
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}