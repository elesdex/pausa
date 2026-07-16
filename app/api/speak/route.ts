import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Voice is not configured", code: "voice_unavailable" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { locale?: string; text?: string } | null;
  const locale = body?.locale === "en" ? "en" : "es";
  const text = body?.text?.trim().slice(0, 3500);
  if (!text) return NextResponse.json({ error: "Text is required", code: "text_required" }, { status: 400 });

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "marin",
      input: text,
      instructions: locale === "es"
        ? "Habla en español mexicano con voz serena, cálida y clara. Ritmo ligeramente lento. No dramatices ni suenes alarmista. Haz pausas breves entre pasos."
        : "Speak in clear, warm English with a calm, slightly slow pace. Do not sound dramatic or alarmist. Pause briefly between steps.",
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("OpenAI speech failed", response.status, details.slice(0, 300));
    return NextResponse.json({ error: "Speech unavailable", code: "speech_failed" }, { status: 502 });
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Pausa-Voice": "ai-generated",
    },
  });
}
