# AGENTS.md — AI coding instructions for TARTARUS UPLINK

This file is for **AI agents** (Cursor, Copilot, Claude Code, etc.) working in this repo. Humans should read [README.md](./README.md) first.

---

## Project identity

- **Name:** Project: TARTARUS UPLINK
- **Type:** Single-file static web app (`index.html` only)
- **Stack:** HTML5, embedded CSS, Vanilla JS, Tailwind CDN, Google Fonts (JetBrains Mono / Fira Code)
- **Backend:** None. All AI calls go **browser → OpenRouter** via `fetch`.
- **Vibe:** Grimy cyberpunk helpdesk. Never break immersion with modern SaaS UI or cheerful copy.

---

## Hard constraints (do not violate)

1. **No build step** — no Webpack, Vite, React, Vue, or npm scripts unless the user explicitly requests a migration.
2. **No frameworks** in the runtime app — Tailwind via CDN only.
3. **Single source of truth** — default deliverable is one `index.html`. Do not split into multiple files without explicit user request.
4. **`SYSTEM_PROMPT` is sacred** — the exact Dispatch AI system string in `index.html` must not be edited, shortened, or “improved” unless the user explicitly asks to change lore/behavior. You may reference it but not paraphrase it in code.
5. **No real shell execution** — terminal is display + capture only; commands go to OpenRouter as text.
6. **Never commit API keys** — use `.env` (gitignored) with `OPENROUTER_API_KEY`; `npm run dev` serves `/api/config`. On CONNECT, key may also be saved to `localStorage`.
7. **Minimize diff scope** — match existing patterns (`app` object, `els` map, `appendChat`, `callOpenRouter`).

---

## File map

| File | Agent may edit? |
|------|-----------------|
| `index.html` | Yes — primary surface |
| `README.md`, `AGENTS.md`, `*.md` docs | Yes — keep in sync with behavior |
| `.cursor/rules/*.mdc` | Yes — project rules |
| `server.mjs`, `package.json`, `.env.example` | Yes — local dev only |
| `src/` | No — unless user requests restructure |

---

## `index.html` anatomy

```
<head>
  Google Fonts, Tailwind CDN, <style> (CRT, glitch, panels, scrollbars)
<body class="crt-screen">
  #app-root
    header (title, conn LED)
    main 3-column grid
      left:  operator stats + #queue-active-title
      center: #terminal-output + #terminal-input form
      right:  #api-key, #model-select, #btn-connect, #chat-log, #typing-indicator
  <script>
    SYSTEM_PROMPT, app state, els, UI helpers, callOpenRouter, init
```

### Core state (`app`)

```javascript
{
  apiKey, model, connected, busy,
  messages: [{ role, content }, ...],  // includes system once
  ticketTitle,
  stats: { caffeine, sanity, uplink }
}
```

### Critical functions

| Function | Responsibility |
|----------|----------------|
| `callOpenRouter(userContent)` | POST to OpenRouter; append user+assistant to `app.messages` on success |
| `sendToAI(content, source)` | Chat UI, typing indicator, queue/title extract, errors |
| `handleConnect()` | Reset messages, first ticket prompt, enable terminal |
| `extractTicketTitle(text)` | Heuristic parse for left panel — do not require AI format changes |
| `appendChat(role, text)` | `dispatch` \| `operator` \| `system` |
| `appendTerminalLine(text, variant)` | `default` \| `system` \| `error` \| `prompt` |

### DOM IDs (stable contract)

Do not rename without updating docs and all references:

`app-root`, `terminal-output`, `terminal-input`, `terminal-form`, `api-key`, `model-select`, `btn-connect`, `chat-log`, `typing-indicator`, `queue-active-title`, `queue-status`, `conn-status`, `conn-status-label`, `stat-caffeine-val`, `stat-caffeine-bar`, `stat-sanity-val`, `stat-sanity-bar`, `stat-uplink-val`, `stat-uplink-bar`

---

## OpenRouter integration checklist

When touching API code, verify:

- URL: `https://openrouter.ai/api/v1/chat/completions`
- Headers include: `Authorization: Bearer ${app.apiKey}`, `Content-Type: application/json`, `HTTP-Referer: http://localhost`, `X-Title: Tartarus Uplink`
- Body: `{ model: app.model, messages: [...app.messages, { role: 'user', content }] }`
- Parse: `data.choices[0].message.content`
- Errors: map 401/402/403/429 and network failures to in-character SYSTEM messages; always clear `busy` in `finally`

---

## Safe extension patterns

**Good (in scope):**

- Sound effects, keyboard shortcuts, ticket counter, export chat
- More terminal easter eggs (`help`, `clear`, fake `ls`)
- Additional models in `#model-select`
- Stronger `extractTicketTitle` heuristics
- Accessibility (focus traps, ARIA on panels)
- Mobile layout tweaks in Tailwind classes

**Ask first:**

- Changing `SYSTEM_PROMPT` or Dispatch AI personality
- Splitting into multiple files or adding a backend proxy
- Replacing Tailwind CDN with build pipeline
- Real command execution or SSH

**Bad:**

- React/Vue rewrite “for maintainability”
- Generic admin dashboard aesthetic (white cards, purple gradients)
- Breaking single-file constraint silently

---

## Testing instructions for agents

After edits, mentally verify:

1. Page loads with CRT overlay and boot lines in terminal
2. Connect without key → SYSTEM error in chat
3. Connect with key → first ticket in chat; queue updates
4. Terminal Enter → operator line echoed; dispatch reply; auto-scroll
5. `busy` disables input during fetch; typing indicator toggles
6. Refresh restores key/model from `localStorage`
7. Serve via HTTP if CORS/`file://` issues reported

---

## Commit message tone

Use clear, conventional messages:

- `feat(terminal): add clear command`
- `fix(openrouter): handle 402 insufficient credits`
- `style(crt): soften scanline opacity`

---

## Related docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — flows and diagrams
- [VIBECODING.md](./VIBECODING.md) — colors, typography, copy style
- [CONTRIBUTING.md](./CONTRIBUTING.md) — human contributor checklist
