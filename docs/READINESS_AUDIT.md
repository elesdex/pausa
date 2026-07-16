# OpenAI Build Week readiness audit

Audit date: July 16, 2026  
Deadline: Tuesday, July 21, 2026 at 5:00 PM Pacific / 6:00 PM Mexico City  
Target internal submission time: 4:00 PM Mexico City

Status meanings:

- **Proven** — current evidence directly demonstrates the requirement.
- **Partial** — the artifact exists, but an external or end-to-end check remains.
- **Missing** — the required external artifact or confirmation does not exist yet.

## Product objective

| Requirement | Status | Current evidence | Remaining proof |
|---|---|---|---|
| Mobile web app | Proven locally | `app/page.tsx`, manifest, service worker, icons, successful production build | Public deployment of the current commit |
| Free and open source | Partial | Apache 2.0 `LICENSE`, no payment or account flow, `CONTRIBUTING.md` | Push complete source to public GitHub |
| Screenshot and photo input | Proven in code | Camera and file inputs plus client-side preparation | Physical iPhone and Android test |
| Text input | Proven | Textarea flow and API contract test | One live GPT-5.6 result |
| Voice input | Partial | Browser speech-recognition flow and fallback | Physical-browser test |
| Risk signals without certainty | Proven by contract, partial live | Strict schema, uncertainty enum, prompt rules, demo, regression tests | Live evaluation and failure review |
| Plain-language explanation | Proven by demo, partial live | Bilingual demo result and schema | Live evaluation |
| Safe next action | Proven by demo, partial live | Independent-verification rules and structured next steps | Live evaluation |
| Read result aloud | Proven in code | Browser speech synthesis | Physical-device test |
| Trusted-person support | Proven in code | Native share action excludes original input | Physical-device privacy check |
| Spanish and English | Proven | Full product copy, results, privacy, install, and capture guidance | Visual review on physical devices |
| Installable PWA | Proven by files, partial device | Manifest, icons, service worker, install instructions | Install and launch on iPhone and Android |
| Privacy disclosure | Proven | `/privacy` route and automated test | Verify published route |

## Technical and safety evidence

| Requirement | Status | Evidence |
|---|---|---|
| GPT-5.6 is the configured model | Proven by contract | Integration test captures `model: gpt-5.6` |
| Image input is sent through Responses API | Proven in code | Data-URL image content in `app/api/analyze/route.ts` |
| Structured output is strict | Proven by contract | JSON-schema test |
| Prompt injection is treated as untrusted | Proven by contract | System instruction test plus synthetic eval case |
| Missing key never produces fake analysis | Proven | 503 regression test |
| Demo never spends a live call | Proven | Deterministic demo route test |
| Large image and slow request recovery | Proven in code | Client preparation, 5 MB server limit, 25-second timeout |
| Synthetic evaluation coverage | Proven | 12 cases in `tests/scam-evals.json` |
| Synthetic screenshot | Proven | Labeled SVG and PNG plus signature test |
| Build and lint | Proven | Clean lint and `pnpm test` |
| Automated suite | Proven | 8 passing tests |

## Hackathon deliverables

| Deliverable | Status | Evidence | Remaining action |
|---|---|---|---|
| Day-by-day plan | Proven | `docs/ROADMAP.md` | Keep current |
| Public repository | Partial | `https://github.com/elesdex/pausa` exists | Authenticate and push all local commits |
| License | Proven locally | Apache 2.0 `LICENSE` | Verify visible on GitHub |
| README and setup | Proven locally | `README.md` | Verify install from clean clone |
| Starter and third-party disclosure | Proven locally | README build-origin section | Verify visible on GitHub |
| Codex build evidence | Partial | Build log and commit history | Add primary `/feedback` Session ID |
| Working judge URL | Missing | Private first Sites deployment exists | Deploy latest commit publicly with API key |
| English Devpost copy | Proven as draft | `docs/DEVPOST_DRAFT.md` | Enter and proofread in Devpost |
| Under-three-minute video | Partial | Timed 2:35 script and synthetic visual | Record, edit, upload publicly, verify duration |
| Devpost registration | Missing confirmation | None available to Codex | User confirms joined event |
| Codex credits request | Missing confirmation | None available to Codex | Submit before July 17 at 1:00 PM Mexico City |
| Final Devpost submission | Missing | Not yet possible | Add all URLs and Session ID, submit, reopen, verify |

## Critical path

1. **User today:** confirm Devpost registration and submit the Codex credit request before its cutoff.
2. **User authorization:** authenticate GitHub so Codex can push the existing local history.
3. **User secret setup:** configure `OPENAI_API_KEY` through a secure local or hosting environment; never paste it into chat.
4. **Codex:** run text, image, and 12-case live evaluations; fix failures.
5. **Codex + user device:** complete the physical QA matrix.
6. **Codex:** deploy the current commit publicly and verify every public route.
7. **User + Codex:** record the prepared script, upload to YouTube, add `/feedback` Session ID, submit Devpost, and reopen the entry to verify it.

The project is not submission-ready until every **Missing** item is resolved and every **Partial** judge-facing artifact is verified in its public form.
