import { app, els } from './state.js';
import { extractTicketTitle, extractDebrief, stripDebriefFromDisplay, extractNextStep, isTicketResolved } from './parsers.js';
import { addFieldNote, incrementTicketsClosed } from './progress.js';

export function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

export function setConnLed(state) {
  els.connStatus.classList.remove('online', 'busy');
  if (state === 'online') {
    els.connStatus.classList.add('online');
    els.connStatusLabel.textContent = 'ONLINE';
    els.connStatusLabel.className = 'text-[#00ff41]';
  } else if (state === 'busy') {
    els.connStatus.classList.add('busy');
    els.connStatusLabel.textContent = 'TRANSMIT';
    els.connStatusLabel.className = 'text-[#ffb000]';
  } else {
    els.connStatusLabel.textContent = 'OFFLINE';
    els.connStatusLabel.className = 'text-[#ff003c]/80';
  }
}

export function appendTerminalLine(text, variant = 'default') {
  const line = document.createElement('div');
  line.className = 'terminal-line text-sm';
  const colors = {
    default: 'text-[#00ff41]',
    system: 'text-[#ffb000]',
    error: 'text-[#ff003c]',
    prompt: 'text-[#00ff41]',
    ok: 'text-[#00ff41]',
  };
  line.classList.add(colors[variant] || colors.default);
  line.textContent = text;
  els.terminalOutput.appendChild(line);
  els.terminalOutput.scrollTop = els.terminalOutput.scrollHeight;
}

export function appendChat(role, text) {
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg';
  const labels = {
    dispatch: { tag: 'DISPATCH', color: 'text-[#00ff41]' },
    operator: { tag: 'OPERATOR', color: 'text-[#ffb000]' },
    system: { tag: 'SYSTEM', color: 'text-[#ff003c]' },
  };
  const meta = labels[role] || labels.system;
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const display = role === 'dispatch' ? stripDebriefFromDisplay(text) : text;
  wrap.innerHTML =
    `<span class="text-[10px] text-[#00ff41]/40">${time}</span> ` +
    `<span class="text-[10px] ${meta.color} font-bold">[${meta.tag}]</span><br/>` +
    `<span class="${meta.color}/90">${escapeHtml(display)}</span>`;
  els.chatLog.appendChild(wrap);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

export function setTyping(show) {
  els.typingIndicator.classList.toggle('hidden', !show);
  if (show) els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

export function setBusy(busy) {
  app.busy = busy;
  els.btnConnect.disabled = busy;
  els.terminalInput.disabled = busy || !app.connected;
  els.modelSelect.disabled = busy;
  els.trackSelect.disabled = busy;
  if (els.btnHint) els.btnHint.disabled = busy || !app.connected;
  if (els.btnStuck) els.btnStuck.disabled = busy || !app.connected;
  setConnLed(busy && app.connected ? 'busy' : app.connected ? 'online' : 'offline');
}

export function setNowDoing(text) {
  els.nowDoing.textContent =
    text || 'Type your first command in the workbench, or press HINT if you need a nudge.';
}

export function updateQueue(title, active, { glitchOnNew = true } = {}) {
  const prev = app.ticketTitle;
  if (title) {
    app.ticketTitle = title;
    els.queueTitle.textContent = title;
    els.queueStatus.textContent = 'ACTIVE';
    els.queueStatus.className =
      'text-[10px] px-2 py-0.5 border border-[#00ff41]/50 text-[#00ff41]';
    if (glitchOnNew && title !== prev) triggerGlitch();
  } else if (!active) {
    els.queueStatus.textContent = 'IDLE';
    els.queueStatus.className =
      'text-[10px] px-2 py-0.5 border border-[#ffb000]/50 text-[#ffb000]';
  }
}

export function celebrateTicketClose() {
  els.queueStatus.classList.add('pulse-win');
  setTimeout(() => els.queueStatus.classList.remove('pulse-win'), 600);
  appendTerminalLine('[OK] Ticket closed. +1 shift completed.', 'ok');
  if (app.soundEnabled) playTick();
}

export function triggerGlitch() {
  els.appRoot.classList.remove('glitch-active');
  void els.appRoot.offsetWidth;
  els.appRoot.classList.add('glitch-active');
  setTimeout(() => els.appRoot.classList.remove('glitch-active'), 400);
}

function playTick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.value = 0.03;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.05);
  } catch (_) {}
}

