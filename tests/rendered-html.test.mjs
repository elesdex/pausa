import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function render(path = "/") {
  const worker = await getWorker();
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Pausa product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Pausa/);
  assert.match(html, /Primero, pausa/);
  assert.match(html, /Cuéntamelo con voz/);
  assert.match(html, /Compartir foto o texto/);
  assert.match(html, /¿Peligro inmediato\?/);
  assert.match(html, /En una emergencia, contacta a los servicios locales/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
});

test("keeps generated guidance in the language selected before analysis", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /screen === "home" \|\| screen === "intake" \|\| screen === "demo" \|\| screen === "install"/);
  assert.match(source, /Pedir ayuda a alguien de confianza/);
  assert.match(source, /Comparte un resumen breve/);
  assert.match(source, /Audio con voz sintética/);
  assert.match(source, /Revisado con Pausa/);
});

test("includes mobile installation metadata", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /manifest\.webmanifest/);
  assert.match(html, /width=device-width/);
  assert.match(html, /mobile-web-app-capable/);
  assert.match(html, /apple-mobile-web-app-title/);
});

test("publishes a bilingual and accurate privacy disclosure", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Privacidad/);
  assert.match(html, /Privacy/);
  assert.match(html, /30 días/);
  assert.match(html, /30 days/);
  assert.match(html, /no tiene base de datos propia/);
  assert.match(html, /developers\.openai\.com\/api\/docs\/guides\/your-data/);
});

