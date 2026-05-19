# Project: TARTARUS UPLINK

> A grimy cyberpunk IT helpdesk simulator — one HTML file, zero build step, AI-powered tickets via OpenRouter.

You are a remote operator for **Tartarus Global**. Dispatch AI drops shady sysadmin tickets. You “fix” them by typing real-looking terminal commands in a fake shell. The AI judges your answers, teaches you when you’re wrong, and escalates the dystopia when you’re right.

![stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20Vanilla%20JS-00ff41?style=flat-square)
![build](https://img.shields.io/badge/build-none-050505?style=flat-square)
![ai](https://img.shields.io/badge/AI-OpenRouter-ffb000?style=flat-square)

---

## Quick start

1. **Get an API key** from [OpenRouter](https://openrouter.ai/keys).
2. **Serve locally** (recommended — avoids `file://` fetch issues):

   ```bash
   npx serve .
   # or: python -m http.server 8080
   ```

3. Open the URL, paste your key in **Uplink Config**, pick a model, click **CONNECT**.
4. Read the ticket in the right panel / left queue, troubleshoot in the center terminal, hit **Enter**.

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
├── README.md       # You are here
├── AGENTS.md       # Instructions for AI coding agents
├── ARCHITECTURE.md # Technical map for contributors
├── VIBECODING.md   # Aesthetic & tone guide for extensions
└── CONTRIBUTING.md # How to change things safely
```

There is **no** bundler, framework, or `package.json` by design.

---

## Configuration

| Setting | Storage key | Notes |
|---------|-------------|--------|
| OpenRouter API key | `tartarus_api_key` | Browser only; never commit keys |
| Model | `tartarus_model` | Set on Connect + dropdown change |

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
