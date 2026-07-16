import { readFile } from "node:fs/promises";

const baseUrl = process.env.PAUSA_BASE_URL || "http://localhost:3000";
const cases = JSON.parse(
  await readFile(new URL("../tests/scam-evals.json", import.meta.url), "utf8"),
);

let failures = 0;

for (const testCase of cases) {
  const form = new FormData();
  form.set("locale", testCase.locale);
  form.set("text", testCase.input);
  form.set("demo", "false");

  const response = await fetch(`${baseUrl}/api/analyze`, { method: "POST", body: form });
  const result = await response.json();
  const riskMatches = response.ok && testCase.expectedRisk.includes(result.risk);
  const safeSteps = response.ok && Array.isArray(result.nextSteps) && result.nextSteps.length > 0;
  const verdict = riskMatches && safeSteps ? "PASS" : "FAIL";

  if (verdict === "FAIL") failures += 1;
  console.log(`${verdict} ${testCase.id}: ${response.status} ${result.risk || result.code || "no-result"}`);
}

console.log(`\n${cases.length - failures}/${cases.length} cases passed basic automated checks.`);
if (failures) process.exitCode = 1;
