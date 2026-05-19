export function extractTicketTitle(text) {
  if (!text || typeof text !== 'string') return '';

  const patterns = [
    /TICKET(?:\s*#?\d*)?:\s*(.+)/i,
    /^##\s+(.+)$/m,
    /\*\*\s*(.+?)\s*\*\*/,
    /Subject:\s*(.+)/i,
    /Ticket:\s*(.+)/i,
    /Issue:\s*(.+)/i,
    /(?:^|\n)(?:Ticket\s*#?\d*[:\-]\s*)(.+)/i,
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) {
      const t = m[1].trim().replace(/\*\*/g, '').slice(0, 120);
      if (t.length > 2) return t;
    }
  }

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const cleaned = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
    if (cleaned.length > 3 && cleaned.length < 80 && !/^(hi|hello|hey|ok|yes|no)\b/i.test(cleaned)) {
      return cleaned;
    }
  }
  return '';
}

export function extractDebrief(text) {
  if (!text || typeof text !== 'string') return null;
  const m = text.match(/---DEBRIEF---\s*([\s\S]*?)\s*---END---/i);
  if (!m) return null;

  const block = m[1];
  const skill = (block.match(/Skill:\s*(.+)/i) || [])[1]?.trim();
  const command = (block.match(/Command:\s*(.+)/i) || [])[1]?.trim();
  const remember = (block.match(/Remember:\s*(.+)/i) || [])[1]?.trim();

  if (!skill && !command && !remember) return null;
  return {
    skill: skill || 'Windows ops',
    command: command || '',
    remember: remember || '',
  };
}

export function stripDebriefFromDisplay(text) {
  return text.replace(/---DEBRIEF---[\s\S]*?---END---/gi, '').trim();
}

export function extractNextStep(text) {
  if (!text) return '';
  const tryMatch = text.match(/(?:try|run|use|type)[:\s]+`?([^\n`]+)`?/i);
  if (tryMatch) return tryMatch[1].trim().slice(0, 100);

  const cmdlet = text.match(/((?:Get|Set|Test|Unlock|Reset|Enable|Disable|Add|Remove)-\w+[^\s]*)/);
  if (cmdlet) return `Consider: ${cmdlet[1]}`;

  if (/ipconfig|nslookup|gpupdate|dcdiag|ping\s/i.test(text)) {
    const cmd = text.match(/(ipconfig[^\s\n]*|nslookup[^\s\n]*|gpupdate[^\s\n]*|dcdiag[^\s\n]*|ping\s+[\d.]+)/i);
    if (cmd) return `Consider: ${cmd[1]}`;
  }

  return '';
}

export function isTicketResolved(text) {
  return /verdict:\s*correct/i.test(text) && /---DEBRIEF---/i.test(text);
}
