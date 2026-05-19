import { app, els, bindElements } from './state.js';
import { buildSystemMessages } from './prompts.js';
import { callChat, mapError, fetchServerConfig } from './openrouter.js';
import {
  appendChat,
  appendTerminalLine,
  setTyping,
  setBusy,
  setConnLed,
  updateQueue,
  renderStats,
  renderFieldNotes,
  applyCalmLabels,
  handleDispatchReply,
  setNowDoing,
  bootTerminal,
  setOfflineBanner,
  toggleFocusMode,
  openReference,
  closeReference,
  copyAllNotes,
} from './ui.js';
import { loadProgress, saveProgress } from './progress.js';
import { loadCurriculum, getTrack, getLevel, buildTrackStartMessage } from './curriculum.js';
import { extractTicketTitle } from './parsers.js';
import { driftStats } from './ui.js';
import { runLocalCommand, pushHistory, updateSuggestions, hideSuggestions, applySuggestion } from './terminal.js';

async function callWithHistory(userContent) {
  const messages = [...app.messages, { role: 'user', content: userContent }];
  const reply = await callChat(messages, app.model);
  app.messages.push({ role: 'user', content: userContent });
  app.messages.push({ role: 'assistant', content: reply });
  return reply;
}

export async function sendToAI(userContent, source, { showOperator = true } = {}) {
  if (app.busy) return;

  if (source === 'terminal' && showOperator) appendChat('operator', userContent);
  if (source === 'hint') appendChat('system', '[HINT requested — no penalty]');
  if (source === 'stuck') appendChat('system', '[STUCK — micro-step requested]');

  setBusy(true);
  setTyping(true);

  try {
    const reply = await callWithHistory(userContent);
    appendChat('dispatch', reply);
    handleDispatchReply(reply);
    setOfflineBanner(false);
  } catch (err) {
    const msg = mapError(err);
    appendChat('system', msg);
    appendTerminalLine('[SYSTEM] ' + msg, 'error');
    if (msg.includes('SEVERED') || msg.includes('NO API KEY')) setOfflineBanner(true);
  } finally {
    setTyping(false);
    setBusy(false);
    if (app.connected) els.terminalInput.focus();
  }
}

function getConnectMessage() {
  const track = getTrack(app.curriculum, app.currentTrackId);
  const level = getLevel(track, app.currentLevelId);
  if (track && level) {
    return buildTrackStartMessage(track, level);
  }
  return "Uplink established. I'm ready for my first ticket. Focus on Windows help desk / Active Directory.";
}

export async function handleConnect() {
  if (!app.serverHasKey) {
    appendChat('system', 'NO API KEY — Set OPENROUTER_API_KEY in .env and run npm run dev.');
    return;
  }

  app.model = els.modelSelect.value;
  localStorage.setItem('tartarus_model', app.model);

  app.connected = false;
  app.messages = buildSystemMessages();
  app.ticketTitle = '';
  els.queueTitle.textContent = 'AWAITING DISPATCH...';
  updateQueue('', false, { glitchOnNew: false });

  setBusy(true);
  setTyping(true);
  appendChat('system', 'Establishing encrypted uplink to Tartarus Global...');
  appendTerminalLine('[SYSTEM] Handshake initiated...', 'system');

  try {
    const reply = await callWithHistory(getConnectMessage());
    app.connected = true;
    els.terminalInput.disabled = false;

    appendChat('dispatch', reply);
    appendTerminalLine('[SYSTEM] Uplink established. Dispatch channel open.', 'system');

    const title = extractTicketTitle(reply);
    if (title) updateQueue(title, true, { glitchOnNew: true });
    else updateQueue('INCOMING TICKET — SEE DISPATCH', true, { glitchOnNew: true });

    setNowDoing('Read the ticket. Type a command or click HINT.');
    driftStats();
    renderStats();
    setConnLed('online');
  } catch (err) {
    app.messages = buildSystemMessages();
    const msg = mapError(err);
    appendChat('system', msg);
    appendTerminalLine('[SYSTEM] ' + msg, 'error');
    setConnLed('offline');
  } finally {
    setTyping(false);
    setBusy(false);
    if (app.connected) els.terminalInput.focus();
  }
}

