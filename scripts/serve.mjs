import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const allowed = ['src', 'public'];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.mp4': 'video/mp4' };
const server = http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = path === '/' ? 'index.html' : path.slice(1);
    const target = resolve(root, relative);
    if (!target.startsWith(root) || (relative !== 'index.html' && !allowed.some(dir => target.startsWith(resolve(root, dir) + sep)))) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': `${types[extname(target)] ?? 'application/octet-stream'}${['.html', '.css', '.js', '.svg'].includes(extname(target)) ? '; charset=utf-8' : ''}`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.on('error', error => { console.error(`無法啟動：${error.message}`); process.exitCode = 1; });
server.listen(Number(process.env.PORT ?? 5173), '127.0.0.1', () => console.log(`紫禁語文弈：http://127.0.0.1:${server.address().port}`));
