# LEARNING.md — How to study with TARTARUS UPLINK

Built for **short, low-pressure sessions** while you learn real Windows help desk skills.

---

## 15-minute study loop

1. Run `npm run dev` (key in `.env` — never commit it).
2. Open http://127.0.0.1:3000
3. Pick a **Shift type** (start with **AD Basics**).
4. Click **CONNECT** — read the ticket in chat and the left queue.
5. Check **NOW DOING** for a nudge on what to try next.
6. Type a PowerShell/cmd style answer in the terminal (it is practice text, not your real PC).
7. Stuck? **HINT** or **STUCK** — no penalty, no timer.
8. When Dispatch closes the ticket, read **FIELD NOTES** — your flashcard for later.
9. Overwhelmed? **FOCUS** hides config noise; **REF** opens the cheat sheet.

---

## What you are actually learning

| Track | Real-world skills |
|-------|-------------------|
| AD Basics | `Get-ADUser`, lockouts, password reset, groups, GPO basics |
| Windows Client | `ipconfig`, DNS, services, connectivity |
| Printers | Spooler, queues (fiction, but cmdlet names matter) |
| Email & Identity | Outlook/M365-style narratives |
| Weird Shift | Gray-area stories — same troubleshooting discipline |

---

## ADHD / anxiety friendly design

- **No timers** and no game over.
- **Hints never punish** you.
- **Progress saves** locally (tickets closed, field notes).
- **CALM** toggles stat labels to softer words.
- **One ticket at a time** — finish or pause whenever.

---

## Export notes

Click **COPY** under Field Notes to get markdown for Obsidian, Notion, or Anki.

---

## When something breaks

| Problem | Fix |
|---------|-----|
| UPLINK OFFLINE banner | `npm run dev` from project folder |
| NO API KEY | `OPENROUTER_API_KEY` in `.env` |
| Empty field notes | AI must send `---DEBRIEF---` block when ticket resolves — try answering correctly |

---

## Off-app study

Use [Microsoft Learn — Active Directory PowerShell](https://learn.microsoft.com/en-us/powershell/module/activedirectory/) alongside this tool. Tartarus teaches *what to type*; Microsoft teaches *why it works*.
