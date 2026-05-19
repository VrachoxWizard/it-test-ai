import { app, els } from './state.js';
import { appendTerminalLine } from './ui.js';
import { getHelpCommandsForTrack } from './curriculum.js';

const BUILTIN_CMDS = ['help', 'clear', 'history'];

const SUGGESTIONS_BASE = [
  'Get-ADUser -Identity ',
  'Unlock-ADAccount -Identity ',
  'Search-ADAccount -LockedOut',
  'ipconfig /all',
  'ipconfig /flushdns',
  'nslookup ',
  'Test-NetConnection ',
  'gpupdate /force',
  'Get-Service ',
  'Restart-Service Spooler',
];

export function runLocalCommand(cmd) {
  const lower = cmd.toLowerCase().trim();
  if (lower === 'help' || lower === '?') {
    showHelp();
    return true;
  }
  if (lower === 'clear') {
    els.terminalOutput.innerHTML = '';
    appendTerminalLine('[SYSTEM] Terminal cleared.', 'system');
    return true;
  }
  if (lower === 'history') {
    if (!app.terminalHistory.length) {
      appendTerminalLine('[SYSTEM] No commands this session.', 'system');
    } else {
      app.terminalHistory.forEach((h, i) =>
        appendTerminalLine(`  ${i + 1}  ${h}`, 'default')
      );
    }
    return true;
  }
  return false;
}

function showHelp() {
  appendTerminalLine('[SYSTEM] Local commands: help, clear, history', 'system');
  appendTerminalLine('[SYSTEM] UI: HINT and STUCK — no penalty, no timer.', 'system');
  const cmds = getHelpCommandsForTrack(app.currentTrackId);
  appendTerminalLine('[SYSTEM] Windows examples for this shift:', 'system');
  cmds.filter((c) => !BUILTIN_CMDS.includes(c.toLowerCase())).forEach((c) => {
    appendTerminalLine('  ' + c, 'default');
  });
}

export function pushHistory(cmd) {
  app.terminalHistory.push(cmd);
  if (app.terminalHistory.length > 50) app.terminalHistory.shift();
}

export function updateSuggestions(input) {
  const list = els.terminalSuggestions;
  list.innerHTML = '';
  if (!input || input.length < 2) {
    list.classList.remove('visible');
    return;
  }
  const pool = [...SUGGESTIONS_BASE, ...getHelpCommandsForTrack(app.currentTrackId)];
  const matches = pool.filter((s) => s.toLowerCase().startsWith(input.toLowerCase())).slice(0, 6);
  if (!matches.length) {
    list.classList.remove('visible');
    return;
  }
  matches.forEach((m, i) => {
    const li = document.createElement('li');
    li.textContent = m;
    li.dataset.value = m;
    if (i === 0) li.classList.add('active');
    li.addEventListener('mousedown', (e) => {
      e.preventDefault();
      els.terminalInput.value = m;
      list.classList.remove('visible');
    });
    list.appendChild(li);
  });
  list.classList.add('visible');
}

export function hideSuggestions() {
  els.terminalSuggestions.classList.remove('visible');
}

export function applySuggestion() {
  const active = els.terminalSuggestions.querySelector('li.active');
  if (active) {
    els.terminalInput.value = active.dataset.value;
    hideSuggestions();
    return true;
  }
  return false;
}
