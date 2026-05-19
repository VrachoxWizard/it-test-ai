let curriculumCache = null;

export async function loadCurriculum() {
  if (curriculumCache) return curriculumCache;
  const res = await fetch('/data/curriculum-windows.json');
  curriculumCache = await res.json();
  return curriculumCache;
}

export function getTrack(curriculum, trackId) {
  return curriculum.tracks.find((t) => t.id === trackId);
}

export function getLevel(track, levelId) {
  return track?.levels.find((l) => l.id === levelId);
}

export function buildTrackStartMessage(track, level) {
  return `Start track ${track.id} level ${level.id}. Topic: ${level.topic}. Seed scenario: ${level.seed}. Use skills: ${level.skills.join(', ')}. Give one ticket for this level.`;
}

export function getHelpCommandsForTrack(trackId) {
  const base = ['help', 'clear', 'history'];
  const byTrack = {
    ad_basics: [
      'Get-ADUser -Identity username',
      'Unlock-ADAccount -Identity username',
      'Get-ADUser -Filter * -Properties LockedOut',
      'Reset-ADAccountPassword -Identity user -Reset',
      'Search-ADAccount -LockedOut',
    ],
    win_client: [
      'ipconfig /all',
      'ipconfig /flushdns',
      'nslookup hostname',
      'Test-NetConnection hostname -Port 443',
      'Get-Service | Where-Object {$_.Status -eq "Stopped"}',
    ],
    printers: [
      'Get-Printer',
      'Restart-Service Spooler',
      'Get-PrintJob',
      'Clear-PrintQueue -Name "PrinterName"',
    ],
    m365_fiction: [
      'Get-Mailbox -Identity user@corp.com',
      'Test-MsolService',
      'Get-User -Identity user@corp.com',
    ],
    weird_shift: ['Get-Process | Sort CPU -Desc | Select -First 10'],
  };
  return [...base, ...(byTrack[trackId] || byTrack.ad_basics)];
}