function populateTrackSelect() {
  els.trackSelect.innerHTML = '';
  for (const t of app.curriculum.tracks) {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.title;
    if (t.id === app.currentTrackId) opt.selected = true;
    els.trackSelect.appendChild(opt);
  }
}

function syncTrackFromSelect() {
  app.currentTrackId = els.trackSelect.value;
  const track = getTrack(app.curriculum, app.currentTrackId);
  if (track?.levels[0]) app.currentLevelId = track.levels[0].id;
  if (app.progress) {
    app.progress.currentTrack = app.currentTrackId;
    app.progress.currentLevel = app.currentLevelId;
    saveProgress(app.progress);
  }
}

async function init() {
  bindElements();
  app.progress = loadProgress();
  app.currentTrackId = app.progress.currentTrack || 'ad_basics';
  app.currentLevelId = app.progress.currentLevel || 'ad_01';
  app.calmLabels = localStorage.getItem('tartarus_calm_labels') === '1';
  app.focusMode = localStorage.getItem('tartarus_focus') === '1';
  app.soundEnabled = localStorage.getItem('tartarus_sound') === '1';

  const config = await fetchServerConfig();
  app.serverHasKey = config.hasKey;
  if (els.uplinkKeyStatus) {
    els.uplinkKeyStatus.textContent = config.hasKey
      ? 'KEY: loaded from .env (server proxy)'
      : 'KEY: missing — set OPENROUTER_API_KEY in .env';
    els.uplinkKeyStatus.className = config.hasKey
      ? 'text-[10px] text-[#00ff41]/70'
      : 'text-[10px] text-[#ff003c]/80';
  }

  app.curriculum = await loadCurriculum();
  populateTrackSelect();

  const savedModel = localStorage.getItem('tartarus_model');
  if (savedModel) els.modelSelect.value = savedModel;
  app.model = els.modelSelect.value;

  applyCalmLabels();
  renderStats();
  renderFieldNotes();
  bootTerminal();
  setConnLed('offline');
  setNowDoing('');
  document.body.classList.toggle('focus-mode', app.focusMode);
  if (app.focusMode) els.btnFocus.textContent = 'FOCUS ON';

  els.btnConnect.addEventListener('click', handleConnect);
  els.btnHint.addEventListener('click', () => {
    if (!app.connected) return;
    sendToAI('Operator requests a hint without penalty.', 'hint', { showOperator: false });
  });
  els.btnStuck.addEventListener('click', () => {
    if (!app.connected) return;
    sendToAI('Operator is stuck. Give one micro-step and reassure.', 'stuck', { showOperator: false });
  });
  els.btnFocus.addEventListener('click', toggleFocusMode);
  els.btnReference.addEventListener('click', openReference);
  els.referenceOverlay.addEventListener('click', closeReference);
  els.btnCopyNotes.addEventListener('click', copyAllNotes);
  els.btnCalmLabels.addEventListener('click', () => {
    app.calmLabels = !app.calmLabels;
    localStorage.setItem('tartarus_calm_labels', app.calmLabels ? '1' : '0');
    applyCalmLabels();
  });

  els.trackSelect.addEventListener('change', syncTrackFromSelect);

  els.modelSelect.addEventListener('change', () => {
    app.model = els.modelSelect.value;
    localStorage.setItem('tartarus_model', app.model);
  });

  els.terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cmd = els.terminalInput.value.trim();
    if (!cmd) return;

    if (applySuggestion()) cmd = els.terminalInput.value.trim();
    els.terminalInput.value = '';
    hideSuggestions();

    appendTerminalLine('operator@tartarus:~$ ' + cmd, 'prompt');

    if (!app.connected) {
      appendTerminalLine('[SYSTEM] Uplink offline. Click CONNECT.', 'error');
      return;
    }

    if (runLocalCommand(cmd)) return;

    pushHistory(cmd);
    sendToAI(cmd, 'terminal');
  });

  els.terminalInput.addEventListener('input', () => {
    updateSuggestions(els.terminalInput.value);
  });

  els.terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideSuggestions();
    if (e.key === 'Tab') {
      e.preventDefault();
      applySuggestion();
    }
  });

  els.terminalInput.addEventListener('blur', () => {
    setTimeout(hideSuggestions, 150);
  });
}

init();
