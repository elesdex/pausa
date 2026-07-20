# Pausa demo video — canonical two-minute script

The final video must stay at or below three minutes, be public on YouTube, contain audio, and explain three things clearly: what Pausa does, how Codex was used, and what GPT-5.6 does. English narration is used throughout.

A complete 2:00 fallback cut already exists at `media/video/output/pausa-demo-draft-en.mp4`, with captions at `media/video/output/pausa-demo-draft-en.srt`.

## Exact narration and visual plan

### 0:00–0:08 — urgency

**Visual:** Full-screen synthetic bank message. Emphasize the large amount, “immediately,” and the supplied number.

**Narration:**

> A message looks official. It mentions money. It tells you to act now. In that moment, urgency is the attack.

### 0:08–0:22 — the product

**Visual:** Open Pausa from the phone home screen, then hold on the simplified home page.

**Narration:**

> Pausa is a free, open source help button for moments of digital uncertainty. It does not monitor your messages. You open it when you want help, and the first step is simple: do not respond yet.

### 0:22–0:35 — accessible inputs

**Visual:** Tap voice; cut to camera, saved screenshot, and pasted-text options.

**Narration:**

> You can describe what happened by voice, photograph another screen, choose a saved image, or paste the text. You do not need to know how to take a screenshot to get started.

### 0:35–0:48 — synthetic demonstration context

**Visual:** Show the clearly labeled guided example and its three-step explanation.

**Narration:**

> For a repeatable demonstration, Pausa shows a synthetic bank alert before any result. It explains what the person shared and how the app will turn a moment of doubt into one safer next step.

### 0:48–1:08 — GPT-5.6

**Visual:** Prefer an uninterrupted live synthetic upload from loading to result. Fallback: show the generated high-risk result, signals, and first safe action.

**Narration:**

> GPT-5.6 reads the text and image and returns a constrained result. It does not claim certainty. Here it notices artificial urgency, financial fear, and a phone number supplied by the message. Pausa does not tell us to call that number. It guides us to leave the message and verify through a channel we already know.

### 1:08–1:22 — support and privacy

**Visual:** Read aloud, trusted-person share preview without the source image, language switch, and installed icon.

**Narration:**

> The guidance can be read aloud with a disclosed synthetic voice and shared with someone you trust without attaching the original private message. Pausa is bilingual, installable on a phone, and keeps emergency help separate from model guidance.

### 1:22–1:42 — Codex

**Visual:** Show the canonical Codex task, one focused code diff, terminal tests, and the build log. Crop tightly and hide all secrets and unrelated content.

**Narration:**

> I am not a traditional software developer. I started by describing the problem and the people I wanted to help. Codex turned that conversation into a plan, built the product, connected the OpenAI APIs, caught unsafe fallback behavior, optimized image latency, created evaluations, tested each iteration, and kept the submission evidence current.

### 1:42–1:54 — evidence

**Visual:** Metric cards: `12/12 live safety evaluations`, `Spanish + English`, `Apache 2.0 open source`.

**Narration:**

> Pausa passed twelve live safety scenarios, including legitimate, ambiguous, threatening, QR payment, and prompt injection messages. The app is Spanish and English, public, and open source under the Apache two point zero license.

### 1:54–2:00 — close

**Visual:** Pausa mark, public QR, product URL, and GitHub URL.

**Narration:**

> Scams use urgency. Pausa gives people time, clarity, and one safer next step.

## Record only these replacement shots

The automated fallback already contains the full narration, cards, captions, and public-app captures. To strengthen it, record only:

1. **Installed app opening:** 5–7 seconds from the iPhone home screen.
2. **Live voice or image analysis:** 20–25 seconds, uninterrupted from input through loading to result.
3. **Read aloud and trusted share:** 6–8 seconds; close the share sheet without sending.
4. **Codex proof:** 8–12 seconds showing this task, a focused diff, and the passing test output.

## Recording rules

- Put the phone and computer in Do Not Disturb.
- Use only synthetic or fully redacted content.
- Never show `.env.local`, API keys, billing, private messages, email, or unrelated tabs.
- Record at 1080p or higher when possible.
- Do not use copyrighted music. Silence is acceptable; narration is mandatory.
- Keep all submitted copy and visuals in English, or include complete English translation.

## Final approval checklist

- [ ] A working flow is visible, not only a marketing claim.
- [x] The video explains Pausa, Codex, and GPT-5.6 specifically.
- [x] English voiceover and English captions exist.
- [x] Current fallback duration is approximately 2:00.
- [x] No third-party music is used.
- [ ] Watch the approved MP4 from beginning to end with sound.
- [ ] Upload to YouTube as Public and verify signed out.
- [ ] Paste the public YouTube URL into Devpost.
