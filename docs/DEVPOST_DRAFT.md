# Devpost submission draft

## Project name

HELP

## Category

Apps for Your Life

## One-line pitch

Scams use urgency. HELP gives people calm, clarity, and one safer next step.

## Short description

HELP is a free, open-source, voice-first web app that helps people respond safely to suspicious digital messages. Share a screenshot, photo, pasted message, or voice description. HELP uses GPT-5.6 to identify possible warning signals, explain them in plain language without claiming certainty, and guide the person toward an independently verified next step.

## Inspiration

This project began with a familiar fear: someone we love receives a message that looks official, feels urgent, and is designed to make them act before they think. The original audience was older relatives who may not feel confident with screenshots, links, or app permissions. We quickly realized that vulnerability under pressure is universal.

Most scam checkers begin after a person has already captured and submitted a message. HELP starts one step earlier. It interrupts urgency, offers several accessible ways to share what happened, and explains not only what looks suspicious but how to verify safely.

## What it does

- Opens as a simple mobile help button with no account or background monitoring.
- Accepts pasted text, browser dictation, a camera photo, or a saved screenshot.
- Uses GPT-5.6 vision and structured outputs to assess possible scam signals.
- Separates guidance from certainty and uses an “uncertain” result when evidence is limited.
- Explains manipulation patterns in short, accessible language.
- Never routes the person to a phone number or link supplied by suspicious content.
- Reads the result aloud using the device voice.
- Works in Spanish and English.
- Includes a clearly labeled guided example that judges can run without an API key.
- Can be installed on a phone home screen as a PWA.

## How we built it

HELP is a mobile-first Next.js application built and iterated with Codex. The server uses the OpenAI Responses API with GPT-5.6, image input, medium reasoning effort, and a strict JSON schema. The schema limits responses to a risk level, short explanation, observed signals, safe next steps, one reusable lesson, and an emergency flag.

The client uses standard browser capabilities for camera/file input, speech recognition when available, and speech synthesis for read-aloud results. It stores no submissions, requires no account, includes no analytics, and does not monitor messages in the background.

We created a synthetic evaluation set covering bank impersonation, parcel fees, family impersonation, verification-code theft, prize and job scams, benign notices, ambiguous messages, threatening authority scams, QR payments, and prompt injection.

## How we used Codex

Codex participated across the full product cycle:

- converted a long voice exploration into a bounded product objective;
- checked the official hackathon requirements and kept a live submission checklist;
- chose a privacy-preserving PWA architecture over invasive background monitoring;
- implemented the bilingual interface, capture paths, voice behavior, API route, structured output, install support, and tests;
- identified and fixed a safety defect where an unconfigured live request could have been mistaken for the deterministic demo;
- maintained the build log, evaluation set, roadmap, README, licensing, and submission drafts;
- built, linted, tested, published, and documented the product from the same primary task.

The primary Codex `/feedback` Session ID will be included in the final submission.

## How we use GPT-5.6

GPT-5.6 is the live reasoning and vision layer. It receives the user-provided text and optional image, treats the content as untrusted evidence, identifies possible scam patterns, and returns constrained structured guidance. The model is specifically instructed not to follow instructions embedded inside suspicious content, not to invent official contact information, not to shame the user, and not to claim certainty.

## Challenges

The largest product challenge was resisting the temptation to build a universal emergency assistant in five days. We kept that broader vision, but limited the working module to scam and phishing uncertainty.

The largest safety challenge was balancing usefulness with fallibility. HELP cannot certify that a message is safe or fraudulent. Its job is to slow the moment down, surface evidence, and route verification away from the suspicious message.

The largest accessibility challenge was supporting people who may not know how to take a screenshot. HELP therefore accepts a camera photo, file, text, or voice description and keeps every interaction large and direct.

## Accomplishments

- A complete bilingual mobile flow rather than a chat mockup.
- Four accessible input methods and read-aloud output.
- Real GPT-5.6 image and text analysis with strict structured output.
- Explicit uncertainty and independent-verification safety rules.
- Installable PWA behavior with no app-store dependency.
- A deterministic, clearly labeled judge demo.
- Open-source Apache 2.0 code and a reproducible synthetic evaluation set.

## What we learned

Fraud prevention is not only classification. Scam messages often weaponize urgency, fear, authority, or affection. A useful intervention must change the pace of the decision, not simply return a red badge.

We also learned that “no API key” is a product state, not an excuse to return plausible-looking sample output. Demo behavior must be explicit so users never confuse a scripted example with analysis of their own message.

## What is next

The next version will add device-specific screenshot guidance, trusted-contact escalation that is always user-approved, community-reviewed multilingual evaluation data, and partnerships that can keep the basic protection free. The long-term vision is a calm, personal help button for moments of digital uncertainty; scam protection is where it begins.

## Links to add before submission

- Working public app: `TBD`
- Public repository: `https://github.com/elesdex/help`
- Public YouTube video: `TBD`
- Primary Codex `/feedback` Session ID: `TBD`
