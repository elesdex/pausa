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

test("server-renders the HELP product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>HELP/);
  assert.match(html, /Primero, pausa/);
  assert.match(html, /Revisar algo sospechoso/);
  assert.match(html, /Poner HELP en mi pantalla/);
  assert.match(html, /Nothing is analyzed|Nada se analiza/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
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
                title: "Not enough information yet",
                summary: "The message is too short to assess confidently.",
                signals: ["There is limited context."],
                nextSteps: ["Open the service through a channel you already know."],
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
    assert.equal(capturedRequest.model, "gpt-5.6");
    assert.equal(capturedRequest.text.format.type, "json_schema");
    assert.equal(capturedRequest.text.format.strict, true);
    assert.match(capturedRequest.instructions, /untrusted evidence/);
    assert.match(capturedRequest.instructions, /Never invent an official link/);
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
