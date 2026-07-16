"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Locale = "es" | "en";
type Screen = "home" | "intake" | "analyzing" | "result";
type Risk = "low" | "medium" | "high" | "uncertain";

type Analysis = {
  risk: Risk;
  title: string;
  summary: string;
  signals: string[];
  nextSteps: string[];
  learning: string;
  emergency: boolean;
  model: string;
  demoMode?: boolean;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const copy = {
  es: {
    language: "English",
    eyebrow: "Ayuda para momentos de incertidumbre digital",
    headline: "Primero, pausa.",
    subhead:
      "Si un mensaje te asustó o te está presionando, no respondas todavía. Lo revisamos contigo, con calma.",
    start: "Revisar algo sospechoso",
    demo: "Probar con un ejemplo",
    privacy: "Nada se analiza hasta que tú lo compartes.",
    notEmergency: "Pausa no sustituye a los servicios de emergencia.",
    intakeTitle: "¿Qué tienes a la mano?",
    intakeHelp: "Elige la opción más fácil. No necesitas saber hacer una captura.",
    camera: "Tomar una foto",
    cameraHelp: "Apunta la cámara al mensaje en otra pantalla.",
    upload: "Elegir foto o captura",
    uploadHelp: "Si ya la tienes guardada.",
    textLabel: "O pega o escribe el mensaje",
    textPlaceholder: "Ejemplo: Se hizo un depósito. Si no lo reconoce, llame ahora…",
    voice: "Contármelo con voz",
    stopVoice: "Terminar de escuchar",
    listening: "Te escucho… habla con calma.",
    review: "Revisar ahora",
    back: "Volver",
    removeImage: "Quitar imagen",
    chosenImage: "Imagen lista para revisar",
    analyzingTitle: "Lo estamos revisando",
    analyzingBody: "No hagas clic, no llames y no compartas datos mientras revisamos.",
    resultEyebrow: "Orientación, no garantía",
    signals: "Señales que encontramos",
    next: "Qué hacer ahora",
    learning: "Para la próxima",
    speak: "Escuchar en voz alta",
    stopSpeak: "Detener voz",
    newCheck: "Revisar otro mensaje",
    disclaimer:
      "Pausa identifica señales de riesgo, pero puede equivocarse. Verifica siempre por un canal oficial que tú ya conozcas.",
    error: "No pudimos revisar esto todavía. Intenta con texto o una imagen más pequeña.",
    textRequired: "Comparte una imagen, escribe el mensaje o cuéntamelo con voz.",
    demoBadge: "Modo de demostración",
    stepOne: "1. No respondas",
    stepTwo: "2. Comparte lo que ves",
    stepThree: "3. Sigue un paso seguro",
  },
  en: {
    language: "Español",
    eyebrow: "Help for moments of digital uncertainty",
    headline: "First, pause.",
    subhead:
      "If a message scared or pressured you, do not respond yet. We will review it with you, calmly.",
    start: "Check something suspicious",
    demo: "Try a guided example",
    privacy: "Nothing is analyzed until you choose to share it.",
    notEmergency: "Pausa does not replace emergency services.",
    intakeTitle: "What do you have available?",
    intakeHelp: "Choose the easiest option. You do not need to know how to take a screenshot.",
    camera: "Take a photo",
    cameraHelp: "Point your camera at the message on another screen.",
    upload: "Choose a photo or screenshot",
    uploadHelp: "If you already have one saved.",
    textLabel: "Or paste or type the message",
    textPlaceholder: "Example: A deposit was made. If you do not recognize it, call now…",
    voice: "Tell me using your voice",
    stopVoice: "Stop listening",
    listening: "I am listening… take your time.",
    review: "Check it now",
    back: "Back",
    removeImage: "Remove image",
    chosenImage: "Image ready to review",
    analyzingTitle: "We are checking it",
    analyzingBody: "Do not click, call, or share information while we review it.",
    resultEyebrow: "Guidance, not a guarantee",
    signals: "Signals we found",
    next: "What to do now",
    learning: "For next time",
    speak: "Listen out loud",
    stopSpeak: "Stop voice",
    newCheck: "Check another message",
    disclaimer:
      "Pausa identifies risk signals, but it can be wrong. Always verify through an official channel you already know.",
    error: "We could not review this yet. Try text or a smaller image.",
    textRequired: "Share an image, type the message, or tell me with your voice.",
    demoBadge: "Demonstration mode",
    stepOne: "1. Do not respond",
    stepTwo: "2. Share what you see",
    stepThree: "3. Take one safe step",
  },
} as const;

const demoMessages = {
  es: "AVISO BANCO: Se está realizando un depósito por $18,450. Si usted no reconoce esta operación, llame inmediatamente al 55 0000 1234 para cancelarla.",
  en: "BANK ALERT: A deposit of $18,450 is being processed. If you do not recognize this transaction, call 555-000-1234 immediately to cancel it.",
};

export default function Home() {
  const [locale, setLocale] = useState<Locale>("es");
  const [screen, setScreen] = useState<Screen>("home");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const t = copy[locale];

  const riskLabel = useMemo(() => {
    if (!analysis) return "";
    const labels = {
      es: { high: "Riesgo alto", medium: "Riesgo medio", low: "Riesgo bajo", uncertain: "No es posible saberlo aún" },
      en: { high: "High risk", medium: "Medium risk", low: "Low risk", uncertain: "Not enough information yet" },
    };
    return labels[locale][analysis.risk];
  }, [analysis, locale]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      window.speechSynthesis?.cancel();
    };
  }, [imagePreview]);

  function reset() {
    setMessage("");
    setImageFile(null);
    setImagePreview(null);
    setAnalysis(null);
    setError("");
    setScreen("intake");
  }

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  function toggleVoice() {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setError(locale === "es" ? "Tu navegador no ofrece dictado aquí. Puedes escribir el mensaje." : "Voice input is not available in this browser. You can type the message.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = locale === "es" ? "es-MX" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ");
      setMessage((current) => `${current} ${transcript}`.trim());
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setError("");
  }

  async function runAnalysis(useDemo = false) {
    const text = useDemo ? demoMessages[locale] : message.trim();
    if (!text && !imageFile) {
      setError(t.textRequired);
      return;
    }

    setScreen("analyzing");
    setError("");

    try {
      const form = new FormData();
      form.append("locale", locale);
      form.append("text", text);
      form.append("demo", String(useDemo));
      if (imageFile) form.append("image", imageFile);

      const response = await fetch("/api/analyze", { method: "POST", body: form });
      if (!response.ok) throw new Error("Analysis failed");
      const result = (await response.json()) as Analysis;
      setAnalysis(result);
      setScreen("result");
    } catch {
      setError(t.error);
      setScreen("intake");
    }
  }

  function speakResult() {
    if (!analysis || !window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance(
      `${analysis.title}. ${analysis.summary}. ${t.next}: ${analysis.nextSteps.join(". ")}`,
    );
    speech.lang = locale === "es" ? "es-MX" : "en-US";
    speech.rate = 0.9;
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("home")} aria-label="Pausa home">
          <span className="brand-mark" aria-hidden="true">Ⅱ</span>
          <span>Pausa</span>
        </button>
        <button className="language-button" onClick={() => setLocale(locale === "es" ? "en" : "es")}>
          {t.language}
        </button>
      </header>

      {screen === "home" && (
        <section className="home-screen screen-enter">
          <div className="calm-orbit" aria-hidden="true"><span>Ⅱ</span></div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.headline}</h1>
          <p className="lead">{t.subhead}</p>
          <button className="primary-button" onClick={() => setScreen("intake")}>{t.start}</button>
          <button className="text-button" onClick={() => runAnalysis(true)}>{t.demo}</button>
          <div className="three-steps" aria-label="How Pausa works">
            <span>{t.stepOne}</span><span>{t.stepTwo}</span><span>{t.stepThree}</span>
          </div>
          <p className="privacy-note"><span aria-hidden="true">●</span> {t.privacy}</p>
        </section>
      )}

      {screen === "intake" && (
        <section className="intake-screen screen-enter">
          <button className="back-button" onClick={() => setScreen("home")}>← {t.back}</button>
          <p className="eyebrow">Pausa</p>
          <h1>{t.intakeTitle}</h1>
          <p className="lead compact">{t.intakeHelp}</p>

          <div className="capture-grid">
            <button className="capture-card" onClick={() => cameraRef.current?.click()}>
              <span className="capture-icon" aria-hidden="true">◎</span>
              <span><strong>{t.camera}</strong><small>{t.cameraHelp}</small></span>
            </button>
            <button className="capture-card" onClick={() => uploadRef.current?.click()}>
              <span className="capture-icon" aria-hidden="true">▧</span>
              <span><strong>{t.upload}</strong><small>{t.uploadHelp}</small></span>
            </button>
          </div>
          <input ref={cameraRef} className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={chooseImage} />
          <input ref={uploadRef} className="visually-hidden" type="file" accept="image/*" onChange={chooseImage} />

          {imagePreview && (
            <div className="image-preview-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt={t.chosenImage} />
              <div><strong>{t.chosenImage}</strong><button onClick={() => { setImageFile(null); setImagePreview(null); }}>{t.removeImage}</button></div>
            </div>
          )}

          <label className="message-label" htmlFor="message">{t.textLabel}</label>
          <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t.textPlaceholder} rows={5} />

          <button className={`voice-button ${isListening ? "listening" : ""}`} onClick={toggleVoice}>
            <span aria-hidden="true">{isListening ? "■" : "●"}</span>
            {isListening ? t.stopVoice : t.voice}
          </button>
          {isListening && <p className="listening-note">{t.listening}</p>}
          {error && <p className="error-message" role="alert">{error}</p>}
          <button className="primary-button" onClick={() => runAnalysis(false)}>{t.review}</button>
        </section>
      )}

      {screen === "analyzing" && (
        <section className="analyzing-screen screen-enter" aria-live="polite">
          <div className="breathing-circle"><span>Ⅱ</span></div>
          <h1>{t.analyzingTitle}</h1>
          <p className="lead compact">{t.analyzingBody}</p>
          <div className="loading-line"><span /></div>
        </section>
      )}

      {screen === "result" && analysis && (
        <section className="result-screen screen-enter">
          <p className="eyebrow">{t.resultEyebrow}</p>
          <div className={`risk-card risk-${analysis.risk}`}>
            <span className="risk-pill">{riskLabel}</span>
            <h1>{analysis.title}</h1>
            <p>{analysis.summary}</p>
            {analysis.demoMode && <span className="demo-badge">{t.demoBadge}</span>}
          </div>

          <article className="result-section">
            <h2>{t.signals}</h2>
            <ul>{analysis.signals.map((signal) => <li key={signal}><span aria-hidden="true">!</span>{signal}</li>)}</ul>
          </article>
          <article className="result-section action-section">
            <h2>{t.next}</h2>
            <ol>{analysis.nextSteps.map((step) => <li key={step}>{step}</li>)}</ol>
          </article>
          <article className="learning-card">
            <span aria-hidden="true">✦</span><div><h2>{t.learning}</h2><p>{analysis.learning}</p></div>
          </article>

          <button className="secondary-button" onClick={speakResult}>{isSpeaking ? t.stopSpeak : t.speak}</button>
          <button className="primary-button" onClick={reset}>{t.newCheck}</button>
          <p className="disclaimer">{t.disclaimer}</p>
        </section>
      )}

      <footer>{t.notEmergency}</footer>
    </main>
  );
}
