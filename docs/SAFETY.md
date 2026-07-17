# Safety and privacy design

## Product position

Pausa is a decision aid, not an authority. It identifies warning signals and recommends safer verification behavior. It never certifies that a message is safe or fraudulent.

## Mandatory behaviors

- Use calibrated language: “looks suspicious,” “signals suggest,” or “not enough information.”
- Tell the person not to click, reply, call, pay, or share information while reviewing.
- Never route to a number, link, QR code, or contact supplied by suspicious content.
- Recommend independently opening an official app, typing a known domain, using a number already saved, or checking a physical card or statement.
- Avoid shame, blame, panic, and technical jargon.
- Keep next steps short and ordered.
- Explicitly state when the evidence is insufficient.

## Data handling for the MVP

- No account or sign-in.
- No database or persistent upload storage.
- Images and text are sent only when the person presses the review button.
- Voice recordings are sent only after the person explicitly starts and stops recording. Audio is transcribed with OpenAI and is not stored in an app database.
- Spoken results are AI-generated from the already-visible guidance and are clearly disclosed as synthetic voice.
- Inputs are processed server-side and are not placed in browser storage.
- No analytics, advertising, or third-party tracking.
- Demo and evaluation data must be synthetic or redacted.

## High-stakes boundaries

Pausa does not replace emergency services, law enforcement, banks, healthcare professionals, legal counsel, or trusted people. The MVP does not automatically call or message anyone. It offers a user-initiated `tel:911` link labeled specifically for Mexico and the United States; it does not infer location or route emergencies through AI. Broader emergency routing would require jurisdiction-aware data, explicit user configuration, confirmation, auditability, and separate safety review.

## Verified organization channels

A future verified-channel directory may offer official contact options for named organizations such as banks or delivery services. Every entry must be maintained separately from model output, link to a first-party source, record its country and verification date, and expire for re-review. Until that directory exists, Pausa must never present a phone number or link from model memory as official.

## Evaluation risks

Test specifically for:

- false reassurance on sophisticated scams;
- false alarms on legitimate notices;
- invented official phone numbers or URLs;
- instructions that keep the user inside the suspicious channel;
- overly long explanations under stress;
- inaccessible language or blaming tone;
- accidental retention of uploaded personal data.
