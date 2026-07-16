"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Locale = "es" | "en";
type Screen = "home" | "intake" | "analyzing" | "result" | "install";
type Risk = "low" | "medium" | "high" | "uncertain";
type DeviceGuide = "iphoneFace" | "iphoneHome" | "android" | "other";

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
    install: "Poner Pausa en mi pantalla",
    privacy: "Nada se analiza hasta que tú lo compartes.",
    notEmergency: "Pausa no sustituye a los servicios de emergencia.",
    intakeTitle: "¿Qué tienes a la mano?",
    intakeHelp: "Elige la opción más fácil. No necesitas saber hacer una captura.",
    screenshotHelp: "No sé hacer una captura",
    screenshotTitle: "Te guiamos paso a paso",
    screenshotIntro: "Detectamos una guía probable para tu dispositivo. Puedes cambiarla si no coincide.",
    iphoneFace: "iPhone sin botón frontal",
    iphoneHome: "iPhone con botón frontal",
    android: "Android",
    otherDevice: "Otro dispositivo",
    closeGuide: "Cerrar guía",
    installTitle: "Ten Pausa siempre a la mano",
    installIntro: "Guárdala como un icono en tu pantalla de inicio. No necesitas una tienda de aplicaciones.",
    installDetected: "Pasos para este dispositivo",
    installDone: "Cuando termines, abre Pausa desde el nuevo icono.",
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
    share: "Compartir con alguien de confianza",
    shared: "Orientación lista para compartir.",
    shareTitle: "Orientación de Pausa",
    newCheck: "Revisar otro mensaje",
    disclaimer:
      "Pausa identifica señales de riesgo, pero puede equivocarse. Verifica siempre por un canal oficial que tú ya conozcas.",
    error: "No pudimos revisar esto todavía. Intenta con texto o una imagen más pequeña.",
    liveUnavailable: "El análisis en vivo aún no está conectado. Puedes probar el ejemplo guiado.",
    imageTooLarge: "La imagen es demasiado grande. Elige una captura o foto de menos de 5 MB.",
    preparingImage: "Preparando la imagen…",
    timeout: "La revisión tardó demasiado. No respondas al mensaje; inténtalo nuevamente.",
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
    install: "Put Pausa on my home screen",
    privacy: "Nothing is analyzed until you choose to share it.",
    notEmergency: "Pausa does not replace emergency services.",
    intakeTitle: "What do you have available?",
    intakeHelp: "Choose the easiest option. You do not need to know how to take a screenshot.",
    screenshotHelp: "I do not know how to take a screenshot",
    screenshotTitle: "We will guide you step by step",
    screenshotIntro: "We detected a likely guide for your device. You can change it if it does not match.",
    iphoneFace: "iPhone without a front button",
    iphoneHome: "iPhone with a front button",
    android: "Android",
    otherDevice: "Another device",
    closeGuide: "Close guide",
    installTitle: "Keep Pausa within reach",
    installIntro: "Save it as an icon on your home screen. You do not need an app store.",
    installDetected: "Steps for this device",
    installDone: "When you finish, open Pausa from the new icon.",
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
    share: "Share with someone you trust",
    shared: "Guidance is ready to share.",
    shareTitle: "Pausa guidance",
    newCheck: "Check another message",
    disclaimer:
      "Pausa identifies risk signals, but it can be wrong. Always verify through an official channel you already know.",
    error: "We could not review this yet. Try text or a smaller image.",
    liveUnavailable: "Live analysis is not connected yet. You can try the guided example.",
    imageTooLarge: "The image is too large. Choose a screenshot or photo under 5 MB.",
    preparingImage: "Preparing the image…",
    timeout: "The check took too long. Do not respond to the message; please try again.",
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

