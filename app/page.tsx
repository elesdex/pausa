"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Locale = "es" | "en";
type Screen = "home" | "intake" | "demo" | "analyzing" | "result" | "install";
type Risk = "low" | "medium" | "high" | "uncertain";
type DeviceGuide = "iphoneFace" | "iphoneHome" | "android" | "other";
type DeviceFamily = "iphone" | "android" | "other";

type Analysis = {
  risk: Risk;
  subject: string;
  title: string;
  summary: string;
  signals: string[];
  nextSteps: string[];
  learning: string;
  emergency: boolean;
  model: string;
  demoMode?: boolean;
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    standalone?: boolean;
  }
}

const copy = {
  es: {
    language: "Idioma",
    eyebrow: "Ayuda para momentos de incertidumbre digital",
    headline: "Primero, pausa.",
    returningHeadline: "¿Qué necesitas revisar?",
    returningSubhead: "Cuéntamelo o comparte lo que ves. Te ayudamos a decidir el siguiente paso seguro.",
    subhead:
      "Si un mensaje te asustó o te está presionando, no respondas todavía. Lo revisamos contigo, con calma.",
    start: "Compartir foto o texto",
    voiceStart: "Cuéntamelo con voz",
    voiceTap: "Toca para hablar",
    voiceHint: "Al terminar, lo revisamos.",
    voiceStop: "Toca para terminar y revisar",
    voicePreparing: "Preparando tu audio…",
    voiceTranscribing: "Entendiendo lo que dijiste…",
    voiceUnavailable: "No pudimos usar el micrófono. Revisa el permiso del navegador o comparte texto.",
    demo: "Probar con un ejemplo",
    install: "Guardar Pausa en mi celular",
    installLater: "Ahora no",
    installDismiss: "Quitar sugerencia",
    installAction: "Instalar Pausa",
    installClose: "Listo, volver al inicio",
    privacy: "Nada se analiza hasta que lo compartes.",
    notEmergency: "Contacta a los servicios locales de emergencia.",
    emergencyTitle: "¿Peligro inmediato?",
    emergencyBody: "México y Estados Unidos",
    emergencyCall: "Llamar al 911",
    intakeTitle: "¿Qué tienes a la mano?",
    intakeHelp: "Elige la opción más fácil. No necesitas saber hacer una captura.",
    voiceIntakeTitle: "¿Qué viste?",
    voiceIntakeHelp: "Cuéntame qué pasó: quién te contactó, qué te pidió y qué te pareció extraño.",
    screenshotHelp: "No sé hacer una captura",
    screenshotTitle: "Te guiamos paso a paso",
    screenshotIntro: "Detectamos una guía probable para tu dispositivo. Puedes cambiarla si no coincide.",
    iphoneFace: "iPhone sin botón frontal",
    iphoneHome: "iPhone con botón frontal",
    android: "Android",
    otherDevice: "Otro dispositivo",
    closeGuide: "Cerrar guía",
    installTitle: "Ten Pausa siempre a la mano",
    installIntro: "Guárdala como un icono en tu pantalla de inicio.",
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
    signals: "Señales que encontramos",
    next: "Qué hacer ahora",
    learning: "Para la próxima",
    speak: "Escuchar en voz alta",
    stopSpeak: "Detener voz",
    aiVoice: "Audio con voz sintética",
    share: "Pedir ayuda a alguien de confianza",
    shareHelp: "Comparte un resumen breve para verificarlo antes de actuar.",
    shareIntro: "Recibí algo que me preocupa. ¿Me ayudas a verificarlo?",
    shareSubject: "Lo que recibí",
    shareSignals: "Por qué Pausa lo marcó como",
    sharePromo: "Revisado con Pausa",
    shared: "Listo para compartir.",
    shareTitle: "¿Me ayudas a verificar esto?",
    newCheck: "Revisar otro mensaje",
    disclaimer:
      "Pausa identifica señales de riesgo, pero puede equivocarse.\nVerifica siempre por un canal oficial que tú ya conozcas.",
    error: "No pudimos revisar esto todavía. Intenta con texto o una imagen más pequeña.",
    liveUnavailable: "El análisis en vivo aún no está conectado. Puedes probar el ejemplo guiado.",
    imageTooLarge: "La imagen es demasiado grande. Elige una captura o foto de menos de 5 MB.",
    preparingImage: "Preparando la imagen…",
    timeout: "La revisión tardó demasiado. No respondas al mensaje; inténtalo nuevamente.",
    textRequired: "Comparte una imagen, escribe el mensaje o cuéntamelo con voz.",
    demoBadge: "Modo de demostración",
    demoTitle: "Así funciona",
    demoIntro: "Este mensaje es sintético. Mira cómo pasa de una duda a un siguiente paso seguro.",
    demoInputLabel: "Ejemplo recibido",
    demoStepOne: "Recibes algo que te presiona.",
    demoStepTwo: "Nos cuentas, hablas o compartes lo que ves.",
    demoStepThree: "Pausa señala riesgos y propone qué verificar.",
    demoSeeResult: "Ver cómo lo revisa Pausa",
  },
  en: {
    language: "Language",
    eyebrow: "Help for moments of digital uncertainty",
    headline: "First, pause.",
    returningHeadline: "What do you need to check?",
    returningSubhead: "Tell me or share what you see. We will help you choose one safe next step.",
    subhead:
      "If a message scared or pressured you, do not respond yet. We will review it with you, calmly.",
    start: "Share a photo or text",
    voiceStart: "Tell me by voice",
    voiceTap: "Tap to speak",
    voiceHint: "When you finish, we'll check it.",
    voiceStop: "Tap to finish and check",
    voicePreparing: "Preparing your audio…",
    voiceTranscribing: "Understanding what you said…",
    voiceUnavailable: "We could not use the microphone. Check browser permission or share text instead.",
    demo: "Try a guided example",
    install: "Keep Pausa on my phone",
    installLater: "Not now",
    installDismiss: "Dismiss suggestion",
    installAction: "Install Pausa",
    installClose: "Done, return home",
    privacy: "Nothing is analyzed until you share it.",
    notEmergency: "Contact local emergency services.",
    emergencyTitle: "Immediate danger?",
    emergencyBody: "Mexico and the United States",
    emergencyCall: "Call 911",
    intakeTitle: "What do you have available?",
    intakeHelp: "Choose the easiest option. You do not need to know how to take a screenshot.",
    voiceIntakeTitle: "What did you see?",
    voiceIntakeHelp: "Tell me what happened: who contacted you, what they asked for, and what felt unusual.",
    screenshotHelp: "I do not know how to take a screenshot",
    screenshotTitle: "We will guide you step by step",
    screenshotIntro: "We detected a likely guide for your device. You can change it if it does not match.",
    iphoneFace: "iPhone without a front button",
    iphoneHome: "iPhone with a front button",
    android: "Android",
    otherDevice: "Another device",
    closeGuide: "Close guide",
    installTitle: "Keep Pausa within reach",
    installIntro: "Save it as an icon on your home screen.",
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
    signals: "Signals we found",
    next: "What to do now",
    learning: "For next time",
    speak: "Listen out loud",
    stopSpeak: "Stop voice",
    aiVoice: "Audio uses a synthetic voice",
    share: "Ask someone you trust",
    shareHelp: "Share a short summary so you can verify it before acting.",
    shareIntro: "I received something that worries me. Can you help me verify it?",
    shareSubject: "What I received",
    shareSignals: "Why Pausa marked it as",
    sharePromo: "Reviewed with Pausa",
    shared: "Ready to share.",
    shareTitle: "Can you help me verify this?",
    newCheck: "Check another message",
    disclaimer:
      "Pausa identifies risk signals, but it can be wrong.\nAlways verify through an official channel you already know.",
    error: "We could not review this yet. Try text or a smaller image.",
    liveUnavailable: "Live analysis is not connected yet. You can try the guided example.",
    imageTooLarge: "The image is too large. Choose a screenshot or photo under 5 MB.",
    preparingImage: "Preparing the image…",
    timeout: "The check took too long. Do not respond to the message; please try again.",
    textRequired: "Share an image, type the message, or tell me with your voice.",
    demoBadge: "Demonstration mode",
    demoTitle: "How it works",
    demoIntro: "This message is synthetic. See how a moment of doubt becomes one safer next step.",
    demoInputLabel: "Example received",
    demoStepOne: "You receive something that pressures you.",
    demoStepTwo: "You tell, speak or share what you see.",
    demoStepThree: "Pausa flags risks and suggests what to verify.",
    demoSeeResult: "See how Pausa checks it",
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

function deviceFamilyFromGuide(device: DeviceGuide): DeviceFamily {
  if (device === "iphoneFace" || device === "iphoneHome") return "iphone";
  return device;
}

function getInitialLocale(): Locale {
  if (typeof navigator === "undefined") return "es";
  const saved = window.localStorage.getItem("pausa-locale");
  if (saved === "es" || saved === "en") return saved;
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function shouldShowInstallCard() {
  if (typeof window === "undefined") return false;
  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.standalone === true;
  const installed = window.localStorage.getItem("pausa-installed") === "true";
  const dismissed = window.sessionStorage.getItem("pausa-install-dismissed") === "true";
  return !standalone && !installed && !dismissed;
}

function PauseMark({ className = "" }: { className?: string }) {
  return <span className={`pause-mark ${className}`} aria-hidden="true"><span /></span>;
}

function AttachmentIcon() {
  return (
    <svg className="attachment-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.5 12.8 14.7 6.6a3.1 3.1 0 0 1 4.4 4.4l-8.3 8.3a5 5 0 0 1-7.1-7.1l8.1-8.1" />
    </svg>
  );
}

function HomeMarkButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="home-mark-button" onClick={onClick} aria-label={label}>
      <PauseMark />
    </button>
  );
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [deviceGuide, setDeviceGuide] = useState<DeviceGuide>(detectDevice);
  const [showScreenshotGuide, setShowScreenshotGuide] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "recording" | "transcribing">("idle");
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showInstallCard, setShowInstallCard] = useState(false);
  const [hasUsedBefore, setHasUsedBefore] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const spokenAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechUrlRef = useRef<string | null>(null);
  const speechPromiseRef = useRef<Promise<string> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
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
    const localeTimer = window.setTimeout(() => setLocale(getInitialLocale()), 0);
    const installVisibilityTimer = window.setTimeout(() => setShowInstallCard(shouldShowInstallCard()), 0);
    const returningUserTimer = window.setTimeout(() => setHasUsedBefore(window.localStorage.getItem("pausa-used") === "true"), 0);
    let refreshingForUpdate = false;
    const refreshAfterWorkerUpdate = () => {
      if (refreshingForUpdate || window.sessionStorage.getItem("pausa-worker-refreshed") === "true") return;
      refreshingForUpdate = true;
      window.sessionStorage.setItem("pausa-worker-refreshed", "true");
      window.location.reload();
    };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", refreshAfterWorkerUpdate);
      navigator.serviceWorker.register("/sw.js").then((registration) => registration.update()).catch(() => {
        // Installation support is progressive; the core safety flow still works.
      });
    }

    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setShowInstallCard(shouldShowInstallCard());
    };
    const markInstalled = () => {
      window.localStorage.setItem("pausa-installed", "true");
      setShowInstallCard(false);
      setInstallPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.clearTimeout(localeTimer);
      window.clearTimeout(installVisibilityTimer);
      window.clearTimeout(returningUserTimer);
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", markInstalled);
      navigator.serviceWorker?.removeEventListener("controllerchange", refreshAfterWorkerUpdate);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      spokenAudioRef.current?.pause();
      if (speechUrlRef.current) URL.revokeObjectURL(speechUrlRef.current);
      microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    window.localStorage.setItem("pausa-locale", nextLocale);
  }

  const deviceLabels = {
    iphoneFace: t.iphoneFace,
    iphoneHome: t.iphoneHome,
    android: t.android,
    other: t.otherDevice,
  };
  const deviceFamilyLabels: Record<DeviceFamily, string> = {
    iphone: "iPhone",
    android: "Android",
    other: t.otherDevice,
  };
  const deviceFamily = deviceFamilyFromGuide(deviceGuide);

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
        iphoneFace: ["Abre Pausa en Safari, Chrome o tu navegador.", "Toca el botón Compartir: el cuadro con una flecha hacia arriba.", "Desliza y elige “Agregar a pantalla de inicio”.", "Toca “Agregar”."],
        iphoneHome: ["Abre Pausa en Safari, Chrome o tu navegador.", "Toca el botón Compartir: el cuadro con una flecha hacia arriba.", "Desliza y elige “Agregar a pantalla de inicio”.", "Toca “Agregar”."],
        android: ["Abre Pausa en Chrome o tu navegador.", "Toca el menú del navegador.", "Elige “Instalar aplicación” o “Agregar a pantalla principal”.", "Confirma la instalación."],
        other: ["Abre el menú de tu navegador.", "Busca “Instalar aplicación” o “Agregar a pantalla de inicio”.", "Si no aparece, guarda Pausa como favorito."],
      },
      en: {
        iphoneFace: ["Open Pausa in Safari, Chrome, or your browser.", "Tap Share: the square with an upward arrow.", "Scroll and choose “Add to Home Screen.”", "Tap “Add.”"],
        iphoneHome: ["Open Pausa in Safari, Chrome, or your browser.", "Tap Share: the square with an upward arrow.", "Scroll and choose “Add to Home Screen.”", "Tap “Add.”"],
        android: ["Open Pausa in Chrome or your browser.", "Open the browser menu.", "Choose “Install app” or “Add to Home screen.”", "Confirm the installation."],
        other: ["Open your browser menu.", "Look for “Install app” or “Add to Home screen.”", "If it is unavailable, save Pausa as a bookmark."],
      },
    };
    return steps[locale][deviceGuide];
  }, [deviceGuide, locale]);

  function reset() {
    spokenAudioRef.current?.pause();
    if (speechUrlRef.current) URL.revokeObjectURL(speechUrlRef.current);
    speechUrlRef.current = null;
    speechPromiseRef.current = null;
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

  async function startVoiceCapture() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError(t.voiceUnavailable);
      setScreen("intake");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      const preferredType = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = preferredType ? new MediaRecorder(stream, { mimeType: preferredType }) : new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = () => void transcribeVoice(recorder.mimeType || preferredType || "audio/webm");
      mediaRecorderRef.current = recorder;
      recorder.start();
      setScreen("intake");
      setVoiceStatus("recording");
      setError("");
    } catch {
      setVoiceStatus("idle");
      setError(t.voiceUnavailable);
      setScreen("intake");
    }
  }

  function stopVoiceCapture() {
    if (mediaRecorderRef.current?.state === "recording") {
      setVoiceStatus("transcribing");
      mediaRecorderRef.current.stop();
      microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
    }
  }

  async function transcribeVoice(mimeType: string) {
    try {
      const audio = new Blob(audioChunksRef.current, { type: mimeType });
      if (audio.size === 0) throw new Error("Empty recording");
      const extension = mimeType.includes("mp4") ? "m4a" : "webm";
      const form = new FormData();
      form.append("locale", locale);
      form.append("audio", new File([audio], `pausa-voice.${extension}`, { type: mimeType }));
      const response = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!response.ok) throw new Error("Transcription failed");
      const result = (await response.json()) as { text?: string };
      const transcript = result.text?.trim();
      if (!transcript) throw new Error("Empty transcript");
      setMessage(transcript);
      setVoiceStatus("idle");
      await runAnalysis(false, transcript);
    } catch {
      setVoiceStatus("idle");
      setError(t.voiceUnavailable);
      setScreen("intake");
    }
  }

  async function runAnalysis(useDemo = false, providedText?: string) {
    const text = useDemo ? demoMessages[locale] : (providedText ?? message).trim();
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
      if (speechUrlRef.current) URL.revokeObjectURL(speechUrlRef.current);
      speechUrlRef.current = null;
      speechPromiseRef.current = null;
      setAnalysis(result);
      window.localStorage.setItem("pausa-used", "true");
      setHasUsedBefore(true);
      setScreen("result");
      void prepareSpeech(result).catch(() => {
        // The visible result remains usable even if audio preparation fails.
      });
    } catch (reason) {
      setError(reason instanceof DOMException && reason.name === "AbortError" ? t.timeout : t.error);
      setScreen("intake");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function prepareSpeech(result: Analysis) {
    if (speechUrlRef.current) return Promise.resolve(speechUrlRef.current);
    if (speechPromiseRef.current) return speechPromiseRef.current;

    const promise = fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        text: `${result.title}. ${result.summary}. ${locale === "es" ? "Siguiente paso" : "Next step"}: ${result.nextSteps[0] || ""}`,
      }),
    }).then(async (response) => {
      if (!response.ok) throw new Error("Speech failed");
      const audioUrl = URL.createObjectURL(await response.blob());
      speechUrlRef.current = audioUrl;
      return audioUrl;
    }).finally(() => {
      speechPromiseRef.current = null;
    });

    speechPromiseRef.current = promise;
    return promise;
  }

  async function speakResult() {
    if (!analysis) return;
    if (isSpeaking) {
      spokenAudioRef.current?.pause();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      const audioUrl = await prepareSpeech(analysis);
      const audio = new Audio(audioUrl);
      spokenAudioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
      };
      await audio.play();
    } catch {
      setIsSpeaking(false);
      setError(t.error);
    }
  }

  async function openInstall() {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        window.localStorage.setItem("pausa-installed", "true");
        setShowInstallCard(false);
      }
      setInstallPrompt(null);
      return;
    }
    setScreen("install");
  }

  function dismissInstall() {
    window.sessionStorage.setItem("pausa-install-dismissed", "true");
    setShowInstallCard(false);
  }

  function finishInstallGuide() {
    window.localStorage.setItem("pausa-installed", "true");
    window.sessionStorage.removeItem("pausa-install-dismissed");
    setShowInstallCard(false);
    goHome();
  }

  function goHome() {
    spokenAudioRef.current?.pause();
    setIsSpeaking(false);
    setScreen("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    const touch = event.touches[0];
    touchStartRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !touch || screen === "home" || start.x > 36) return;
    const horizontal = touch.clientX - start.x;
    const vertical = Math.abs(touch.clientY - start.y);
    if (horizontal > 88 && horizontal > vertical * 1.4) goHome();
  }

  async function shareGuidance() {
    if (!analysis) return;
    const shareText = `${t.shareIntro}\n\n${t.shareSubject}:\n${analysis.subject || analysis.summary}\n\n${t.shareSignals} ${riskLabel.toLocaleLowerCase(locale === "es" ? "es-MX" : "en")}:\n${analysis.signals
      .slice(0, 2)
      .map((signal) => `• ${signal}`)
      .join("\n")}\n\n${t.sharePromo}\nhttps://pausa-digital.elesdex.chatgpt.site`;

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
    <main className="app-shell" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <header className="topbar">
        <button className="brand" onClick={goHome} aria-label="Pausa home">
          <PauseMark className="brand-mark" />
          <span>Pausa</span>
        </button>
        {(screen === "home" || screen === "intake" || screen === "demo" || screen === "install") && (
          <label className="language-picker">
            <span className="visually-hidden">{t.language}</span>
            <select value={locale} onChange={(event) => changeLocale(event.target.value as Locale)} aria-label={t.language}>
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </label>
        )}
      </header>

      {screen === "home" && (
        <section className="home-screen screen-enter">
          <div className="calm-orbit">
            <PauseMark className="assistant-mark" />
          </div>
          {!hasUsedBefore && <p className="eyebrow">{t.eyebrow}</p>}
          <h1>{hasUsedBefore ? t.returningHeadline : t.headline}</h1>
          <p className="lead">{hasUsedBefore ? t.returningSubhead : t.subhead}</p>
          <button className="voice-primary-button" onClick={startVoiceCapture}>
            <span className="voice-symbol" aria-hidden="true"><i /><i /><i /></span>
            <span className="voice-copy">
              <span className="voice-title-row"><strong>{t.voiceStart}</strong><em>{t.voiceTap}</em></span>
              <small>{t.voiceHint}</small>
            </span>
          </button>
          <button className="secondary-button quick-start-button" onClick={() => setScreen("intake")}>
            <AttachmentIcon />
            <span>{t.start}</span>
          </button>
          <button className="text-button guided-example-button" onClick={() => setScreen("demo")}>{t.demo}</button>
          {showInstallCard && (
            <aside className="install-prompt-card">
              <div className="install-suggestion-mark" aria-hidden="true"><PauseMark /></div>
              <div className="install-suggestion-copy">
                <strong>{t.install}</strong>
                <p>{t.installIntro}</p>
                <div className="install-prompt-actions">
                  <button onClick={openInstall}>{installPrompt ? t.installAction : t.installDetected}</button>
                </div>
              </div>
              <button className="install-dismiss" onClick={dismissInstall} aria-label={t.installDismiss}>×</button>
            </aside>
          )}
        </section>
      )}

      {screen === "demo" && (
        <section className="demo-screen screen-enter">
          <button className="back-button" onClick={() => setScreen("home")}>← {t.back}</button>
          <p className="eyebrow">{t.demoBadge}</p>
          <h1>{t.demoTitle}</h1>
          <p className="lead compact">{t.demoIntro}</p>
          <article className="demo-message-card">
            <span>{t.demoInputLabel}</span>
            <p>{demoMessages[locale]}</p>
          </article>
          <ol className="demo-story">
            {[t.demoStepOne, t.demoStepTwo, t.demoStepThree].map((step, index) => (
              <li key={step}>
                <span className={`demo-step-visual demo-step-${index + 1}`} aria-hidden="true">
                  {index === 0 && "!"}
                  {index === 1 && <><span className="mini-wave">|||</span><AttachmentIcon /></>}
                  {index === 2 && <PauseMark />}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <button className="primary-button demo-result-button" onClick={() => runAnalysis(true)}>{t.demoSeeResult}</button>
          <div className="demo-home-control">
            <HomeMarkButton label={locale === "es" ? "Volver al inicio" : "Return home"} onClick={goHome} />
          </div>
        </section>
      )}

      {screen === "intake" && (
        <section className="intake-screen screen-enter">
          {voiceStatus !== "recording" && <button className="back-button compact-back-button" onClick={() => setScreen("home")}>← {t.back}</button>}
          <h1>{voiceStatus === "recording" ? t.voiceIntakeTitle : t.intakeTitle}</h1>
          <p className="lead compact">{voiceStatus === "recording" ? t.voiceIntakeHelp : t.intakeHelp}</p>

          <button
            className={`voice-primary-button intake-voice ${voiceStatus === "recording" ? "recording" : ""}`}
            disabled={voiceStatus === "transcribing"}
            onClick={voiceStatus === "recording" ? stopVoiceCapture : startVoiceCapture}
          >
            <span className="voice-symbol" aria-hidden="true">{voiceStatus === "recording" ? "■" : <><i /><i /><i /></>}</span>
            <span className="voice-copy">
              {voiceStatus === "recording" ? <strong>{t.voiceStop}</strong> : <span className="voice-title-row"><strong>{t.voiceStart}</strong><em>{t.voiceTap}</em></span>}
              <small>{voiceStatus === "recording" ? t.listening : voiceStatus === "transcribing" ? t.voiceTranscribing : t.voiceHint}</small>
            </span>
          </button>

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
                {(["iphone", "android", "other"] as DeviceFamily[]).map((family) => (
                  <button
                    key={family}
                    className={deviceFamily === family ? "selected" : ""}
                    aria-pressed={deviceFamily === family}
                    onClick={() => setDeviceGuide(family === "iphone" ? "iphoneFace" : family)}
                  >
                    {deviceFamilyLabels[family]}
                  </button>
                ))}
              </div>
              {deviceFamily === "iphone" && (
                <div className="iphone-choice" aria-label="iPhone type">
                  <button className={deviceGuide === "iphoneFace" ? "selected" : ""} onClick={() => setDeviceGuide("iphoneFace")}>{locale === "es" ? "Sin botón frontal" : "No front button"}</button>
                  <button className={deviceGuide === "iphoneHome" ? "selected" : ""} onClick={() => setDeviceGuide("iphoneHome")}>{locale === "es" ? "Con botón frontal" : "Front button"}</button>
                </div>
              )}
              <ol className="screenshot-story">
                {screenshotSteps.map((step, index) => (
                  <li key={step}>
                    <span className={`screenshot-step-visual screenshot-step-${index + 1}`} aria-hidden="true">
                      {index === 0 && <span className="message-preview">•••</span>}
                      {index === 1 && <span className="button-combo">{deviceFamily === "iphone" ? "+  ↕" : "−  ⏻"}</span>}
                      {index === 2 && <span className="saved-photo">▧</span>}
                      {index === 3 && <span className="new-app"><PauseMark /></span>}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
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

          {error && <p className="error-message" role="alert">{error}</p>}
          <button className="primary-button" disabled={isPreparingImage} onClick={() => runAnalysis(false)}>{t.review}</button>
        </section>
      )}

      {screen === "analyzing" && (
        <section className="analyzing-screen screen-enter" aria-live="polite">
          <div className="breathing-circle"><PauseMark /></div>
          <h1>{t.analyzingTitle}</h1>
          <p className="lead compact">{t.analyzingBody}</p>
          <div className="loading-line"><span /></div>
        </section>
      )}

      {screen === "install" && (
        <section className="install-screen screen-enter">
          <button className="back-button" onClick={() => setScreen("home")}>← {t.back}</button>
          <h1>{t.installTitle}</h1>
          <p className="lead compact">{t.installIntro}</p>
          <article className="guide-card install-guide">
            <p className="detected-device">{t.installDetected}: <strong>{deviceLabels[deviceGuide]}</strong></p>
            <ol className="install-story">
              {installSteps.map((step, index) => (
                <li key={step}>
                  <span className={`install-step-visual step-${index + 1}`} aria-hidden="true">
                    {index === 0 && (
                      <span className="browser-tile">
                        <span className="browser-glyph">◎</span>
                        <small>{locale === "es" ? "Navegador" : "Browser"}</small>
                      </span>
                    )}
                    {index === 1 && <span className="tap-target">{deviceFamily === "iphone" ? "↥" : "•••"}</span>}
                    {index === 2 && <span className="menu-row">＋ {locale === "es" ? "Pantalla de inicio" : "Home screen"}</span>}
                    {index === 3 && <span className="new-app"><PauseMark /></span>}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="install-done">{t.installDone}</p>
          </article>
          <div className="device-options" aria-label={t.installDetected}>
            {(["iphone", "android", "other"] as DeviceFamily[]).map((family) => (
              <button
                key={family}
                className={deviceFamily === family ? "selected" : ""}
                aria-pressed={deviceFamily === family}
                onClick={() => setDeviceGuide(family === "iphone" ? "iphoneFace" : family)}
              >
                {deviceFamilyLabels[family]}
              </button>
            ))}
          </div>
          {deviceFamily === "iphone" && (
            <div className="iphone-choice install-choice" aria-label="iPhone type">
              <button className={deviceGuide === "iphoneFace" ? "selected" : ""} onClick={() => setDeviceGuide("iphoneFace")}>{locale === "es" ? "Sin botón frontal" : "No front button"}</button>
              <button className={deviceGuide === "iphoneHome" ? "selected" : ""} onClick={() => setDeviceGuide("iphoneHome")}>{locale === "es" ? "Con botón frontal" : "Front button"}</button>
            </div>
          )}
          <button className="secondary-button install-home-button" onClick={finishInstallGuide}>{t.installClose}</button>
        </section>
      )}

      {screen === "result" && analysis && (
        <section className="result-screen screen-enter">
          <div className={`risk-card risk-${analysis.risk}`}>
            <span className="risk-pill"><span className="risk-dot" aria-hidden="true" />{riskLabel}</span>
            <h1>{analysis.title}</h1>
            <p>{analysis.summary}</p>
            {analysis.demoMode && <span className="demo-badge">{t.demoBadge}</span>}
            <button className="risk-voice-button" onClick={speakResult}>
              <span aria-hidden="true">{isSpeaking ? "■" : "▶"}</span>
              {isSpeaking ? t.stopSpeak : t.speak}
            </button>
            <small className="ai-voice-note">{t.aiVoice}</small>
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

          <div className="trust-share">
            <button className="secondary-button" onClick={shareGuidance}>{t.share}</button>
            <p>{t.shareHelp}</p>
          </div>
          {shareStatus && <p className="share-status" role="status">{shareStatus}</p>}
          <button className="primary-button" onClick={reset}>{t.newCheck}</button>
          <p className="disclaimer">{t.disclaimer}</p>
          {error && <p className="error-message" role="alert">{error}</p>}
        </section>
      )}

      <footer className={`${screen === "demo" ? "demo-footer" : ""} ${screen === "home" ? "home-footer" : ""}`.trim()}>
        {screen !== "demo" && <HomeMarkButton label={locale === "es" ? "Volver al inicio" : "Return home"} onClick={goHome} />}
        <aside className="emergency-card">
          <div><strong>{t.emergencyTitle}</strong><p>{t.emergencyBody}</p></div>
          <a href="tel:911">911</a>
        </aside>
        <p className="emergency-disclaimer">{t.notEmergency}</p>
        <nav aria-label={locale === "es" ? "Información del proyecto" : "Project information"}>
          <a href={`/privacy#${locale}`}>{locale === "es" ? "Privacidad" : "Privacy"}</a>
          <a href="https://github.com/elesdex/pausa" target="_blank" rel="noreferrer">
            {locale === "es" ? "Código abierto" : "Open source"}
          </a>
          <button onClick={openInstall}>{t.installAction}</button>
        </nav>
        <button className="footer-brand-link" onClick={goHome} aria-label={locale === "es" ? "Volver al inicio de Pausa" : "Return to Pausa home"}>Pausa</button>
      </footer>
    </main>
  );
}
