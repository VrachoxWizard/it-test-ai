/**
 * TARTARUS UPLINK dev server — serves public/, proxies OpenRouter (key stays server-side).
 */
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname, normalize } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC = join(ROOT, 'public');
const PORT = Number(process.env.PORT) || 3000;
const HOST = '127.0.0.1';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function loadDotEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadDotEnv();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
  '.ico': 'image/x-icon',
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function serveFile(res, filePath) {
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }
  const ext = extname(filePath);
  const body = readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(body);
}

async function proxyChat(req, res) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { message: 'OPENROUTER_API_KEY not set in .env' } }));
    return;
  }

  let raw;
  try {
    raw = await readBody(req);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { message: 'Invalid body' } }));
    return;
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { message: 'JSON required' } }));
    return;
  }

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost',
        'X-Title': 'Tartarus Uplink',
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    res.writeHead(upstream.status, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    });
    res.end(text);
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { message: err.message || 'Upstream failed' } }));
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${HOST}`);

  if (req.method === 'GET' && url.pathname === '/api/config') {
    const hasKey = Boolean(process.env.OPENROUTER_API_KEY);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    });
    res.end(JSON.stringify({ hasKey }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/chat') {
    await proxyChat(req, res);
    return;
  }

  let rel = url.pathname === '/' ? '/index.html' : url.pathname;
  const safe = normalize(join(PUBLIC, rel));
  if (!safe.startsWith(PUBLIC)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  serveFile(res, safe);
});

server.listen(PORT, HOST, () => {
  const hasKey = Boolean(process.env.OPENROUTER_API_KEY);
  console.log(`TARTARUS UPLINK → http://${HOST}:${PORT}`);
  console.log(hasKey ? 'OPENROUTER_API_KEY loaded from .env (proxy active)' : 'No .env key — copy .env.example to .env');
});
