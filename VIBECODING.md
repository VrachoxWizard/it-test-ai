# VIBECODING.md — Style & tone guide

**Vibecoding** here means: ship fast, stay in character, keep the apartment-terminal fantasy intact. Every change should feel like it was hacked together at 3 AM on a ThinkPad, not designed in Figma.

---

## North star

> Remote entry-level IT for a shady megacorp, from a messy apartment, on a CRT-soaked terminal.

If a feature sounds like **Slack**, **Notion**, or **Vercel Dashboard**, reject it.

---

## Visual language

### Do

- Pitch black `#050505`, phosphor green `#00ff41`
- Amber `#ffb000` for warnings, operator voice, “corporate” unease
- Harsh red `#ff003c` for errors and offline state
- Monospace everywhere: JetBrains Mono → Fira Code fallback
- `[ BRACKET LABELS ]` for section headers
- Thin green borders, inset glow, scanlines always on
- Brief glitch on **new ticket** — not on every keystroke
- `operator@tartarus:~$` prompt — never change hostname without lore reason

### Don’t

- Rounded bubbly UI, glassmorphism, gradient heroes
- Inter/Roboto, light mode, Material icons
- Purple/indigo “AI app” palette
- Card shadows that look like Bootstrap admin
- Animations longer than ~500ms (except stat bar transitions)

---

## Copy & lore

### Dispatch AI (right panel)

- Cynical, corporate, slightly evil Tartarus Global
- Tickets: realistic IT + ethically gray (`firewall bypass`, `basement crypto miner`)
- Concise — 1 ticket at a time, teach on wrong answers
- Never says “As an AI language model…”

### System messages (red / SYSTEM)

- Terse technical failures: `UPLINK SEVERED`, `AUTH FAILED`
- Frame errors as infrastructure, not app bugs

### Terminal (center)

- Fake boot: `systemctl`, `tartarus-uplink.service`, compliance ignored
- Echo user commands with full prompt before AI round-trip
- Local-only commands can be added (`clear`, `help`) — still in-universe

### Operator stats (left)

- Caffeine / Sanity / Uplink — joke metrics, not HR-approved
- Small random drift on ticket resolve — “alive” apartment energy

---

## Sound & motion (future-friendly)

| Effect | When | Style |
|--------|------|--------|
| Glitch | New ticket title | 400ms, skew + clip-path |
| LED pulse | Transmitting | Amber |
| Typing indicator | API wait | `DISPATCH AI TRANSMITTING...` |
| (future) keystroke click | Terminal input | Subtle, optional mute |

---

## Code style for vibe-preserving PRs

```javascript
// Good — in-character system line
appendTerminalLine('[SYSTEM] Uplink offline. Connect in right panel.', 'error');

// Bad — breaks immersion
appendTerminalLine('Error: Please connect to API', 'error');
```

```html
<!-- Good -->
<h2 class="text-xs text-[#ffb000] tracking-widest">[ TICKET QUEUE ]</h2>

<!-- Bad -->
<h2 class="text-lg font-semibold text-gray-700">Ticket Queue</h2>
```

---

## Feature ideas that fit the vibe

- `corpclock` command — fake after-hours overtime
- Ticket `#` counter in queue header
- Rare “compliance audit” system interrupt (amber flash)
- Static noise on disconnect
- `man tartarus` easter egg in terminal

## Feature ideas that break the vibe

- User avatars, emoji reactions, light theme toggle
- Gamification badges with cheerful copy
- Real SSH to user’s machine
- ChatGPT-style markdown rendering with code themes

---

## AI-assisted development prompts

Use these when vibecoding with an agent:

```
Add a `clear` terminal command that wipes #terminal-output but keeps boot aesthetic.
Follow VIBECODING.md. Single file. No frameworks.
```

```
Improve mobile layout for 3-column grid — stack panels, keep CRT overlay.
Do not change SYSTEM_PROMPT. See AGENTS.md.
```

```
Add keyboard shortcut Ctrl+L to clear terminal — cynical system confirmation line.
```

---

## Reference media

- *Mr. Robot* — terminal realism, paranoia
- *The Matrix* — green rain, system aesthetic
- Late-night r/sysadmin energy — plausible commands, dark humor

---

## Checklist before merge

- [ ] Still one `index.html` (unless user approved split)
- [ ] Colors match palette above
- [ ] No immersion-breaking error strings
- [ ] `SYSTEM_PROMPT` untouched
- [ ] Tested with `npx serve .` + OpenRouter key
