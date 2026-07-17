# Pausa manual test cases

These synthetic messages exercise the four result states without using real personal data, phone numbers, or live links.

1. Open Pausa.
2. Paste one `message` from `messages.json`.
3. Compare the result with `expectedRisk`.
4. Check that the response has no more than three signals and three next steps.
5. Confirm that no bullet becomes a paragraph and no phone number or link is invented.

The expected risk is a test hypothesis, not a guaranteed verdict. `low` means the supplied text contains few scam signals; it never means Pausa certifies the sender.

