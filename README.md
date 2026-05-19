# Project: TARTARUS UPLINK

> Cyberpunk Windows help desk learning simulator — practice AD, PowerShell, and L1 triage in a fake terminal with AI Dispatch. Built for **short, chill study sessions** (ADHD/anxiety friendly: no timers, hints without penalty).

You are a remote operator for **Tartarus Global**. Dispatch drops tickets; you type troubleshooting commands; the AI teaches you and saves **Field Notes** flashcards when you close a ticket.

![stack](https://img.shields.io/badge/stack-Vanilla%20ES%20modules-00ff41?style=flat-square)
![ai](https://img.shields.io/badge/AI-OpenRouter-ffb000?style=flat-square)

---

## Quick start

```bash
cp .env.example .env
# Edit .env — set OPENROUTER_API_KEY=sk-or-v1-...
npm run dev
```

Open **http://127.0.0.1:3000** → pick **Shift type** → **CONNECT** → troubleshoot in the terminal.

See [LEARNING.md](./LEARNING.md) for the 15-minute study loop.

---

## Features (v3)

| Area | What you get |
|------|----------------|
| **Learning** | Windows/AD-focused curriculum tracks, `---DEBRIEF---` flashcards, HINT / STUCK buttons |
| **Left panel** | Progress (tickets closed, skills), ticket queue, **NOW DOING**, field notes |
| **Center** | Terminal + local `help` / `clear` / `history` + autocomplete |
| **Right** | Model picker, Dispatch chat (API key stays on server) |
| **Header** | FOCUS mode, REF cheat sheet, CALM stat labels |

- API proxied via `POST /api/chat` — key never sent to the browser
- Progress in `localStorage` (`tartarus_progress_v1`)
- `npm test` — parser unit tests

---

## Project structure

```
it-test-ai/
├── public/
│   ├── index.html
│   ├── css/tartarus.css
│   ├── js/          # ES modules (app, ui, openrouter, prompts, …)
│   └── data/curriculum-windows.json
├── server.mjs       # Static host + OpenRouter proxy
├── tests/
├── LEARNING.md      # How to study with this app
├── .env.example
└── package.json
```

---

## Configuration

| Setting | Where |
|---------|--------|
| API key | `.env` → `OPENROUTER_API_KEY` (server only) |
| Model | UI dropdown → `localStorage` `tartarus_model` |
| Progress | `localStorage` `tartarus_progress_v1` |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server on port 3000 |
| `npm test` | Run parser tests |

---

## Docs

| File | Purpose |
|------|---------|
| [LEARNING.md](./LEARNING.md) | Study guide for you |
| [AGENTS.md](./AGENTS.md) | AI coding rules |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical map |
| [VIBECODING.md](./VIBECODING.md) | Visual / tone guide |

---

## License

MIT
