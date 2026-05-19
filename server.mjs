/**
 * Local dev server for TARTARUS UPLINK.
 * Reads OPENROUTER_API_KEY from .env and exposes it to the app via GET /api/config (localhost only).
 * The key is still used client-side for OpenRouter fetch — same as manual paste; .env avoids committing secrets.
 */
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname, normalize } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = '127.0.0.1';

function loadDotEnv() {
  const envPath = join(__dirname, '.env');
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

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${HOST}`);

  if (req.method === 'GET' && url.pathname === '/api/config') {
    const key = process.env.OPENROUTER_API_KEY || '';
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    });
    res.end(JSON.stringify({ openRouterApiKey: key }));
    return;
  }

  let rel = url.pathname === '/' ? '/index.html' : url.pathname;
  const safe = normalize(join(__dirname, rel));
  if (!safe.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  serveFile(res, safe);
});

server.listen(PORT, HOST, () => {
  const hasKey = Boolean(process.env.OPENROUTER_API_KEY);
  console.log(`TARTARUS UPLINK dev server → http://${HOST}:${PORT}`);
  console.log(hasKey ? 'OPENROUTER_API_KEY loaded from .env' : 'No .env key — copy .env.example to .env');
});
