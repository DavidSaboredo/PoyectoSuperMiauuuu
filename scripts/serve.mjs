import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const port = Number.parseInt(process.env.PORT || '8000', 10);
const host = process.env.HOST || '127.0.0.1';
const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
    const relativePath = normalize(pathname === '/' ? 'index.html' : pathname.replace(/^[/\\]+/, ''));
    const filePath = resolve(join(root, relativePath));
    const insideRoot = filePath === root || filePath.startsWith(`${root}\\`) || filePath.startsWith(`${root}/`);

    if (!insideRoot) {
        response.writeHead(403).end('Forbidden');
        return;
    }
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
        return;
    }

    response.writeHead(200, {
        'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
    });
    createReadStream(filePath).pipe(response);
}).listen(port, host, () => console.log(`Super Miau disponible en http://${host}:${port}`));
