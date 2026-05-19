# CONTRIBUTING.md

Thanks for extending **TARTARUS UPLINK**. This project is intentionally small — keep it that way unless you are deliberately growing scope.

---

## Setup

```bash
git clone https://github.com/VrachoxWizard/it-test-ai.git
cd it-test-ai
cp .env.example .env
# Set OPENROUTER_API_KEY in .env
npm run dev
```

Open **http://127.0.0.1:3000**. Or use `npx serve .` and paste your key manually.

---

## What to edit

| Change type | File |
|-------------|------|
| App behavior / UI | `index.html` |
| Agent behavior docs | `AGENTS.md` |
| Visual/tone rules | `VIBECODING.md` |
| Technical design | `ARCHITECTURE.md` |
| User-facing overview | `README.md` |

---

## Pull request guidelines

1. **One concern per PR** — e.g. terminal `clear` command, not `clear` + React migration.
2. **No secrets** — never commit API keys or `.env` with tokens.
3. **Test manually** — Connect, send terminal command, verify chat scroll + queue update.
4. **Preserve immersion** — see [VIBECODING.md](./VIBECODING.md).
5. **Agents** — if you change IDs, flows, or constraints, update [AGENTS.md](./AGENTS.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Changing Dispatch AI behavior

The system prompt in `index.html` defines Tartarus Dispatch personality and ticket flow. Changes affect gameplay — open an issue or PR description explaining **why** before editing.

---

## Reporting bugs

Include:

- Browser + OS
- Served via `file://` or `http://localhost`
- OpenRouter model used
- Console/network error (redact API key)

---

## Code review lens

Reviewers ask:

- Does it work without a build step?
- Does failure handling stay in-character?
- Is the diff minimal?
- Are docs updated?

---

## License

By contributing, you agree your changes are licensed under the same terms as the project (MIT).
