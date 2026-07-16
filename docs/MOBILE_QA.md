# Mobile and accessibility QA

This matrix separates automated evidence from checks that require a physical device. Do not mark a device row complete based only on desktop simulation.

## Automated evidence

| Check | Status | Evidence |
|---|---|---|
| Production build | Pass | `pnpm test` builds all routes |
| Spanish-first server render | Pass | Product-shell test |
| English copy available | Pass | Bilingual source and guided flow |
| PWA manifest and mobile metadata | Pass | Installation-metadata test |
| 192px and 512px icons | Pass | Manifest plus generated PNG assets |
| Service worker does not cache API POSTs | Pass by inspection | `/api/` is excluded in `public/sw.js` |
| Demo is explicitly labeled | Pass | Guided-demo test |
| Missing API key cannot impersonate analysis | Pass | 503 regression test |
| GPT-5.6 request contract | Pass | Simulated Responses API integration test |
| Privacy disclosure | Pass | Bilingual privacy-route test |
| Reduced motion | Pass by inspection | `prefers-reduced-motion` stylesheet rule |
| Pinch zoom | Pass by inspection | No `maximumScale` restriction |

## iPhone Safari — physical check required

- [ ] Open the public URL without authentication.
- [ ] Add Pausa to the Home Screen and launch it in standalone mode.
- [ ] Confirm the icon and title are legible.
- [ ] Photograph a synthetic message on another screen.
- [ ] Select a saved screenshot.
- [ ] Confirm a large photo is prepared without freezing the page.
- [ ] Confirm browser dictation either works or shows the text fallback.
- [ ] Hear a complete Spanish result using the device voice.
- [ ] Open the native share sheet and confirm the original screenshot is not attached.
- [ ] Increase system text size and complete the flow.
- [ ] Pinch zoom the privacy page.

Device/version: `TBD`  
Tester/date: `TBD`  
Issues found: `TBD`

## Android Chrome — physical check required

- [ ] Open the public URL without authentication.
- [ ] Install the PWA and launch it in standalone mode.
- [ ] Confirm the icon and title are legible.
- [ ] Photograph a synthetic message on another screen.
- [ ] Select a saved screenshot.
- [ ] Use browser voice input.
- [ ] Hear a complete English result using the device voice.
- [ ] Share only the guidance through the Android share sheet.
- [ ] Navigate with large system text.
- [ ] Verify the back action never loses the ability to start over.

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
