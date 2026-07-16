import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Voice is not configured", code: "voice_unavailable" }, { status: 503 });
  }

  const incoming = await request.formData();
  const audio = incoming.get("audio");
  const locale = incoming.get("locale") === "en" ? "en" : "es";
  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json({ error: "Audio is required", code: "audio_required" }, { status: 400 });
  }
  if (audio.size > 12_000_000) {
    return NextResponse.json({ error: "Audio is too large", code: "audio_too_large" }, { status: 413 });
  }
  if (!audio.type.startsWith("audio/")) {
    return NextResponse.json({ error: "Unsupported audio type", code: "unsupported_audio" }, { status: 415 });
  }

  const form = new FormData();
  form.append("file", audio, audio.name || "pausa-voice.webm");
  form.append("model", "gpt-4o-transcribe");
  form.append("response_format", "json");
  form.append(
    "prompt",
    locale === "es"
      ? "La persona describe en español un mensaje, llamada o situación digital posiblemente sospechosa. Conserva nombres, cantidades y teléfonos exactamente como se escuchan."
      : "The speaker describes a possibly suspicious digital message, call, or situation. Preserve names, amounts, and phone numbers exactly as heard.",
  );

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("OpenAI transcription failed", response.status, details.slice(0, 300));
    return NextResponse.json({ error: "Transcription unavailable", code: "transcription_failed" }, { status: 502 });
  }

  const result = (await response.json()) as { text?: string };
  const text = result.text?.trim();
  if (!text) return NextResponse.json({ error: "Empty transcript", code: "empty_transcript" }, { status: 502 });
  return NextResponse.json({ text, model: "gpt-4o-transcribe" });
}
