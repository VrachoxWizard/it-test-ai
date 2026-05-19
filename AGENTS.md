# AGENTS.md — AI coding instructions for TARTARUS UPLINK

## Project identity (v3)

- **Stack:** `public/` static app, ES modules, Tailwind CDN, `server.mjs` proxy
- **Run:** `npm run dev` → http://127.0.0.1:3000
- **AI:** `POST /api/chat` (server holds `OPENROUTER_API_KEY`)
- **Focus:** Windows help desk / AD learning, chill UX (no timers)

## Hard constraints

1. **DISPATCH_CORE** in `public/js/prompts.js` — exact string, do not edit without user request
2. **DISPATCH_WINDOWS_CURRICULUM** — teaching layer; debrief block format required on ticket close
3. **No real shell** — terminal is simulated
4. **Never commit `.env`**
5. **Hints never penalize** — HINT/STUCK are first-class
6. Match module layout: `app.js`, `ui.js`, `openrouter.js`, `parsers.js`, `progress.js`, `curriculum.js`, `terminal.js`, `state.js`

## Key files

| File | Role |
|------|------|
| `public/js/app.js` | Init, connect, sendToAI |
| `public/js/openrouter.js` | `/api/chat`, `/api/config` |
| `public/js/parsers.js` | `extractDebrief`, `extractTicketTitle`, `isTicketResolved` |
| `public/js/progress.js` | `tartarus_progress_v1` |
| `public/data/curriculum-windows.json` | Tracks / levels |
| `server.mjs` | Static + proxy |

## Debrief contract

On ticket resolve, AI should emit:

```
---DEBRIEF---
Skill: ...
Command: ...
Remember: ...
---END---
```

Parsed in `ui.handleDispatchReply` → field notes panel.

## Testing

`npm test` — `tests/parsers.test.mjs`

## Related

[ARCHITECTURE.md](./ARCHITECTURE.md) · [VIBECODING.md](./VIBECODING.md) · [LEARNING.md](./LEARNING.md)
