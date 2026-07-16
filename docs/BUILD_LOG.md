# Build log

## July 16, 2026

### Source and problem framing

The idea emerged from a long voice conversation about building a universal, altruistic daily-life product. The team rejected generic chat wrappers and narrowed the project to a calm intervention for suspicious digital messages. The initial audience is broad, with accessibility choices informed by older adults and people with limited technical confidence.

### Decisions made with Codex

- Chose a mobile-first PWA instead of native iOS/Android to fit the hackathon timeline and avoid invasive permissions.
- Chose “Pausa” as the provisional name because it expresses the behavioral intervention and works across Spanish and English.
- Kept the big “personal emergency button” vision, but bounded the build to fraud and phishing.
- Made Spanish the product's first language while including complete English support for judging.
- Avoided background message monitoring and automatic calls.
- Designed four input paths: text, voice, camera photo, and saved screenshot.
- Added a deterministic guided example so judges can understand the flow even if the API is unavailable.
- Selected GPT-5.6 vision plus strict structured outputs for the live analysis path.
- Created an active Codex goal covering the app, repository, documentation, publishing, video, and Devpost submission.

### Evidence to preserve

- Primary Codex task/session and `/feedback` Session ID.
- Commit history beginning during the submission period.
- Screenshots or clips of the early skeleton, working flow, API integration, and mobile testing.
- Prompt/evaluation changes made after synthetic scam tests.

### Next checkpoint

Complete the local build, connect a real API key, and verify one text example and one screenshot example through GPT-5.6.

### First working product

- Built the bilingual, mobile-first experience with text, camera, screenshot, browser dictation, and read-aloud output.
- Implemented the GPT-5.6 Responses API path with image input and a strict structured-output schema.
- Added a clearly labeled deterministic demonstration path for judges when no API key is configured.
- Published the first private Sites version for product review.
- Created the public `elesdex/pausa` GitHub repository.
- Added full PWA installation support: branded 192px and 512px icons, a service worker, and mobile installation metadata.
- Rebuilt successfully, passed lint, passed the rendered-product tests, and verified the service worker, manifest, and guided-analysis endpoint from the running app.
- Confirmed that the live GPT-5.6 path still needs a separately configured OpenAI API key before it can be verified.
- Added device-aware screenshot guidance for iPhone models with and without a Home button, Android, and other devices.
- Added a bilingual installation walkthrough so a family member can place Pausa on an iPhone or Android home screen without an app store.
- Removed the viewport zoom restriction, localized the document language, expanded visible focus treatment, and retained reduced-motion support.
- Added an optional trusted-person share action that includes only Pausa's guidance and safe steps, never the original private message or screenshot.
- Added automatic preparation for oversized camera images and a 25-second request timeout so common mobile-network failures produce an honest recovery state instead of a stuck screen.
- Added an integration-contract test that captures the outbound Responses API request and verifies the `gpt-5.6` model, strict JSON schema, prompt-injection boundary, and parsed non-demo response without spending a live API call.
- Added a bilingual public privacy page covering voluntary submission, image previews, browser dictation, native sharing, the lack of an app database, and OpenAI's standard abuse-monitoring retention of up to 30 days.
- Removed unused starter authentication, database, migration, and D1 example code plus the related dependencies so the public repository matches the product's no-account, no-database architecture.
- Added contribution rules and an evidence-based mobile QA matrix that keeps automated checks separate from the physical iPhone, Android, and first-time-user tests still required.
- Created a clearly labeled, fully synthetic bank-message screenshot in SVG and PNG formats for the live vision test and video, avoiding the use of any real person's message or financial data.
- Added a requirement-by-requirement readiness audit and corrected the submission checklist so simulated integration evidence is never mistaken for a live GPT-5.6 evaluation or public delivery.
- Documented the Sites starter origin, retained deployment toolchain, third-party packages, and the fact that no existing scam-detector product or dataset was copied.
- Replaced the provisional product name “Pausa” with the selected final name **HELP** across the interface, PWA metadata, prompts, documentation, tests, Devpost draft, and video script. “Primero, pausa” remains the product's first safety instruction, not its brand name.
- Reconsidered the naming decision and confirmed **Pausa** as the final project name. Restored Pausa across the product, repository targets, PWA metadata, prompts, tests, and submission materials.
- User confirmed joining OpenAI Build Week on Devpost and submitting the Codex credit request on July 16.
