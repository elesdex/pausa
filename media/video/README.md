# Pausa submission video assets

## Current fallback cut

- `output/pausa-demo-draft-en.mp4` — 1920×1080, English synthetic narration, approximately 2:00.
- `output/pausa-demo-draft-en.srt` — matching English captions.

The fallback covers what Pausa does, how Codex was used, and how GPT-5.6 is integrated. Before uploading, watch the full file with sound. Prefer replacing the static product walkthrough with one uninterrupted physical-phone clip that shows a real synthetic input moving from loading to result.

## Rebuild

From the repository root on macOS:

```bash
swiftc -parse-as-library scripts/capture-video-stills.swift -o /tmp/capture-video-stills
/tmp/capture-video-stills
swiftc -parse-as-library scripts/build-video-draft.swift -o /tmp/build-video-draft
/tmp/build-video-draft
```

The capture script reads only the public Pausa app and uses a nonpersistent web view. The assembly script uses macOS AVFoundation and the system Samantha English voice. It creates no music and depends only on repository-owned or synthetic visuals.

## Generated sources

- `source/01-home-en.png`
- `source/02-input-options-en.png`
- `source/03-guided-example-en.png`
- `source/04-result-en.png`
- `cards/scene-01.png` through `cards/scene-09.png` (regenerable and Git-ignored)

The app captures, final MP4, captions, and scripts are the intended handoff artifacts. Intermediate narration and silent-video files are Git-ignored.
