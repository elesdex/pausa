# Codex `/feedback` Session ID

`/feedback` is a Codex command for sending product feedback or diagnostics to the Codex team. It is not feedback collected by Pausa and it is not an analytics feature inside the app.

For the OpenAI Build Week submission, the useful artifact is the Session ID returned after feedback is submitted. It connects the submission to the Codex work session that contains the build history.

## Recommended moment

Run `/feedback` from the canonical Pausa task after the final physical QA, public deployment, and documentation update. That gives the shared session the most complete evidence.

## Steps

1. In the Codex composer, type `/feedback` and press Enter.
2. Choose to include the existing session and logs when the dialog offers that option.
3. Use a short note such as: `OpenAI Build Week submission evidence for Pausa. This session contains product planning, implementation, QA, and deployment.`
4. Submit the feedback only after reviewing what will be shared.
5. Copy the Session ID returned by Codex.
6. Add it to `docs/DEVPOST_DRAFT.md`, the Devpost entry, and `docs/HACKATHON_CHECKLIST.md`.

Submitting feedback transmits the selected session/log information to OpenAI. The user should perform and approve this step directly.
