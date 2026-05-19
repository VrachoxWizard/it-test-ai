# Project: TARTARUS UPLINK

> A grimy cyberpunk IT helpdesk simulator — one HTML file, zero build step, AI-powered tickets via OpenRouter.

You are a remote operator for **Tartarus Global**. Dispatch AI drops shady sysadmin tickets. You “fix” them by typing real-looking terminal commands in a fake shell. The AI judges your answers, teaches you when you’re wrong, and escalates the dystopia when you’re right.

![stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20Vanilla%20JS-00ff41?style=flat-square)
![build](https://img.shields.io/badge/build-none-050505?style=flat-square)
![ai](https://img.shields.io/badge/AI-OpenRouter-ffb000?style=flat-square)

---

## Quick start

1. **Get an API key** from [OpenRouter](https://openrouter.ai/keys).
2. **Set environment variable** (recommended for local dev):

   ```bash
   cp .env.example .env
   # Edit .env and set OPENROUTER_API_KEY=sk-or-v1-...
   npm run dev
   ```

   Opens **http://127.0.0.1:3000** — the key loads from `.env` into the uplink field automatically.

3. Or serve without `.env` and paste the key manually:

   ```bash
   npx serve .
   ```

4. Pick a model, click **CONNECT**, then troubleshoot in the center terminal (**Enter**).

---

## Features

| Panel | Role |
|-------|------|
| **Left** | Fake operator vitals (Caffeine, Sanity, Uplink) + active ticket queue |
| **Center** | Interactive terminal (`operator@tartarus:~$`) — history only, no real OS |
| **Right** | OpenRouter config + Dispatch AI chat log |

- CRT scanlines, phosphor glow, screen glitch on new tickets
- Conversation memory for multi-turn troubleshooting
- API key + model persisted in `localStorage`
- Models: `meta-llama/llama-3-8b-instruct:free` (default), `openai/gpt-4o-mini`

---

## Project structure

```
it-test-ai/
├── index.html      # Entire app (markup + CSS + JS)
├── server.mjs      # Dev server — loads .env, serves /api/config
├── .env.example    # Copy to .env (gitignored)
├── package.json    # npm run dev
├── README.md       # You are here
├── AGENTS.md       # Instructions for AI coding agents
├── ARCHITECTURE.md # Technical map for contributors
├── VIBECODING.md   # Aesthetic & tone guide for extensions
└── CONTRIBUTING.md # How to change things safely
```

There is **no** bundler or frontend framework — only a tiny `package.json` for `npm run dev` (local server + `.env`).

---

## Configuration

| Setting | Where | Notes |
|---------|--------|--------|
| OpenRouter API key | `.env` → `OPENROUTER_API_KEY` | Dev: `npm run dev` reads via `/api/config`; **never commit `.env`** |
| OpenRouter API key (saved) | `localStorage` → `tartarus_api_key` | Set when you click CONNECT |
| Model | `localStorage` → `tartarus_model` | Set on Connect + dropdown change |

### OpenRouter request shape

- **Endpoint:** `POST https://openrouter.ai/api/v1/chat/completions`
- **Headers:** `Authorization`, `Content-Type`, `HTTP-Referer: http://localhost`, `X-Title: Tartarus Uplink`
- **System prompt:** Immutable string in `index.html` — do not alter without product intent (see `AGENTS.md`).

---

## Development

- Edit **`index.html` only** unless you are explicitly splitting files (out of scope for v1).
- Test with a real OpenRouter key and both models.
- Use `npx serve .` — do not rely on double-clicking `index.html` for API calls.

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [VIBECODING.md](./VIBECODING.md) before large UI or lore changes.

---

## Docs for AI / vibecoding

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | Rules for Cursor, Copilot, Claude, etc. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | State, flows, DOM IDs, extension points |
| [VIBECODING.md](./VIBECODING.md) | Visual language, copy tone, “do / don’t” |

---

## License

MIT — use, fork, and corrupt helpdesks responsibly.

---

## Credits

Built as a single-file immersive web toy. Aesthetic: Mr. Robot × Matrix × midnight apartment sysadmin.
