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
  assert.match(html, /Revisar algo sospechoso/);
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
