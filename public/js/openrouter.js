export async function callChat(messages, model) {
  const payload = { model, messages };

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Invalid response from uplink.');
  }

  if (!res.ok) {
    const msg =
      (data && data.error && (data.error.message || data.error)) || 'HTTP ' + res.status;
    const err = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    err.status = res.status;
    throw err;
  }

  const content =
    data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error('Empty transmission from Dispatch AI.');
  return content;
}

export function mapError(err) {
  const s = err.status;
  if (s === 401) return 'AUTH FAILED — Invalid OpenRouter API key in .env.';
  if (s === 402) return 'INSUFFICIENT CREDITS — Top up OpenRouter account.';
  if (s === 429) return 'RATE LIMITED — Uplink congested. Wait and retry.';
  if (s === 403) return 'FORBIDDEN — Key lacks model access.';
  if (s === 503) return 'NO API KEY — Set OPENROUTER_API_KEY in .env and restart npm run dev.';
  if (err.message && err.message.includes('Failed to fetch')) {
    return 'UPLINK SEVERED — Run npm run dev (server proxy required).';
  }
  return 'UPLINK ERROR — ' + (err.message || 'Unknown failure');
}

export async function fetchServerConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return { hasKey: false };
    return await res.json();
  } catch {
    return { hasKey: false };
  }
}
