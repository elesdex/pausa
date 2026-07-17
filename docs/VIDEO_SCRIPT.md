# Pausa demo video — target 2:45

The story is more important than listing every feature. The video should feel like a short public-service commercial: pressure, pause, understanding, one safer action, and proof that the product works.

Use English narration or complete English captions. Keep the final export under 3:00.

## Final story and voiceover

### 0:00–0:14 — the pressure

**Visual:** Full-screen synthetic bank message. Highlight only “call immediately” and the supplied phone number. Add a subtle notification sound, then silence.

**Voiceover:**

> A message looks official. It mentions money. It tells you to act now. In that moment, urgency is the attack.

### 0:14–0:31 — the pause

**Visual:** A hand opens Pausa from the phone home screen. Show the large pause symbol and the two primary inputs.

**Voiceover:**

> Pausa is a free, open-source help button for moments of digital uncertainty. It does not monitor your messages. You open it when you want help, and the first step is simple: do not respond yet.

### 0:31–0:57 — meet people where they are

**Visual:** Tap voice, speak one sentence, then cut quickly to the paperclip button, camera, screenshot guide, and pasted text. Do not complete every path.

**Voiceover:**

> You can describe what happened by voice, photograph another screen, choose a saved image, or paste the text. You do not need to know how to take a screenshot to get started.

### 0:57–1:31 — the working demo

**Visual:** Upload `public/demo/bank-alert-es.png` or use the equivalent synthetic live input. Tap the main review button. Show the calm loading state, the live high-risk result, up to three signals, and the first safe action. Briefly play the spoken result.

**Voiceover:**

> GPT-5.6 reads the text and image and returns a constrained result. It does not claim certainty. Here it notices artificial urgency, financial fear, and a phone number supplied by the message. Pausa does not tell us to call that number. It guides us to leave the message and verify through a channel we already know.

### 1:31–1:49 — support beyond the result

**Visual:** Show “Ask someone you trust,” the native share preview without the original image, the language switch, and the installed home-screen icon. Keep the 911 action visible for one beat.

**Voiceover:**

> The guidance can be read aloud, shared with someone you trust without attaching the original private message, and opened again from the phone home screen. Emergency help remains separate and immediate.

### 1:49–2:18 — built with Codex

**Visual:** Fast montage: the canonical Codex task, roadmap, a focused code diff, terminal tests, the safety-evaluation file, and the build log. Hide credentials and unrelated content.

**Voiceover:**

> I am not a traditional software developer. I started by describing the problem and the people I wanted to help. Codex turned that conversation into a plan, built the product, connected the OpenAI APIs, caught unsafe fallback behavior, optimized image latency, created evaluations, tested each iteration, and kept the submission evidence current.

### 2:18–2:36 — proof

**Visual:** Four clean metric cards, one at a time: `12/12 live safety evaluations`, `12.7-second synthetic vision check`, `Spanish + English`, `Apache 2.0 open source`.

**Voiceover:**

> Pausa passed twelve live safety scenarios, including legitimate, ambiguous, threatening, QR-payment, and prompt-injection messages. A synthetic vision check completed in 12.7 seconds. The app is bilingual, public, and open source.

### 2:36–2:45 — close

**Visual:** Pausa mark, public QR, URL, GitHub repository, and the line “One calmer, safer next step.”

**Voiceover:**

> Scams use urgency. Pausa gives people time, clarity, and one safer next step.

## Record these shots separately

| Shot | Source | Target length |
|---|---|---:|
| Synthetic message hook | Full-screen still with two highlights | 6–8 s |
| Open installed Pausa | Physical phone camera or phone screen recording | 8–10 s |
| Voice input | Physical phone screen recording with mic permission already granted | 7–9 s |
| Photo/text alternatives | Three short screen-recording cuts | 6–8 s total |
| Live GPT-5.6 result | One uninterrupted screen recording | 25–30 s |
| Read aloud + trusted share | Screen recording; close share sheet without sending | 8–10 s |
| Codex montage | Desktop screen recording, tightly cropped | 20–24 s |
| Evidence cards | Designed title cards using verified figures only | 12–15 s |
| Closing QR | Static branded frame | 7–9 s |

## How to record

1. Put the phone in Do Not Disturb and hide personal notifications.
2. Use only synthetic or fully redacted messages.
3. Record phone interactions as clean clips; do not try to perform the whole demo in one take.
4. Capture the live analysis clip with a stable connection and keep the complete loading-to-result transition.
5. Record the voiceover afterward in a quiet room, one paragraph at a time.
6. Record Codex at 1080p or higher with the project task, diff, tests, and build log already prepared on screen.
7. Never show `.env.local`, API keys, account billing, personal browser tabs, or private messages.

## How to assemble

- Canvas: 1920×1080, 30 fps, landscape.
- Place vertical phone recordings inside a simple cream background; keep the phone UI large enough to read.
- Use hard cuts or short dissolves. Avoid decorative transitions that compete with the safety story.
- Add burned-in English captions for the full narration.
- Keep background music very low and remove it during the first notification-to-silence moment.
- Use the Pausa palette: cream, forest green, muted gold, and red only for risk/emergency emphasis.
- Show each metric only if it remains verified in the final repository.
- Export once, watch the full file without stopping, and confirm duration below 3:00.

## Final verification

- [ ] Real live-analysis result is shown, not only the deterministic tutorial.
- [ ] GPT-5.6 and Codex have distinct, specific explanations.
- [ ] Public app URL, QR, and repository are readable on the closing frame.
- [ ] English narration or complete English captions are present.
- [ ] No personal or secret information is visible.
- [ ] YouTube visibility is public or unlisted as allowed by the rules, and the link works signed out.
- [ ] Final duration is under 3:00.
