import { existsSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

const entrypoint = readFileSync('index.html', 'utf8');
const localReferences = [...entrypoint.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)]
    .map((match) => match[1])
    .filter((reference) => !/^(?:https?:|\/\/|data:)/.test(reference));
const missingReferences = localReferences.filter((reference) => !existsSync(reference));
const supportedExtensions = ['.css', '.html', '.js', '.jpg', '.jpeg', '.png', '.svg'];
const unsupportedAssets = localReferences.filter((reference) => !supportedExtensions.includes(extname(reference).toLowerCase()));
const configPosition = entrypoint.indexOf('src="js/config.js"');
const levelsPosition = entrypoint.indexOf('src="js/data/levels.js"');
const effectsPosition = entrypoint.indexOf('src="js/render/effects.js"');
const backgroundsPosition = entrypoint.indexOf('src="js/render/backgrounds.js"');
const entitiesPosition = entrypoint.indexOf('src="js/render/entities.js"');
const hudPosition = entrypoint.indexOf('src="js/render/hud.js"');
const gamePosition = entrypoint.indexOf('src="js/game.js"');

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
if (!process.exitCode) console.log(`Validación correcta: ${localReferences.length} recursos locales disponibles.`);
