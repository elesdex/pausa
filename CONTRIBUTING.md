# Contributing to HELP

HELP is an accessibility-first, open-source safety project. Contributions are welcome when they make the product calmer, clearer, more inclusive, or more honest about uncertainty.

## Start safely

- Never commit real scam victims' messages, phone numbers, account details, screenshots, or identity documents.
- Use synthetic or thoroughly redacted examples.
- Never add a flow that contacts a person, institution, or emergency service without an explicit user action.
- Never turn a risk assessment into a guarantee.
- Never direct users to a link or phone number found inside suspicious content.

## Good contribution areas

- Accessible interaction and plain-language improvements.
- Additional languages reviewed by fluent speakers.
- Synthetic scam and benign-message evaluation cases.
- Device-specific capture and installation guidance.
- Prompt-injection, privacy, and false-confidence tests.
- Carefully reviewed official-channel routing patterns.

## Local workflow

```bash
pnpm install
cp .env.example .env.local
pnpm test
pnpm dev
```

The guided example works without an API key. Live evaluation requires an OpenAI API key configured locally; never commit the key.

## Pull requests

Describe:

1. the user problem;
2. what changed;
3. how it was tested;
4. any privacy or safety tradeoff;
5. whether new copy was reviewed in both Spanish and English.

Keep changes focused and include a regression test when practical.