function detectDevice(): DeviceGuide {
  if (typeof navigator === "undefined") return "other";
  if (/Android/i.test(navigator.userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return "iphoneFace";
  return "other";
}

async function prepareImage(file: File) {
  if (file.size <= 4_500_000 || typeof createImageBitmap === "undefined") return file;

  const bitmap = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.84));
  return blob ? new File([blob], "pausa-message.jpg", { type: "image/jpeg" }) : file;
}

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
  const [shareStatus, setShareStatus] = useState("");
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [deviceGuide, setDeviceGuide] = useState<DeviceGuide>(detectDevice);
  const [showScreenshotGuide, setShowScreenshotGuide] = useState(false);
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
    document.documentElement.lang = locale === "es" ? "es-MX" : "en";
  }, [locale]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Installation support is progressive; the core safety flow still works.
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      window.speechSynthesis?.cancel();
    };
  }, [imagePreview]);

  const deviceLabels = {
    iphoneFace: t.iphoneFace,
    iphoneHome: t.iphoneHome,
    android: t.android,
    other: t.otherDevice,
  };

  const screenshotSteps = useMemo(() => {
    const steps = {
      es: {
        iphoneFace: ["Abre el mensaje que quieres revisar.", "Presiona al mismo tiempo el botón lateral y el botón de subir volumen.", "Suelta ambos botones. La captura quedará en Fotos.", "Regresa a Pausa y toca “Elegir foto o captura”."],
        iphoneHome: ["Abre el mensaje que quieres revisar.", "Presiona al mismo tiempo el botón lateral o superior y el botón frontal.", "Suelta ambos botones. La captura quedará en Fotos.", "Regresa a Pausa y toca “Elegir foto o captura”."],
        android: ["Abre el mensaje que quieres revisar.", "Presiona al mismo tiempo el botón de encendido y el de bajar volumen.", "Suelta ambos botones. La captura quedará en Fotos o Galería.", "Regresa a Pausa y toca “Elegir foto o captura”."],
        other: ["Abre el mensaje que quieres revisar.", "Busca en el menú del dispositivo la opción “Captura de pantalla”.", "Si no la encuentras, usa “Tomar una foto” en Pausa y fotografía el mensaje desde otra pantalla."],
      },
      en: {
        iphoneFace: ["Open the message you want to check.", "Press the side button and volume-up button at the same time.", "Release both buttons. The screenshot will be saved in Photos.", "Return to Pausa and tap “Choose a photo or screenshot.”"],
        iphoneHome: ["Open the message you want to check.", "Press the side or top button and the front Home button at the same time.", "Release both buttons. The screenshot will be saved in Photos.", "Return to Pausa and tap “Choose a photo or screenshot.”"],
        android: ["Open the message you want to check.", "Press the power and volume-down buttons at the same time.", "Release both buttons. The screenshot will be saved in Photos or Gallery.", "Return to Pausa and tap “Choose a photo or screenshot.”"],
        other: ["Open the message you want to check.", "Look for “Screenshot” in your device menu.", "If you cannot find it, use “Take a photo” in Pausa and photograph the message on another screen."],
      },
    };
    return steps[locale][deviceGuide];
  }, [deviceGuide, locale]);

  const installSteps = useMemo(() => {
    const steps = {
      es: {
        iphoneFace: ["Abre Pausa en Safari.", "Toca el botón Compartir: el cuadro con una flecha hacia arriba.", "Desliza y elige “Agregar a pantalla de inicio”.", "Toca “Agregar”."],
        iphoneHome: ["Abre Pausa en Safari.", "Toca el botón Compartir: el cuadro con una flecha hacia arriba.", "Desliza y elige “Agregar a pantalla de inicio”.", "Toca “Agregar”."],
        android: ["Abre Pausa en Chrome.", "Toca el menú de tres puntos.", "Elige “Instalar aplicación” o “Agregar a pantalla principal”.", "Confirma la instalación."],
        other: ["Abre el menú de tu navegador.", "Busca “Instalar aplicación” o “Agregar a pantalla de inicio”.", "Si no aparece, guarda Pausa como favorito."],
      },
      en: {
        iphoneFace: ["Open Pausa in Safari.", "Tap Share: the square with an upward arrow.", "Scroll and choose “Add to Home Screen.”", "Tap “Add.”"],
        iphoneHome: ["Open Pausa in Safari.", "Tap Share: the square with an upward arrow.", "Scroll and choose “Add to Home Screen.”", "Tap “Add.”"],
        android: ["Open Pausa in Chrome.", "Tap the three-dot menu.", "Choose “Install app” or “Add to Home screen.”", "Confirm the installation."],
        other: ["Open your browser menu.", "Look for “Install app” or “Add to Home screen.”", "If it is unavailable, save Pausa as a bookmark."],
      },
    };
    return steps[locale][deviceGuide];
  }, [deviceGuide, locale]);

  function reset() {
    setMessage("");
    setImageFile(null);
    setImagePreview(null);
    setAnalysis(null);
    setError("");
    setShareStatus("");
    setScreen("intake");
  }

  async function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 20_000_000) {
      setError(t.imageTooLarge);
      event.target.value = "";
      return;
    }

    setIsPreparingImage(true);
    setError("");
    try {
      const prepared = await prepareImage(file);
      if (prepared.size > 5_000_000) {
        setError(t.imageTooLarge);
        return;
      }
      setImageFile(prepared);
      setImagePreview(URL.createObjectURL(prepared));
    } catch {
      setError(t.imageTooLarge);
    } finally {
      setIsPreparingImage(false);
      event.target.value = "";
    }
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
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25_000);

    try {
      const form = new FormData();
      form.append("locale", locale);
      form.append("text", text);
      form.append("demo", String(useDemo));
      if (imageFile) form.append("image", imageFile);

      const response = await fetch("/api/analyze", { method: "POST", body: form, signal: controller.signal });
      if (!response.ok) {
        const failure = (await response.json().catch(() => null)) as { code?: string } | null;
        if (failure?.code === "live_analysis_unavailable") {
          setError(t.liveUnavailable);
          setScreen("intake");
          return;
        }
        if (failure?.code === "image_too_large") {
          setError(t.imageTooLarge);
          setScreen("intake");
          return;
        }
        throw new Error("Analysis failed");
      }
      const result = (await response.json()) as Analysis;
      setAnalysis(result);
      setScreen("result");
    } catch (reason) {
      setError(reason instanceof DOMException && reason.name === "AbortError" ? t.timeout : t.error);
      setScreen("intake");
    } finally {
      window.clearTimeout(timeout);
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

  async function shareGuidance() {
    if (!analysis) return;
    const shareText = `${analysis.title}\n\n${analysis.summary}\n\n${t.next}:\n${analysis.nextSteps
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n")}\n\n${t.disclaimer}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: t.shareTitle, text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
      setShareStatus(t.shared);
    } catch {
      // The native share sheet can be dismissed without changing the analysis.
    }
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
          <button className="install-link" onClick={() => setScreen("install")}>{t.install}</button>
          <div className="three-steps" aria-label={locale === "es" ? "Cómo funciona Pausa" : "How Pausa works"}>
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
          {isPreparingImage && <p className="preparing-image" role="status">{t.preparingImage}</p>}

          <button className="screenshot-help-button" aria-expanded={showScreenshotGuide} onClick={() => setShowScreenshotGuide((current) => !current)}>
            <span aria-hidden="true">?</span>{t.screenshotHelp}
          </button>

          {showScreenshotGuide && (
            <aside className="guide-card" aria-labelledby="screenshot-guide-title">
              <h2 id="screenshot-guide-title">{t.screenshotTitle}</h2>
              <p>{t.screenshotIntro}</p>
              <div className="device-options" aria-label={t.screenshotTitle}>
                {(["iphoneFace", "iphoneHome", "android", "other"] as DeviceGuide[]).map((device) => (
                  <button
                    key={device}
                    className={deviceGuide === device ? "selected" : ""}
                    aria-pressed={deviceGuide === device}
                    onClick={() => setDeviceGuide(device)}
                  >
                    {deviceLabels[device]}
                  </button>
                ))}
              </div>
              <ol>{screenshotSteps.map((step) => <li key={step}>{step}</li>)}</ol>
              <button className="guide-close" onClick={() => setShowScreenshotGuide(false)}>{t.closeGuide}</button>
            </aside>
          )}

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
          <button className="primary-button" disabled={isPreparingImage} onClick={() => runAnalysis(false)}>{t.review}</button>
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

      {screen === "install" && (
        <section className="install-screen screen-enter">
          <button className="back-button" onClick={() => setScreen("home")}>← {t.back}</button>
          <p className="eyebrow">Pausa</p>
          <h1>{t.installTitle}</h1>
          <p className="lead compact">{t.installIntro}</p>
          <div className="install-icon" aria-hidden="true"><span>Ⅱ</span></div>
          <article className="guide-card install-guide">
            <p className="detected-device">{t.installDetected}: <strong>{deviceLabels[deviceGuide]}</strong></p>
            <ol>{installSteps.map((step) => <li key={step}>{step}</li>)}</ol>
            <p className="install-done">{t.installDone}</p>
          </article>
          <div className="device-options" aria-label={t.installDetected}>
            {(["iphoneFace", "iphoneHome", "android", "other"] as DeviceGuide[]).map((device) => (
              <button
                key={device}
                className={deviceGuide === device ? "selected" : ""}
                aria-pressed={deviceGuide === device}
                onClick={() => setDeviceGuide(device)}
              >
                {deviceLabels[device]}
              </button>
            ))}
          </div>
          <button className="primary-button" onClick={() => setScreen("intake")}>{t.start}</button>
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
          <button className="secondary-button" onClick={shareGuidance}>{t.share}</button>
          {shareStatus && <p className="share-status" role="status">{shareStatus}</p>}
          <button className="primary-button" onClick={reset}>{t.newCheck}</button>
          <p className="disclaimer">{t.disclaimer}</p>
        </section>
      )}

      <footer>
        <p>{t.notEmergency}</p>
        <nav aria-label={locale === "es" ? "Información del proyecto" : "Project information"}>
          <a href="/privacy">{locale === "es" ? "Privacidad" : "Privacy"}</a>
          <a href="https://github.com/elesdex/pausa" target="_blank" rel="noreferrer">
            {locale === "es" ? "Código abierto" : "Open source"}
          </a>
        </nav>
      </footer>
    </main>
  );
}
