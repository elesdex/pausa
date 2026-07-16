# Pausa

> Scams use urgency. Pausa gives people calm and one safer next step.

Pausa is a free, open-source, mobile-first web app for moments of digital uncertainty. A person can share a suspicious message as text, voice, photo, or screenshot. Pausa uses GPT-5.6 vision and structured outputs to identify risk signals, explain them without jargon or shame, and recommend a safer way to verify.

The first module focuses on scam and phishing messages. The broader vision is a trusted, accessible help button for moments when someone does not know what is happening or what to do next.

## Why this is different

Pausa is not just a scam verdict. It starts before analysis by interrupting urgency, supports people who do not know how to take screenshots, explains the manipulation pattern, and always routes toward an independently verified channel. It does not monitor private messages in the background.

## Current MVP

- Spanish-first and fully available in English.
- Large, touch-friendly mobile interface.
- Text, voice, camera photo, and screenshot input.
- Automatic client-side preparation of large camera images before upload.
- Device-aware screenshot instructions for iPhone and Android.
- GPT-5.6 image understanding and structured risk guidance.
- Calm read-aloud results using the device voice.
- Privacy-conscious sharing of the guidance, without attaching the original message or screenshot.
- A built-in guided demo that works without an API key.
- Installable PWA manifest, branded icons, and service worker so it can be added to a phone home screen.
- Built-in iPhone and Android home-screen installation instructions.
- No account, analytics, or permanent storage.
- Public bilingual privacy disclosure, including OpenAI API retention boundaries.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Add an OpenAI API key to `.env.local` to enable live analysis:

```text
OPENAI_API_KEY=your_key_here
```

Then open `http://localhost:3000`.

Run the verified build and automated suite with:

```bash
pnpm test
```

## Test the product

1. Choose “Try a guided example” for the no-key demo.
2. Or choose “Check something suspicious.”
3. Paste a message, dictate it, take a photo, or select a screenshot.
4. Review the risk signals and the recommended safe next step.
5. Use “Listen out loud” to hear the result.

Never upload real passwords, PINs, full card numbers, identity documents, or private financial records. Use synthetic or redacted examples for judging.

Pausa does not keep submissions in its own database. Under standard API settings, OpenAI may retain customer content in abuse-monitoring logs for up to 30 days. See the in-product privacy page and [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data).

The repository includes 12 synthetic safety cases covering scams, benign messages, ambiguity, and prompt injection. With a live local server and API key configured, run:

```bash
pnpm eval:live
```

The automated test suite also verifies the outbound GPT-5.6 request contract with a simulated Responses API response. This does not replace the required live-key evaluation before submission.

## GPT-5.6 integration

The server sends user-provided text and, when present, an image to the OpenAI Responses API using the `gpt-5.6` model. A strict JSON schema constrains the result to:

- risk level;
- short explanation;
- observed warning signals;
- safe next steps;
- one reusable lesson;
- an emergency flag.

The system prompt avoids certainty, shame, and unsafe redirection. When no API key is configured, only the clearly labeled guided example is available as a deterministic fallback.

## How Codex contributed

This project is being designed and built in one primary Codex task. Codex has helped:

- turn an extended voice conversation into a bounded product objective;
- verify the hackathon rules and required evidence;
- choose a privacy-preserving PWA architecture;
- create the bilingual interface and accessibility behavior;
- implement GPT-5.6 image input and structured output;
- maintain the roadmap, decision log, tests, and submission checklist.

Key product decisions and daily progress are recorded in `docs/BUILD_LOG.md`. The primary Codex `/feedback` Session ID will be added before submission.

## Safety boundary

Pausa provides guidance, not a guarantee. It does not replace emergency services, banks, law enforcement, medical professionals, or trusted people. It never instructs a person to contact a phone number or link supplied by suspicious content. See `docs/SAFETY.md`.

## Open source

Licensed under Apache License 2.0. Contributions that improve accessibility, language coverage, scam education, evaluation data, and safe routing are welcome.

Public repository: [github.com/elesdex/pausa](https://github.com/elesdex/pausa)

See [CONTRIBUTING.md](CONTRIBUTING.md) for the safety and privacy rules that apply to community contributions.