test("guided demo is explicit and deterministic", async () => {
  const worker = await getWorker();
  const form = new FormData();
  form.set("locale", "es");
  form.set("demo", "true");
  const response = await worker.fetch(
    new Request("http://localhost/api/analyze", { method: "POST", body: form }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.demoMode, true);
  assert.equal(result.model, "demo-fallback");
  assert.equal(result.risk, "high");
});

test("live analysis never impersonates the demo when the API key is absent", async () => {
  const worker = await getWorker();
  const form = new FormData();
  form.set("locale", "en");
  form.set("text", "Your appointment is confirmed for tomorrow.");
  form.set("demo", "false");
  const response = await worker.fetch(
    new Request("http://localhost/api/analyze", { method: "POST", body: form }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.code, "live_analysis_unavailable");
});

test("live path requests GPT-5.6 with strict structured output", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  let capturedRequest;

  process.env.OPENAI_API_KEY = "test-key-not-a-secret";
  globalThis.fetch = async (input, init) => {
    if (String(input) === "https://api.openai.com/v1/responses") {
      capturedRequest = JSON.parse(String(init?.body));
      return new Response(
        JSON.stringify({
          output: [{
            type: "message",
            content: [{
              type: "output_text",
              text: JSON.stringify({
                risk: "uncertain",
                subject: "A short account-review message from an unidentified sender.",
                title: "Not enough information yet",
                summary: "The message is too short to assess confidently.",
                signals: ["There is limited context.", "The sender is not identified.", "No trusted channel is named.", "This fourth signal must be removed."],
                nextSteps: ["Open the service through a channel you already know. ".repeat(8), "Do not use the supplied contact.", "Ask a trusted person to help verify.", "This fourth step must be removed."],
                learning: "Verify independently before acting.",
                emergency: false,
              }),
            }],
          }],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }
    return originalFetch(input, init);
  };

  try {
    const worker = await getWorker();
    const form = new FormData();
    form.set("locale", "en");
    form.set("text", "Please review your account.");
    form.set("demo", "false");
    const response = await worker.fetch(
      new Request("http://localhost/api/analyze", { method: "POST", body: form }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.model, "gpt-5.6");
    assert.equal(result.demoMode, false);
    assert.equal(result.signals.length, 3);
    assert.equal(result.nextSteps.length, 3);
    assert.ok(result.nextSteps[0].length <= 118);
    assert.equal(capturedRequest.model, "gpt-5.6");
    assert.equal(capturedRequest.max_output_tokens, 1600);
    assert.equal(capturedRequest.reasoning.effort, "medium");
    assert.equal(capturedRequest.text.format.type, "json_schema");
    assert.equal(capturedRequest.text.format.strict, true);
    assert.equal(capturedRequest.text.format.schema.properties.nextSteps.maxItems, 3);
    assert.equal(capturedRequest.text.format.schema.properties.nextSteps.items.maxLength, 118);
    assert.equal(capturedRequest.text.format.schema.properties.subject.maxLength, 110);
    assert.match(capturedRequest.instructions, /untrusted evidence/);
    assert.match(capturedRequest.instructions, /Never invent an official link/);
    assert.match(capturedRequest.instructions, /at most 16 words/);

    const imageForm = new FormData();
    imageForm.set("locale", "es");
    imageForm.set("text", "Analiza esta captura.");
    imageForm.set("demo", "false");
    imageForm.set("image", new File(["synthetic image"], "capture.png", { type: "image/png" }));
    const imageResponse = await worker.fetch(
      new Request("http://localhost/api/analyze", { method: "POST", body: imageForm }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(imageResponse.status, 200);
    assert.equal(capturedRequest.reasoning.effort, "low");
    assert.ok(capturedRequest.input[0].content.some((item) => item.type === "input_image"));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  }
});

test("voice routes use OpenAI transcription and AI-generated speech models", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  const captured = {};

  process.env.OPENAI_API_KEY = "test-key-not-a-secret";
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url === "https://api.openai.com/v1/audio/transcriptions") {
      const form = init?.body;
      captured.transcriptionModel = form.get("model");
      captured.transcriptionPrompt = form.get("prompt");
      return Response.json({ text: "Me llegó un mensaje que pide llamar inmediatamente." });
    }
    if (url === "https://api.openai.com/v1/audio/speech") {
      captured.speech = JSON.parse(String(init?.body));
      return new Response(new Uint8Array([73, 68, 51, 4]), {
        status: 200,
        headers: { "content-type": "audio/mpeg" },
      });
    }
    return originalFetch(input, init);
  };

  try {
    const worker = await getWorker();
    const audioForm = new FormData();
    audioForm.set("locale", "es");
    audioForm.set("audio", new File(["synthetic audio"], "voice.webm", { type: "audio/webm" }));
    const transcriptResponse = await worker.fetch(
      new Request("http://localhost/api/transcribe", { method: "POST", body: audioForm }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(transcriptResponse.status, 200);
    assert.equal((await transcriptResponse.json()).model, "gpt-4o-transcribe");
    assert.equal(captured.transcriptionModel, "gpt-4o-transcribe");
    assert.match(captured.transcriptionPrompt, /español/);

    const speechResponse = await worker.fetch(
      new Request("http://localhost/api/speak", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: "es", text: "No llames a ese número." }),
      }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(speechResponse.status, 200);
    assert.equal(speechResponse.headers.get("content-type"), "audio/mpeg");
    assert.equal(speechResponse.headers.get("x-pausa-voice"), "ai-generated");
    assert.equal(captured.speech.model, "gpt-4o-mini-tts");
    assert.equal(captured.speech.voice, "marin");
    assert.match(captured.speech.instructions, /serena/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  }
});

test("safety evaluation set covers the required scam and benign scenarios", async () => {
  const cases = JSON.parse(
    await readFile(new URL("./scam-evals.json", import.meta.url), "utf8"),
  );
  assert.equal(cases.length, 12);
  assert.ok(cases.some((item) => item.id === "prompt-injection-in-message"));
  assert.ok(cases.some((item) => item.expectedRisk.includes("low")));
  assert.ok(cases.some((item) => item.locale === "es"));
  assert.ok(cases.some((item) => item.locale === "en"));
  for (const item of cases) {
    assert.ok(item.input.length > 10);
    assert.ok(item.expectedRisk.length > 0);
    assert.ok(item.mustNot.length > 0);
  }
});

test("ships a clearly labeled synthetic screenshot for vision demos", async () => {
  const svg = await readFile(
    new URL("../public/demo/bank-alert-es.svg", import.meta.url),
    "utf8",
  );
  const png = await readFile(
    new URL("../public/demo/bank-alert-es.png", import.meta.url),
  );
  assert.match(svg, /EJEMPLO SINTÉTICO PARA DEMOSTRACIÓN/);
  assert.match(svg, /no corresponden a una/);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});

test("includes lightweight local browser marks and manual test cases", async () => {
  const safari = await readFile(new URL("../public/brands/safari.svg", import.meta.url), "utf8");
  const chrome = await readFile(new URL("../public/brands/chrome.svg", import.meta.url), "utf8");
  const cases = JSON.parse(await readFile(new URL("../examples/test-cases/messages.json", import.meta.url), "utf8"));
  assert.match(safari, /<title>Safari<\/title>/);
  assert.match(chrome, /<title>Google Chrome<\/title>/);
  assert.equal(cases.length, 12);
  assert.deepEqual(new Set(cases.map((item) => item.expectedRisk)), new Set(["high", "medium", "uncertain", "low"]));
});

test("keeps the installed experience current and ships the public QR", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const worker = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  const qr = await readFile(new URL("../public/pausa-qr.png", import.meta.url));
  assert.match(source, /sessionStorage\.getItem\("pausa-install-dismissed"\)/);
  assert.match(source, /localStorage\.setItem\("pausa-installed", "true"\)/);
  assert.match(source, /registration\.update\(\)/);
  assert.match(source, /How it works/);
  assert.match(source, /You tell, speak or share what you see\./);
  assert.match(source, /screen !== "demo"/);
  assert.match(source, /Just speak\. When you finish, we'll check it\./);
  assert.match(source, /For emergencies, contact local emergency services\./);
  assert.doesNotMatch(source, /<p className="privacy-note"/);
  assert.match(source, /AttachmentIcon/);
  assert.match(worker, /pausa-shell-v9/);
  assert.match(worker, /networkFirst/);
  assert.deepEqual([...qr.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});
