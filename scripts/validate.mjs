import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname } from 'node:path';

const entrypoint = readFileSync('index.html', 'utf8');
const sourceFiles = [
    'index.html',
    'css/styles.css',
    ...readdirSync('js', { recursive: true, withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
        .map(entry => `${entry.parentPath.replaceAll('\\', '/')}/${entry.name}`)
];
const sourceText = sourceFiles.map(file => readFileSync(file, 'utf8')).join('\n');
const localReferences = [...entrypoint.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)]
    .map((match) => match[1])
    .filter((reference) => !/^(?:https?:|\/\/|data:)/.test(reference));
const localPaths = localReferences.map((reference) => reference.split(/[?#]/, 1)[0]);
const missingReferences = localPaths.filter((reference) => !existsSync(reference));
const supportedExtensions = ['.css', '.html', '.js', '.jpg', '.jpeg', '.png', '.svg', '.mp4', '.webm'];
const unsupportedAssets = localPaths.filter((reference) => !supportedExtensions.includes(extname(reference).toLowerCase()));
const runtimeAssets = [...new Set(
    [...sourceText.matchAll(/(?:assets|cinematicas)\/[\p{L}\p{N}_.\-/ ]+\.(?:png|jpe?g|svg|mp4|webm)/giu)]
        .map(match => match[0])
)];
const missingRuntimeAssets = runtimeAssets.filter(reference => !existsSync(reference));
const ids = [...entrypoint.matchAll(/\sid=["']([^"']+)["']/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
const referencedIds = [...new Set(
    [...sourceText.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map(match => match[1])
)];
const missingDomIds = referencedIds.filter(id => !ids.includes(id));
const configPosition = entrypoint.indexOf('src="js/config.js"');
const levelsPosition = entrypoint.indexOf('src="js/data/levels.js');
const effectsPosition = entrypoint.indexOf('src="js/render/effects.js"');
const backgroundsPosition = entrypoint.indexOf('src="js/render/backgrounds.js"');
const entitiesPosition = entrypoint.indexOf('src="js/render/entities.js"');
const hudPosition = entrypoint.indexOf('src="js/render/hud.js"');
const gamePosition = entrypoint.indexOf('src="js/game.js');

if (!/<meta\s+charset=["']UTF-8["']/i.test(entrypoint)) {
    console.error('index.html debe declarar UTF-8.');
    process.exitCode = 1;
}
if (missingReferences.length) {
    console.error(`Recursos faltantes:\n${missingReferences.join('\n')}`);
    process.exitCode = 1;
}
if (unsupportedAssets.length) {
    console.error(`Extensiones no contempladas:\n${unsupportedAssets.join('\n')}`);
    process.exitCode = 1;
}
if (missingRuntimeAssets.length) {
    console.error(`Recursos usados por el juego que faltan:\n${missingRuntimeAssets.join('\n')}`);
    process.exitCode = 1;
}
if (duplicateIds.length) {
    console.error(`IDs HTML duplicados:\n${duplicateIds.join('\n')}`);
    process.exitCode = 1;
}
if (missingDomIds.length) {
    console.error(`Elementos HTML requeridos por JavaScript que faltan:\n${missingDomIds.join('\n')}`);
    process.exitCode = 1;
}
if (configPosition < 0 || gamePosition < 0 || configPosition > gamePosition) {
    console.error('js/config.js debe cargarse antes de js/game.js.');
    process.exitCode = 1;
}
if (levelsPosition < 0 || gamePosition < 0 || levelsPosition > gamePosition) {
    console.error('js/data/levels.js debe cargarse antes de js/game.js.');
    process.exitCode = 1;
}
if (effectsPosition < 0 || gamePosition < 0 || effectsPosition > gamePosition) {
    console.error('js/render/effects.js debe cargarse antes de js/game.js.');
    process.exitCode = 1;
}
if (backgroundsPosition < 0 || gamePosition < 0 || backgroundsPosition > gamePosition) {
    console.error('js/render/backgrounds.js debe cargarse antes de js/game.js.');
    process.exitCode = 1;
}
if (entitiesPosition < 0 || gamePosition < 0 || entitiesPosition > gamePosition) {
    console.error('js/render/entities.js debe cargarse antes de js/game.js.');
    process.exitCode = 1;
}
if (hudPosition < 0 || gamePosition < 0 || hudPosition > gamePosition) {
    console.error('js/render/hud.js debe cargarse antes de js/game.js.');
    process.exitCode = 1;
}
if (!process.exitCode) {
    console.log(`Validación correcta: ${localReferences.length} enlaces y ${runtimeAssets.length} recursos del juego disponibles.`);
}
