# Mobile and accessibility QA

This matrix separates automated evidence from checks that require a physical device. Do not mark a device row complete based only on desktop simulation.

## Automated evidence

| Check | Status | Evidence |
|---|---|---|
| Production build | Pass | `pnpm test` builds all routes |
| Public judge URL | Pass | `https://pausa-digital.elesdex.chatgpt.site/` opens without authentication |
| Desktop/mobile parity | Pass in browser QA | Same simplified home screen at desktop and 390×844 viewports on July 17 |
| Public QR | Pass | `public/pausa-qr.png` and `public/pausa-qr.svg` point to the judge URL |
| Spanish-first server render | Pass | Product-shell test |
| English copy available | Pass | Bilingual source and guided flow |
| PWA manifest and mobile metadata | Pass | Installation-metadata test |
| 192px and 512px icons | Pass | Manifest plus generated PNG assets |
| Service worker does not cache API POSTs | Pass by inspection | `/api/` is excluded in `public/sw.js` |
| Demo is explicitly labeled | Pass | Guided-demo test |
| Missing API key cannot impersonate analysis | Pass | 503 regression test |
| GPT-5.6 request contract | Pass | Simulated Responses API integration test |
| OpenAI voice route contracts | Pass | Transcription and speech model integration test |
| Live synthetic voice round trip | Pass | `gpt-4o-mini-tts` audio transcribed exactly by `gpt-4o-transcribe` |
| Privacy disclosure | Pass | Bilingual privacy-route test |
| Reduced motion | Pass by inspection | `prefers-reduced-motion` stylesheet rule |
| Pinch zoom | Pass by inspection | No `maximumScale` restriction |

## July 17 product QA findings

The public site was reviewed in desktop and 390×844 browser viewports. Both showed the same simplified “What do you need to check?” experience. A physical phone showing the older “First pass” screen is therefore treated as an installed-PWA cache issue, not a separate mobile layout.

Changes prepared from this review:

- More vertical space between voice, photo/text, guided example, the main action, and emergency help.
- A paperclip icon distinguishes photo/text from voice.
- Shorter voice and privacy copy; a quieter guided-example link.
- A three-step guided-example story before the result.
- Visual screenshot instructions matching the installation walkthrough.
- A brighter 911 action while preserving the red emergency outline.
- Installation dismissal lasts only for the current browser session. It returns next visit unless Pausa is installed.
- Installed mode and the `appinstalled` event suppress the installation suggestion.
- The service worker uses a new network-first shell and requests updates so installed phones receive the current interface.

These changes still require the physical-device checks below. Do not convert them to “Pass” until observed on the named device.

## Start physical QA from the public QR

![Scan to open the public Pausa app](../public/pausa-qr.png)

1. Scan the QR with the phone camera.
2. Record the device model, OS version, browser, tester, and date.
3. Complete the relevant checklist without coaching.
4. Take one screenshot of the home screen and one of a real synthetic-result flow.
5. Write the exact issue under “Issues found”; do not silently interpret it as passed.

## iPhone Safari — physical check required

- [ ] Open the public URL without authentication.
- [ ] Add Pausa to the Home Screen and launch it in standalone mode.
- [ ] Confirm the installed app shows the current simplified home screen, not “First pass.”
- [ ] Confirm the install suggestion is absent in standalone mode.
- [ ] Confirm the icon and title are legible.
- [ ] Photograph a synthetic message on another screen.
- [ ] Select a saved screenshot.
- [ ] Confirm a large photo is prepared without freezing the page.
- [ ] Record a Spanish description, stop it, and reach the result without typing.
- [ ] Hear a complete Spanish result using the disclosed AI-generated voice.
- [ ] Open the native share sheet and confirm the original screenshot is not attached.
- [ ] Increase system text size and complete the flow.
- [ ] Pinch zoom the privacy page.

Device/version: `TBD`  
Tester/date: `TBD`  
Issues found: `TBD`

## Android Chrome — physical check required

- [ ] Open the public URL without authentication.
- [ ] Install the PWA and launch it in standalone mode.
- [ ] Confirm the installed app shows the current simplified home screen, not “First pass.”
- [ ] Confirm the install suggestion is absent in standalone mode.
- [ ] Confirm the icon and title are legible.
- [ ] Photograph a synthetic message on another screen.
- [ ] Select a saved screenshot.
- [ ] Record an English description, stop it, and reach the result without typing.
- [ ] Hear a complete English result using the disclosed AI-generated voice.
- [ ] Share only the guidance through the Android share sheet.
- [ ] Navigate with large system text.
- [ ] Verify the back action never loses the ability to start over.
- [ ] Swipe right from the left edge on a secondary screen and return home.

Device/version: `TBD`  
Tester/date: `TBD`  
Issues found: `TBD`

## First-time-user observation

Give the phone to one person who has not seen Pausa. Say only:

> “You received a suspicious message. Use this to decide what to do next.”

Observe without coaching:

- [ ] They understand the first pause instruction.
- [ ] They choose an input method without help.
- [ ] They distinguish a risk signal from a guarantee.
- [ ] They can state the next safe action afterward.
- [ ] They understand that the example is a demonstration.

Participant/date: `TBD`  
Highest-friction moment: `TBD`  
Change made afterward: `TBD`