export function driftStats() {
  app.stats.caffeine = clamp(app.stats.caffeine + rand(-3, 5), 15, 99);
  app.stats.sanity = clamp(app.stats.sanity + rand(-4, 2), 5, 95);
  app.stats.uplink = clamp(app.stats.uplink + rand(-2, 3), 70, 100);
  renderStats();
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

export function renderStats() {
  els.statCaffeineVal.textContent = app.stats.caffeine + '%';
  els.statCaffeineBar.style.width = app.stats.caffeine + '%';
  els.statSanityVal.textContent = app.stats.sanity + '%';
  els.statSanityBar.style.width = app.stats.sanity + '%';
  const uplinkLabel =
    app.stats.uplink > 85 ? 'Stable' : app.stats.uplink > 60 ? 'Degraded' : 'Critical';
  els.statUplinkVal.textContent = uplinkLabel;
  els.statUplinkVal.className =
    app.stats.uplink > 85 ? 'text-[#00ff41]' : app.stats.uplink > 60 ? 'text-[#ffb000]' : 'text-[#ff003c]';
  els.statUplinkBar.style.width = app.stats.uplink + '%';
  els.statUplinkBar.className =
    'stat-bar-fill h-full ' +
    (app.stats.uplink > 85 ? 'bg-[#00ff41]' : app.stats.uplink > 60 ? 'bg-[#ffb000]' : 'bg-[#ff003c]');

  if (app.progress) {
    els.statTicketsVal.textContent = String(app.progress.ticketsClosed);
    els.statSkillsVal.textContent = String(app.progress.skillsSeen.length);
  }
}

export function applyCalmLabels() {
  if (app.calmLabels) {
    els.labelCaffeine.textContent = 'Energy';
    els.labelSanity.textContent = 'Headspace';
    els.labelUplink.textContent = 'Connection';
  } else {
    els.labelCaffeine.textContent = 'Caffeine';
    els.labelSanity.textContent = 'Sanity';
    els.labelUplink.textContent = 'Uplink';
  }
}

export function renderFieldNotes() {
  els.fieldNotesList.innerHTML = '';
  const notes = app.progress?.fieldNotes || [];
  if (!notes.length) {
    els.fieldNotesList.innerHTML =
      '<p class="text-[10px] text-[#00ff41]/40">Notes appear when you close a ticket.</p>';
    return;
  }
  for (const n of notes) {
    const card = document.createElement('div');
    card.className = 'field-note-card';
    card.innerHTML =
      `<div class="skill">${escapeHtml(n.skill)}</div>` +
      `<div class="cmd">${escapeHtml(n.command)}</div>` +
      `<div class="remember">${escapeHtml(n.remember)}</div>`;
    els.fieldNotesList.appendChild(card);
  }
}

export function handleDispatchReply(reply) {
  const debrief = extractDebrief(reply);
  if (debrief && app.progress) {
    addFieldNote(app.progress, debrief);
    renderFieldNotes();
    renderStats();
  }

  if (isTicketResolved(reply)) {
    incrementTicketsClosed(app.progress);
    celebrateTicketClose();
    driftStats();
    renderStats();
  }

  const title = extractTicketTitle(reply);
  if (title) updateQueue(title, true);

  const step = extractNextStep(reply);
  if (step) setNowDoing(step);
  else if (/verdict:\s*wrong/i.test(reply)) setNowDoing('Read Dispatch feedback, then try a different command.');
  else if (/verdict:\s*partial/i.test(reply)) setNowDoing('You are close — refine your approach.');
}

export function setOfflineBanner(visible) {
  els.offlineBanner.classList.toggle('visible', visible);
}

export function toggleFocusMode() {
  app.focusMode = !app.focusMode;
  document.body.classList.toggle('focus-mode', app.focusMode);
  els.btnFocus.textContent = app.focusMode ? 'FOCUS ON' : 'FOCUS';
  localStorage.setItem('tartarus_focus', app.focusMode ? '1' : '0');
}

export function openReference() {
  els.referenceDrawer.classList.add('open');
  els.referenceOverlay.classList.add('open');
}

export function closeReference() {
  els.referenceDrawer.classList.remove('open');
  els.referenceOverlay.classList.remove('open');
}

export async function copyAllNotes() {
  const notes = app.progress?.fieldNotes || [];
  if (!notes.length) return;
  const md = notes
    .map(
      (n) =>
        `## ${n.skill}\n\`\`\`\n${n.command}\n\`\`\`\n> ${n.remember}\n`
    )
    .join('\n');
  await navigator.clipboard.writeText(md);
  appendChat('system', 'Field notes copied to clipboard (markdown).');
}

export function bootTerminal() {
  const lines = [
    { t: 'Tartarus Uplink v3.0 — learning shift', v: 'system' },
    { t: '[ OK ] tartarus-uplink.service — active (running)', v: 'default' },
    { t: '[ OK ] Windows curriculum module loaded', v: 'default' },
    { t: 'Commands: help, clear, history | Buttons: HINT, STUCK (no penalty)', v: 'system' },
    { t: 'npm run dev required — API key stays on server (.env)', v: 'system' },
    { t: '────────────────────────────────────────', v: 'default' },
  ];
  lines.forEach((l) => appendTerminalLine(l.t, l.v));
}
