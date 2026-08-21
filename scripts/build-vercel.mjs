import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist', 'vercel');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of ['index.html', 'vercel.json', 'assets', 'cinematicas', 'css', 'js']) {
    await cp(resolve(root, entry), resolve(output, entry), { recursive: true });
}

console.log('Versión para Vercel creada en dist/vercel/.');
