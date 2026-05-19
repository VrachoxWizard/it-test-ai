const STORAGE_KEY = 'tartarus_progress_v1';

const DEFAULT_PROGRESS = {
  ticketsClosed: 0,
  skillsSeen: [],
  fieldNotes: [],
  lastSession: null,
  currentTrack: 'ad_basics',
  currentLevel: 'ad_01',
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress) {
  progress.lastSession = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addFieldNote(progress, note) {
  const id = `${note.skill}-${Date.now()}`;
  const entry = { id, ...note, date: new Date().toISOString() };
  progress.fieldNotes.unshift(entry);
  const skillKey = note.skill.toLowerCase().replace(/\s+/g, '_');
  if (!progress.skillsSeen.includes(skillKey)) {
    progress.skillsSeen.push(skillKey);
  }
  saveProgress(progress);
  return entry;
}

export function incrementTicketsClosed(progress) {
  progress.ticketsClosed += 1;
  saveProgress(progress);
}
