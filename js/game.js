const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ilustraciones PNG de Super Miau. Cada pose se dibuja sobre la misma
// caja de colision de 32x32, por lo que cambia la apariencia pero no la
// fisica del juego. En V4 no existe el gato anterior como respaldo:
// siempre se usan estas ocho imagenes.
const SUPER_MIAU_SPRITE_DATA = {
    quieto:      { src: 'assets/sprites/super-miau-quieto.png',      height: 88, anchorX: 0.70 },
    caminando:   { src: 'assets/sprites/super-miau-caminando.png',   height: 82, anchorX: 0.68 },
    volando:     { src: 'assets/sprites/super-miau-volando.png',     height: 82, anchorX: 0.67 },
    aterrizando: { src: 'assets/sprites/super-miau-aterrizando.png', height: 82, anchorX: 0.68 },
    maullando:   { src: 'assets/sprites/super-miau-maullando.png',   height: 70, anchorX: 0.30 },
    disparando:  { src: 'assets/sprites/super-miau-disparando.png',  height: 80, anchorX: 0.52 },
    golpeado:    { src: 'assets/sprites/super-miau-golpeado.png',    height: 82, anchorX: 0.57 },
    festejando:  { src: 'assets/sprites/super-miau-festejando.png',  height: 92, anchorX: 0.67 }
};
const SUPER_MIAU_SPRITES = {};
const SUPER_MIAU_TOTAL_SPRITES = Object.keys(SUPER_MIAU_SPRITE_DATA).length;
let superMiauLoadedSprites = 0;
let superMiauFailedSprites = 0;

function updateSuperMiauLoadStatus() {
    const status = document.getElementById('spriteLoadStatus');
    if (!status) return;

    if (superMiauFailedSprites > 0) {
        status.textContent = `V23 DETENIDA: ${superMiauFailedSprites} pose(s) sin cargar`;
        status.classList.add('error');
        return;
    }

    status.textContent = superMiauLoadedSprites === SUPER_MIAU_TOTAL_SPRITES
        ? `✓ V23 lista · mundos 1, 2 y 3 · ${SUPER_MIAU_TOTAL_SPRITES}/8 poses`
        : `Cargando poses ${superMiauLoadedSprites}/${SUPER_MIAU_TOTAL_SPRITES}…`;
    if (superMiauLoadedSprites === SUPER_MIAU_TOTAL_SPRITES) status.classList.add('ready');
}

Object.entries(SUPER_MIAU_SPRITE_DATA).forEach(([state, data]) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
        superMiauLoadedSprites++;
        updateSuperMiauLoadStatus();
    };
    image.onerror = () => {
        superMiauFailedSprites++;
        updateSuperMiauLoadStatus();
    };
    image.src = data.src;
    SUPER_MIAU_SPRITES[state] = image;
});
updateSuperMiauLoadStatus();

// -----------------------------------------------------------------
// CINEMÁTICA INICIAL: "LA NOCHE DEL PORTAL"
// -----------------------------------------------------------------
const cutsceneScreen = document.getElementById('cutsceneScreen');
const cutsceneCanvas = document.getElementById('cutsceneCanvas');
const cutsceneCtx = cutsceneCanvas.getContext('2d');
const ui = {
    startScreen: document.getElementById('startScreen'),
    shopScreen: document.getElementById('shopScreen'),
    gameOverlay: document.getElementById('gameOverlay'),
    creditsScreen: document.getElementById('creditsScreen'),
    creditsPanel: document.getElementById('creditsPanel'),
    creditsViewport: document.getElementById('creditsViewport'),
    creditsList: document.getElementById('creditsList'),
    creditsStoryline: document.getElementById('creditsStoryline'),
    creditsKicker: document.getElementById('creditsKicker'),
    creditsTitle: document.getElementById('creditsTitle'),
    creditsLead: document.getElementById('creditsLead'),
    creditsHint: document.getElementById('creditsHint'),
    creditsThanks: document.getElementById('creditsThanks'),
    cutsceneProgress: document.getElementById('cutsceneProgress'),
    cutsceneCaption: document.getElementById('cutsceneCaption'),
    cutsceneSpeaker: document.getElementById('cutsceneSpeaker'),
    cutsceneText: document.getElementById('cutsceneText'),
    oxygenBadge: document.getElementById('oxygenBadge'),
    oxygenBar: document.getElementById('oxygenBar'),
    timerBadge: document.getElementById('timerBadge'),
    levelTimerText: document.getElementById('levelTimerText'),
    powerBadge: document.getElementById('powerBadge'),
    powerIcon: document.getElementById('powerIcon'),
    powerText: document.getElementById('powerText'),
    powerTimerText: document.getElementById('powerTimerText'),
    headerCoins: document.getElementById('headerCoins'),
    headerLives: document.getElementById('headerLives'),
    headerLevel: document.getElementById('headerLevel'),
    headerLevelName: document.getElementById('headerLevelName'),
    btnShoot: document.getElementById('btnShoot'),
    btnDown: document.getElementById('btnDown'),
    btnJumpIcon: document.getElementById('btnJumpIcon'),
    btnJumpText: document.getElementById('btnJumpText'),
    btnFullscreenHeader: document.getElementById('btnFullscreenHeader'),
    btnHelpHeader: document.getElementById('btnHelpHeader'),
    btnFullscreenMobile: document.getElementById('btnFullscreenMobile'),
    mobileControls: document.getElementById('mobileControls'),
    pageFooter: document.getElementById('pageFooter'),
    startScreenWallet: document.getElementById('startScreenWallet'),
    developerPanel: document.getElementById('developerPanel'),
    devLevelSelect: document.getElementById('devLevelSelect'),
    devUseShopUpgrades: document.getElementById('devUseShopUpgrades'),
    shopWalletText: document.getElementById('shopWalletText'),
    ownedLives: document.getElementById('ownedLives'),
    ownedLightning: document.getElementById('ownedLightning'),
    ownedStrength: document.getElementById('ownedStrength'),
    ownedShield: document.getElementById('ownedShield'),
    btnBuyLightning: document.getElementById('btnBuyLightning'),
    btnBuyStrength: document.getElementById('btnBuyStrength'),
    btnBuyShield: document.getElementById('btnBuyShield'),
    overlayEmoji: document.getElementById('overlayEmoji'),
    overlayTitle: document.getElementById('overlayTitle'),
    overlayMessage: document.getElementById('overlayMessage'),
    overlayButton: document.getElementById('overlayButton'),
    overlayMenuButton: document.getElementById('overlayMenuButton'),
    debugHud: document.getElementById('debugHud'),
    debugFps: document.getElementById('debugFps'),
    debugFrame: document.getElementById('debugFrame'),
    debugQuality: document.getElementById('debugQuality'),
    debugParticles: document.getElementById('debugParticles'),
    debugEnemies: document.getElementById('debugEnemies'),
    debugEntities: document.getElementById('debugEntities'),
    debugUpdates: document.getElementById('debugUpdates'),
    debugLevel: document.getElementById('debugLevel')
};
const RENDER_PADDING = 120;
const PARTICLE_SOFT_LIMIT = 260;
const REDUCED_PARTICLE_SOFT_LIMIT = 180;
const MINIMAL_PARTICLE_SOFT_LIMIT = 120;
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowPowerDevice = (navigator.deviceMemory && navigator.deviceMemory <= 4)
    || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
let runtimeQuality = prefersReducedMotion ? 'reduced' : (lowPowerDevice ? 'balanced' : 'high');
let smoothedFrameMs = 16.67;
let lowPerformanceFrames = 0;
let stablePerformanceFrames = 0;
let suspendedByVisibility = false;
let debugHudVisible = false;
let developerPanelVisible = false;
let lastUpdatesThisFrame = 0;
let debugHudRefreshCountdown = 0;

function getParticleSoftLimit() {
    if (runtimeQuality === 'reduced') return MINIMAL_PARTICLE_SOFT_LIMIT;
    if (runtimeQuality === 'balanced') return REDUCED_PARTICLE_SOFT_LIMIT;
    return PARTICLE_SOFT_LIMIT;
}

function getAmbientSpawnMultiplier() {
    if (runtimeQuality === 'reduced') return 3;
    if (runtimeQuality === 'balanced') return 2;
    return 1;
}

function shouldRunAmbientEffect(baseModulo) {
    return gameTick % (baseModulo * getAmbientSpawnMultiplier()) === 0;
}

function getShakeScale() {
    if (runtimeQuality === 'reduced') return 0.45;
    if (runtimeQuality === 'balanced') return 0.72;
    return 1;
}

function useMediumVisualEffects() {
    return runtimeQuality !== 'reduced';
}

function useHeavyVisualEffects() {
    return runtimeQuality === 'high';
}

function getShadowBlurValue(high, medium = Math.max(2, Math.round(high * 0.5)), low = 0) {
    if (runtimeQuality === 'high') return high;
    if (runtimeQuality === 'balanced') return medium;
    return low;
}

function getDecorationCount(high, medium, low) {
    if (runtimeQuality === 'high') return high;
    if (runtimeQuality === 'balanced') return medium;
    return low;
}

function updateRuntimeQuality(frameDelta) {
    if (!Number.isFinite(frameDelta) || frameDelta <= 0) return;
    smoothedFrameMs = smoothedFrameMs * 0.92 + frameDelta * 0.08;

    if (smoothedFrameMs > 22) {
        lowPerformanceFrames++;
        stablePerformanceFrames = 0;
    } else if (smoothedFrameMs < 16.9) {
        stablePerformanceFrames++;
        lowPerformanceFrames = Math.max(0, lowPerformanceFrames - 2);
    } else {
        lowPerformanceFrames = Math.max(0, lowPerformanceFrames - 1);
        stablePerformanceFrames = Math.max(0, stablePerformanceFrames - 1);
    }

    if (runtimeQuality === 'high' && lowPerformanceFrames > 90) {
        runtimeQuality = 'balanced';
        lowPerformanceFrames = 0;
        stablePerformanceFrames = 0;
    } else if (runtimeQuality === 'balanced' && lowPerformanceFrames > 150) {
        runtimeQuality = 'reduced';
        lowPerformanceFrames = 0;
        stablePerformanceFrames = 0;
    } else if (runtimeQuality === 'balanced' && stablePerformanceFrames > 240 && !lowPowerDevice && !prefersReducedMotion) {
        runtimeQuality = 'high';
        lowPerformanceFrames = 0;
        stablePerformanceFrames = 0;
    } else if (runtimeQuality === 'reduced' && stablePerformanceFrames > 300 && !prefersReducedMotion) {
        runtimeQuality = lowPowerDevice ? 'balanced' : 'high';
        lowPerformanceFrames = 0;
        stablePerformanceFrames = 0;
    }
}

function toggleDeveloperPanel(forceVisible) {
    developerPanelVisible = typeof forceVisible === 'boolean' ? forceVisible : !developerPanelVisible;
    if (developerPanelVisible) {
        ui.developerPanel.classList.remove('hidden');
    } else {
        ui.developerPanel.classList.add('hidden');
    }
}

// Comprueba si un objeto del mundo esta cerca de la camara para evitar trabajo de dibujo innecesario.
function isOnScreen(worldX, width, padding = RENDER_PADDING) {
    return worldX + width >= cameraX - padding && worldX <= cameraX + canvas.width + padding;
}

// Calcula visibilidad usando coordenadas ya convertidas a pantalla.
function isScreenPosition(drawX, width, padding = RENDER_PADDING) {
    return drawX + width >= -padding && drawX <= canvas.width + padding;
}

// Estima el ancho visual de cada decoracion para poder descartarla si esta fuera de escena.
function getDecorationApproxWidth(deco) {
    switch (deco.type) {
        case 'star': return deco.size || 4;
        case 'nebula': return (deco.width || 40) * 2;
        case 'planet': return (deco.radius || 24) * 2;
        case 'tree': return (deco.radius || 30) * 2 + 16;
        case 'volcano': return deco.size || 120;
        case 'castle_tower': return deco.width || 90;
        case 'lightray':
        case 'lightray_purple':
        case 'lightray_red':
            return (deco.width || 90) + 380;
        case 'spooky_tree': return 70;
        case 'city_skyline': return 1700;
        case 'cardboard_home': return 82;
        case 'park_lamp': return 32;
        case 'park_bench': return 74;
        case 'playground_sign':
        case 'park_exit_sign':
        case 'avenue_sign':
        case 'safe_gate': return 150;
        case 'street_light': return 70;
        case 'storm_tree': return 120;
        case 'giant_mushroom': return (deco.size || 30) * 2;
        case 'root_arch':
        case 'sunken_arch':
            return 150;
        case 'giant_leaf': return (deco.size || 40) * 2;
        case 'ant_hill': return 150;
        case 'basalt_spire': return deco.size || 80;
        case 'paw_totem': return 36;
        case 'coral_garden': return 80;
        case 'kelp': return 44;
        case 'torn_banner': return 48;
        case 'hanging_chain': return 24;
        case 'world_shard': return 70;
        case 'dimensional_rift': return 120;
        default: return 90;
    }
}

const CUTSCENE_DURATION = 23800;
const CUTSCENE_SCENES = [
    {
        start: 0, end: 3400, speaker: 'NARRADOR', cue: 'family',
        text: 'En el Parque Sureño, Miau vivía con mamá, papá y su hermanita en una pequeña caja de cartón.'
    },
    {
        start: 3400, end: 6800, speaker: 'NARRADOR', cue: 'thunder',
        text: 'Una noche, la tormenta cubrió la ciudad. Un rayo cayó sobre el viejo árbol...'
    },
    {
        start: 6800, end: 10100, speaker: 'NARRADOR', cue: 'portal',
        text: 'El impacto abrió un portal azul y violeta. De otra dimensión apareció Firulais.'
    },
    {
        start: 10100, end: 13700, speaker: 'NARRADOR', cue: 'villain',
        text: 'El bulldog atrapó a la pequeña gatita y comenzó a llevársela hacia el portal.'
    },
    {
        start: 13700, end: 17400, speaker: 'NARRADOR', cue: 'pull',
        text: 'Mamá y papá intentaron rescatarla, pero Firulais también los arrastró a su dimensión.'
    },
    {
        start: 17400, end: 21300, speaker: 'MIAU', cue: 'hero',
        text: '¡No los abandonaré! ¡Voy a salvarlos!'
    },
    {
        start: 21300, end: CUTSCENE_DURATION, speaker: 'TU MISIÓN', cue: 'mission',
        text: 'Seguí las huellas de luz, cruzá las siete dimensiones y rescatá a la familia gatuna.'
    }
];
let cutsceneActive = false;
let cutsceneStartTime = null;
let cutsceneAnimationFrameId = null;
let cutsceneSceneIndex = -1;

// Limita un valor a un rango para que las animaciones no se salgan de sus extremos.
function cutsceneClamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

// Suaviza transiciones entre dos puntos de la cinematica.
function cutsceneSmooth(start, end, value) {
    const t = cutsceneClamp((value - start) / (end - start));
    return t * t * (3 - 2 * t);
}

// Mezcla dos numeros para mover elementos de la historia de forma gradual.
function cutsceneMix(start, end, amount) {
    return start + (end - start) * amount;
}

// Lanza peque?os sonidos narrativos que acompa?an los cambios de escena de la cinematica.
function playCinematicCue(type) {
    if (!ensureAudioContext()) return;
    try {
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        const now = audioCtx.currentTime;

        function tone(frequency, endFrequency, duration, volume, wave = 'sine', delay = 0) {
            const oscillator = audioCtx.createOscillator();
            const cueGain = audioCtx.createGain();
            const begins = now + delay;
            oscillator.type = wave;
            oscillator.frequency.setValueAtTime(frequency, begins);
            oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), begins + duration);
            cueGain.gain.setValueAtTime(0.0001, begins);
            cueGain.gain.exponentialRampToValueAtTime(volume, begins + 0.025);
            cueGain.gain.exponentialRampToValueAtTime(0.0001, begins + duration);
            oscillator.connect(cueGain);
            cueGain.connect(audioCtx.destination);
            oscillator.start(begins);
            oscillator.stop(begins + duration + 0.03);
        }

        if (type === 'family') {
            tone(330, 440, 0.32, 0.055, 'sine', 0);
            tone(440, 523, 0.34, 0.05, 'sine', 0.24);
        } else if (type === 'thunder') {
            tone(95, 32, 0.95, 0.16, 'sawtooth', 1.65);
            tone(58, 28, 1.25, 0.09, 'triangle', 1.78);
        } else if (type === 'portal') {
            [196, 293.66, 440, 659.25].forEach((frequency, index) => {
                tone(frequency, frequency * 1.45, 0.75, 0.045, 'sine', index * 0.1);
            });
        } else if (type === 'villain') {
            tone(115, 72, 0.5, 0.11, 'square', 0);
            tone(88, 55, 0.55, 0.08, 'sawtooth', 0.2);
        } else if (type === 'pull') {
            tone(360, 135, 0.9, 0.07, 'triangle', 0);
        } else if (type === 'hero') {
            [392, 523.25, 659.25].forEach((frequency, index) => {
                tone(frequency, frequency, 0.3, 0.055, 'sine', index * 0.16);
            });
        } else if (type === 'mission') {
            [261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
                tone(frequency, frequency * 1.03, 0.38, 0.05, 'triangle', index * 0.12);
            });
        }
    } catch (error) {
        console.warn('No se pudo reproducir un sonido de la cinemática.', error);
    }
}

// Muestra u oculta la pantalla de cinematica sin depender de estilos externos.
function setCutsceneVisible(visible) {
    cutsceneScreen.classList.toggle('cutscene-active', visible);
    cutsceneScreen.classList.toggle('hidden', !visible);
    cutsceneScreen.setAttribute('aria-hidden', visible ? 'false' : 'true');
    syncShellChrome();
}

function resetInputState() {
    keys = {};
    player.jumpHeld = false;
    player.jumpHoldFrames = 0;
    player.isMoving = false;
}

// Oculta elementos de la carcasa externa cuando una pantalla completa
// (menu, pausa, cinematica o creditos) toma el foco visual del juego.
function syncShellChrome() {
    const blockingScreenVisible =
        !ui.startScreen.classList.contains('hidden') ||
        !ui.shopScreen.classList.contains('hidden') ||
        !ui.gameOverlay.classList.contains('hidden') ||
        !ui.creditsScreen.classList.contains('hidden') ||
        cutsceneActive;

    if (ui.mobileControls) {
        ui.mobileControls.classList.toggle('hidden', blockingScreenVisible);
    }
    if (ui.pageFooter) {
        ui.pageFooter.classList.toggle('hidden', blockingScreenVisible);
    }

    const playingVisible = gameActive && !blockingScreenVisible;
    document.body.classList.toggle('game-active', playingVisible);
}

function supportsFullscreen() {
    const docEl = document.documentElement;
    const hasRequest = !!(
        docEl &&
        (typeof docEl.requestFullscreen === 'function' || typeof docEl.webkitRequestFullscreen === 'function')
    );
    const enabled = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
    return hasRequest && enabled;
}

function isIOSBrowser() {
    const ua = navigator.userAgent || '';
    const isAppleDevice = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return isAppleDevice;
}

function isStandaloneDisplayMode() {
    return !!(
        window.navigator.standalone ||
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
    );
}

function isFullscreenActive() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function updateFullscreenButtons() {
    const buttons = [ui.btnFullscreenHeader, ui.btnFullscreenMobile].filter(Boolean);
    const supported = supportsFullscreen();
    const isIOS = isIOSBrowser();
    buttons.forEach(button => {
        button.classList.toggle('hidden', !supported && !isIOS);
        if (!supported && !isIOS) return;
        const wantsExit = isFullscreenActive();
        if (!supported && isIOS) {
            if (button === ui.btnFullscreenHeader) {
                button.innerHTML = '📲 <span class="hidden sm:inline ml-1">Pantalla</span>';
            } else {
                button.textContent = '📲 Pantalla Completa (iOS)';
            }
            return;
        }

        if (button === ui.btnFullscreenHeader) {
            button.innerHTML = wantsExit
                ? '🡼 <span class="hidden sm:inline ml-1">Salir</span>'
                : '⛶ <span class="hidden sm:inline ml-1">Pantalla</span>';
            return;
        }

        button.textContent = wantsExit ? '🡼 Salir de Pantalla Completa' : '⛶ Pantalla Completa';
    });
}

async function lockLandscape() {
    try {
        if (!screen.orientation || typeof screen.orientation.lock !== 'function') return false;
        await screen.orientation.lock('landscape');
        return true;
    } catch (error) {
        return false;
    }
}

async function unlockOrientation() {
    try {
        if (!screen.orientation || typeof screen.orientation.unlock !== 'function') return;
        screen.orientation.unlock();
    } catch (error) {}
}

function showIOSFullscreenHelp() {
    const lines = [
        'En Safari iOS no existe pantalla completa real para juegos web.',
        'La forma correcta es instalar el juego como App:',
        '',
        '1) Tocá Compartir (⬆️)',
        '2) Elegí "Agregar a pantalla de inicio"',
        '3) Abrí Super Miau desde el ícono',
        '',
        'Después girá el teléfono para jugar en horizontal.'
    ];

    showOverlay('📲', 'Pantalla completa en iOS', lines.join('\n'), 'Entendido ▶️', () => {
        isPaused = false;
        ui.gameOverlay.classList.add('hidden');
        syncShellChrome();
        lastTime = performance.now();
        physicsAccumulator = 0;
    }, true);
}

async function toggleFullscreen() {
    if (!supportsFullscreen()) {
        if (isIOSBrowser()) {
            playSound('click');
            showIOSFullscreenHelp();
        }
        return;
    }
    playSound('click');
    try {
        if (isFullscreenActive()) {
            await unlockOrientation();
            if (document.exitFullscreen) await document.exitFullscreen();
            else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
        } else {
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) await docEl.requestFullscreen();
            else if (docEl.webkitRequestFullscreen) await docEl.webkitRequestFullscreen();
            await lockLandscape();
        }
    } catch (error) {
        console.warn('No se pudo cambiar a pantalla completa.', error);
    }
    updateFullscreenButtons();
}

function showHelpOverlay() {
    const isWater = currentLevel === 5;
    const isIOS = isIOSBrowser();
    const lines = [
        'Moverse: ⬅️➡️ o A/D',
        'Saltar: ⬆️ o W o Espacio',
        'Maullido Estelar: F o Shift (cuando tengas ⭐)',
        isWater ? 'Bajar en agua: ⬇️ o S' : 'Pausa: P o Escape',
        isIOS ? 'iOS: pantalla completa es "Agregar a pantalla de inicio"' : 'Pantalla completa: botón ⛶'
    ].filter(Boolean);
    showOverlay('❔', 'Ayuda', lines.join('\n'), 'Volver ▶️', () => {
        isPaused = false;
        ui.gameOverlay.classList.add('hidden');
        syncShellChrome();
        lastTime = performance.now();
        physicsAccumulator = 0;
    }, true);
}

// Cambia el texto narrativo visible para que coincida con la escena que se esta reproduciendo.
function updateCutsceneCaption(sceneIndex) {
    if (sceneIndex === cutsceneSceneIndex) return;
    cutsceneSceneIndex = sceneIndex;
    const scene = CUTSCENE_SCENES[sceneIndex];
    ui.cutsceneSpeaker.textContent = scene.speaker;
    ui.cutsceneSpeaker.className = scene.speaker === 'MIAU'
        ? 'text-[9px] md:text-[11px] font-extrabold tracking-[0.2em] text-orange-300 mb-1'
        : scene.speaker === 'TU MISIÓN'
            ? 'text-[9px] md:text-[11px] font-extrabold tracking-[0.2em] text-cyan-300 mb-1'
            : 'text-[9px] md:text-[11px] font-extrabold tracking-[0.2em] text-yellow-300 mb-1';
    ui.cutsceneText.textContent = scene.text;
    ui.cutsceneCaption.classList.remove('is-changing');
    void ui.cutsceneCaption.offsetWidth;
    ui.cutsceneCaption.classList.add('is-changing');
    playCinematicCue(scene.cue);
}

// Dibuja a Miau y su familia durante la cinematica usando formas simples en canvas.
function drawCinematicCat(target, x, groundY, scale, color, detail, facing = 1, emotion = 'calm', cape = false) {
    target.save();
    target.translate(x, groundY);
    target.scale(facing * scale, scale);

    target.fillStyle = 'rgba(2,6,23,.38)';
    target.beginPath();
    target.ellipse(0, 1, 21, 5, 0, 0, Math.PI * 2);
    target.fill();

    if (cape) {
        const capeWave = prefersReducedMotion ? 0 : Math.sin(performance.now() * .008 + x * .02) * 4;
        const capeGradient = target.createLinearGradient(-8, -43, -38, -5);
        capeGradient.addColorStop(0, '#fb7185');
        capeGradient.addColorStop(.45, '#ef4444');
        capeGradient.addColorStop(1, '#991b1b');
        target.fillStyle = capeGradient;
        target.strokeStyle = '#7f1d1d';
        target.lineWidth = 2;
        target.beginPath();
        target.moveTo(-10, -42);
        target.bezierCurveTo(-30, -42 + capeWave, -42, -24 + capeWave, -34, -5 + capeWave * .35);
        target.quadraticCurveTo(-18, -12, -6, -17);
        target.closePath();
        target.fill();
        target.stroke();
    }

    target.strokeStyle = color;
    target.lineWidth = 7;
    target.lineCap = 'round';
    target.beginPath();
    target.moveTo(-17, -24);
    target.quadraticCurveTo(-34, -38, -28, -53);
    target.stroke();

    const bodyGradient = target.createRadialGradient(7, -26, 3, 0, -23, 28);
    bodyGradient.addColorStop(0, '#ffffff');
    bodyGradient.addColorStop(0.18, color);
    bodyGradient.addColorStop(1, color);
    target.fillStyle = bodyGradient;
    target.beginPath();
    target.ellipse(0, -22, 23, 18, 0, 0, Math.PI * 2);
    target.fill();
    target.strokeStyle = 'rgba(89,39,14,.55)';
    target.lineWidth = 2;
    target.stroke();

    target.fillStyle = 'rgba(255,247,237,.72)';
    target.beginPath();
    target.ellipse(7, -19, 11, 10, -.18, 0, Math.PI * 2);
    target.fill();

    target.fillStyle = color;
    target.beginPath();
    target.arc(13, -45, 18, 0, Math.PI * 2);
    target.fill();
    target.beginPath();
    target.moveTo(1, -54); target.lineTo(5, -70); target.lineTo(13, -57); target.closePath();
    target.moveTo(15, -58); target.lineTo(25, -70); target.lineTo(29, -52); target.closePath();
    target.fill();

    target.fillStyle = '#fda4af';
    target.beginPath();
    target.moveTo(5, -58); target.lineTo(6, -66); target.lineTo(11, -58); target.closePath();
    target.moveTo(19, -59); target.lineTo(24, -66); target.lineTo(26, -56); target.closePath();
    target.fill();

    if (cape) {
        target.fillStyle = '#7f1d1d';
        target.beginPath(); target.ellipse(-2, -38, 12, 4, -.15, 0, Math.PI * 2); target.fill();
        target.shadowColor = '#fde047'; target.shadowBlur = 6;
        target.fillStyle = '#fde047';
        target.beginPath(); target.arc(5, -39, 3, 0, Math.PI * 2); target.fill();
        target.shadowBlur = 0;
    }

    target.strokeStyle = color;
    target.lineWidth = 6;
    target.beginPath();
    target.moveTo(-12, -10); target.lineTo(-13, -1);
    target.moveTo(8, -9); target.lineTo(9, -1);
    target.stroke();

    const eyeY = emotion === 'afraid' ? -47 : -46;
    target.fillStyle = emotion === 'afraid' ? '#ffffff' : '#1e1b4b';
    target.beginPath();
    target.ellipse(8, eyeY, emotion === 'afraid' ? 4.2 : 3.2, emotion === 'afraid' ? 5.2 : 3.8, 0, 0, Math.PI * 2);
    target.ellipse(19, eyeY, emotion === 'afraid' ? 4.2 : 3.2, emotion === 'afraid' ? 5.2 : 3.8, 0, 0, Math.PI * 2);
    target.fill();
    if (emotion === 'afraid') {
        target.fillStyle = '#1e1b4b';
        target.beginPath();
        target.arc(8.5, eyeY + 1, 2.1, 0, Math.PI * 2);
        target.arc(19.5, eyeY + 1, 2.1, 0, Math.PI * 2);
        target.fill();
    }

    target.fillStyle = '#f43f5e';
    target.beginPath();
    target.moveTo(13.5, -41); target.lineTo(11, -38); target.lineTo(16, -38); target.closePath();
    target.fill();

    target.fillStyle = 'rgba(255,247,237,.85)';
    target.beginPath();
    target.ellipse(10.5, -36.5, 5.5, 3.7, 0, 0, Math.PI * 2);
    target.ellipse(16.5, -36.5, 5.5, 3.7, 0, 0, Math.PI * 2);
    target.fill();
    target.fillStyle = '#f43f5e';
    target.beginPath();
    target.moveTo(13.5, -41); target.lineTo(11, -38); target.lineTo(16, -38); target.closePath();
    target.fill();

    if (detail === 'bow') {
        target.fillStyle = '#f43f5e';
        target.beginPath();
        target.ellipse(5, -61, 6, 4, -0.4, 0, Math.PI * 2);
        target.ellipse(13, -64, 6, 4, 0.4, 0, Math.PI * 2);
        target.arc(9, -62, 2.8, 0, Math.PI * 2);
        target.fill();
    } else if (detail === 'moustache') {
        target.strokeStyle = '#0f172a';
        target.lineWidth = 1.5;
        target.beginPath();
        target.moveTo(10, -35); target.quadraticCurveTo(5, -31, 1, -35);
        target.moveTo(17, -35); target.quadraticCurveTo(22, -31, 27, -35);
        target.stroke();
    }

    target.restore();
}

// Dibuja a Firulais para la introduccion de la historia.
function drawCinematicBulldog(target, x, groundY, scale, phase) {
    target.save();
    target.translate(x, groundY);
    target.scale(scale, scale);
    target.fillStyle = 'rgba(0,0,0,.52)';
    target.beginPath();
    target.ellipse(0, 2, 43, 8, 0, 0, Math.PI * 2);
    target.fill();

    const bodyGradient = target.createRadialGradient(8, -50, 5, 0, -42, 58);
    bodyGradient.addColorStop(0, '#29222f');
    bodyGradient.addColorStop(0.55, '#0b0811');
    bodyGradient.addColorStop(1, '#020205');
    target.fillStyle = bodyGradient;
    target.beginPath();
    target.ellipse(0, -39, 42, 39, 0, 0, Math.PI * 2);
    target.fill();

    target.fillStyle = '#ef4444';
    target.fillRect(-38, -58, 76, 9);
    for (let spikeX = -30; spikeX <= 30; spikeX += 20) {
        target.fillStyle = '#f8fafc';
        target.beginPath();
        target.moveTo(spikeX - 4, -58); target.lineTo(spikeX, -67); target.lineTo(spikeX + 4, -58); target.closePath();
        target.fill();
    }

    target.fillStyle = '#07050b';
    target.beginPath();
    target.ellipse(0, -78, 39, 31, 0, 0, Math.PI * 2);
    target.fill();
    target.beginPath();
    target.moveTo(-30, -94); target.lineTo(-46, -101); target.lineTo(-35, -72); target.closePath();
    target.moveTo(30, -94); target.lineTo(46, -101); target.lineTo(35, -72); target.closePath();
    target.fill();

    target.fillStyle = '#30252e';
    target.beginPath();
    target.ellipse(0, -66, 23, 15, 0, 0, Math.PI * 2);
    target.fill();
    target.fillStyle = '#020205';
    target.beginPath();
    target.ellipse(0, -72, 8, 5, 0, 0, Math.PI * 2);
    target.fill();

    target.shadowColor = '#ef4444';
    target.shadowBlur = 13 + Math.sin(phase * 0.008) * 4;
    target.fillStyle = '#ef4444';
    target.beginPath();
    target.ellipse(-15, -83, 5, 4, -0.2, 0, Math.PI * 2);
    target.ellipse(15, -83, 5, 4, 0.2, 0, Math.PI * 2);
    target.fill();
    target.shadowBlur = 0;

    target.fillStyle = '#ffffff';
    target.beginPath();
    target.moveTo(-13, -60); target.lineTo(-8, -50); target.lineTo(-3, -59); target.closePath();
    target.moveTo(13, -60); target.lineTo(8, -50); target.lineTo(3, -59); target.closePath();
    target.fill();

    const step = Math.sin(phase * 0.011) * 3;
    target.fillStyle = '#0b0811';
    target.fillRect(-31, -22, 17, 23 + step);
    target.fillRect(14, -22, 17, 23 - step);
    target.restore();
}

// Crea el portal dimensional animado que conecta la historia con el juego.
function drawCinematicPortal(target, x, y, radius, elapsed) {
    if (radius <= 1) return;
    target.save();
    target.translate(x, y);
    target.globalCompositeOperation = 'lighter';
    for (let ring = 0; ring < 7; ring++) {
        const ringRadius = radius * (1 - ring * 0.075) + Math.sin(elapsed * 0.006 + ring) * 5;
        target.strokeStyle = ring % 2 === 0 ? 'rgba(34,211,238,.72)' : 'rgba(168,85,247,.66)';
        target.lineWidth = 7 - ring * 0.65;
        target.beginPath();
        target.ellipse(0, 0, ringRadius * 0.58, ringRadius, elapsed * 0.00035 + ring * 0.11, 0, Math.PI * 2);
        target.stroke();
    }
    const glow = target.createRadialGradient(0, 0, 4, 0, 0, radius);
    glow.addColorStop(0, 'rgba(255,255,255,.7)');
    glow.addColorStop(0.22, 'rgba(34,211,238,.35)');
    glow.addColorStop(0.62, 'rgba(126,34,206,.23)');
    glow.addColorStop(1, 'rgba(15,23,42,0)');
    target.fillStyle = glow;
    target.beginPath();
    target.ellipse(0, 0, radius * 0.7, radius * 1.08, 0, 0, Math.PI * 2);
    target.fill();
    target.restore();
}

// Pinta el parque y todos los elementos visuales que aparecen en la apertura.
function drawCinematicPark(elapsed) {
    const target = cutsceneCtx;
    const storm = cutsceneSmooth(2600, 6000, elapsed);
    const lightningPulse = Math.exp(-Math.pow((elapsed - 5400) / 330, 2));
    const shake = lightningPulse > 0.12 ? Math.sin(elapsed * 0.09) * 4 * lightningPulse : 0;
    target.setTransform(1, 0, 0, 1, 0, 0);
    target.clearRect(0, 0, 800, 450);
    target.save();
    target.translate(shake, shake * 0.35);

    const sky = target.createLinearGradient(0, 0, 0, 360);
    sky.addColorStop(0, `rgb(${Math.round(cutsceneMix(13, 3, storm))}, ${Math.round(cutsceneMix(20, 8, storm))}, ${Math.round(cutsceneMix(48, 28, storm))})`);
    sky.addColorStop(1, `rgb(${Math.round(cutsceneMix(31, 10, storm))}, ${Math.round(cutsceneMix(41, 17, storm))}, ${Math.round(cutsceneMix(76, 43, storm))})`);
    target.fillStyle = sky;
    target.fillRect(0, 0, 800, 450);

    // Luna y ciudad detrás del Parque Sureño.
    target.globalAlpha = 1 - storm * 0.72;
    target.fillStyle = '#fef3c7';
    target.beginPath();
    target.arc(108, 80, 34, 0, Math.PI * 2);
    target.fill();
    target.globalAlpha = 1;
    const buildings = [
        [0, 215, 74, 143], [72, 190, 74, 168], [144, 235, 86, 123], [225, 175, 86, 183],
        [310, 223, 78, 135], [387, 155, 95, 203], [480, 207, 72, 151], [550, 178, 84, 180],
        [632, 220, 76, 138], [706, 165, 94, 193]
    ];
    buildings.forEach(([x, y, width, height], index) => {
        target.fillStyle = index % 2 ? '#10162d' : '#0b1226';
        target.fillRect(x, y, width, height);
        for (let wx = x + 13; wx < x + width - 8; wx += 21) {
            for (let wy = y + 16; wy < 335; wy += 24) {
                target.fillStyle = ((wx + wy + index) % 4 === 0) ? 'rgba(253,224,71,.68)' : 'rgba(96,165,250,.18)';
                target.fillRect(wx, wy, 6, 8);
            }
        }
    });

    // Nubes de tormenta.
    target.fillStyle = `rgba(30, 31, 53, ${0.4 + storm * 0.55})`;
    for (let cloud = 0; cloud < 5; cloud++) {
        const cloudX = ((cloud * 190 - elapsed * 0.012) % 1040) - 80;
        const cloudY = 42 + (cloud % 2) * 35;
        target.beginPath();
        target.arc(cloudX, cloudY, 43, 0, Math.PI * 2);
        target.arc(cloudX + 43, cloudY - 9, 53, 0, Math.PI * 2);
        target.arc(cloudX + 91, cloudY + 4, 41, 0, Math.PI * 2);
        target.fill();
    }

    // Suelo, sendero y césped del parque.
    target.fillStyle = '#14261f';
    target.fillRect(0, 350, 800, 100);
    target.fillStyle = '#2d4f38';
    target.fillRect(0, 350, 800, 7);
    target.fillStyle = '#334155';
    target.beginPath();
    target.moveTo(270, 450); target.lineTo(365, 350); target.lineTo(520, 350); target.lineTo(660, 450); target.closePath();
    target.fill();

    // Faroles y banco.
    [292, 744].forEach((lampX, index) => {
        target.strokeStyle = '#475569';
        target.lineWidth = 6;
        target.beginPath(); target.moveTo(lampX, 350); target.lineTo(lampX, 238); target.stroke();
        target.fillStyle = storm > 0.8 && index === 1 && Math.floor(elapsed / 180) % 3 === 0 ? '#64748b' : '#fde68a';
        target.shadowColor = '#fde68a'; target.shadowBlur = 18 * (1 - storm * 0.25);
        target.beginPath(); target.arc(lampX, 236, 11, 0, Math.PI * 2); target.fill();
        target.shadowBlur = 0;
    });
    target.fillStyle = '#7c4a2d';
    target.fillRect(365, 304, 112, 12);
    target.fillRect(372, 321, 98, 9);
    target.fillStyle = '#475569';
    target.fillRect(379, 330, 7, 21);
    target.fillRect(455, 330, 7, 21);

    // Caja-refugio de la familia.
    target.fillStyle = '#a16207';
    target.fillRect(55, 286, 162, 68);
    target.fillStyle = '#ca8a04';
    target.beginPath();
    target.moveTo(55, 286); target.lineTo(88, 265); target.lineTo(139, 286); target.lineTo(181, 263); target.lineTo(217, 286); target.closePath();
    target.fill();
    target.fillStyle = '#422006';
    target.fillRect(105, 306, 63, 48);
    target.strokeStyle = 'rgba(254,240,138,.45)';
    target.lineWidth = 2;
    target.strokeRect(61, 292, 150, 57);
    target.fillStyle = '#fef08a';
    target.font = 'bold 12px Fredoka';
    target.fillText('HOGAR', 68, 310);

    // Árbol viejo alcanzado por el rayo.
    target.strokeStyle = '#4b2e24';
    target.lineWidth = 29;
    target.lineCap = 'round';
    target.beginPath(); target.moveTo(650, 350); target.lineTo(647, 190); target.stroke();
    target.lineWidth = 16;
    target.beginPath();
    target.moveTo(646, 238); target.lineTo(590, 182);
    target.moveTo(650, 235); target.lineTo(708, 169);
    target.stroke();
    target.fillStyle = `rgb(${Math.round(cutsceneMix(38, 26, storm))}, ${Math.round(cutsceneMix(86, 45, storm))}, ${Math.round(cutsceneMix(61, 52, storm))})`;
    [[600,162,53],[649,143,62],[700,158,50],[618,204,45],[688,207,43]].forEach(([x,y,radius]) => {
        target.beginPath(); target.arc(x, y, radius, 0, Math.PI * 2); target.fill();
    });

    // El rayo aparece justo antes de que se abra el portal.
    if (elapsed > 4900 && elapsed < 6050) {
        target.strokeStyle = `rgba(255,255,255,${cutsceneClamp(lightningPulse * 1.25)})`;
        target.shadowColor = '#67e8f9';
        target.shadowBlur = 22;
        target.lineWidth = 8;
        target.beginPath();
        target.moveTo(612, 0); target.lineTo(653, 74); target.lineTo(624, 128); target.lineTo(661, 195); target.lineTo(647, 250);
        target.stroke();
        target.shadowBlur = 0;
    }

    const portalOpen = Math.min(
        cutsceneSmooth(5900, 7600, elapsed),
        1 - cutsceneSmooth(22000, 23700, elapsed)
    );
    drawCinematicPortal(target, 650, 264, 90 * portalOpen, elapsed);

    // Posiciones animadas de la familia y de Firulais.
    const sisterTravel = cutsceneSmooth(10300, 13450, elapsed);
    const parentsTravel = cutsceneSmooth(13800, 17150, elapsed);
    const miauTravel = cutsceneSmooth(18100, 21800, elapsed);
    const frightened = elapsed > 6800;
    const sisterX = cutsceneMix(226, 642, sisterTravel);
    const sisterY = 347 - Math.sin(sisterTravel * Math.PI) * 45;
    const fatherX = cutsceneMix(143, 626, parentsTravel);
    const motherX = cutsceneMix(184, 635, parentsTravel);
    const parentLift = Math.sin(parentsTravel * Math.PI) * 33;

    // Cintas de energía: dejan claro que la familia no camina hacia el
    // portal, sino que Firulais la está arrastrando a otra dimensión.
    function drawDimensionalPull(fromX, fromY, strength, color) {
        if (strength <= 0.01 || strength >= 0.99) return;
        target.save();
        target.globalCompositeOperation = 'lighter';
        target.globalAlpha = Math.sin(strength * Math.PI) * 0.78;
        target.strokeStyle = color;
        target.shadowColor = color;
        target.shadowBlur = 12;
        target.lineWidth = 3;
        target.setLineDash([10, 9]);
        target.lineDashOffset = -elapsed * 0.04;
        target.beginPath();
        target.moveTo(fromX + 8, fromY - 37);
        target.bezierCurveTo(fromX + 85, fromY - 78, 575, 304, 640, 265);
        target.stroke();
        target.setLineDash([]);
        target.lineWidth = 2;
        target.beginPath();
        target.ellipse(fromX, fromY - 31, 26, 40, elapsed * 0.001, 0, Math.PI * 2);
        target.stroke();
        target.restore();
    }

    drawDimensionalPull(sisterX, sisterY, sisterTravel, '#67e8f9');
    drawDimensionalPull(fatherX, 347 - parentLift, parentsTravel, '#c084fc');
    drawDimensionalPull(motherX, 347 - parentLift * 0.85, parentsTravel, '#f9a8d4');

    if (elapsed < 17450) {
        target.globalAlpha = 1 - cutsceneSmooth(16500, 17450, elapsed);
        drawCinematicCat(target, fatherX, 347 - parentLift, 0.82, '#94a3b8', 'moustache', 1, frightened ? 'afraid' : 'calm');
        drawCinematicCat(target, motherX, 347 - parentLift * 0.85, 0.78, '#fef08a', 'bow', 1, frightened ? 'afraid' : 'calm');
        target.globalAlpha = 1;
    }
    if (elapsed < 13800) {
        target.globalAlpha = 1 - cutsceneSmooth(12900, 13800, elapsed);
        drawCinematicCat(target, sisterX, sisterY, 0.58, '#ffffff', 'none', 1, frightened ? 'afraid' : 'calm');
        target.globalAlpha = 1;
    }

    if (elapsed >= 7100 && elapsed < 17600) {
        const enter = cutsceneSmooth(7100, 8900, elapsed);
        const retreat = cutsceneSmooth(14500, 17200, elapsed);
        const firulaisX = cutsceneMix(cutsceneMix(690, 522, enter), 640, retreat);
        target.globalAlpha = 1 - cutsceneSmooth(16600, 17600, elapsed);
        drawCinematicBulldog(target, firulaisX, 349, 0.93, elapsed);
        target.globalAlpha = 1;
    }

    // Miau permanece escondido y luego se convierte en el héroe del rescate.
    const miauX = cutsceneMix(270, 646, miauTravel);
    const miauJump = Math.sin(miauTravel * Math.PI) * 82;
    target.globalAlpha = 1 - cutsceneSmooth(21650, 22800, elapsed);
    drawCinematicCat(target, miauX, 348 - miauJump, 0.7, '#f97316', 'none', 1, elapsed > 17200 ? 'afraid' : 'calm', elapsed > 17800);
    target.globalAlpha = 1;

    // Arbusto que oculta a Miau al inicio.
    if (elapsed < 18100) {
        target.fillStyle = '#166534';
        [[246,340,25],[270,330,31],[295,342,24]].forEach(([x,y,radius]) => {
            target.beginPath(); target.arc(x, y, radius, 0, Math.PI * 2); target.fill();
        });
    }

    // Huellas luminosas que señalan el camino al final del prólogo.
    if (elapsed > 20200) {
        const pawAlpha = cutsceneSmooth(20200, 21800, elapsed);
        target.globalAlpha = pawAlpha;
        for (let index = 0; index < 6; index++) {
            const pawX = 330 + index * 49;
            const pawY = 330 - Math.sin(index * 0.9) * 19;
            drawPawMark(target, pawX, pawY, 0.62, index % 2 ? '#67e8f9' : '#fde047');
        }
        target.globalAlpha = 1;
    }

    // Lluvia delante de la escena.
    if (storm > 0.12) {
        target.strokeStyle = `rgba(147,197,253,${0.13 + storm * 0.3})`;
        target.lineWidth = 1.5;
        for (let drop = 0; drop < 58; drop++) {
            const dropX = ((drop * 137 - elapsed * 0.18) % 900 + 900) % 900 - 45;
            const dropY = ((drop * 71 + elapsed * 0.31) % 520) - 55;
            target.beginPath();
            target.moveTo(dropX, dropY);
            target.lineTo(dropX - 8, dropY + 20);
            target.stroke();
        }
    }

    if (lightningPulse > 0.05) {
        target.fillStyle = `rgba(224,242,254,${lightningPulse * 0.58})`;
        target.fillRect(-10, -10, 820, 470);
    }
    if (elapsed > 22400) {
        target.fillStyle = `rgba(255,255,255,${cutsceneSmooth(22400, 23750, elapsed)})`;
        target.fillRect(0, 0, 800, 450);
    }

    target.restore();
}

// Renderiza un fotograma completo de la cinematica con su fondo y subtitulos.
function renderCutsceneFrame(elapsed) {
    drawCinematicPark(elapsed);
    const foundSceneIndex = CUTSCENE_SCENES.findIndex(scene => elapsed >= scene.start && elapsed < scene.end);
    const sceneIndex = foundSceneIndex === -1 ? CUTSCENE_SCENES.length - 1 : foundSceneIndex;
    updateCutsceneCaption(sceneIndex);
    ui.cutsceneProgress.style.width = `${cutsceneClamp(elapsed / CUTSCENE_DURATION) * 100}%`;
}

// Intenta dibujar la cinematica y cae a una version mas segura si el navegador falla.
function renderCutsceneFrameSafely(elapsed) {
    try {
        renderCutsceneFrame(elapsed);
    } catch (error) {
        // Si un navegador antiguo no admite alguna operación del
        // canvas, el relato continúa mediante los subtítulos.
        console.warn('La animación visual se redujo por compatibilidad.', error);
        const foundSceneIndex = CUTSCENE_SCENES.findIndex(scene => elapsed >= scene.start && elapsed < scene.end);
        const sceneIndex = foundSceneIndex === -1 ? CUTSCENE_SCENES.length - 1 : foundSceneIndex;
        updateCutsceneCaption(sceneIndex);
        ui.cutsceneProgress.style.width = `${cutsceneClamp(elapsed / CUTSCENE_DURATION) * 100}%`;
    }
}

// Controla el avance en el tiempo de la cinematica hasta que termina o se salta.
function cutsceneLoop(timestamp) {
    if (!cutsceneActive) return;
    if (cutsceneStartTime === null) cutsceneStartTime = timestamp;
    const elapsed = Math.min(CUTSCENE_DURATION, timestamp - cutsceneStartTime);
    renderCutsceneFrameSafely(elapsed);
    if (elapsed >= CUTSCENE_DURATION) {
        finishCutscene();
    } else {
        cutsceneAnimationFrameId = requestAnimationFrame(cutsceneLoop);
    }
}

// Inicia la aventura ocultando menus, activando la cinematica y preparando audio y animacion.
function beginAdventure() {
    if (cutsceneActive) return;
    const availableAudio = ensureAudioContext();
    if (availableAudio && availableAudio.state === 'suspended') {
        availableAudio.resume().catch(() => {});
    }
    gameActive = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    ui.startScreen.classList.add('hidden');
    ui.shopScreen.classList.add('hidden');
    ui.gameOverlay.classList.add('hidden');
    setCutsceneVisible(true);
    cutsceneActive = true;
    cutsceneSceneIndex = -1;
    cutsceneStartTime = null;
    renderCutsceneFrameSafely(0);
    cutsceneAnimationFrameId = requestAnimationFrame(cutsceneLoop);
}

// Cierra la cinematica y da paso a la jugabilidad real.
function finishCutscene() {
    if (!cutsceneActive) return;
    cutsceneActive = false;
    if (cutsceneAnimationFrameId) cancelAnimationFrame(cutsceneAnimationFrameId);
    cutsceneAnimationFrameId = null;
    cutsceneStartTime = null;
    setCutsceneVisible(false);
    startGame();
}

// Permite saltar la escena de apertura sin romper el flujo del juego.
function skipCutscene() {
    if (!cutsceneActive) return;
    playSound('coin');
    finishCutscene();
}

// Las constantes compartidas viven en config.js.

// Variables de estado y de visualización
let keys = {};
let currentLevel = 1;
let levelOneSection = 1;
let levelTwoSection = 1;
let levelThreeSection = 1;
let gameActive = false;
let isPaused = false;
let gameOver = false;
let animationFrameId;
let gameTick = 0;
let cameraX = 0;
let levelStartedAt = 0;
let physicsAccumulator = 0;

// Acerca un valor a otro poco a poco, ideal para movimientos suaves y controlados.
function approach(value, target, amount) {
    if (value < target) return Math.min(value + amount, target);
    if (value > target) return Math.max(value - amount, target);
    return target;
}

// Identidad narrativa: cada dimensión tiene un nombre, una función en la
// historia y una silueta propia. Así el viaje deja de sentirse como una
// sucesión de mapas iguales con distinto color.
const LEVEL_IDENTITIES = {
    1: { name: 'Parque Sureño', subtitle: 'La noche del portal', icon: '⛈️', accent: '#38bdf8' },
    2: { name: 'Bosque de los Ecos', subtitle: 'Las voces entre las raíces', icon: '🌙', accent: '#c084fc' },
    3: { name: 'Colonia Colosal', subtitle: 'El jardín visto por un gato', icon: '🍃', accent: '#4ade80' },
    4: { name: 'Cordillera de las Siete Huellas', subtitle: 'Un camino escrito en fuego', icon: '🌋', accent: '#fb923c' },
    5: { name: 'Ciudad Sumergida de Bigotes', subtitle: 'Recuerdos bajo el río', icon: '🫧', accent: '#22d3ee' },
    6: { name: 'Fortaleza de Firulais', subtitle: 'La jaula de las sombras', icon: '🏰', accent: '#f87171' },
    7: { name: 'Dimensión Quebrada', subtitle: 'Todas las huellas llevan a casa', icon: '🌀', accent: '#34d399' }
};

const LEVEL_ONE_IDENTITIES = {
    1: { name: 'Parque Sureño', subtitle: 'El primer rastro bajo la tormenta', icon: '⛈️', accent: '#38bdf8' },
    2: { name: 'Juegos del Parque', subtitle: 'Deslizate por toboganes y colgate de los aros', icon: '🛝', accent: '#fbbf24' },
    3: { name: 'Camino a la Isla', subtitle: 'Juan Perón, el puente y el portal', icon: '🌉', accent: '#60a5fa' }
};

const LEVEL_TWO_IDENTITIES = {
    1: { name: 'Bosque de los Ecos', subtitle: 'Los fantasmas siguen flotando entre las raíces', icon: '👻', accent: '#c084fc' },
    2: { name: 'Sendero Zombi', subtitle: 'Evitá sus mordidas o quedarás verde y aturdido', icon: '🧟', accent: '#4ade80' },
    3: { name: 'Cofres de la Cripta', subtitle: 'Acercate con cuidado: algo revolotea dentro', icon: '🦇', accent: '#818cf8' }
};

const LEVEL_THREE_IDENTITIES = {
    1: { name: 'Jardín de las Telarañas', subtitle: 'Los bichos gigantes siguen aquí... y ahora también cae la seda', icon: '🕸️', accent: '#86efac' },
    2: { name: 'Túneles de los Topos', subtitle: 'Escondete en los agujeros cuando los vigías miren hacia vos', icon: '🕳️', accent: '#fbbf24' },
    3: { name: 'Puentes de la Copa Verde', subtitle: 'Lianas, combate y tablas que no aguantan para siempre', icon: '🌿', accent: '#4ade80' }
};

function getCurrentLevelLabel() {
    if (currentLevel === 1) return `1.${levelOneSection}`;
    if (currentLevel === 2) return `2.${levelTwoSection}`;
    if (currentLevel === 3) return `3.${levelThreeSection}`;
    return `${currentLevel}`;
}

function getCurrentIdentity() {
    if (currentLevel === 1) return LEVEL_ONE_IDENTITIES[levelOneSection];
    if (currentLevel === 2) return LEVEL_TWO_IDENTITIES[levelTwoSection];
    if (currentLevel === 3) return LEVEL_THREE_IDENTITIES[levelThreeSection];
    return LEVEL_IDENTITIES[currentLevel];
}

// Los planos declarativos viven en js/data/levels.js.
function getCurrentBlueprint() {
    if (currentLevel === 1) return LEVEL_ONE_BLUEPRINTS[levelOneSection];
    if (currentLevel === 2) return LEVEL_TWO_BLUEPRINTS[levelTwoSection];
    if (currentLevel === 3) return LEVEL_THREE_BLUEPRINTS[levelThreeSection];
    return MAP_BLUEPRINTS[currentLevel];
}

// Sistema de Sacudida de Pantalla (Screen Shake)
let shakeDuration = 0;
let shakeIntensity = 0;

// ===== Progreso, tienda y recompensas persistentes =====
// Variables de la Tienda de Súper Gatito
let globalWallet = 0; // Monedero acumulable de la sesión
let shopUpgrades = {
    extraLives: 0,
    startLightning: false,
    startStrength: false,
    shieldActive: false
};
const PROGRESS_STORAGE_KEY = 'superMiauProgressV1';

// Mantiene sincronizado el monedero global entre la pantalla inicial y la tienda.
function syncWalletDisplays() {
    ui.startScreenWallet.textContent = globalWallet;
    ui.shopWalletText.textContent = globalWallet;
}

// Guarda el progreso local del jugador para no perder huellas ni mejoras al recargar.
function saveProgress() {
    try {
        window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
            globalWallet,
            shopUpgrades
        }));
    } catch (error) {
        console.warn('No se pudo guardar el progreso local.', error);
    }
}

// Recupera desde el navegador el progreso guardado de partidas anteriores.
function loadProgress() {
    try {
        const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Number.isFinite(parsed.globalWallet) && parsed.globalWallet >= 0) {
            globalWallet = Math.floor(parsed.globalWallet);
        }
        if (parsed.shopUpgrades && typeof parsed.shopUpgrades === 'object') {
            shopUpgrades = {
                extraLives: Number.isFinite(parsed.shopUpgrades.extraLives)
                    ? Math.max(0, Math.floor(parsed.shopUpgrades.extraLives))
                    : 0,
                startLightning: Boolean(parsed.shopUpgrades.startLightning),
                startStrength: Boolean(parsed.shopUpgrades.startStrength),
                shieldActive: Boolean(parsed.shopUpgrades.shieldActive)
            };
        }
    } catch (error) {
        console.warn('No se pudo recuperar el progreso guardado.', error);
    }
}

// Suma recompensas al monedero global y actualiza la interfaz y el guardado.
function awardWallet(amount) {
    if (!Number.isFinite(amount) || amount <= 0) return;
    globalWallet += amount;
    syncWalletDisplays();
    saveProgress();
}

// Rellena el selector del modo desarrollador con los mundos disponibles.
function populateDeveloperLevelOptions() {
    ui.devLevelSelect.innerHTML = '';
    Object.entries(LEVEL_ONE_IDENTITIES).forEach(([section, identity]) => {
        const option = document.createElement('option');
        option.value = `1.${section}`;
        option.textContent = `${identity.icon} Nivel 1.${section} · ${identity.name}`;
        ui.devLevelSelect.appendChild(option);
    });
    Object.entries(LEVEL_TWO_IDENTITIES).forEach(([section, identity]) => {
        const option = document.createElement('option');
        option.value = `2.${section}`;
        option.textContent = `${identity.icon} Nivel 2.${section} · ${identity.name}`;
        ui.devLevelSelect.appendChild(option);
    });
    Object.entries(LEVEL_THREE_IDENTITIES).forEach(([section, identity]) => {
        const option = document.createElement('option');
        option.value = `3.${section}`;
        option.textContent = `${identity.icon} Nivel 3.${section} · ${identity.name}`;
        ui.devLevelSelect.appendChild(option);
    });
    Object.entries(LEVEL_IDENTITIES).forEach(([level, identity]) => {
        if (level === '1' || level === '2' || level === '3') return;
        const option = document.createElement('option');
        option.value = level;
        option.textContent = `${identity.icon} Nivel ${level} · ${identity.name}`;
        ui.devLevelSelect.appendChild(option);
    });
    ui.devLevelSelect.value = '1.1';
}

// Premia el avance entre mundos para que los niveles largos se sientan
// mejor encadenados y el jugador llegue al final con margen de error.
function grantInterLevelReward(completedLevel) {
    if (!Number.isFinite(completedLevel) || completedLevel < 1 || completedLevel > 6) return;
    awardWallet(3 + Math.floor(completedLevel / 2));
    if (completedLevel % 2 === 0 && player.lives < 9 + shopUpgrades.extraLives) {
        player.lives++;
        syncHudLives();
    }
    player.oxygen = 100;
}

// Variable para el temporizador de tiempo (Nivel 7)
let levelTimer = 0;
const DEFAULT_CREDITS = [
    { role: 'Idea, direccion y produccion', names: ['Tu nombre va aqui'], detail: 'La chispa que convirtió una caja de cartón y un parque en una aventura dimensional.' },
    { role: 'Programacion y diseño del juego', names: ['Equipo Super Miau'], detail: 'Mecánicas, niveles, sonido, optimización y toda la lógica que hace correr a Miau.' },
    { role: 'Arte, historia y ajustes finales', names: ['Pendiente de nombres finales'], detail: 'Fondos, identidad de cada mundo, textos y el tono emocional del viaje.' },
    { role: 'Pruebas y balance', names: ['Pendiente de nombres finales'], detail: 'Saltos afinados, dificultad revisada y pruebas para que la aventura se sienta justa.' },
    { role: 'Agradecimiento especial', names: ['A todas las personas que ayudaron a Super Miau a llegar a casa'], detail: 'Este cierre queda preparado para sumar nombres definitivos cuando quieras.' }
];
const CREDITS_JOURNEY = [
    { icon: '⛈️', title: 'Parque Sureño', text: 'Todo comenzó con el rayo, el árbol y la decisión de no dejar sola a la familia.' },
    { icon: '🌙', title: 'Bosque de los Ecos', text: 'Las huellas se internaron entre raíces y sombras que querían desviar el camino.' },
    { icon: '🍃', title: 'Colonia Colosal', text: 'Cada salto se volvió más grande y cada insecto parecía una criatura legendaria.' },
    { icon: '🏠', title: 'Regreso', text: 'El último portal cayó detrás de Miau y el viaje terminó donde siempre tuvo que terminar: en casa.' }
];
let finalPortalSequence = {
    active: false,
    phase: 'idle',
    timer: 0,
    collapse: 0,
    shatter: 0,
    fade: 0,
    pulse: 0,
    beam: 0,
    flash: 0,
    homeGlow: 0,
    message: '',
    detail: '',
    playerAlpha: 1,
    shardsSpawned: false
};
let creditsAnimationTimers = [];
let creditsScrollFrameId = null;

// ===== Entidades jugables y enemigos =====
// Estructura del Jugador (Gato Miau con Súper Poderes)
let player = {
    x: 100,
    y: 300,
    vx: 0,
    vy: 0,
    width: 32,
    height: 32,
    baseWidth: 32,
    baseHeight: 32,
    speed: 4.55,
    jumpStrength: -11.5,
    grounded: false,
    wasGrounded: false, 
    coyoteFrames: 0,
    jumpBufferFrames: 0,
    jumpHeld: false,
    jumpHoldFrames: 0,
    direction: 1, 
    isMoving: false,
    invulnerable: 0,
    lives: 7,
    coins: 0,
    oxygen: 100,
    
    // Atributos de Súper Poderes
    powerup: 'none', // 'none' | 'lightning' (Maullido Estelar) | 'strength' (Fuerza Felina)
    powerTimer: 0,   // Segundos o ticks restantes
    shootCooldown: 0,

    // Temporizadores exclusivamente visuales para elegir las poses PNG.
    attackAnimationTimer: 0,
    hurtAnimationTimer: 0,
    landingAnimationTimer: 0,
    celebrateAnimationTimer: 0,
    // Estado temporal del nivel 2.2: una mordida zombi inmoviliza a
    // Miau y activa el tinte verde durante unos tres segundos.
    zombieStunTimer: 0,
    // En 2.3 Miau puede encontrar un aerosol especial para espantar
    // las bandadas. Es una herramienta exclusiva de esta sección.
    batSprayOwned: false,
    batSprayCooldown: 0,
    batSprayFlashTimer: 0,
    // V23 · estados temporales del capítulo 3.
    webStunTimer: 0,
    hiddenInHole: false,
    // Estados exclusivos del parque dinámico (nivel 1.2).
    sliding: false,
    hangingRing: null,
    ringDetachCooldown: 0,
    ringReleaseArmed: false,
    hangSwing: 0
};

let blocks = [];
let coins = [];
let enemies = [];
let particles = [];
let backgroundDecorations = [];
let bubbles = []; 
let bones = []; 
let hazards = []; // Meteoros/Debris para el Nivel 7
let trafficCars = [];
let dogcatcher = null;
let streetBird = null;
let forestChests = [];
let bats = [];
let batSprayPickup = null;
let fallingWebs = [];
let moleHoles = [];
let tunnelMoles = [];
let bridgePlanks = [];
// Extra de 2.3: una puerta al final lleva a una sala cerrada donde
// el aerosol sirve para enfrentar a un vampiro caricaturesco.
const VAMPIRE_ARENA = {
    minX: 4300,
    maxX: 5200,
    playerStartX: 4370,
    bossStartX: 4920,
    doorX: 5070
};
let vampireBattle = {
    entered: false,
    active: false,
    defeated: false,
    hp: 100,
    maxHp: 100,
    playerHp: 100,
    playerMaxHp: 100,
    x: VAMPIRE_ARENA.bossStartX,
    y: 270,
    width: 58,
    height: 88,
    vx: -1.35,
    hurtTimer: 0,
    playerHurtTimer: 0,
    introTimer: 0,
    batAttackCooldown: 0,
    batAttackArmed: true,
    phase: 0
};

// Entidades adicionales para Súper Poderes
let poppedPowerups = []; // Símbolos de poder o vidas que salen de los lucky blocks
let playerProjectiles = []; // Estrellas (Maullido estelar) disparados por el jugador

// Elemento de Meta / Portal Dimensional
let flagpole = { x: LEVEL_WIDTH - 330, y: 280, width: 45, height: 100, reached: false };

// El Jefe: Firulais (Nivel 6)
let boss = {
    x: 2400,
    y: 280,
    width: 80,
    height: 100,
    hp: 3,
    maxHp: 3,
    vx: -2.2,
    dir: -1,
    hurtTimer: 0,
    shootTimer: 0,
    active: false // Inicialmente inactivo hasta que el jugador se acerque
};

// Familia Gatuna (Secuestrados en Nivel 6 por Firulais)
let princess = { 
    x: 4870,
    y: 348,
    width: 45, // Más ancho para acomodar a los tres gatitos
    height: 32,
    jailed: true
};

const ENEMY_VARIANT_CYCLES = {
    mouse: ['scout', 'charger', 'brute'],
    ghost: ['drifter', 'stalker', 'blink'],
    zombie: ['shambler', 'lurker', 'brute'],
    bug: ['crawler', 'leaper', 'shell'],
    jellyfish: ['drifter', 'surger', 'mine']
};

// Construye un enemigo a partir del mapa y le asigna variante, velocidad, vida y comportamiento base.
function createEnemyFromSpawn(spawn, type, index) {
    const variantCycle = ENEMY_VARIANT_CYCLES[type] || ['default'];
    const variant = spawn.variant || variantCycle[index % variantCycle.length];
    const enemy = {
        x: spawn.x,
        y: spawn.y,
        baseY: spawn.y,
        width: 28,
        height: 20,
        baseSpeed: 1.35,
        vx: -1.35,
        minX: spawn.minX,
        maxX: spawn.maxX,
        type,
        variant,
        alive: true,
        squishTime: 0,
        hp: 1,
        hurtTimer: 0,
        phase: index * 0.9,
        abilityCooldown: 70 + index * 8,
        leapTimer: 0,
        anchorX: spawn.x,
        pulse: 0,
        pulseRadius: 40,
        scoreValue: 2
    };

    if (type === 'mouse') {
        if (variant === 'scout') {
            enemy.width = 26;
            enemy.height = 18;
            enemy.baseSpeed = 1.9;
        } else if (variant === 'charger') {
            enemy.width = 28;
            enemy.height = 20;
            enemy.baseSpeed = 1.2;
            enemy.abilityCooldown = 40 + index * 5;
        } else if (variant === 'brute') {
            enemy.width = 34;
            enemy.height = 22;
            enemy.baseSpeed = 0.9;
            enemy.hp = 2;
            enemy.scoreValue = 3;
        }
    } else if (type === 'ghost') {
        enemy.width = 28;
        enemy.height = 22;
        enemy.baseSpeed = 1.05;
        if (variant === 'stalker') {
            enemy.width = 30;
            enemy.baseSpeed = 0.9;
        } else if (variant === 'blink') {
            enemy.width = 26;
            enemy.baseSpeed = 0.8;
            enemy.abilityCooldown = 85 + index * 10;
        }
    } else if (type === 'zombie') {
        enemy.width = 30;
        enemy.height = 32;
        enemy.baseSpeed = 0.72;
        enemy.scoreValue = 2;
        if (variant === 'lurker') {
            enemy.width = 29;
            enemy.baseSpeed = 0.86;
            enemy.abilityCooldown = 55 + index * 6;
        } else if (variant === 'brute') {
            enemy.width = 34;
            enemy.height = 36;
            enemy.baseSpeed = 0.58;
            enemy.hp = 2;
            enemy.scoreValue = 3;
        }
    } else if (type === 'bug') {
        enemy.width = 30;
        enemy.height = 22;
        enemy.baseSpeed = 1.4;
        if (variant === 'leaper') {
            enemy.baseSpeed = 1.15;
            enemy.abilityCooldown = 55 + index * 7;
        } else if (variant === 'shell') {
            enemy.width = 34;
            enemy.height = 24;
            enemy.baseSpeed = 0.95;
            enemy.hp = 2;
            enemy.scoreValue = 3;
        }
    } else if (type === 'jellyfish') {
        enemy.width = 28;
        enemy.height = 22;
        enemy.baseSpeed = 0.75;
        if (variant === 'surger') {
            enemy.width = 30;
            enemy.height = 24;
            enemy.baseSpeed = 0.95;
            enemy.abilityCooldown = 48 + index * 6;
        } else if (variant === 'mine') {
            enemy.width = 32;
            enemy.height = 28;
            enemy.baseSpeed = 0.3;
            enemy.pulseRadius = 52;
        }
    }

    enemy.vx = spawn.vx ?? -enemy.baseSpeed;
    return enemy;
}

// Genera particulas de impacto para comunicar visualmente da?o o derrota de un enemigo.
function spawnEnemyHitParticles(enemy, color = '#facc15', count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            color,
            4,
            18,
            enemy.type === 'jellyfish' ? 'bubble' : 'spark'
        ));
    }
}

// Aplica da?o respetando enemigos con armadura o varias vidas antes de darlos por derrotados.
function damageEnemy(enemy, knockbackDirection = 0) {
    if (!enemy.alive || enemy.hurtTimer > 0) return false;
    if (enemy.hp > 1) {
        enemy.hp--;
        enemy.hurtTimer = 20;
        if (knockbackDirection !== 0) {
            enemy.vx = Math.sign(knockbackDirection) * Math.max(1.6, Math.abs(enemy.vx));
        } else {
            enemy.vx *= -1;
        }
        spawnEnemyHitParticles(enemy, enemy.type === 'jellyfish' ? '#67e8f9' : '#fbbf24', 6);
        return false;
    }

    enemy.alive = false;
    enemy.squishTime = 25;
    spawnEnemyHitParticles(enemy, enemy.type === 'jellyfish' ? '#67e8f9' : '#facc15', 10);
    return true;
}

// Crea el decorado del nivel actual para que cada mundo tenga su propia identidad visual.
function initBackground() {
    backgroundDecorations = [];
    const starCount = getDecorationCount(70, 46, 28);
    const nebulaCount = getDecorationCount(12, 8, 5);
    const isStreetSection = currentLevel === 1 && levelOneSection === 3;
    const isParqueSurenoSection = currentLevel === 1 && levelOneSection <= 2;

    // El 1.3 usa un fondo completamente independiente del parque.
    // V15: 1.1 y 1.2 también tienen una atmósfera exclusiva inspirada
    // en Plaza Constitución, sin estrellas/nebulosas del fondo viejo.
    if (!isStreetSection && !isParqueSurenoSection) {
        // Estrellas de fondo
        for (let i = 0; i < starCount; i++) {
            backgroundDecorations.push({
                x: Math.random() * LEVEL_WIDTH,
                y: Math.random() * 250,
                size: Math.random() * 2 + 0.8,
                type: 'star',
                phase: Math.random() * Math.PI,
                depth: 0.05 
            });
        }

        // Nebulosas/Nubes lejanas
        for (let i = 0; i < nebulaCount; i++) {
            backgroundDecorations.push({
                x: i * 300 + Math.random() * 100,
                y: 80 + Math.random() * 80,
                width: 120 + Math.random() * 100,
                height: 40 + Math.random() * 40,
                color: currentLevel === 1 ? 'rgba(79, 70, 229, 0.06)' : 
                       currentLevel === 2 && levelTwoSection === 2 ? 'rgba(34, 197, 94, 0.07)' :
                       currentLevel === 2 && levelTwoSection === 3 ? 'rgba(67, 56, 202, 0.07)' :
                       currentLevel === 2 ? 'rgba(168, 85, 247, 0.05)' : // Morado Bosque 2.1
                       currentLevel === 3 ? 'rgba(34, 197, 94, 0.05)' :  // Verde Selva Bichos
                       currentLevel === 4 ? 'rgba(239, 68, 68, 0.06)' :  // Lava
                       currentLevel === 5 ? 'rgba(14, 116, 144, 0.05)' :  // Mar
                       currentLevel === 6 ? 'rgba(220, 38, 38, 0.08)' : 'rgba(239, 68, 68, 0.12)', // Castillo y Colapso
                type: 'nebula',
                depth: 0.15
            });
        }
    }

    if (currentLevel === 1) {
        // 1.1 y 1.2 se dibujan enteros en drawParqueSurenoEnvironment().
        // Se eliminan las decoraciones oscuras heredadas para que no
        // aparezcan encima del nuevo paisaje cálido de la plaza.
        if (levelOneSection === 3) {
            // V19: el 1.3 ya no usa decoraciones repetidas por encima
            // de una foto panorámica. Los hitos de Juan Perón se
            // dibujan con posiciones propias en drawStreetEnvironmentV19().
        }
    } else if (currentLevel === 2) {
        // Rayos de luz misteriosos violetas y árboles retorcidos del Bosque
        for (let i = 0; i < getDecorationCount(12, 7, 4); i++) {
            backgroundDecorations.push({
                x: i * 280 + Math.random() * 80,
                y: 150 + Math.random() * 80,
                width: 40 + Math.random() * 40,
                angle: -20 * (Math.PI / 180),
                type: 'lightray_purple',
                depth: 0.2
            });
        }
        for (let i = 0; i < getDecorationCount(15, 10, 6); i++) {
            backgroundDecorations.push({
                x: i * 200 + Math.random() * 60,
                y: 320,
                width: 25,
                height: 60,
                type: 'spooky_tree',
                depth: 0.3
            });
        }
        const mushroomPositions = levelTwoSection === 2
            ? [220, 720, 1260, 1940, 2680, 3540, 4320, 4940]
            : [260, 880, 1460, 2160, 2780];
        mushroomPositions.forEach((x, i) => backgroundDecorations.push({ x, y: 342, size: 18 + (i % 3) * 7, type: 'giant_mushroom', depth: 0.92 }));
        const rootPositions = levelTwoSection === 3
            ? [430, 1210, 2180, 3140, 4090, 4880]
            : [560, 1820, 2480];
        rootPositions.forEach(x => backgroundDecorations.push({ x, y: 378, type: 'root_arch', depth: 0.88 }));
    } else if (currentLevel === 3) {
        // 3.2 se dibuja como túnel cerrado y no debe heredar árboles
        // ni cielo. 3.1 y 3.3 sí conservan la escala vegetal gigante.
        if (levelThreeSection !== 2) {
            for (let i = 0; i < getDecorationCount(15, 10, 6); i++) {
                backgroundDecorations.push({
                    x: i * 210 + Math.random() * 70,
                    y: 160,
                    radius: 40 + Math.random() * 20,
                    color1: '#064e3b',
                    color2: '#022c22',
                    type: 'tree',
                    depth: 0.25
                });
            }
            [180, 720, 1260, 1880, 2520, 3480, 4300, 4980].forEach((x, i) => backgroundDecorations.push({ x, y: 330 - (i % 2) * 35, size: 70 + (i % 3) * 18, type: 'giant_leaf', depth: 0.82 }));
            [520, 1700, 2860, 4020].forEach(x => backgroundDecorations.push({ x, y: 380, type: 'ant_hill', depth: 0.75 }));
        }
    } else if (currentLevel === 4) {
        // Volcanes del "El piso es lava"
        for (let i = 0; i < getDecorationCount(10, 6, 4); i++) {
            backgroundDecorations.push({
                x: i * 350 - 50,
                y: 380,
                size: 150 + Math.random() * 80,
                type: 'volcano',
                depth: 0.3
            });
        }
        [360, 1040, 1740, 2420, 2920].forEach((x, i) => backgroundDecorations.push({ x, y: 350, size: 45 + (i % 2) * 25, type: 'basalt_spire', depth: 0.78 }));
        [720, 1460, 2220, 2760].forEach((x, i) => backgroundDecorations.push({ x, y: 328, rune: (i % 3) + 1, type: 'paw_totem', depth: 0.9 }));
    } else if (currentLevel === 5) {
        // Rayos de luz submarinos
        for (let i = 0; i < getDecorationCount(15, 8, 5); i++) {
            backgroundDecorations.push({
                x: i * 220 + 50,
                y: 0,
                width: 30 + Math.random() * 40,
                angle: -15 * (Math.PI / 180),
                type: 'lightray',
                depth: 0.2
            });
        }
        [160, 760, 1370, 2050, 2680].forEach((x, i) => backgroundDecorations.push({ x, y: 375, size: 35 + (i % 3) * 12, type: 'coral_garden', depth: 0.86 }));
        [560, 1640, 2500].forEach(x => backgroundDecorations.push({ x, y: 350, type: 'sunken_arch', depth: 0.72 }));
        for (let x = 80; x < LEVEL_WIDTH; x += getDecorationCount(260, 340, 480)) backgroundDecorations.push({ x, y: 380, height: 45 + (x % 90), type: 'kelp', depth: 0.92 });
    } else if (currentLevel === 6) {
        // Castillo de las Sombras
        for (let i = 0; i < getDecorationCount(10, 7, 4); i++) {
            backgroundDecorations.push({
                x: i * 320,
                y: 100 + Math.random() * 50,
                width: 80,
                height: 280,
                type: 'castle_tower',
                depth: 0.25
            });
        }
        backgroundDecorations.push({ x: 800, y: 120, radius: 65, color1: '#ef4444', color2: '#7f1d1d', type: 'planet', depth: 0.2 });
        [460, 980, 1520, 2040, 2600].forEach((x, i) => backgroundDecorations.push({ x, y: 170, mark: i % 2, type: 'torn_banner', depth: 0.72 }));
        [730, 1810, 2820].forEach(x => backgroundDecorations.push({ x, y: 40, type: 'hanging_chain', depth: 0.88 }));
    } else if (currentLevel === 7) {
        // Luces rojas de alarma de colapso
        for (let i = 0; i < getDecorationCount(15, 8, 5); i++) {
            backgroundDecorations.push({
                x: i * 250 + Math.random() * 80,
                y: 100 + Math.random() * 120,
                width: 50 + Math.random() * 50,
                angle: -30 * (Math.PI / 180),
                type: 'lightray_red',
                depth: 0.2
            });
        }
        [260, 720, 1160, 1620, 2080, 2580, 2980].forEach((x, i) => backgroundDecorations.push({ x, y: 120 + (i % 3) * 70, world: (i % 6) + 1, type: 'world_shard', depth: 0.65 }));
        backgroundDecorations.push({ x: 3020, y: 210, type: 'dimensional_rift', depth: 0.92 });
    }
}

// ===== Construcción del mundo, interfaz y flujo de partida =====
// Reinicia y construye el nivel actual usando su plano, sus enemigos y sus reglas especiales.
function initLevel() {
    const blueprint = getCurrentBlueprint();
    const identity = getCurrentIdentity();
    resetFinalPortalSequence();
    blocks = [];
    coins = [];
    enemies = [];
    bubbles = [];
    bones = [];
    hazards = []; // Limpiamos meteoritos
    trafficCars = [];
    dogcatcher = null;
    streetBird = null;
    forestChests = [];
    bats = [];
    batSprayPickup = null;
    fallingWebs = [];
    moleHoles = [];
    tunnelMoles = [];
    bridgePlanks = [];
    poppedPowerups = [];
    playerProjectiles = [];
    player.coyoteFrames = 0;
    player.jumpBufferFrames = 0;
    player.jumpHeld = false;
    player.jumpHoldFrames = 0;
    player.sliding = false;
    player.hangingRing = null;
    player.ringDetachCooldown = 0;
    player.ringReleaseArmed = false;
    player.hangSwing = 0;
    player.attackAnimationTimer = 0;
    player.hurtAnimationTimer = 0;
    player.landingAnimationTimer = 0;
    player.celebrateAnimationTimer = 0;
    player.zombieStunTimer = 0;
    player.webStunTimer = 0;
    player.hiddenInHole = false;
    player.batSprayOwned = false;
    player.batSprayCooldown = 0;
    player.batSprayFlashTimer = 0;
    resetVampireBattle();

    boss.active = false; 
    boss.hp = 3;
    boss.x = blueprint.bossZone ? blueprint.bossZone.bossX : 4380;
    boss.y = blueprint.bossZone ? blueprint.bossZone.bossY : 280;
    boss.vx = -2.2;
    princess.jailed = true;
    princess.x = blueprint.rescueX || princess.x;
    flagpole.reached = false;
    flagpole.x = blueprint.goalX || (LEVEL_WIDTH - 330);

    // El poder pertenece al jugador, no al mapa. Al atravesar un portal
    // se limpia el mundo anterior, pero la recompensa se conserva
    // mientras Miau no haya recibido daño ni haya agotado su duración.
    if (player.powerup === 'strength' && player.powerTimer > 0) {
        player.width = player.baseWidth * 1.5;
        player.height = player.baseHeight * 1.5;
    } else {
        player.width = player.baseWidth;
        player.height = player.baseHeight;

        // La Fuerza Felina sí es temporal. El Maullido Estelar usa
        // powerTimer = 0 para indicar que dura hasta recibir daño.
        if (player.powerup === 'strength') {
            player.powerup = 'none';
            player.powerTimer = 0;
        }
    }
    updatePowerBadge();

    // Activar/Desactivar interfaz de oxígeno para el Nivel Acuático (Nivel 5)
    if (currentLevel === 5) {
        ui.oxygenBadge.style.display = 'flex';
        player.oxygen = 100;
        ui.btnDown.classList.remove('hidden');
        ui.btnDown.textContent = '⬇️';
        ui.btnDown.setAttribute('aria-label', 'Nadar hacia abajo');
        ui.btnJumpIcon.textContent = '🫧';
        ui.btnJumpText.textContent = 'NADAR';
    } else if (currentLevel === 3 && levelThreeSection === 2) {
        ui.oxygenBadge.style.display = 'none';
        ui.btnDown.classList.remove('hidden');
        ui.btnDown.textContent = '🕳️';
        ui.btnDown.setAttribute('aria-label', 'Esconderse en un agujero');
        ui.btnJumpIcon.textContent = '🦘';
        ui.btnJumpText.textContent = 'SALTAR';
    } else {
        ui.oxygenBadge.style.display = 'none';
        ui.btnDown.classList.add('hidden');
        ui.btnDown.textContent = '⬇️';
        ui.btnDown.setAttribute('aria-label', 'Nadar hacia abajo');
        ui.btnJumpIcon.textContent = '🦘';
        ui.btnJumpText.textContent = 'SALTAR';
    }

    // Activar/Desactivar interfaz de temporizador para el Nivel 7 de escape
    if (currentLevel === 7) {
        ui.timerBadge.style.display = 'flex';
        levelTimer = (blueprint.timerSeconds || 45) * 60;
        ui.levelTimerText.textContent = `${blueprint.timerSeconds || 45}`;
    } else {
        ui.timerBadge.style.display = 'none';
    }
    levelStartedAt = gameTick;
    refreshLevelHud();

    blueprint.ground.forEach(([start, end]) => {
        blocks.push({ x: start, y: 380, width: end - start, height: 70, type: 'ground', bounceOffset: 0 });
    });

    // Estas estructuras cambian de aspecto según el mundo: bancos y
    // cajas, hongos, tallos, corales o columnas de la fortaleza.
    blueprint.structures.forEach(structure => {
        blocks.push({
            x: structure.x,
            y: 380 - structure.h,
            width: 48,
            height: structure.h,
            type: 'pipe', // nombre interno conservado para no alterar las físicas
            bounceOffset: 0
        });
    });

    blueprint.platforms.forEach(layout => {
        blocks.push({
            x: layout.x,
            y: layout.y,
            width: layout.width || 32,
            height: layout.height || 32,
            type: layout.type,
            anchorY: layout.anchorY,
            ringIndex: layout.ringIndex,
            bridgeGroup: layout.bridgeGroup,
            plankIndex: layout.plankIndex,
            hasBeenHit: false,
            bounceOffset: 0
        });
    });

    if (currentLevel === 3 && levelThreeSection === 3) {
        bridgePlanks = blocks.filter(block => block.type === 'bridge_plank');
        bridgePlanks.forEach(plank => {
            plank.fallTimer = -1;
            plank.falling = false;
            plank.fallen = false;
            plank.fallVy = 0;
            plank.originalY = plank.y;
        });
    }

    // Las antiguas monedas ahora son huellas de luz: rastros de la
    // familia que guían a Miau a través de cada dimensión.
    blueprint.collectibles.forEach(([x, y], index) => {
        coins.push({ x, y, width: 18, height: 18, collected: false, bobOffset: index * 0.7 });
    });

    blueprint.enemies.forEach(spawn => {
        let eType = 'mouse'; // Nivel 1: Ratones
        if (currentLevel === 2) {
            eType = levelTwoSection === 2 ? 'zombie' : 'ghost';
        } else if (currentLevel === 3) {
            eType = 'bug'; // Nivel 3: Bichos gigantes
        } else if (currentLevel === 5) {
            eType = 'jellyfish'; // Nivel 5: Mar profundo
        }
        enemies.push(createEnemyFromSpawn(spawn, eType, enemies.length));
    });

    if (currentLevel === 3 && levelThreeSection === 1) {
        [620, 1280, 2050, 2920, 3780, 4580].forEach((x, index) => {
            fallingWebs.push({
                x,
                y: -92 - index * 13,
                width: 62,
                height: 62,
                state: 'armed',
                vy: 0,
                cooldown: index * 18,
                phase: index * 0.8
            });
        });
    }

    if (currentLevel === 3 && levelThreeSection === 2) {
        [390, 1030, 1690, 2370, 3070, 3770, 4480].forEach((x, index) => {
            moleHoles.push({ x, y: 365, width: 132, height: 24, phase: index * 0.6 });
        });
        [760, 1390, 2050, 2760, 3450, 4160, 4820].forEach((x, index) => {
            tunnelMoles.push({
                x,
                y: 347,
                width: 38,
                height: 33,
                minX: Math.max(120, x - 150),
                maxX: Math.min(5250, x + 150),
                vx: index % 2 ? 0.86 : -0.86,
                alertTimer: 0,
                spottedFlash: 0,
                phase: index * 0.7
            });
        });
    }

    // En 2.3 los cofres son disparadores: al acercarse se abren una
    // sola vez y liberan una pequeña bandada de murciélagos.
    if (currentLevel === 2 && levelTwoSection === 3) {
        (blueprint.chests || []).forEach((x, index) => {
            forestChests.push({
                x,
                y: 348,
                width: 44,
                height: 32,
                opened: false,
                phase: index * 0.7
            });
        });
        // El aerosol aparece antes del primer cofre (x=640), para que el
        // jugador conozca la defensa antes de liberar una bandada.
        batSprayPickup = {
            x: 250,
            y: 337,
            width: 24,
            height: 39,
            collected: false,
            phase: 0
        };
    }

    if (currentLevel === 1 && levelOneSection === 3) {
        trafficCars = [
            {x:900,y:334,width:78,height:46,vx:-1.75,minX:-300,maxX:5800,color:'#38bdf8',kind:'auto'},
            {x:2250,y:330,width:88,height:50,vx:-1.9,minX:-300,maxX:5800,color:'#f472b6',kind:'auto'},
            {x:3650,y:334,width:82,height:46,vx:-1.82,minX:-300,maxX:5800,color:'#4ade80',kind:'auto'},
            {x:5150,y:322,width:104,height:58,vx:-1.62,minX:-300,maxX:5800,color:'#fb923c',kind:'colectivo'}
        ].map((car, index) => ({...car, phase:index * 0.8, waiting:false}));

        dogcatcher = {
            x: -150,
            y: 314,
            width: 42,
            height: 66,
            active: true,
            runPhase: 0,
            distractedTimer: 0
        };

        streetBird = {
            x: -120,
            y: 210,
            width: 34,
            height: 24,
            triggerX: STREET_BIRD_TRIGGER_X,
            triggered: false,
            active: false,
            timer: 0,
            phase: 0
        };
    }

    // Estaciones de burbujas de aire. Permanecen en lugares útiles del
    // recorrido y reaparecen unos segundos después de ser utilizadas.
    if (currentLevel === 5) {
        const bubblePositions = [
            {x: 350, y: 300}, {x: 720, y: 220}, {x: 1120, y: 275},
            {x: 1510, y: 145}, {x: 1960, y: 185},
            {x: 2500, y: 260}, {x: 2860, y: 160},
            {x: 3480, y: 220}, {x: 4120, y: 150}, {x: 4780, y: 235}
        ];
        bubblePositions.forEach((position, index) => {
            bubbles.push({
                x: position.x,
                y: position.y,
                baseX: position.x,
                baseY: position.y,
                width: 34,
                height: 34,
                available: true,
                respawnAt: 0,
                phase: index * 0.9
            });
        });
    }
}

// Abre la tienda desde el menu principal.
function openShop() {
    playSound('click');
    ui.startScreen.classList.add('hidden');
    ui.shopScreen.classList.remove('hidden');
    updateShopUI();
    syncShellChrome();
}

// Cierra la tienda y devuelve al jugador a la pantalla inicial.
function closeShop() {
    playSound('click');
    ui.shopScreen.classList.add('hidden');
    ui.startScreen.classList.remove('hidden');
    syncWalletDisplays();
    syncShellChrome();
}

// Refresca textos, botones y estados visibles de la tienda.
function updateShopUI() {
    syncWalletDisplays();
    ui.ownedLives.textContent = shopUpgrades.extraLives;
    ui.ownedLightning.textContent = shopUpgrades.startLightning ? "Sí (Activo)" : "No";
    ui.ownedStrength.textContent = shopUpgrades.startStrength ? "Sí (Activo)" : "No";
    ui.ownedShield.textContent = shopUpgrades.shieldActive ? "Sí (Activo)" : "No";

    // Deshabilitar botones de poderes únicos si ya han sido comprados
    ui.btnBuyLightning.disabled = shopUpgrades.startLightning;
    ui.btnBuyLightning.className = shopUpgrades.startLightning ? 
        "bg-slate-800 text-slate-500 cursor-not-allowed font-bold py-1.5 px-3 rounded-lg text-xs" : 
        "bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-1.5 px-3 rounded-lg text-xs transition whitespace-nowrap";

    ui.btnBuyStrength.disabled = shopUpgrades.startStrength;
    ui.btnBuyStrength.className = shopUpgrades.startStrength ? 
        "bg-slate-800 text-slate-500 cursor-not-allowed font-bold py-1.5 px-3 rounded-lg text-xs" : 
        "bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-1.5 px-3 rounded-lg text-xs transition whitespace-nowrap";

    ui.btnBuyShield.disabled = shopUpgrades.shieldActive;
    ui.btnBuyShield.className = shopUpgrades.shieldActive ? 
        "bg-slate-800 text-slate-500 cursor-not-allowed font-bold py-1.5 px-3 rounded-lg text-xs" : 
        "bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-1.5 px-3 rounded-lg text-xs transition whitespace-nowrap";
}

// Compra una mejora si el monedero tiene suficientes huellas.
function buyItem(item, cost) {
    if (globalWallet >= cost) {
        globalWallet -= cost;
        playSound('coin');

        if (item === 'extraLives') {
            shopUpgrades.extraLives++;
        } else {
            shopUpgrades[item] = true;
        }
        saveProgress();
        updateShopUI();
    } else {
        playSound('hurt'); 
    }
}

// Reinicia las mejoras de tienda para comenzar otra progresion desde cero.
function resetShopUpgrades() {
    playSound('stomp');
    // Reembolsar el 100% de las monedas
    let refund = (shopUpgrades.extraLives * 15) + 
                 (shopUpgrades.startLightning ? 40 : 0) + 
                 (shopUpgrades.startStrength ? 60 : 0) + 
                 (shopUpgrades.shieldActive ? 30 : 0);
    
    globalWallet += refund;
    shopUpgrades = {
        extraLives: 0,
        startLightning: false,
        startStrength: false,
        shieldActive: false
    };
    saveProgress();
    updateShopUI();
}

// Inicia una partida completa o una prueba directa de nivel usando la
// misma preparación del jugador y del mundo.
function startGame(options = {}) {
    const requestedValue = String(options.startLevel ?? '1.1');
    const requestedParts = requestedValue.split('.');
    const requestedLevel = Number(requestedParts[0]);
    const startLevel = Number.isFinite(requestedLevel)
        ? Math.max(1, Math.min(7, Math.floor(requestedLevel)))
        : 1;
    const requestedSection = Number(options.startSection ?? requestedParts[1]);
    const useShopLoadout = options.useShopLoadout !== false;
    const consumeShopLoadout = useShopLoadout && options.consumeShopLoadout !== false;

    playSound('victory');
    resetInputState();
    gameTick = 0;
    currentLevel = startLevel;
    levelOneSection = currentLevel === 1 && Number.isFinite(requestedSection)
        ? Math.max(1, Math.min(3, Math.floor(requestedSection)))
        : 1;
    levelTwoSection = currentLevel === 2 && Number.isFinite(requestedSection)
        ? Math.max(1, Math.min(3, Math.floor(requestedSection)))
        : 1;
    levelThreeSection = currentLevel === 3 && Number.isFinite(requestedSection)
        ? Math.max(1, Math.min(3, Math.floor(requestedSection)))
        : 1;
    player.x = 100;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    player.jumpHeld = false;
    player.jumpHoldFrames = 0;
    
    // En modo desarrollador se puede arrancar limpio para probar una
    // etapa sin consumir ayudas ni alterar la progresión guardada.
    player.lives = useShopLoadout ? 7 + shopUpgrades.extraLives : 7;
    player.coins = 0;
    player.grounded = false;
    player.wasGrounded = false;
    player.direction = 1;
    player.invulnerable = 0;
    player.width = player.baseWidth;
    player.height = player.baseHeight;
    player.powerup = 'none';
    player.powerTimer = 0;
    player.shootCooldown = 0;
    player.attackAnimationTimer = 0;
    player.hurtAnimationTimer = 0;
    player.landingAnimationTimer = 0;
    player.celebrateAnimationTimer = 0;
    player.zombieStunTimer = 0;
    player.webStunTimer = 0;
    player.hiddenInHole = false;
    
    // Aplicar poderes de inicio solo si esta partida usa la tienda.
    if (useShopLoadout && shopUpgrades.startLightning) {
        player.powerup = 'lightning';
        player.powerTimer = 0;
    } else if (useShopLoadout && shopUpgrades.startStrength) {
        player.powerup = 'strength';
        player.powerTimer = 900; // 15 segundos (15 * 60 ticks)
        player.width = player.baseWidth * 1.5;
        player.height = player.baseHeight * 1.5;
    } else {
        player.powerup = 'none';
        player.powerTimer = 0;
    }

    // Consumir mejoras de un solo uso solo al iniciar una partida
    // normal; en modo desarrollador quedan intactas para seguir probando.
    if (consumeShopLoadout) {
        shopUpgrades.startLightning = false;
        shopUpgrades.startStrength = false;
        saveProgress();
    }

    syncHudCoins();
    syncHudLives();
    refreshLevelHud();

    updatePowerBadge();
    initBackground();
    initLevel();

    cameraX = 0;
    gameActive = true;
    isPaused = false;
    gameOver = false;

    ui.startScreen.classList.add('hidden');
    ui.gameOverlay.classList.add('hidden');
    ui.creditsScreen.classList.add('hidden');
    stopCreditsAutoScroll(true);
    syncShellChrome();

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    lastTime = performance.now();
    physicsAccumulator = 0;
    animationFrameId = requestAnimationFrame(loop);
}

// Inicia una partida de prueba en el nivel elegido desde el menu.
function startDeveloperLevel() {
    playSound('click');
    startGame({
        startLevel: ui.devLevelSelect.value || '1.1',
        useShopLoadout: ui.devUseShopUpgrades.checked,
        consumeShopLoadout: false
    });
}

// Lleva al jugador al siguiente nivel o al cierre de la aventura cuando corresponde.
function transitionNext() {
    playSound('click');
    resetInputState();
    ui.gameOverlay.classList.add('hidden');
    syncShellChrome();

    if (currentLevel === 1 && levelOneSection < 3) {
        levelOneSection++;
        refreshLevelHud();
        player.x = 100;
        player.y = 300;
        player.vx = 0;
        player.vy = 0;
        player.jumpHeld = false;
        player.jumpHoldFrames = 0;
        player.invulnerable = 0;
        cameraX = 0;

        initBackground();
        initLevel();

        gameActive = true;
        isPaused = false;
        gameOver = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        lastTime = performance.now();
        physicsAccumulator = 0;
        animationFrameId = requestAnimationFrame(loop);
        syncShellChrome();
    } else if (currentLevel === 2 && levelTwoSection < 3) {
        levelTwoSection++;
        refreshLevelHud();
        player.x = 100;
        player.y = 300;
        player.vx = 0;
        player.vy = 0;
        player.jumpHeld = false;
        player.jumpHoldFrames = 0;
        player.invulnerable = 0;
        player.zombieStunTimer = 0;
        cameraX = 0;

        initBackground();
        initLevel();

        gameActive = true;
        isPaused = false;
        gameOver = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        lastTime = performance.now();
        physicsAccumulator = 0;
        animationFrameId = requestAnimationFrame(loop);
        syncShellChrome();
    } else if (currentLevel === 3 && levelThreeSection < 3) {
        levelThreeSection++;
        refreshLevelHud();
        player.x = 100;
        player.y = 300;
        player.vx = 0;
        player.vy = 0;
        player.jumpHeld = false;
        player.jumpHoldFrames = 0;
        player.invulnerable = 0;
        player.webStunTimer = 0;
        player.hiddenInHole = false;
        cameraX = 0;

        initBackground();
        initLevel();

        gameActive = true;
        isPaused = false;
        gameOver = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        lastTime = performance.now();
        physicsAccumulator = 0;
        animationFrameId = requestAnimationFrame(loop);
        syncShellChrome();
    } else if (currentLevel < 7) {
        grantInterLevelReward(currentLevel);
        currentLevel++;
        levelOneSection = 1;
        levelTwoSection = 1;
        levelThreeSection = 1;
        refreshLevelHud();
        player.x = 100;
        player.y = 300;
        player.vx = 0;
        player.vy = 0;
        player.jumpHeld = false;
        player.jumpHoldFrames = 0;
        player.invulnerable = 0;
        player.zombieStunTimer = 0;
        cameraX = 0;
        
        initBackground();
        initLevel();
        
        gameActive = true;
        isPaused = false;
        gameOver = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        lastTime = performance.now();
        physicsAccumulator = 0;
        animationFrameId = requestAnimationFrame(loop);
        syncShellChrome();
    } else {
        gameActive = false;
        resetToMain();
    }
}

// Devuelve al menu principal y restablece el estado visual basico.
function resetToMain() {
    resetInputState();
    if (cutsceneAnimationFrameId) cancelAnimationFrame(cutsceneAnimationFrameId);
    cutsceneAnimationFrameId = null;
    cutsceneActive = false;
    cutsceneStartTime = null;
    setCutsceneVisible(false);
    clearCreditsAnimations();
    resetFinalPortalSequence();
    ui.creditsPanel.classList.remove('opacity-0', 'translate-y-6', 'scale-[0.98]');
    ui.creditsList.classList.remove('opacity-0');
    ui.creditsStoryline.classList.remove('opacity-0', 'translate-y-4');
    ui.creditsScreen.classList.add('hidden');
    ui.gameOverlay.classList.add('hidden');
    ui.startScreen.classList.remove('hidden');
    syncWalletDisplays();
    syncShellChrome();
}

function resetFinalPortalSequence() {
    finalPortalSequence.active = false;
    finalPortalSequence.phase = 'idle';
    finalPortalSequence.timer = 0;
    finalPortalSequence.collapse = 0;
    finalPortalSequence.shatter = 0;
    finalPortalSequence.fade = 0;
    finalPortalSequence.pulse = 0;
    finalPortalSequence.beam = 0;
    finalPortalSequence.flash = 0;
    finalPortalSequence.homeGlow = 0;
    finalPortalSequence.message = '';
    finalPortalSequence.detail = '';
    finalPortalSequence.playerAlpha = 1;
    finalPortalSequence.shardsSpawned = false;
}

function stopCreditsAutoScroll(resetPosition = false) {
    if (creditsScrollFrameId) {
        cancelAnimationFrame(creditsScrollFrameId);
        creditsScrollFrameId = null;
    }
    if (resetPosition && ui.creditsViewport) {
        ui.creditsViewport.scrollTop = 0;
    }
}

function clearCreditsAnimations() {
    creditsAnimationTimers.forEach(timerId => window.clearTimeout(timerId));
    creditsAnimationTimers = [];
    stopCreditsAutoScroll(true);
}

function startCreditsAutoScroll() {
    stopCreditsAutoScroll(false);
    if (!ui.creditsViewport) return;

    const viewport = ui.creditsViewport;
    viewport.scrollTop = 0;
    let lastTime = 0;
    let pauseUntil = performance.now() + 1700;

    const step = (timestamp) => {
        if (ui.creditsScreen.classList.contains('hidden')) {
            creditsScrollFrameId = null;
            return;
        }

        if (!lastTime) lastTime = timestamp;
        const delta = Math.min(34, timestamp - lastTime);
        lastTime = timestamp;

        if (timestamp >= pauseUntil) {
            const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
            if (maxScroll > 0) {
                viewport.scrollTop = Math.min(maxScroll, viewport.scrollTop + delta * 0.018);
            }
        }

        creditsScrollFrameId = requestAnimationFrame(step);
    };

    creditsScrollFrameId = requestAnimationFrame(step);
}

function renderCreditsStoryline(entries = CREDITS_JOURNEY) {
    ui.creditsStoryline.innerHTML = entries.map((entry, index) => `
        <div class="rounded-2xl border ${index === entries.length - 1 ? 'border-emerald-400/35 bg-emerald-950/20' : 'border-indigo-500/20 bg-slate-950/45'} px-3 py-3">
            <p class="text-lg">${entry.icon}</p>
            <p class="mt-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cyan-300">${entry.title}</p>
            <p class="mt-2 leading-relaxed text-indigo-100/90">${entry.text}</p>
        </div>
    `).join('');
}

function renderCreditsList(entries = DEFAULT_CREDITS) {
    ui.creditsList.innerHTML = entries.map((entry, index) => `
        <div class="credits-card-glow rounded-3xl border border-indigo-500/20 bg-slate-950/55 px-4 py-4 md:px-5 md:py-5" style="animation-delay:${index * 0.22}s">
            <p class="text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-300">Bloque ${String(index + 1).padStart(2, '0')}</p>
            <p class="mt-2 text-xs uppercase tracking-[0.18em] text-indigo-300">${entry.role}</p>
            <p class="mt-2 text-lg font-bold text-white">${entry.names.join(' • ')}</p>
            <p class="mt-2 text-sm leading-relaxed text-indigo-100/85">${entry.detail || ''}</p>
        </div>
    `).join('') + `
        <div class="rounded-3xl border border-emerald-400/25 bg-emerald-950/15 px-4 py-5 text-center">
            <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-300">Fin del Viaje</p>
            <p class="mt-2 text-xl font-bold text-white">Super Miau volvió a casa</p>
            <p class="mt-2 text-sm leading-relaxed text-emerald-100/85">Cuando me pases los nombres finales, esta sección ya queda lista para recibirlos con una presentación mucho más linda.</p>
        </div>
    `;
}

function showCreditsScreen() {
    gameActive = false;
    resetInputState();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    clearCreditsAnimations();
    renderCreditsStoryline();
    renderCreditsList();
    ui.creditsViewport.scrollTop = 0;
    ui.creditsKicker.textContent = 'Epílogo';
    ui.creditsTitle.textContent = 'El regreso al Parque Sureño';
    ui.creditsLead.textContent = 'La última grieta se rompe en el cielo y la noche vuelve a respirar. Super Miau ya no corre para escapar: ahora corre hacia casa.';
    ui.creditsHint.textContent = 'Un pequeño momento de calma antes de ver todo el viaje completo.';
    ui.creditsThanks.textContent = 'La lista se moverá sola después de un instante, pero podés deslizarla si querés leer con calma.';
    ui.creditsPanel.classList.add('opacity-0', 'translate-y-6', 'scale-[0.98]');
    ui.creditsList.classList.add('opacity-0');
    ui.creditsStoryline.classList.add('opacity-0', 'translate-y-4');
    ui.gameOverlay.classList.add('hidden');
    ui.creditsScreen.classList.remove('hidden');
    syncShellChrome();
    requestAnimationFrame(() => {
        ui.creditsPanel.classList.remove('opacity-0', 'translate-y-6', 'scale-[0.98]');
    });
    creditsAnimationTimers.push(window.setTimeout(() => {
        ui.creditsKicker.textContent = 'Créditos';
        ui.creditsTitle.textContent = 'Super Miau: Final del Viaje';
        ui.creditsLead.textContent = 'Cada mundo dejó una marca distinta, pero todos terminaron empujando a Miau hacia el mismo lugar: su familia y su hogar.';
        ui.creditsHint.textContent = 'Gracias por jugar a Super Miau.';
        ui.creditsList.classList.remove('opacity-0');
        ui.creditsStoryline.classList.remove('opacity-0', 'translate-y-4');
    }, 1100));
    creditsAnimationTimers.push(window.setTimeout(() => {
        startCreditsAutoScroll();
        ui.creditsHint.textContent = 'Los créditos avanzan solos. Podés frenar y releer cuando quieras.';
    }, 1850));
    creditsAnimationTimers.push(window.setTimeout(() => {
        ui.creditsThanks.textContent = 'Gracias por acompañar a Super Miau hasta el final. Solo faltan los nombres definitivos.';
    }, 3200));
}

function restartFromCredits() {
    playSound('click');
    clearCreditsAnimations();
    ui.creditsScreen.classList.add('hidden');
    syncShellChrome();
    startGame();
}

function closeCreditsToMenu() {
    playSound('click');
    clearCreditsAnimations();
    ui.creditsScreen.classList.add('hidden');
    syncShellChrome();
    resetToMain();
}

function startFinalPortalSequence() {
    finalPortalSequence.active = true;
    finalPortalSequence.phase = 'approach';
    finalPortalSequence.timer = 62;
    finalPortalSequence.collapse = 0;
    finalPortalSequence.shatter = 0;
    finalPortalSequence.fade = 0;
    finalPortalSequence.pulse = 0;
    finalPortalSequence.beam = 0;
    finalPortalSequence.flash = 0;
    finalPortalSequence.homeGlow = 0;
    finalPortalSequence.message = 'La familia ya cruzó el portal';
    finalPortalSequence.detail = 'Miau da el último paso antes de cerrar la grieta.';
    finalPortalSequence.playerAlpha = 1;
    finalPortalSequence.shardsSpawned = false;
    flagpole.reached = true;
    player.vx = 0;
    player.vy = 0;
    player.jumpHeld = false;
    player.jumpHoldFrames = 0;
    player.invulnerable = 9999;
    triggerShake(22, 5);
    playSound('victory');
    playSound('portalCharge');
}

function updateFinalPortalSequence() {
    if (!finalPortalSequence.active) return false;

    const portalCenterX = flagpole.x + flagpole.width / 2 - player.width / 2;
    const portalGroundY = 334;
    player.x = approach(player.x, portalCenterX, 2.5);
    player.y = approach(player.y, portalGroundY, 3.2);
    player.vx = 0;
    player.vy = 0;
    player.isMoving = false;
    player.grounded = true;
    player.wasGrounded = true;

    const portalWorldCenterX = flagpole.x + flagpole.width / 2;
    const portalWorldCenterY = flagpole.y + flagpole.height / 2;
    cameraX = Math.max(0, Math.min(LEVEL_WIDTH - canvas.width, portalWorldCenterX - canvas.width * 0.58));

    finalPortalSequence.flash = Math.max(0, finalPortalSequence.flash - 0.035);
    finalPortalSequence.homeGlow = Math.min(1, finalPortalSequence.homeGlow + (finalPortalSequence.phase === 'reunion' || finalPortalSequence.phase === 'afterglow' || finalPortalSequence.phase === 'fade' ? 0.018 : 0));

    if (gameTick % 2 === 0) {
        particles.push(new Particle(
            portalWorldCenterX + (Math.random() - 0.5) * 18,
            portalWorldCenterY + (Math.random() - 0.5) * 55,
            (Math.random() - 0.5) * 1.1,
            -Math.random() * 1.8,
            '#6ee7b7',
            2.5,
            22,
            'electricity'
        ));
    }

    finalPortalSequence.timer--;

    if (finalPortalSequence.phase === 'approach') {
        finalPortalSequence.pulse = Math.min(0.45, finalPortalSequence.pulse + 0.014);
        if (finalPortalSequence.timer <= 0 || Math.abs(player.x - portalCenterX) < 2.5) {
            finalPortalSequence.phase = 'stabilize';
            finalPortalSequence.timer = 38;
            finalPortalSequence.message = 'El portal intenta resistir';
            finalPortalSequence.detail = 'Todo el cielo vibra mientras la grieta busca quedarse abierta.';
            triggerShake(16, 4);
            playSound('portalCharge');
        }
    } else if (finalPortalSequence.phase === 'stabilize') {
        finalPortalSequence.pulse = 0.35 + Math.sin((38 - finalPortalSequence.timer) * 0.18) * 0.12;
        finalPortalSequence.beam = Math.min(0.55, (38 - finalPortalSequence.timer) / 68);
        finalPortalSequence.collapse = Math.max(0, Math.sin((38 - finalPortalSequence.timer) * 0.12) * 0.08);
        if (finalPortalSequence.timer <= 0) {
            finalPortalSequence.phase = 'surge';
            finalPortalSequence.timer = 40;
            finalPortalSequence.message = 'La energía del regreso atraviesa el cielo';
            finalPortalSequence.detail = 'La ciudad vuelve a aparecer detrás del brillo.';
            finalPortalSequence.flash = 0.55;
            finalPortalSequence.beam = 0.72;
            triggerShake(22, 6);
        }
    } else if (finalPortalSequence.phase === 'surge') {
        finalPortalSequence.pulse = 0.5 + Math.sin((40 - finalPortalSequence.timer) * 0.3) * 0.15;
        finalPortalSequence.beam = Math.min(1, 0.72 + (40 - finalPortalSequence.timer) / 50);
        if (gameTick % 3 === 0) {
            particles.push(new Particle(
                portalWorldCenterX + (Math.random() - 0.5) * 30,
                portalWorldCenterY + 8,
                (Math.random() - 0.5) * 1.8,
                -3.8 - Math.random() * 1.8,
                Math.random() > 0.45 ? '#a7f3d0' : '#93c5fd',
                3 + Math.random() * 3,
                28,
                'electricity'
            ));
        }
        if (finalPortalSequence.timer <= 0) {
            finalPortalSequence.phase = 'closing';
            finalPortalSequence.timer = 60;
            finalPortalSequence.message = 'La grieta se pliega sobre sí misma';
            finalPortalSequence.detail = 'Nada podrá volver a arrastrar a la familia lejos de casa.';
            triggerShake(28, 8);
        }
    } else if (finalPortalSequence.phase === 'closing') {
        finalPortalSequence.collapse = 1 - (finalPortalSequence.timer / 60);
        finalPortalSequence.pulse = Math.max(0.15, 0.8 - finalPortalSequence.collapse * 0.5);
        finalPortalSequence.beam = Math.max(0.18, 1 - finalPortalSequence.collapse * 0.75);
        finalPortalSequence.playerAlpha = Math.max(0.2, 1 - finalPortalSequence.collapse * 0.92);
        if (finalPortalSequence.timer <= 0) {
            finalPortalSequence.phase = 'shatter';
            finalPortalSequence.timer = 54;
            finalPortalSequence.message = 'El último portal estalla en mil luces';
            finalPortalSequence.detail = 'Ya no queda regreso posible, solo la casa esperando.';
            finalPortalSequence.playerAlpha = 0;
            finalPortalSequence.flash = 0.95;
            triggerShake(38, 11);
            playSound('portalBurst');
        }
    } else if (finalPortalSequence.phase === 'shatter') {
        finalPortalSequence.shatter = 1 - (finalPortalSequence.timer / 54);
        finalPortalSequence.pulse = Math.max(0, 0.5 - finalPortalSequence.shatter * 0.5);
        finalPortalSequence.beam = Math.max(0, 0.42 - finalPortalSequence.shatter * 0.42);
        if (!finalPortalSequence.shardsSpawned) {
            finalPortalSequence.shardsSpawned = true;
            for (let i = 0; i < 42; i++) {
                particles.push(new Particle(
                    portalWorldCenterX,
                    portalWorldCenterY - 8,
                    (Math.random() - 0.5) * 7.2,
                    (Math.random() - 0.5) * 6.2,
                    i % 3 === 0 ? '#fde68a' : (i % 2 === 0 ? '#a7f3d0' : '#e9d5ff'),
                    3 + Math.random() * 3,
                    38,
                    'magic'
                ));
            }
        }
        if (finalPortalSequence.timer <= 0) {
            finalPortalSequence.phase = 'reunion';
            finalPortalSequence.timer = 42;
            finalPortalSequence.message = 'La ciudad vuelve a encenderse';
            finalPortalSequence.detail = 'El Parque Sureño ya está del otro lado del resplandor.';
            finalPortalSequence.flash = 0.4;
            playSound('victory');
        }
    } else if (finalPortalSequence.phase === 'reunion') {
        finalPortalSequence.homeGlow = Math.min(1, finalPortalSequence.homeGlow + 0.028);
        finalPortalSequence.fade = Math.max(0, (42 - finalPortalSequence.timer) / 140);
        if (gameTick % 4 === 0) {
            particles.push(new Particle(
                portalWorldCenterX + (Math.random() - 0.5) * 90,
                100 + Math.random() * 150,
                (Math.random() - 0.5) * 1.2,
                0.5 + Math.random() * 1.2,
                Math.random() > 0.5 ? '#fde68a' : '#86efac',
                2 + Math.random() * 2,
                26,
                'magic'
            ));
        }
        if (finalPortalSequence.timer <= 0) {
            finalPortalSequence.phase = 'afterglow';
            finalPortalSequence.timer = 42;
            finalPortalSequence.message = 'La noche por fin se queda en silencio';
            finalPortalSequence.detail = 'Solo queda respirar, mirar el cielo y volver a casa.';
        }
    } else if (finalPortalSequence.phase === 'afterglow') {
        finalPortalSequence.fade = Math.max(0.12, (42 - finalPortalSequence.timer) / 105);
        if (finalPortalSequence.timer <= 0) {
            finalPortalSequence.phase = 'fade';
            finalPortalSequence.timer = 62;
            finalPortalSequence.message = 'Super Miau volvió a casa';
            finalPortalSequence.detail = 'La aventura baja el ritmo antes de abrir los créditos.';
        }
    } else if (finalPortalSequence.phase === 'fade') {
        finalPortalSequence.fade = 1 - (finalPortalSequence.timer / 62);
        if (finalPortalSequence.timer <= 0) {
            resetFinalPortalSequence();
            showCreditsScreen();
            return true;
        }
    }

    return true;
}

// Gestiona el da?o recibido, las vidas restantes y los mensajes de derrota o continuidad.
function handlePlayerDeath() {
    if (player.powerup !== 'none') {
        player.powerup = 'none';
        player.powerTimer = 0;
        player.width = player.baseWidth;
        player.height = player.baseHeight;
        updatePowerBadge();
    }

    player.lives--;
    player.hurtAnimationTimer = 24;
    player.zombieStunTimer = 0;
    player.webStunTimer = 0;
    player.hiddenInHole = false;
    syncHudLives();
    playSound('hurt');
    triggerShake(20, 10); 

    if (player.lives <= 0) {
        gameActive = false;
        playSound('gameover');
        showOverlay('💀', '¡FIN DEL JUEGO!', '¡Te has quedado sin vidas estelares!', 'Volver a Intentar 🔄', () => {
            startGame();
        });
    } else {
        player.x = Math.max(100, cameraX + 50);
        player.y = 100;
        player.vx = 0;
        player.vy = 0;
        player.jumpHeld = false;
        player.jumpHoldFrames = 0;
        player.sliding = false;
        player.hangingRing = null;
        player.ringDetachCooldown = 0;
        player.ringReleaseArmed = false;
        player.hangSwing = 0;
        player.invulnerable = 70; 

        // Resetear el temporizador si estamos en el nivel 7 para dar un respiro al reaparecer
        if (currentLevel === 7) {
            levelTimer = (MAP_BLUEPRINTS[7].timerSeconds || 45) * 60;
            ui.levelTimerText.textContent = `${MAP_BLUEPRINTS[7].timerSeconds || 45}`;
        }
    }
}

// Muestra paneles informativos entre niveles, pausas o finales con botones reutilizables.
function showOverlay(emoji, title, msg, btnText = "Siguiente ➡️", action = transitionNext, showMenuBtn = false) {
    ui.overlayEmoji.textContent = emoji;
    ui.overlayTitle.textContent = title;
    ui.overlayMessage.textContent = msg;
    ui.overlayButton.textContent = btnText;
    ui.overlayButton.onclick = action;

    const menuBtn = ui.overlayMenuButton;
    if (showMenuBtn) {
        menuBtn.classList.remove('hidden');
    } else {
        menuBtn.classList.add('hidden');
    }

    ui.gameOverlay.classList.remove('hidden');
    syncShellChrome();
}

// Alterna entre juego activo y pausa sin perder el estado de la partida.
function togglePause() {
    if (!gameActive || gameOver) return;
    isPaused = !isPaused;
    if (isPaused) {
        playSound('click');
        showOverlay('⏸️', 'Juego Pausado', 'Súper Miau está tomando un descanso. ¿Qué deseas hacer?', 'Reanudar ▶️', () => {
            togglePause();
        }, true);
    } else {
        playSound('click');
        ui.gameOverlay.classList.add('hidden');
        syncShellChrome();
        lastTime = performance.now();
        physicsAccumulator = 0;
    }
}

// Pide confirmacion antes de abandonar la partida actual.
function confirmGoToMainMenu() {
    if (!gameActive) return;
    isPaused = true;
    playSound('click');
    showOverlay(
        '🏠', 
        '¿Salir al Menú?', 
        'Si sales perderás el progreso de la partida actual, pero conservarás las huellas de luz reunidas.', 
        'Seguir Jugando ▶️', 
        () => {
            isPaused = false;
            ui.gameOverlay.classList.add('hidden');
            syncShellChrome();
            lastTime = performance.now();
            physicsAccumulator = 0;
        }, 
        true
    );
}

// Sale de la partida y vuelve al menu principal limpiando overlays y animaciones.
function goToMainMenu() {
    playSound('click');
    resetInputState();
    gameActive = false;
    isPaused = false;
    cutsceneActive = false;
    resetFinalPortalSequence();
    if (cutsceneAnimationFrameId) cancelAnimationFrame(cutsceneAnimationFrameId);
    cutsceneAnimationFrameId = null;
    cutsceneStartTime = null;
    setCutsceneVisible(false);
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    ui.gameOverlay.classList.add('hidden');
    ui.creditsScreen.classList.add('hidden');
    ui.startScreen.classList.remove('hidden');
    syncWalletDisplays();
    syncShellChrome();
}

// Inputs Teclado
window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        toggleDeveloperPanel();
        return;
    }
    if (cutsceneActive) {
        if (e.key === ' ' || e.code === 'Space' || e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            skipCutscene();
        }
        if (e.key === 'F3') {
            e.preventDefault();
            toggleDebugHud();
        }
        return;
    }
    if (e.key === 'F3') {
        e.preventDefault();
        toggleDebugHud();
        return;
    }
    keys[e.key] = true;
    if (['Space', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) || ((currentLevel === 5 || (currentLevel === 3 && levelThreeSection === 2)) && (e.key === 's' || e.key === 'S'))) {
        e.preventDefault();
    }
    if (e.key === 'f' || e.key === 'F' || e.key === 'Shift') {
        if (currentLevel === 2 && levelTwoSection === 3 && player.batSprayOwned && player.batSprayCooldown === 0) {
            useBatSpray();
        } else if (player.powerup === 'lightning' && player.shootCooldown === 0) {
            shootLightning();
        }
    }
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        togglePause();
    }
});
window.addEventListener('keyup', e => {
    keys[e.key] = false;
});
window.addEventListener('blur', resetInputState);

// Inputs Táctiles
// Conecta los botones tactiles con las mismas teclas virtuales usadas por teclado.
function setupTouch(btnId, keyName) {
    const el = document.getElementById(btnId);
    const activate = (e) => {
        e.preventDefault();
        keys[keyName] = true;
    };
    const release = (e) => {
        e.preventDefault();
        keys[keyName] = false;
    };
    el.addEventListener('touchstart', activate, { passive: false });
    el.addEventListener('touchend', release, { passive: false });
    el.addEventListener('touchcancel', release, { passive: false });
}
setupTouch('btnLeft', 'ArrowLeft');
setupTouch('btnRight', 'ArrowRight');
setupTouch('btnDown', 'ArrowDown');
setupTouch('btnJump', 'ArrowUp');

ui.btnShoot.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (currentLevel === 2 && levelTwoSection === 3 && player.batSprayOwned && player.batSprayCooldown === 0) {
        useBatSpray();
    } else if (player.powerup === 'lightning' && player.shootCooldown === 0) {
        shootLightning();
    }
});

// Comprueba si dos rectangulos se tocan para resolver colisiones del juego.
function checkCollision(r1, r2) {
    return r1.x < r2.x + r2.width &&
           r1.x + r1.width > r2.x &&
           r1.y < r2.y + r2.height &&
           r1.y + r1.height > r2.y;
}

function isSwingMechanicSection() {
    return (currentLevel === 1 && levelOneSection === 2) ||
        (currentLevel === 3 && levelThreeSection === 3);
}

// El tobogán, los aros y las lianas usan geometría propia. Las tablas
// que ya están cayendo dejan de ser sólidas inmediatamente.
function isPlaygroundNonSolid(block) {
    if (currentLevel === 1 && levelOneSection === 2 &&
        (block.type === 'play_slide_slope' || block.type === 'hanging_ring')) return true;
    if (currentLevel === 3 && levelThreeSection === 3) {
        if (block.type === 'hanging_vine') return true;
        if (block.type === 'bridge_plank' && block.falling) return true;
    }
    return false;
}

function getSlideSurfaceY(slide, worldX) {
    const progress = Math.max(0, Math.min(1, (worldX - slide.x) / slide.width));
    return slide.y + progress * slide.height;
}

function getRingSwingOffset(ring) {
    const isVine = ring.type === 'hanging_vine';
    const idleSwing = Math.sin(gameTick * (isVine ? 0.035 : 0.045) + (ring.ringIndex || 0) * 0.8) * (isVine ? 16 : 3.5);
    const playerSwing = player.hangingRing === ring ? player.hangSwing * (isVine ? 34 : 13) : 0;
    return idleSwing + playerSwing;
}

function getRingCenter(ring) {
    return {
        x: ring.x + ring.width / 2 + getRingSwingOffset(ring),
        y: ring.y + ring.height / 2
    };
}

// Mientras Miau está agarrado, izquierda/derecha hacen crecer el
// balanceo. Para soltarse hay que liberar SALTAR y pulsarlo de nuevo.
function updateActiveRingHang(horizontalInput, upPressed) {
    if (!isSwingMechanicSection() || !player.hangingRing) return false;

    const ring = player.hangingRing;
    if (!blocks.includes(ring)) {
        player.hangingRing = null;
        return false;
    }

    if (!upPressed) player.ringReleaseArmed = true;
    const freshJumpPress = upPressed && !player.jumpHeld;

    if (freshJumpPress && player.ringReleaseArmed) {
        const launchDirection = horizontalInput || player.direction || 1;
        player.hangingRing = null;
        player.ringDetachCooldown = 18;
        player.ringReleaseArmed = false;
        const isVine = ring.type === 'hanging_vine';
        player.vx = launchDirection * ((isVine ? 6.5 : 5.8) + Math.abs(player.hangSwing) * (isVine ? 1.4 : 1.1));
        player.vy = isVine ? -9.5 : -10.2;
        player.grounded = false;
        player.coyoteFrames = 0;
        player.jumpBufferFrames = 0;
        player.jumpHoldFrames = 6;
        player.direction = launchDirection;
        playSound('jump');
        return false;
    }

    player.hangSwing = approach(player.hangSwing, horizontalInput, horizontalInput === 0 ? 0.035 : 0.075);
    const center = getRingCenter(ring);
    player.x = center.x - player.width / 2;
    player.y = center.y + ring.height * 0.18;
    player.vx = 0;
    player.vy = 0;
    player.grounded = false;
    player.sliding = false;
    if (horizontalInput !== 0) player.direction = horizontalInput;
    return true;
}

// Convierte la pendiente dibujada en una superficie jugable. Al caer
// sobre ella, Miau queda pegado a la curva y gana impulso hacia abajo.
function updatePlaygroundSlide(previousBottom) {
    if (currentLevel !== 1 || levelOneSection !== 2 || player.hangingRing) return;

    const centerX = player.x + player.width / 2;
    const currentBottom = player.y + player.height;
    player.sliding = false;

    for (const slide of blocks) {
        if (slide.type !== 'play_slide_slope') continue;
        if (centerX < slide.x - 2 || centerX > slide.x + slide.width + 2) continue;

        const surfaceY = getSlideSurfaceY(slide, centerX);
        const closeToSurface = currentBottom >= surfaceY - 9 && currentBottom <= surfaceY + 23;
        const arrivedFromAbove = previousBottom <= surfaceY + 18;

        if (player.vy >= -0.5 && closeToSurface && arrivedFromAbove) {
            player.y = surfaceY - player.height;
            player.vy = 0;
            player.vx = Math.max(6.05, player.vx + 0.18);
            player.direction = 1;
            player.grounded = true;
            player.sliding = true;
            player.isMoving = true;

            if (gameTick % 8 === 0) {
                particles.push(new Particle(
                    player.x + player.width * 0.35,
                    player.y + player.height,
                    -1.3,
                    -0.6,
                    'rgba(191,219,254,.65)',
                    4,
                    14,
                    'dust'
                ));
            }
            break;
        }
    }
}

// Si Miau atraviesa un aro en el aire, se agarra automáticamente. De
// este modo funciona igual con teclado y con los controles táctiles.
function tryAttachToPlaygroundRing() {
    if (!isSwingMechanicSection() || player.grounded || player.hangingRing || player.ringDetachCooldown > 0) return;

    const playerCenterX = player.x + player.width / 2;
    const playerGripY = player.y + Math.min(13, player.height * 0.42);

    for (const ring of blocks) {
        if (ring.type !== 'hanging_ring' && ring.type !== 'hanging_vine') continue;
        const center = getRingCenter(ring);
        const dx = playerCenterX - center.x;
        const dy = playerGripY - center.y;
        if (Math.abs(dx) <= ring.width * 0.82 && Math.abs(dy) <= ring.height * 1.25) {
            player.hangingRing = ring;
            player.ringReleaseArmed = false;
            player.hangSwing = Math.max(-0.8, Math.min(0.8, player.vx / 5.5));
            player.vx = 0;
            player.vy = 0;
            player.coyoteFrames = 0;
            player.jumpBufferFrames = 0;
            player.jumpHoldFrames = 0;
            player.sliding = false;
            playSound('coin');
            break;
        }
    }
}

function armBridgeCascade(triggerPlank) {
    if (currentLevel !== 3 || levelThreeSection !== 3 || !triggerPlank || triggerPlank.falling) return;
    bridgePlanks.forEach(plank => {
        if (plank.bridgeGroup !== triggerPlank.bridgeGroup || plank.falling || plank.fallTimer >= 0) return;
        const distance = Math.abs((plank.plankIndex || 0) - (triggerPlank.plankIndex || 0));
        plank.fallTimer = 54 + distance * 11;
    });
}

function resetWebTrap(web, delay = 230) {
    web.state = 'armed';
    web.y = -90;
    web.vy = 0;
    web.cooldown = delay;
}

// Mecánicas exclusivas de 3.1, 3.2 y 3.3. Se actualizan antes de leer
// el movimiento para que un escondite o una telaraña bloqueen los
// controles en el mismo fotograma en el que se activan.
function updateLevelThreeMechanics() {
    if (currentLevel !== 3) {
        player.hiddenInHole = false;
        return;
    }

    if (levelThreeSection === 1) {
        player.hiddenInHole = false;
        fallingWebs.forEach(web => {
            if (web.cooldown > 0) web.cooldown--;
            if (web.state === 'armed') {
                const playerCenter = player.x + player.width / 2;
                if (web.cooldown <= 0 && Math.abs(playerCenter - web.x) < 118) {
                    web.state = 'falling';
                    web.y = -58;
                    web.vy = 3.4;
                }
                return;
            }

            web.vy = Math.min(9.5, web.vy + 0.22);
            web.y += web.vy;
            const webHitbox = { x: web.x - web.width / 2, y: web.y, width: web.width, height: web.height };
            if (player.webStunTimer <= 0 && checkCollision(player, webHitbox)) {
                player.webStunTimer = 300;
                player.vx = 0;
                player.vy = 0;
                player.jumpHeld = false;
                player.jumpHoldFrames = 0;
                playSound('hurt');
                triggerShake(12, 4);
                for (let i = 0; i < 12; i++) {
                    particles.push(new Particle(player.x + player.width / 2, player.y + player.height / 2, (Math.random() - .5) * 3, -Math.random() * 2, '#e2e8f0', 2.5, 26, 'spark'));
                }
                resetWebTrap(web, 330);
            } else if (web.y > 405) {
                resetWebTrap(web, 220);
            }
        });
        return;
    }

    if (levelThreeSection === 2) {
        const hidePressed = !!(keys['ArrowDown'] || keys['s'] || keys['S']);
        const playerCenter = player.x + player.width / 2;
        const currentHole = moleHoles.find(hole => playerCenter >= hole.x && playerCenter <= hole.x + hole.width);
        const canHide = currentHole && player.y + player.height >= 344;
        const wasHidden = player.hiddenInHole;
        player.hiddenInHole = !!(hidePressed && canHide);

        if (player.hiddenInHole) {
            player.x = Math.max(currentHole.x + 12, Math.min(currentHole.x + currentHole.width - player.width - 12, player.x));
            player.y = 348;
            player.vx = 0;
            player.vy = 0;
            player.grounded = true;
            player.jumpHeld = false;
            player.jumpHoldFrames = 0;
            if (!wasHidden) playSound('coin');
        }

        for (const mole of tunnelMoles) {
            if (mole.spottedFlash > 0) mole.spottedFlash--;
            if (mole.alertTimer > 0) mole.alertTimer--;

            const direction = mole.vx >= 0 ? 1 : -1;
            const dx = (player.x + player.width / 2) - (mole.x + mole.width / 2);
            const seesPlayer = !player.hiddenInHole && Math.abs(dx) < 245 && dx * direction > 0 && player.y + player.height > 318;
            if (seesPlayer) {
                mole.alertTimer = 95;
                mole.spottedFlash = 24;
            }

            if (mole.alertTimer > 0 && !player.hiddenInHole) {
                mole.vx = dx < 0 ? -1.75 : 1.75;
            } else if (Math.abs(mole.vx) > .95) {
                mole.vx = approach(mole.vx, (mole.vx >= 0 ? 1 : -1) * .86, .06);
            }

            mole.x += mole.vx;
            if (mole.x <= mole.minX) {
                mole.x = mole.minX;
                mole.vx = Math.abs(mole.vx) || .86;
            } else if (mole.x >= mole.maxX - mole.width) {
                mole.x = mole.maxX - mole.width;
                mole.vx = -(Math.abs(mole.vx) || .86);
            }

            if (!player.hiddenInHole && player.invulnerable <= 0 && checkCollision(player, mole)) {
                player.invulnerable = shopUpgrades.shieldActive ? 130 : 65;
                handlePlayerDeath();
                return;
            }
        }
        return;
    }

    player.hiddenInHole = false;
    bridgePlanks.forEach(plank => {
        if (plank.fallen) return;
        if (plank.fallTimer >= 0 && !plank.falling) {
            plank.fallTimer--;
            if (plank.fallTimer <= 0) {
                plank.falling = true;
                plank.fallVy = 1.1 + (plank.plankIndex % 3) * .16;
                playSound('stomp');
            }
        }
        if (plank.falling) {
            plank.fallVy = Math.min(10, plank.fallVy + .32);
            plank.y += plank.fallVy;
            if (plank.y > WORLD_HEIGHT + 70) plank.fallen = true;
        }
    });
}

function getStreetSignalState(worldX) {
    let crossing = STREET_CROSSINGS[0];
    let bestDistance = Infinity;
    for (const candidate of STREET_CROSSINGS) {
        const distance = Math.abs(candidate.x - worldX);
        if (distance < bestDistance) {
            bestDistance = distance;
            crossing = candidate;
        }
    }

    const streetElapsed = Math.max(0, gameTick - levelStartedAt);
    const phase = (streetElapsed + crossing.offset) % STREET_SIGNAL_CYCLE;
    const carsStopped = phase < STREET_RED_TICKS;
    const crosswalkClear = !trafficCars.some(car =>
        car.x < crossing.x + 136 &&
        car.x + car.width > crossing.x - 8
    );
    return {
        crossing,
        carsStopped,
        // PASÁ sólo aparece cuando el tránsito tiene rojo y el último
        // vehículo que ya había entrado terminó de liberar la senda.
        safeToCross: carsStopped && crosswalkClear,
        phase
    };
}

// Devuelve la próxima senda que encuentra un vehículo que circula
// hacia la izquierda. Así cada auto recorre toda la avenida y respeta
// los cuatro semáforos, en vez de teletransportarse alrededor de uno.
function getUpcomingStreetCrossing(car) {
    let upcoming = null;
    for (const crossing of STREET_CROSSINGS) {
        if (crossing.x <= car.x && (!upcoming || crossing.x > upcoming.x)) {
            upcoming = crossing;
        }
    }
    return upcoming;
}

function triggerStreetBirdDistraction() {
    if (!streetBird || streetBird.triggered || !dogcatcher) return;
    streetBird.triggered = true;
    streetBird.active = true;
    streetBird.timer = 270;
    streetBird.phase = 0;
    dogcatcher.distractedTimer = 235;
    dogcatcher.x = Math.min(dogcatcher.x, player.x - 420);
    playSound('coin');

    for (let i = 0; i < 12; i++) {
        particles.push(new Particle(
            dogcatcher.x + 24,
            250,
            (Math.random() - 0.5) * 3,
            -Math.random() * 2,
            '#fde68a',
            3,
            24,
            'spark'
        ));
    }
}

function updateStreetChase() {
    if (currentLevel !== 1 || levelOneSection !== 3) return;

    trafficCars.forEach(car => {
        let nextX = car.x + car.vx;
        car.waiting = false;

        // Los vehículos llegan desde la derecha y recorren toda la
        // avenida. Antes de cada senda consultan su semáforo real.
        const upcomingCrossing = getUpcomingStreetCrossing(car);
        if (upcomingCrossing) {
            const signal = getStreetSignalState(upcomingCrossing.x);
            const stopX = upcomingCrossing.x + STREET_CAR_STOP_OFFSET;
            if (signal.carsStopped && car.vx < 0 && car.x >= stopX && nextX <= stopX) {
                nextX = stopX;
                car.waiting = true;
            } else if (signal.carsStopped && car.vx < 0 && Math.abs(car.x - stopX) < 1.5) {
                nextX = stopX;
                car.waiting = true;
            }
        }

        car.x = nextX;
        // El reinicio sucede cientos de píxeles fuera del mundo. Por
        // eso el auto entra y sale por el borde, sin saltos visibles.
        if (car.vx < 0 && car.x + car.width < car.minX) {
            car.x = car.maxX;
        } else if (car.vx > 0 && car.x > car.maxX) {
            car.x = car.minX - car.width;
        }

        if (player.invulnerable <= 0 && checkCollision(player, car)) {
            player.invulnerable = shopUpgrades.shieldActive ? 130 : 70;
            handlePlayerDeath();
            car.x = car.maxX;
            if (dogcatcher) dogcatcher.x = Math.max(-150, player.x - 280);
        }
    });

    if (!dogcatcher || !dogcatcher.active || player.x < 140) return;

    if (streetBird && !streetBird.triggered && player.x >= streetBird.triggerX) {
        triggerStreetBirdDistraction();
    }

    if (streetBird && streetBird.active) {
        streetBird.phase += 0.13;
        streetBird.timer--;

        if (dogcatcher.distractedTimer > 0) {
            streetBird.x = dogcatcher.x + 20 + Math.sin(streetBird.phase) * 46;
            streetBird.y = 236 + Math.cos(streetBird.phase * 1.7) * 18;
        } else {
            streetBird.x += 5.2;
            streetBird.y -= 1.15;
        }

        if (streetBird.timer <= 0 || streetBird.y < 90) {
            streetBird.active = false;
        }
    }

    if (dogcatcher.distractedTimer > 0) {
        dogcatcher.distractedTimer--;
        dogcatcher.runPhase += 0.045;
        return;
    }

    const chaseGap = player.x - dogcatcher.x;
    const chaseSpeed = chaseGap > 360 ? 3.25 : chaseGap > 220 ? 2.75 : chaseGap > 130 ? 2.2 : 1.6;
    dogcatcher.x += chaseSpeed;
    dogcatcher.runPhase += chaseSpeed * 0.18;
    dogcatcher.y = 314 + Math.sin(dogcatcher.runPhase) * 2;

    if (player.invulnerable <= 0 && checkCollision(player, dogcatcher)) {
        player.invulnerable = shopUpgrades.shieldActive ? 130 : 70;
        handlePlayerDeath();
        dogcatcher.x = Math.max(-150, player.x - 300);
    }
}

// Abre los cofres de 2.3 al acercarse y libera murciélagos que salen
// disparados hacia arriba y a los costados antes de abandonar la zona.
function updateForestChestsAndBats() {
    if (currentLevel !== 2 || levelTwoSection !== 3) return;

    if (batSprayPickup && !batSprayPickup.collected && checkCollision(player, batSprayPickup)) {
        batSprayPickup.collected = true;
        player.batSprayOwned = true;
        playSound('powerup');
        updatePowerBadge();
        for (let i = 0; i < 18; i++) {
            particles.push(new Particle(
                batSprayPickup.x + batSprayPickup.width / 2,
                batSprayPickup.y + 8,
                (Math.random() - 0.5) * 3.2,
                -0.8 - Math.random() * 2.4,
                i % 2 ? '#a7f3d0' : '#67e8f9',
                2.2,
                30,
                'spark'
            ));
        }
    }

    forestChests.forEach(chest => {
        const distanceX = Math.abs((player.x + player.width / 2) - (chest.x + chest.width / 2));
        if (!chest.opened && distanceX < 118) {
            chest.opened = true;
            playSound('powerup');
            const directions = [-1, -0.45, 0.45, 1];
            directions.forEach((direction, index) => {
                bats.push({
                    x: chest.x + 10,
                    y: chest.y + 4,
                    width: 24,
                    height: 14,
                    vx: direction * (2.4 + index * 0.18),
                    vy: -3.2 - (index % 2) * 0.55,
                    phase: chest.phase + index * 1.4,
                    life: 520,
                    age: 0,
                    hit: false,
                    repelledTicks: 0
                });
            });
            for (let i = 0; i < 12; i++) {
                particles.push(new Particle(chest.x + 22, chest.y + 8, (Math.random() - 0.5) * 3, -Math.random() * 2.4, '#818cf8', 2, 24, 'spark'));
            }
        }
    });

    for (let i = bats.length - 1; i >= 0; i--) {
        const bat = bats[i];
        bat.life--;
        bat.age = (bat.age || 0) + 1;

        if (bat.repelledTicks > 0) {
            // El aerosol rompe la persecución: el murciélago gira y
            // se aleja con un vuelo rápido, pero todavía visible.
            bat.repelledTicks--;
            bat.vx = approach(bat.vx, Math.sign(bat.vx || 1) * 5.4, 0.14);
            bat.vy = approach(bat.vy, -1.35, 0.08);
        } else if (bat.age < 28) {
            // Primero salen del cofre con un pequeño estallido vertical.
            bat.vy = approach(bat.vy, -1.05, 0.075);
        } else {
            // Después se comportan como una bandada: cada uno apunta a
            // una zona levemente distinta alrededor de Miau para que el
            // vuelo no parezca una fila de objetos pegados entre sí.
            const offsetX = Math.cos(bat.phase * 1.7) * 34;
            const offsetY = Math.sin(bat.phase * 1.3) * 28;
            const targetX = player.x + player.width / 2 + offsetX;
            const targetY = player.y + player.height * 0.45 + offsetY;
            const dx = targetX - (bat.x + bat.width / 2);
            const dy = targetY - (bat.y + bat.height / 2);
            const distance = Math.max(1, Math.hypot(dx, dy));
            const chaseSpeed = distance > 250 ? 3.15 : distance > 120 ? 2.65 : 2.15;
            bat.vx = approach(bat.vx, dx / distance * chaseSpeed, 0.12);
            bat.vy = approach(bat.vy, dy / distance * chaseSpeed, 0.11);
        }

        bat.x += bat.vx;
        bat.y += bat.vy + Math.sin(gameTick * 0.28 + bat.phase) * 0.55;

        if (bat.repelledTicks <= 0 && !bat.hit && player.invulnerable <= 0 && checkCollision(player, bat)) {
            bat.hit = true;
            if (player.powerup === 'strength') {
                playSound('stomp');
                bat.life = 0;
            } else if (vampireBattle.entered && vampireBattle.active && !vampireBattle.defeated) {
                // En la sala extra los murciélagos forman parte del
                // combate y descuentan la barra de vida, en vez de
                // sacar una vida completa de un solo golpe.
                const damage = shopUpgrades.shieldActive ? 6 : 9;
                vampireBattle.playerHp = Math.max(0, vampireBattle.playerHp - damage);
                vampireBattle.playerHurtTimer = shopUpgrades.shieldActive ? 84 : 62;
                player.invulnerable = Math.max(player.invulnerable, vampireBattle.playerHurtTimer);
                player.hurtAnimationTimer = 20;
                bat.repelledTicks = 90;
                bat.vx = Math.sign((bat.x + bat.width / 2) - (player.x + player.width / 2) || 1) * 4.8;
                bat.vy = -1.8;
                bat.life = Math.min(bat.life, 110);
                playSound('hurt');
                triggerShake(9, 3);
                if (vampireBattle.playerHp <= 0) resetPlayerInsideVampireRoom();
            } else {
                player.invulnerable = shopUpgrades.shieldActive ? 130 : 70;
                handlePlayerDeath();
            }
        }

        if (bat.life <= 0 || bat.y < -130 || bat.y > WORLD_HEIGHT + 100 || bat.x < -220 || bat.x > LEVEL_WIDTH + 220) {
            bats.splice(i, 1);
        }
    }
}

function isVampireBattleSection() {
    return currentLevel === 2 && levelTwoSection === 3;
}

function resetVampireBattle() {
    vampireBattle.entered = false;
    vampireBattle.active = false;
    vampireBattle.defeated = false;
    vampireBattle.hp = vampireBattle.maxHp;
    vampireBattle.playerHp = vampireBattle.playerMaxHp;
    vampireBattle.x = VAMPIRE_ARENA.bossStartX;
    vampireBattle.y = 270;
    vampireBattle.vx = -1.35;
    vampireBattle.hurtTimer = 0;
    vampireBattle.playerHurtTimer = 0;
    vampireBattle.introTimer = 0;
    vampireBattle.batAttackCooldown = 0;
    vampireBattle.batAttackArmed = true;
    vampireBattle.phase = 0;
}

function getVampireDoorHitbox() {
    return {
        x: flagpole.x - 8,
        y: 276,
        width: 62,
        height: 104
    };
}

function startVampireBattle() {
    if (!isVampireBattleSection() || vampireBattle.entered) return;

    vampireBattle.entered = true;
    vampireBattle.active = true;
    vampireBattle.defeated = false;
    vampireBattle.hp = vampireBattle.maxHp;
    vampireBattle.playerHp = vampireBattle.playerMaxHp;
    vampireBattle.x = VAMPIRE_ARENA.bossStartX;
    vampireBattle.y = 270;
    vampireBattle.vx = -1.35;
    vampireBattle.hurtTimer = 0;
    vampireBattle.playerHurtTimer = 70;
    vampireBattle.introTimer = 180;
    vampireBattle.batAttackCooldown = 45;
    vampireBattle.batAttackArmed = true;
    vampireBattle.phase = 0;

    // Si el jugador pasó demasiado lejos del objeto, la puerta evita
    // un bloqueo: Miau entra a la sala llevando el aerosol necesario.
    player.batSprayOwned = true;
    player.x = VAMPIRE_ARENA.playerStartX;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    player.invulnerable = Math.max(player.invulnerable, 70);

    // La sala queda limpia de las últimas bandadas y de la decoración
    // física del sendero, conservando únicamente el piso principal.
    bats = [];
    blocks = blocks.filter(block => block.type === 'ground' || block.x < VAMPIRE_ARENA.minX || block.x > VAMPIRE_ARENA.maxX);
    coins = coins.filter(coin => coin.x < VAMPIRE_ARENA.minX);
    updatePowerBadge();
    playSound('hurt');
    triggerShake(28, 8);

    for (let i = 0; i < 18; i++) {
        particles.push(new Particle(
            VAMPIRE_ARENA.bossStartX + 25,
            310,
            (Math.random() - 0.5) * 5,
            -Math.random() * 3.5,
            i % 2 ? '#c084fc' : '#f472b6',
            2 + Math.random() * 2,
            28,
            'spark'
        ));
    }
}

function defeatVampire() {
    vampireBattle.hp = 0;
    vampireBattle.active = false;
    vampireBattle.defeated = true;
    vampireBattle.introTimer = 150;
    player.celebrateAnimationTimer = Math.max(player.celebrateAnimationTimer, 70);
    playSound('victory');
    triggerShake(30, 9);

    for (let i = 0; i < 26; i++) {
        particles.push(new Particle(
            vampireBattle.x + vampireBattle.width / 2,
            vampireBattle.y + vampireBattle.height / 2,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 5,
            i % 2 ? '#a7f3d0' : '#ddd6fe',
            2 + Math.random() * 2.5,
            32,
            'spark'
        ));
    }
}

function resetPlayerInsideVampireRoom() {
    player.lives--;
    syncHudLives();
    playSound('hurt');
    triggerShake(24, 8);

    if (player.lives <= 0) {
        gameActive = false;
        showOverlay('🌙', '¡FIN DEL JUEGO!', 'El vampiro defendió la salida. Volvé a intentarlo y usá el aerosol cuando esté delante de Super Miau.', 'Volver a Intentar 🔄', () => {
            startGame();
        });
        return;
    }

    vampireBattle.playerHp = vampireBattle.playerMaxHp;
    vampireBattle.playerHurtTimer = 90;
    player.x = VAMPIRE_ARENA.playerStartX;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    player.invulnerable = 90;
    player.hurtAnimationTimer = 24;
    vampireBattle.x = VAMPIRE_ARENA.bossStartX;
    vampireBattle.vx = -1.35;
    vampireBattle.batAttackCooldown = 45;
    vampireBattle.batAttackArmed = true;
}

// El vampiro reutiliza exactamente el mismo tipo de murciélago de los
// cofres. La bandada sale desde su capa y luego la rutina normal de
// 2.3 se encarga del aleteo, persecución y efecto del aerosol.
function launchVampireBats() {
    if (!vampireBattle.active || vampireBattle.defeated) return;

    const originX = vampireBattle.x + vampireBattle.width / 2 - 12;
    const originY = vampireBattle.y + vampireBattle.height * 0.42;
    const directions = [-1, -0.45, 0.45, 1];
    directions.forEach((direction, index) => {
        bats.push({
            x: originX,
            y: originY,
            width: 24,
            height: 14,
            vx: direction * (2.4 + index * 0.18),
            vy: -3.2 - (index % 2) * 0.55,
            phase: vampireBattle.phase * 2 + index * 1.4,
            life: 520,
            age: 0,
            hit: false,
            repelledTicks: 0
        });
    });

    playSound('powerup');
    for (let i = 0; i < 12; i++) {
        particles.push(new Particle(
            originX + 12,
            originY + 7,
            (Math.random() - 0.5) * 3,
            -Math.random() * 2.4,
            i % 2 ? '#818cf8' : '#c084fc',
            2,
            24,
            'spark'
        ));
    }
}

function updateVampireBattle() {
    if (!isVampireBattleSection()) return;

    if (!vampireBattle.entered) {
        if (checkCollision(player, getVampireDoorHitbox())) startVampireBattle();
        return;
    }

    // Incluso después de ganar, Miau permanece dentro de la habitación
    // hasta cruzar la puerta de salida.
    const roomLeft = VAMPIRE_ARENA.minX + 18;
    const roomRight = VAMPIRE_ARENA.maxX - 18 - player.width;
    if (player.x < roomLeft) {
        player.x = roomLeft;
        player.vx = Math.max(0, player.vx);
    } else if (player.x > roomRight) {
        player.x = roomRight;
        player.vx = Math.min(0, player.vx);
    }

    if (vampireBattle.introTimer > 0) vampireBattle.introTimer--;
    if (!vampireBattle.active || vampireBattle.defeated) return;

    if (vampireBattle.hurtTimer > 0) vampireBattle.hurtTimer--;
    if (vampireBattle.playerHurtTimer > 0) vampireBattle.playerHurtTimer--;
    if (vampireBattle.batAttackCooldown > 0) vampireBattle.batAttackCooldown--;

    vampireBattle.phase += 0.045;
    const direction = player.x + player.width / 2 < vampireBattle.x + vampireBattle.width / 2 ? -1 : 1;
    const missingHpRatio = 1 - vampireBattle.hp / vampireBattle.maxHp;
    const chaseSpeed = 1.35 + missingHpRatio * 1.15;
    vampireBattle.vx = approach(vampireBattle.vx, direction * chaseSpeed, 0.055 + missingHpRatio * 0.025);
    vampireBattle.x += vampireBattle.vx;
    vampireBattle.y = 262 + Math.sin(vampireBattle.phase) * 30;

    const bossLeft = VAMPIRE_ARENA.minX + 150;
    const bossRight = VAMPIRE_ARENA.maxX - vampireBattle.width - 35;
    if (vampireBattle.x < bossLeft) {
        vampireBattle.x = bossLeft;
        vampireBattle.vx = Math.abs(vampireBattle.vx);
    } else if (vampireBattle.x > bossRight) {
        vampireBattle.x = bossRight;
        vampireBattle.vx = -Math.abs(vampireBattle.vx);
    }

    // Al acercarse Miau, el vampiro responde con una bandada. Para
    // volver a dispararla el jugador debe tomar distancia y entrar
    // nuevamente en su zona, evitando una lluvia infinita de enemigos.
    const playerCenterX = player.x + player.width / 2;
    const vampireCenterX = vampireBattle.x + vampireBattle.width / 2;
    const batAttackDistance = Math.abs(playerCenterX - vampireCenterX);
    if (batAttackDistance > 470 && vampireBattle.batAttackCooldown <= 0) {
        vampireBattle.batAttackArmed = true;
    }
    if (batAttackDistance < 345 && vampireBattle.batAttackArmed && vampireBattle.batAttackCooldown <= 0) {
        launchVampireBats();
        vampireBattle.batAttackArmed = false;
        vampireBattle.batAttackCooldown = 100;
    }

    if (vampireBattle.playerHurtTimer <= 0 && checkCollision(player, vampireBattle)) {
        const damage = shopUpgrades.shieldActive ? 11 : 17;
        vampireBattle.playerHp = Math.max(0, vampireBattle.playerHp - damage);
        vampireBattle.playerHurtTimer = shopUpgrades.shieldActive ? 92 : 68;
        player.invulnerable = Math.max(player.invulnerable, vampireBattle.playerHurtTimer);
        player.hurtAnimationTimer = 24;
        player.vx = direction * 4.8;
        player.vy = -4.5;
        playSound('hurt');
        triggerShake(14, 5);

        for (let i = 0; i < 9; i++) {
            particles.push(new Particle(
                player.x + player.width / 2,
                player.y + player.height / 2,
                (Math.random() - 0.5) * 3.5,
                -Math.random() * 2.5,
                '#c084fc',
                2,
                22,
                'spark'
            ));
        }

        if (vampireBattle.playerHp <= 0) resetPlayerInsideVampireRoom();
    }
}

// Herramienta exclusiva de 2.3. La nube alcanza a los murciélagos
// que están delante de Miau y, en la sala extra, también al vampiro.
function useBatSpray() {
    if (currentLevel !== 2 || levelTwoSection !== 3 || !player.batSprayOwned || player.batSprayCooldown > 0) return;

    player.batSprayCooldown = 24;
    player.batSprayFlashTimer = 14;
    player.attackAnimationTimer = 14;
    playSound('shoot');

    const direction = player.direction >= 0 ? 1 : -1;
    const originX = player.x + player.width / 2 + direction * 12;
    const originY = player.y + player.height * 0.45;

    for (let i = 0; i < 22; i++) {
        const spread = (Math.random() - 0.5) * 2.6;
        particles.push(new Particle(
            originX,
            originY + (Math.random() - 0.5) * 10,
            direction * (2.6 + Math.random() * 3.2),
            spread,
            i % 3 === 0 ? '#cffafe' : '#a7f3d0',
            1.6 + Math.random() * 1.6,
            24 + Math.floor(Math.random() * 10),
            'spark'
        ));
    }

    bats.forEach(bat => {
        if (bat.repelledTicks > 0) return;
        const batCenterX = bat.x + bat.width / 2;
        const batCenterY = bat.y + bat.height / 2;
        const dx = batCenterX - originX;
        const dy = batCenterY - originY;
        const inFront = dx * direction > -12;
        const inCloud = Math.abs(dx) < 235 && Math.abs(dy) < 112;
        if (!inFront || !inCloud) return;

        bat.repelledTicks = 110;
        bat.hit = true;
        bat.vx = direction * (4.2 + Math.random() * 1.2);
        bat.vy = -1.1 - Math.random() * 1.2;
        bat.life = Math.min(bat.life, 145);
        for (let i = 0; i < 4; i++) {
            particles.push(new Particle(batCenterX, batCenterY, (Math.random() - 0.5) * 2.8, -Math.random() * 2, '#d1fae5', 2, 20, 'spark'));
        }
    });

    if (vampireBattle.active && !vampireBattle.defeated && vampireBattle.hurtTimer <= 0) {
        const vampireCenterX = vampireBattle.x + vampireBattle.width / 2;
        const vampireCenterY = vampireBattle.y + vampireBattle.height / 2;
        const dx = vampireCenterX - originX;
        const dy = vampireCenterY - originY;
        const inFront = dx * direction > -10;
        const inCloud = Math.abs(dx) < 255 && Math.abs(dy) < 125;

        if (inFront && inCloud) {
            vampireBattle.hp = Math.max(0, vampireBattle.hp - 12);
            vampireBattle.hurtTimer = 16;
            vampireBattle.vx = direction * (3.2 + Math.random());
            triggerShake(10, 4);
            playSound('stomp');

            for (let i = 0; i < 12; i++) {
                particles.push(new Particle(
                    vampireCenterX,
                    vampireCenterY,
                    direction * (1 + Math.random() * 2.5),
                    (Math.random() - 0.5) * 3.2,
                    i % 2 ? '#cffafe' : '#ddd6fe',
                    2 + Math.random() * 1.5,
                    24,
                    'spark'
                ));
            }

            if (vampireBattle.hp <= 0) defeatVampire();
        }
    }
}

// Disparo de Maullido Estelar (¡Forma de estrellas de energía!)
// Crea el proyectil del maullido estelar cuando el poder correspondiente esta activo.
function shootLightning() {
    playSound('shoot');
    player.shootCooldown = 15;
    player.attackAnimationTimer = 18;
    
    playerProjectiles.push({
        x: player.direction === 1 ? player.x + player.width : player.x - 16,
        y: player.y + player.height / 2 - 4,
        width: 18,
        height: 18,
        vx: player.direction * 7.5,
        rotation: 0,
        life: 60
    });

    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(
            player.direction === 1 ? player.x + player.width : player.x,
            player.y + player.height / 2,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            '#facc15', // Chispas amarillas estelares
            2,
            15,
            'electricity'
        ));
    }
}

// Ejecuta un paso de simulacion: movimiento, colisiones, enemigos, jefe y progreso del nivel.
function updateGame() {
    gameTick++;

    if (finalPortalSequence.active) {
        if (updateFinalPortalSequence()) {
            for (let idx = particles.length - 1; idx >= 0; idx--) {
                const particle = particles[idx];
                particle.update();
                if (particle.life <= 0) particles.splice(idx, 1);
            }
            trimParticles();
            if (shakeDuration > 0) {
                shakeDuration--;
            } else {
                shakeIntensity = 0;
            }
        }
        return;
    }

    if (player.invulnerable > 0) player.invulnerable--;
    if (player.shootCooldown > 0) player.shootCooldown--;
    if (player.attackAnimationTimer > 0) player.attackAnimationTimer--;
    if (player.hurtAnimationTimer > 0) player.hurtAnimationTimer--;
    if (player.landingAnimationTimer > 0) player.landingAnimationTimer--;
    if (player.celebrateAnimationTimer > 0) player.celebrateAnimationTimer--;
    if (player.ringDetachCooldown > 0) player.ringDetachCooldown--;
    if (player.batSprayCooldown > 0) player.batSprayCooldown--;
    if (player.batSprayFlashTimer > 0) player.batSprayFlashTimer--;
    if (player.zombieStunTimer > 0) {
        player.zombieStunTimer--;
        player.vx = 0;
        player.jumpHeld = false;
        player.jumpHoldFrames = 0;
        if (player.zombieStunTimer % 18 === 0) {
            particles.push(new Particle(player.x + player.width / 2, player.y + 4, (Math.random() - 0.5) * 1.2, -1.2, '#86efac', 2, 18, 'spark'));
        }
    }
    if (player.webStunTimer > 0) {
        player.webStunTimer--;
        player.vx = 0;
        player.jumpHeld = false;
        player.jumpHoldFrames = 0;
        if (player.webStunTimer % 24 === 0) {
            particles.push(new Particle(player.x + player.width / 2, player.y + 5, (Math.random() - .5) * 1.1, -.8, '#f8fafc', 2, 18, 'spark'));
        }
    }

    // Tormenta fuerte y continua en las tres partes del Nivel 1.
    if ((currentLevel === 1 || !gameActive) && shouldRunAmbientEffect(1)) {
        for (let drop = 0; drop < 2; drop++) {
            particles.push(new Particle(
                cameraX + Math.random() * (canvas.width + 120),
                -20 - Math.random() * 90,
                -2.2 - Math.random() * 1.1,
                7.2 + Math.random() * 2.2,
                'rgba(147, 197, 253, 0.58)',
                1.35,
                62,
                'rain'
            ));
        }
    }

    // Efecto de brasas de lava flotantes en las montañas volcánicas (Nivel 4)
    if (currentLevel === 4 && shouldRunAmbientEffect(6)) {
        particles.push(new Particle(
            cameraX + Math.random() * canvas.width,
            380,
            (Math.random() - 0.5) * 1.5,
            -Math.random() * 2 - 1,
            '#f97316',
            Math.random() * 3 + 1,
            30,
            'fire'
        ));
    }

    // LÓGICA DEL NIVEL 7 (Cuenta Atrás & Escombros del Colapso)
    if (currentLevel === 7 && gameActive && !isPaused) {
        levelTimer--;
        
        // Actualizar interfaz cada segundo
        if (levelTimer % 60 === 0) {
            ui.levelTimerText.textContent = Math.ceil(levelTimer / 60);
        }

        // Generar caída de meteoros/escombros por el colapso
        if (gameTick % 45 === 0) {
            hazards.push({
                x: cameraX + Math.random() * canvas.width,
                y: -20,
                vy: 3.2 + Math.random() * 2.8,
                width: 20,
                height: 20
            });
        }

        // Fin de tiempo
        if (levelTimer <= 0) {
            levelTimer = (MAP_BLUEPRINTS[7].timerSeconds || 45) * 60;
            handlePlayerDeath();
        }

        // Actualizar posiciones de meteoros
        for (let hIdx = hazards.length - 1; hIdx >= 0; hIdx--) {
            const h = hazards[hIdx];
            h.y += h.vy;
            
            if (shouldRunAmbientEffect(6)) {
                particles.push(new Particle(h.x + 10, h.y + 10, (Math.random() - 0.5) * 1.5, -1, '#ef4444', 3, 10, 'fire'));
            }

            if (checkCollision(player, h)) {
                hazards.splice(hIdx, 1);
                if (player.powerup !== 'strength' && player.invulnerable <= 0) {
                    player.invulnerable = shopUpgrades.shieldActive ? 130 : 65;
                    handlePlayerDeath();
                }
            }

            if (h.y > WORLD_HEIGHT) {
                hazards.splice(hIdx, 1);
            }
        }
    }

    // Temporizador de Súper Poderes
    if (player.powerTimer > 0) {
        player.powerTimer--;
        if (player.powerTimer % 60 === 0) {
            updatePowerBadge();
        }
        
        if (player.powerup === 'strength' && gameTick % 5 === 0) {
            particles.push(new Particle(
                player.x + Math.random() * player.width,
                player.y + Math.random() * player.height,
                (Math.random() - 0.5) * 1.5,
                -Math.random() * 2,
                '#facc15',
                4,
                20,
                'fire'
            ));
        }
        
        if (player.powerTimer <= 0) {
            player.powerup = 'none';
            player.width = player.baseWidth;
            player.height = player.baseHeight;
            player.y += 16;
            playSound('hurt');
            updatePowerBadge();
        }
    }

    if (player.powerup === 'lightning' && gameTick % 8 === 0) {
        particles.push(new Particle(
            player.x + Math.random() * player.width,
            player.y + Math.random() * player.height,
            0, 0,
            '#facc15', // Partículas doradas mágicas estelares
            1.5,
            10,
            'electricity'
        ));
    }

    updateLevelThreeMechanics();

    const isWater = (currentLevel === 5); // Nivel 5 es el Fondo del Mar
    const isControlLocked = player.zombieStunTimer > 0 || player.webStunTimer > 0 || player.hiddenInHole;
    const leftPressed = !isControlLocked && (keys['ArrowLeft'] || keys['a'] || keys['A']);
    const rightPressed = !isControlLocked && (keys['ArrowRight'] || keys['d'] || keys['D']);
    const upPressed = !isControlLocked && (keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']);
    const canUseDownAction = isWater || (currentLevel === 3 && levelThreeSection === 2);
    const downPressed = !isControlLocked && (keys['ArrowDown'] || (canUseDownAction && (keys['s'] || keys['S'])));
    const horizontalInput = (rightPressed ? 1 : 0) - (leftPressed ? 1 : 0);
    const isHanging = updateActiveRingHang(horizontalInput, upPressed);
    player.isMoving = isHanging ? Math.abs(horizontalInput) > 0 : horizontalInput !== 0 || (isWater && (upPressed || downPressed));

    if (player.grounded && horizontalInput !== 0) {
        if (gameTick % 10 === 0) {
            particles.push(new Particle(player.x + player.width / 2, player.y + player.height - 2, (Math.random() - 0.5) * 2, -Math.random() * 1.5, 'rgba(255,255,255,0.3)', 4, 15, 'dust'));
        }
    }

    if (isHanging) {
        player.coyoteFrames = 0;
        player.jumpBufferFrames = 0;
        player.jumpHoldFrames = 0;
    } else if (isWater) {
        // Nado por objetivos de velocidad: responde al instante, pero
        // gana y pierde impulso de forma gradual, sin salir disparado.
        const targetWaterVx = horizontalInput * WATER_MAX_SPEED;
        player.vx = approach(
            player.vx,
            targetWaterVx,
            horizontalInput === 0 ? WATER_DECEL : WATER_ACCEL
        );

        const verticalInput = (downPressed ? 1 : 0) - (upPressed ? 1 : 0);
        if (verticalInput !== 0) {
            player.vy = approach(
                player.vy,
                verticalInput * WATER_MAX_VERTICAL_SPEED,
                WATER_VERTICAL_ACCEL
            );
        } else {
            player.vy = approach(player.vy, 0, WATER_VERTICAL_DECEL);
            player.vy += WATER_GRAVITY;
        }

        if (horizontalInput !== 0) player.direction = horizontalInput;
        player.coyoteFrames = 0;
        player.jumpBufferFrames = 0;
        player.jumpHoldFrames = 0;

        if (upPressed) {
            player.grounded = false;
            if (gameTick % 12 === 0) {
                playSound('jump');
                particles.push(new Particle(player.x + player.width / 2, player.y + player.height, (Math.random() - 0.5) * 2, -1, '', 5, 20, 'bubble'));
            }
        }
    } else {
        const movement = LAND_MOVEMENT[currentLevel] || LAND_MOVEMENT[2];
        const targetVx = horizontalInput * movement.maxSpeed;

        if (horizontalInput !== 0) {
            const isReversing = Math.sign(player.vx) !== horizontalInput && Math.abs(player.vx) > 0.1;
            const baseAcceleration = player.grounded ? movement.groundAccel : movement.airAccel;
            player.vx = approach(player.vx, targetVx, baseAcceleration * (isReversing ? 1.35 : 1));
            player.direction = horizontalInput;
        } else {
            player.vx = approach(
                player.vx,
                0,
                player.grounded ? movement.groundDecel : movement.airDecel
            );
        }

        // Un pequeño margen antes y después del borde evita saltos que
        // no responden por apenas uno o dos fotogramas.
        if (player.grounded) player.coyoteFrames = DEFAULT_COYOTE_FRAMES;
        else player.coyoteFrames = Math.max(0, player.coyoteFrames - 1);

        if (upPressed && !player.jumpHeld) player.jumpBufferFrames = DEFAULT_JUMP_BUFFER_FRAMES;
        else player.jumpBufferFrames = Math.max(0, player.jumpBufferFrames - 1);

        if (player.jumpBufferFrames > 0 && player.coyoteFrames > 0) {
            const jumpHeight = player.powerup === 'strength' ? movement.jumpStrength * 1.05 : movement.jumpStrength;
            player.vy = jumpHeight;
            player.grounded = false;
            player.coyoteFrames = 0;
            player.jumpBufferFrames = 0;
            player.jumpHoldFrames = DEFAULT_JUMP_HOLD_FRAMES;
            playSound('jump');
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(player.x + player.width / 2, player.y + player.height - 2, (Math.random() - 0.5) * 3, -Math.random() * 2, 'rgba(255,255,255,0.4)', 5, 20, 'dust'));
            }
        }

        // El impulso extra solo dura unos fotogramas. Mantener la tecla
        // ya no reduce la gravedad durante todo el salto ni hace que
        // Miau quede flotando. Soltar antes produce un salto corto.
        if (!upPressed && player.jumpHeld && player.vy < SHORT_HOP_CUTOFF_SPEED) {
            player.vy *= SHORT_HOP_DAMPING;
            player.jumpHoldFrames = 0;
        }

        let activeGravity = GRAVITY;
        if (upPressed && player.vy < 0 && player.jumpHoldFrames > 0) {
            activeGravity = GRAVITY * 0.62;
            player.jumpHoldFrames--;
        } else if (player.vy >= 0) {
            player.jumpHoldFrames = 0;
        }
        player.vy += activeGravity;
        if (player.vy > 12) player.vy = 12;
    }

    player.jumpHeld = upPressed;

    const previousBottom = player.y + player.height;
    player.x += player.vx;
    if (player.x < 0) player.x = 0;

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (isPlaygroundNonSolid(block)) continue;
        if (checkCollision(player, block)) {
            if (player.vx > 0) {
                player.x = block.x - player.width;
                player.vx = 0;
            } else if (player.vx < 0) {
                player.x = block.x + block.width;
                player.vx = 0;
            }
        }
    }

    player.y += player.vy;
    player.wasGrounded = player.grounded;
    player.grounded = false;

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (isPlaygroundNonSolid(block)) continue;
        if (checkCollision(player, block)) {
            if (player.vy > 0) {
                player.y = block.y - player.height;
                player.vy = 0;
                player.grounded = true;

                if (currentLevel === 3 && levelThreeSection === 3 && block.type === 'bridge_plank' && !block.falling) {
                    armBridgeCascade(block);
                }

                if (!player.wasGrounded) {
                    player.landingAnimationTimer = 7;
                    triggerShake(5, 2); 
                    for (let i = 0; i < 6; i++) {
                        particles.push(new Particle(player.x + player.width / 2, player.y + player.height - 2, (Math.random() - 0.5) * 4, -Math.random() * 2, 'rgba(255,255,255,0.3)', 6, 25, 'dust'));
                    }
                }
            } else if (player.vy < 0) {
                player.y = block.y + block.height;
                player.vy = 0;

                if ((block.type === 'brick' || block.type === 'question') && !block.hasBeenHit) {
                    block.bounceOffset = -8;
                    triggerShake(10, 4); 

                    if (block.type === 'brick') {
                        playSound('stomp');
                        for (let i = 0; i < 6; i++) {
                            particles.push(new Particle(block.x + 16, block.y + 16, (Math.random() - 0.5) * 6, -Math.random() * 5 - 2, '#ea580c', 6, 35, 'spark'));
                        }
                        blocks.splice(i, 1);
                        break;
                    } else if (block.type === 'question') {
                        block.hasBeenHit = true;
                        
                        const rng = Math.random();
                        let dropType = 'coin';
                        if (rng < 0.40) {
                            dropType = 'coin'; 
                        } else if (rng < 0.60) {
                            dropType = 'extra_life'; 
                        } else if (rng < 0.80) {
                            dropType = 'lightning'; 
                        } else {
                            dropType = 'strength'; 
                        }

                        poppedPowerups.push({
                            x: block.x + 6,
                            y: block.y - 16,
                            width: 20,
                            height: 20,
                            vx: (Math.random() - 0.5) * 3, 
                            vy: -6,                       
                            type: dropType,
                            grounded: false
                        });
                        
                        playSound('coin');
                        for (let i = 0; i < 6; i++) {
                            particles.push(new Particle(block.x + 16, block.y - 10, (Math.random() - 0.5) * 3, -3, '#facc15', 4, 15, 'spark'));
                        }
                    }
                }
            }
        }
    }

    if (!isHanging) {
        updatePlaygroundSlide(previousBottom);
        tryAttachToPlaygroundRing();
    }

    // El límite superior funciona como superficie: permite recuperar
    // aire sin que Miau pueda salir del área visible del agua.
    if (isWater && player.y < 18) {
        player.y = 18;
        if (player.vy < 0) player.vy = 0;
    }

    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.bounceOffset < 0) {
            b.bounceOffset += 0.8;
            if (b.bounceOffset > 0) b.bounceOffset = 0;
        }
    }

    // Caída al vacío
    if (player.y > WORLD_HEIGHT) {
        handlePlayerDeath();
    }

    for (let idx = poppedPowerups.length - 1; idx >= 0; idx--) {
        const pw = poppedPowerups[idx];
        pw.vy += GRAVITY; 
        pw.x += pw.vx;
        pw.y += pw.vy;

        for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
            const block = blocks[blockIdx];
            if (isPlaygroundNonSolid(block)) continue;
            if (checkCollision(pw, block)) {
                if (pw.vy > 0) {
                    pw.y = block.y - pw.height;
                    pw.vy = -3; 
                    pw.vx *= 0.7; 
                }
            }
        }

        if (pw.x < 0) pw.x = 0;
        if (pw.y > WORLD_HEIGHT) {
            poppedPowerups.splice(idx, 1);
            return;
        }

        if (checkCollision(player, pw)) {
            poppedPowerups.splice(idx, 1);
            
            if (pw.type === 'coin') {
                playSound('coin');
                player.coins++;
                awardWallet(1);
                syncHudCoins();
                for (let i = 0; i < 8; i++) {
                    particles.push(new Particle(pw.x + 10, pw.y + 10, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, '#facc15', 3, 15, 'spark'));
                }
            } else if (pw.type === 'extra_life') {
                playSound('lifeup');
                player.lives++;
                syncHudLives();
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(pw.x + 10, pw.y + 10, (Math.random() - 0.5) * 3, -Math.random() * 3, '#f43f5e', 4, 25, 'spark'));
                }
            } else if (pw.type === 'lightning') {
                playSound('powerup');
                const wasStrength = player.powerup === 'strength';
                player.powerup = 'lightning';
                player.powerTimer = 0;
                player.width = player.baseWidth;
                player.height = player.baseHeight;
                if (wasStrength) player.y += 16;
                updatePowerBadge();
            } else if (pw.type === 'strength') {
                playSound('powerup');
                player.powerup = 'strength';
                player.powerTimer = 600; 
                player.width = player.baseWidth * 1.5; 
                player.height = player.baseHeight * 1.5;
                player.y -= 16; 
                updatePowerBadge();
            }
        }
    }

    for (let pIdx = playerProjectiles.length - 1; pIdx >= 0; pIdx--) {
        const proj = playerProjectiles[pIdx];
        proj.x += proj.vx;
        proj.rotation += 0.15 * player.direction;
        proj.life--;
        let projectileRemoved = false;

        if (gameTick % 3 === 0) {
            particles.push(new Particle(proj.x + proj.width/2, proj.y + proj.height/2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, '#facc15', 2, 10, 'electricity'));
        }

        for (let enemyIdx = 0; enemyIdx < enemies.length; enemyIdx++) {
            const enemy = enemies[enemyIdx];
            if (enemy.alive && checkCollision(proj, enemy)) {
                playSound('stomp');
                triggerShake(10, 4);
                playerProjectiles.splice(pIdx, 1); 
                projectileRemoved = true;
                if (damageEnemy(enemy, player.direction || 1)) {
                    player.coins += enemy.scoreValue;
                    awardWallet(enemy.scoreValue);
                    syncHudCoins();
                }
                break;
            }
        }

        if (projectileRemoved) continue;

        // Colisión del maullido con Firulais (Nivel 6)
        if (currentLevel === 6 && boss.active && boss.hp > 0 && checkCollision(proj, boss)) {
            playerProjectiles.splice(pIdx, 1);
            projectileRemoved = true;
            if (boss.hurtTimer <= 0) {
                playSound('stomp');
                triggerShake(20, 8);
                boss.hp--;
                boss.hurtTimer = 60;
                boss.vx = (boss.vx > 0 ? 1 : -1) * (2.2 + (3 - boss.hp) * 1.0);
                
                for (let i = 0; i < 15; i++) {
                    particles.push(new Particle(boss.x + boss.width/2, boss.y + boss.height/2, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7, '#facc15', 3, 25, 'electricity'));
                }

                if (boss.hp <= 0) {
                    princess.jailed = false;
                    playSound('victory');
                }
            }
        }

        if (projectileRemoved) continue;

        if (proj.life <= 0) {
            playerProjectiles.splice(pIdx, 1);
        }
    }

    // Lógica de Oxígeno (Nivel 5 Acuático)
    if (isWater) {
        if (player.y < 70) {
            player.oxygen = Math.min(100, player.oxygen + 1.8);
        } else {
            player.oxygen -= 0.075;
        }

        if (player.oxygen <= 0) {
            player.oxygen = 100;
            handlePlayerDeath();
        }

        ui.oxygenBar.style.width = `${player.oxygen}%`;
        if (player.oxygen < 30) {
            ui.oxygenBar.className = "bg-rose-500 h-full w-full transition-all duration-100 animate-pulse";
        } else {
            ui.oxygenBar.className = "bg-cyan-400 h-full w-full transition-all duration-100";
        }

        bubbles.forEach(b => {
            b.x = b.baseX + Math.sin(gameTick * 0.035 + b.phase) * 5;
            b.y = b.baseY + Math.cos(gameTick * 0.045 + b.phase) * 6;

            if (!b.available && gameTick >= b.respawnAt) {
                b.available = true;
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particle(b.x + 17, b.y + 17, (Math.random() - 0.5) * 2, -Math.random() * 2, '', 5, 18, 'bubble'));
                }
            }

            if (b.available && checkCollision(player, b)) {
                b.available = false;
                b.respawnAt = gameTick + AIR_BUBBLE_RESPAWN_TICKS;
                playSound('coin');
                player.oxygen = Math.min(100, player.oxygen + 45);
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(b.x + 17, b.y + 17, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, '', 6, 20, 'bubble'));
                }
            }
        });
    }

    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true;
            playSound('coin');
            player.coins++;
            awardWallet(1);
            syncHudCoins();
            for (let i = 0; i < 10; i++) {
                particles.push(new Particle(coin.x + 8, coin.y + 8, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, '#facc15', 4, 18, 'spark'));
            }
        }
    }

    enemies.forEach(enemy => {
        if (!enemy.alive) {
            if (enemy.squishTime > 0) enemy.squishTime--;
            return;
        }
        if (enemy.hurtTimer > 0) enemy.hurtTimer--;

        if (enemy.type === 'jellyfish') {
            if (enemy.variant === 'drifter') {
                enemy.x += enemy.vx;
                if (enemy.x <= enemy.minX) {
                    enemy.x = enemy.minX;
                    enemy.vx = Math.abs(enemy.vx);
                } else if (enemy.x >= enemy.maxX - enemy.width) {
                    enemy.x = enemy.maxX - enemy.width;
                    enemy.vx = -Math.abs(enemy.vx);
                }
                enemy.y = enemy.baseY + Math.sin(gameTick * 0.05 + enemy.phase) * 18;
            } else if (enemy.variant === 'surger') {
                enemy.abilityCooldown--;
                if (enemy.abilityCooldown <= 0 && Math.abs(player.x - enemy.x) < 230 && Math.abs(player.y - enemy.y) < 120) {
                    enemy.vx = player.x < enemy.x ? -3.2 : 3.2;
                    enemy.abilityCooldown = 95;
                } else {
                    const patrolDirection = enemy.vx >= 0 ? 1 : -1;
                    enemy.vx = approach(enemy.vx, patrolDirection * enemy.baseSpeed, 0.08);
                }
                enemy.x += enemy.vx;
                if (enemy.x <= enemy.minX) {
                    enemy.x = enemy.minX;
                    enemy.vx = Math.abs(enemy.vx);
                } else if (enemy.x >= enemy.maxX - enemy.width) {
                    enemy.x = enemy.maxX - enemy.width;
                    enemy.vx = -Math.abs(enemy.vx);
                }
                enemy.y = enemy.baseY + Math.sin(gameTick * 0.08 + enemy.phase) * 14;
            } else {
                enemy.pulse = 0.5 + 0.5 * Math.sin(gameTick * 0.09 + enemy.phase);
                enemy.x = enemy.anchorX + Math.sin(gameTick * 0.03 + enemy.phase) * 10;
                enemy.y = enemy.baseY + Math.cos(gameTick * 0.05 + enemy.phase) * 14;
                const pulseDistanceX = Math.abs((enemy.x + enemy.width / 2) - (player.x + player.width / 2));
                const pulseDistanceY = Math.abs((enemy.y + enemy.height / 2) - (player.y + player.height / 2));
                if (enemy.pulse > 0.82 && pulseDistanceX < enemy.pulseRadius && pulseDistanceY < enemy.pulseRadius && player.invulnerable <= 0) {
                    player.invulnerable = shopUpgrades.shieldActive ? 130 : 65;
                    handlePlayerDeath();
                }
            }
        } else if (enemy.type === 'zombie') {
            enemy.abilityCooldown--;
            if (enemy.variant === 'lurker' && enemy.abilityCooldown <= 0 && Math.abs(player.x - enemy.x) < 220) {
                enemy.vx = player.x < enemy.x ? -1.65 : 1.65;
                enemy.abilityCooldown = 95;
            } else {
                const patrolDirection = enemy.vx >= 0 ? 1 : -1;
                enemy.vx = approach(enemy.vx, patrolDirection * enemy.baseSpeed, 0.04);
            }
            enemy.x += enemy.vx;
            if (enemy.x <= enemy.minX) {
                enemy.x = enemy.minX;
                enemy.vx = Math.abs(enemy.vx);
            } else if (enemy.x >= enemy.maxX - enemy.width) {
                enemy.x = enemy.maxX - enemy.width;
                enemy.vx = -Math.abs(enemy.vx);
            }
            enemy.y = enemy.baseY + Math.abs(Math.sin(gameTick * 0.075 + enemy.phase)) * 2;
        } else if (enemy.type === 'ghost') {
            if (enemy.variant === 'stalker') {
                const desiredX = Math.max(enemy.minX, Math.min(enemy.maxX - enemy.width, player.x + (player.x < enemy.x ? 40 : -40)));
                enemy.x = approach(enemy.x, desiredX, 1.15);
                enemy.y = approach(enemy.y, enemy.baseY + Math.sin(gameTick * 0.05 + enemy.phase) * 10 + (player.y - enemy.baseY) * 0.12, 0.7);
            } else {
                enemy.x += enemy.vx;
                if (enemy.x <= enemy.minX) {
                    enemy.x = enemy.minX;
                    enemy.vx = Math.abs(enemy.vx);
                } else if (enemy.x >= enemy.maxX - enemy.width) {
                    enemy.x = enemy.maxX - enemy.width;
                    enemy.vx = -Math.abs(enemy.vx);
                }
                enemy.y = enemy.baseY + Math.sin(gameTick * (enemy.variant === 'blink' ? 0.08 : 0.05) + enemy.phase) * (enemy.variant === 'blink' ? 6 : 12);
                if (enemy.variant === 'blink') {
                    enemy.abilityCooldown--;
                    if (enemy.abilityCooldown <= 0 && Math.abs(player.x - enemy.x) < 260) {
                        enemy.x = Math.max(enemy.minX, Math.min(enemy.maxX - enemy.width, player.x + (player.x < enemy.x ? 90 : -90)));
                        enemy.abilityCooldown = 145;
                    }
                }
            }
        } else if (enemy.type === 'bug') {
            if (enemy.variant === 'leaper') {
                enemy.abilityCooldown--;
                if (enemy.leapTimer > 0) {
                    const progress = 1 - enemy.leapTimer / 24;
                    enemy.y = enemy.baseY - Math.sin(progress * Math.PI) * 30;
                    enemy.leapTimer--;
                } else {
                    enemy.y = enemy.baseY;
                    if (enemy.abilityCooldown <= 0) {
                        enemy.leapTimer = 24;
                        enemy.abilityCooldown = 80;
                        enemy.vx = player.x < enemy.x ? -2.7 : 2.7;
                    } else {
                        enemy.vx = approach(enemy.vx, (enemy.vx >= 0 ? 1 : -1) * enemy.baseSpeed, 0.06);
                    }
                }
            } else if (enemy.variant === 'shell') {
                enemy.abilityCooldown--;
                if (enemy.abilityCooldown <= 0) {
                    enemy.vx = player.x < enemy.x ? -2.8 : 2.8;
                    enemy.abilityCooldown = 105;
                } else {
                    enemy.vx = approach(enemy.vx, (enemy.vx >= 0 ? 1 : -1) * enemy.baseSpeed, 0.05);
                }
                enemy.y = enemy.baseY;
            } else {
                enemy.y = enemy.baseY;
            }
            enemy.x += enemy.vx;
            if (enemy.x <= enemy.minX) {
                enemy.x = enemy.minX;
                enemy.vx = Math.abs(enemy.vx);
            } else if (enemy.x >= enemy.maxX - enemy.width) {
                enemy.x = enemy.maxX - enemy.width;
                enemy.vx = -Math.abs(enemy.vx);
            }
        } else {
            if (enemy.variant === 'charger') {
                enemy.abilityCooldown--;
                if (enemy.abilityCooldown <= 0 && Math.abs(player.x - enemy.x) < 210) {
                    enemy.vx = player.x < enemy.x ? -3.4 : 3.4;
                    enemy.abilityCooldown = 120;
                } else {
                    enemy.vx = approach(enemy.vx, (enemy.vx >= 0 ? 1 : -1) * enemy.baseSpeed, 0.1);
                }
            } else {
                enemy.vx = approach(enemy.vx, (enemy.vx >= 0 ? 1 : -1) * enemy.baseSpeed, 0.06);
            }
            enemy.x += enemy.vx;
            if (enemy.x <= enemy.minX) {
                enemy.x = enemy.minX;
                enemy.vx = Math.abs(enemy.vx);
            } else if (enemy.x >= enemy.maxX - enemy.width) {
                enemy.x = enemy.maxX - enemy.width;
                enemy.vx = -Math.abs(enemy.vx);
            }
        }

        if (checkCollision(player, enemy)) {
            if (player.powerup === 'strength') {
                playSound('stomp');
                triggerShake(15, 6);
                if (damageEnemy(enemy, player.direction || 1)) {
                    player.coins += enemy.scoreValue;
                    awardWallet(enemy.scoreValue);
                    syncHudCoins();
                }
                player.vy = -6;
            } else if (player.vy > 0 && player.y + player.height - player.vy <= enemy.y + 7) {
                playSound('stomp');
                triggerShake(12, 5); 
                player.vy = -7.5;
                if (damageEnemy(enemy, player.direction || 1)) {
                    player.coins += enemy.scoreValue;
                    awardWallet(enemy.scoreValue);
                    syncHudCoins();
                }
            } else if (enemy.type === 'zombie') {
                if (player.invulnerable <= 0 && player.zombieStunTimer <= 0) {
                    if (shopUpgrades.shieldActive) {
                        player.invulnerable = 130;
                        playSound('stomp');
                        for (let i = 0; i < 8; i++) {
                            particles.push(new Particle(player.x + player.width / 2, player.y + player.height / 2, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3, '#67e8f9', 2, 18, 'spark'));
                        }
                    } else {
                        player.zombieStunTimer = 180;
                        player.invulnerable = 195;
                        player.hurtAnimationTimer = 24;
                        player.vx = 0;
                        player.jumpHeld = false;
                        player.jumpHoldFrames = 0;
                        playSound('hurt');
                        triggerShake(12, 5);
                        for (let i = 0; i < 12; i++) {
                            particles.push(new Particle(player.x + player.width / 2, player.y + player.height / 2, (Math.random() - 0.5) * 3, -Math.random() * 2, '#4ade80', 3, 28, 'spark'));
                        }
                    }
                }
            } else {
                if (player.invulnerable <= 0) {
                    player.invulnerable = shopUpgrades.shieldActive ? 130 : 65;
                    handlePlayerDeath();
                }
            }
        }
    });

    updateForestChestsAndBats();
    updateStreetChase();
    updateVampireBattle();

    const currentBlueprint = getCurrentBlueprint();
    const bossZone = currentBlueprint.bossZone;

    // Activar al jefe Firulais solo al aproximarse a la sala final del castillo.
    if (currentLevel === 6 && bossZone && !boss.active && player.x > bossZone.triggerX) {
        boss.active = true;
        boss.shootTimer = -30; 
        triggerShake(30, 8); // Sacudida épica
    }

    // Lógica Final de Firulais (Nivel 6)
    if (currentLevel === 6 && bossZone && boss.active) {
        boss.x += boss.vx;
        if (boss.x <= bossZone.minX) {
            boss.x = bossZone.minX;
            boss.vx = Math.abs(boss.vx);
        } else if (boss.x >= bossZone.maxX) {
            boss.x = bossZone.maxX;
            boss.vx = -Math.abs(boss.vx);
        }

        if (boss.hurtTimer > 0) boss.hurtTimer--;

        boss.shootTimer++;
        const bossAttackInterval = boss.hp === 3 ? 118 : boss.hp === 2 ? 102 : 88;
        if (boss.shootTimer >= bossAttackInterval && boss.hp > 0) {
            boss.shootTimer = 0;
            playSound('hurt'); 
            bones.push({
                x: boss.x + boss.width / 2,
                y: boss.y + 20,
                vx: (player.x < boss.x) ? -4.5 : 4.5,
                vy: -5,
                width: 24,
                height: 16,
                bounceCount: 0
            });
        }

        if (boss.hp < 3 && shouldRunAmbientEffect(15)) {
            particles.push(new Particle(boss.x + boss.width / 2 + (Math.random() - 0.5) * 30, boss.y + 10, (Math.random() - 0.5) * 1, -1, '', 6, 25, 'smoke'));
        }

        for (let idx = bones.length - 1; idx >= 0; idx--) {
            const bone = bones[idx];
            bone.x += bone.vx;
            bone.y += bone.vy;
            bone.vy += 0.25; 

            if (bone.y > 364) {
                bone.y = 364;
                bone.vy = -6; 
                bone.bounceCount++;
            }

            if (checkCollision(player, bone)) {
                bones.splice(idx, 1);
                if (player.powerup === 'strength') {
                    playSound('stomp');
                } else if (player.invulnerable <= 0) {
                    player.invulnerable = shopUpgrades.shieldActive ? 130 : 65;
                    handlePlayerDeath();
                }
            }

            if (bone.bounceCount > 3 || bone.x < 0 || bone.x > LEVEL_WIDTH) {
                bones.splice(idx, 1);
            }
        }

        if (boss.hp > 0 && checkCollision(player, boss)) {
            if (player.powerup === 'strength') {
                if (boss.hurtTimer <= 0) {
                    playSound('stomp');
                    triggerShake(20, 8);
                    boss.hp--;
                    boss.hurtTimer = 60;
                    player.vx = player.direction * -6; 
                    
                    if (boss.hp <= 0) {
                        princess.jailed = false; 
                        playSound('victory');
                    }
                }
            } else if (player.vy > 0 && player.y + player.height - player.vy <= boss.y + 15 && boss.hurtTimer <= 0) {
                playSound('stomp');
                triggerShake(20, 8); 
                boss.hp--;
                boss.hurtTimer = 60; 
                player.vy = -8.5; 
                
                boss.vx = (boss.vx > 0 ? 1 : -1) * (2.2 + (3 - boss.hp) * 1.0);

                if (boss.hp <= 0) {
                    princess.jailed = false; 
                    playSound('victory');
                }
            } else if (player.invulnerable <= 0 && boss.hurtTimer <= 0) {
                player.invulnerable = shopUpgrades.shieldActive ? 130 : 65;
                handlePlayerDeath();
            }
        }
    }

    // Colisión con la familia rescatada en el Castillo (Nivel 6)
    if (currentLevel === 6 && !princess.jailed && checkCollision(player, princess)) {
        player.celebrateAnimationTimer = 120;
        gameActive = false;
        playSound('victory');
        showOverlay('💥🌀', '¡FIRULAIS DERROTADO!', '¡La jaula se abrió! La fortaleza comenzó a quebrarse y todas las dimensiones se mezclaron. Seguí las huellas de tu familia hasta el portal de regreso.', 'Entrar a la Dimensión Quebrada 🐾', () => {
            transitionNext();
        });
    }

    // En 2.3 la meta queda bloqueada hasta completar la habitación
    // extra. La misma zona pasa a ser la puerta de salida al vencer.
    const vampireExitLocked = isVampireBattleSection() && !vampireBattle.defeated;
    // Asta / Portal dimensional para niveles de transición
    if (currentLevel !== 6 && !vampireExitLocked && !flagpole.reached && checkCollision(player, flagpole)) {
        flagpole.reached = true;

        if (currentLevel === 1) {
            gameActive = false;
            playSound('victory');
            if (levelOneSection === 1) {
                showOverlay('🛝', '¡LLEGASTE A LOS JUEGOS!', 'Las huellas luminosas siguen por la parte más divertida del Parque Sureño. Deslizate por los toboganes y saltá hacia los aros para colgarte y tomar impulso.', 'Entrar al nivel 1.2 🛝');
            } else if (levelOneSection === 2) {
                showOverlay('🚦', '¡EL RASTRO CRUZA LA CALLE!', 'Las huellas salen del parque y llegan a una avenida sin obstáculos para saltar. Avanzá por el suelo, mirá los semáforos y cruzá cuando aparezca PASÁ. Los autos entran desde el borde y respetan cada luz. Más adelante, un ave curiosa puede distraer al encargado de la perrera y darte tiempo para escapar.', 'Comenzar el nivel 1.3 🚗');
            } else {
                playSound('portalBurst');
                showOverlay('🌉🌀', '¡ENCONTRASTE EL PORTAL!', 'Super Miau dejó atrás Juan Perón, cruzó el puente sobre el río y llegó a la entrada de la Isla del Puerto. Bajo el gran pórtico rosado se abre el portal: del otro lado comienza el nivel 2.1, el mundo de los fantasmas.', 'Cruzar al nivel 2.1 👻');
            }
        } else if (currentLevel === 2) {
            gameActive = false;
            playSound('victory');
            if (levelTwoSection === 1) {
                showOverlay('🧟', '¡EL BOSQUE CAMBIÓ!', 'Los fantasmas quedaron atrás, pero el sendero se vuelve verdoso y aparecen zombis entre las raíces. Evitá que te alcancen: una mordida deja a Super Miau verde y aturdido por unos segundos.', 'Entrar al nivel 2.2 🧟');
            } else if (levelTwoSection === 2) {
                showOverlay('🦇', '¡COFRES ENTRE LAS RAÍCES!', 'El sendero zombi termina frente a una zona más oscura. Al comenzar vas a encontrar un aerosol: recogelo y usá F, SHIFT o el botón de ataque para espantar los murciélagos que salen de los cofres.', 'Entrar al nivel 2.3 🧴');
            } else {
                showOverlay('🧛✨', '¡VAMPIRO DERROTADO!', 'El aerosol despejó la habitación y la puerta final quedó abierta. Dejás atrás la cripta y al otro lado todo parece enorme: comienza la Colonia Colosal.', 'Explorar la colonia 🐜');
            }
        } else if (currentLevel === 3) {
            gameActive = false;
            playSound('victory');
            if (levelThreeSection === 1) {
                showOverlay('🕳️', '¡HAY UN TÚNEL BAJO LA COLONIA!', 'Super Miau superó a los bichos y las telarañas, pero las huellas se meten debajo de la tierra. En los túneles viven topos vigías: buscá los agujeros y mantené ↓ o S para esconderte cuando miren hacia vos.', 'Bajar al nivel 3.2 🐾');
            } else if (levelThreeSection === 2) {
                showOverlay('🌿', '¡LA SALIDA ESTÁ EN LAS COPAS!', 'El túnel termina bajo árboles gigantes. Ahora el camino sigue por puentes de madera y lianas. Las tablas empiezan a caer después de pisarlas, así que no te quedes quieto.', 'Trepar al nivel 3.3 🌉');
            } else {
                showOverlay('🌋', '¡SIETE HUELLAS DE FUEGO!', 'Super Miau dejó atrás los puentes, las lianas y los últimos bichos gigantes. Antiguos tótems felinos marcan un sendero sobre la lava: la Cordillera de las Siete Huellas.', 'Cruzar la cordillera 🔥');
            }
        } else if (currentLevel === 4) {
            gameActive = false;
            playSound('victory');
            showOverlay('🫧', '¡UNA CIUDAD BAJO EL AGUA!', 'El sendero de fuego termina en un remolino. Debajo aparecen arcos, corales y ruinas construidas por antiguos gatos viajeros.', 'Bajar a la ciudad sumergida 🌀');
        } else if (currentLevel === 5) {
            gameActive = false;
            playSound('victory');
            showOverlay('🏰', '¡LA FORTALEZA ESTÁ CERCA!', 'Una última huella brilla en la puerta de la Fortaleza de Firulais. Tu familia está del otro lado.', 'Rescatar a la familia 🐾');
        } else if (currentLevel === 7) {
            startFinalPortalSequence();
        }
    }

    for (let idx = particles.length - 1; idx >= 0; idx--) {
        const p = particles[idx];
        p.update();
        if (p.life <= 0) particles.splice(idx, 1);
    }
    trimParticles();

    let targetCameraX = player.x - canvas.width / 2.5;
    cameraX = Math.max(0, Math.min(LEVEL_WIDTH - canvas.width, targetCameraX));

    if (shakeDuration > 0) {
        shakeDuration--;
    } else {
        shakeIntensity = 0;
    }
}

const SKY_25D = {
    1: { top: '#071426', middle: '#173652', bottom: '#78645e', glow: '#ffd59a', haze: '#8bd5e8' },
    2: { top: '#080717', middle: '#20103d', bottom: '#552c68', glow: '#d8b4fe', haze: '#8b5cf6' },
    3: { top: '#03130e', middle: '#0c3d2c', bottom: '#567a39', glow: '#d9f99d', haze: '#4ade80' },
    4: { top: '#150407', middle: '#4a1012', bottom: '#9a3412', glow: '#fed7aa', haze: '#fb923c' },
    5: { top: '#03101f', middle: '#07375b', bottom: '#08728b', glow: '#cffafe', haze: '#22d3ee' },
    6: { top: '#0b050b', middle: '#270b17', bottom: '#511827', glow: '#fecdd3', haze: '#f87171' },
    7: { top: '#100619', middle: '#2b1248', bottom: '#064e3b', glow: '#d1fae5', haze: '#34d399' }
};

function drawSoftCloud(x, y, scale, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const cloudGradient = ctx.createLinearGradient(0, y - 28 * scale, 0, y + 22 * scale);
    cloudGradient.addColorStop(0, 'rgba(226,232,240,.72)');
    cloudGradient.addColorStop(1, 'rgba(71,85,105,.18)');
    ctx.fillStyle = cloudGradient;
    ctx.beginPath();
    ctx.ellipse(x, y, 45 * scale, 18 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 25 * scale, y + 4 * scale, 27 * scale, 13 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 29 * scale, y + 4 * scale, 30 * scale, 14 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 4 * scale, y - 10 * scale, 31 * scale, 22 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// ===== V15 · PARQUE SUREÑO / PLAZA CONSTITUCIÓN =====
// Fondo exclusivo para 1.1 y 1.2. Está dibujado por capas para que la
// plaza acompañe a la cámara sin estirar ni repetir una imagen fija.
function drawParqueCloud(x, y, scale, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const cloud = ctx.createLinearGradient(0, y - 30 * scale, 0, y + 24 * scale);
    cloud.addColorStop(0, '#0f172a');
    cloud.addColorStop(.48, '#1e293b');
    cloud.addColorStop(1, '#334155');
    ctx.fillStyle = cloud;
    ctx.beginPath();
    ctx.ellipse(x, y, 48 * scale, 18 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 31 * scale, y + 5 * scale, 31 * scale, 13 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 34 * scale, y + 6 * scale, 34 * scale, 14 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 4 * scale, y - 13 * scale, 32 * scale, 24 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawParqueTree(x, baseY, scale, variant = 0) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#6b452b';
    ctx.beginPath();
    ctx.moveTo(-8, 5); ctx.lineTo(-4, -78); ctx.lineTo(8, -78); ctx.lineTo(12, 5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(73,45,28,.45)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1, -70); ctx.lineTo(2, -4); ctx.stroke();

    const greens = [
        ['#5f7f31', '#91a742', '#3f652b'],
        ['#748f35', '#a6ae48', '#4b6f2d'],
        ['#98723d', '#d47a62', '#6f5e35']
    ][variant % 3];
    ctx.fillStyle = greens[2];
    ctx.beginPath(); ctx.arc(-17, -83, 35, 0, Math.PI * 2); ctx.arc(21, -86, 37, 0, Math.PI * 2); ctx.arc(1, -112, 43, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = greens[0];
    ctx.beginPath(); ctx.arc(-27, -102, 30, 0, Math.PI * 2); ctx.arc(30, -105, 31, 0, Math.PI * 2); ctx.arc(2, -127, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = greens[1]; ctx.globalAlpha = .78;
    ctx.beginPath(); ctx.arc(-13, -124, 19, 0, Math.PI * 2); ctx.arc(24, -121, 18, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

function drawPlazaColumn(x, baseY, scale = 1) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);
    ctx.shadowColor = 'rgba(91,58,34,.18)'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#d6b98d'; ctx.fillRect(-39, -19, 78, 19);
    ctx.fillStyle = '#f1d6a5'; ctx.fillRect(-31, -38, 62, 19);
    ctx.fillStyle = '#dfbf8e'; ctx.fillRect(-25, -52, 50, 14);
    const shaft = ctx.createLinearGradient(-18, 0, 18, 0);
    shaft.addColorStop(0, '#cfad7c'); shaft.addColorStop(.34, '#f7e3b6'); shaft.addColorStop(.68, '#e8c895'); shaft.addColorStop(1, '#b98d5c');
    ctx.fillStyle = shaft; ctx.fillRect(-17, -211, 34, 159);
    ctx.fillStyle = '#c79b67'; ctx.fillRect(-22, -219, 44, 10); ctx.fillRect(-23, -58, 46, 8);
    ctx.fillStyle = '#e9c58d'; ctx.fillRect(-28, -229, 56, 11);
    ctx.fillStyle = '#b77b38';
    for (let i = 0; i < 5; i++) {
        const a = -Math.PI + i * Math.PI / 4;
        ctx.beginPath(); ctx.arc(Math.cos(a) * 17, -236 + Math.sin(a) * 5, 8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#d49a46'; ctx.beginPath(); ctx.ellipse(0, -237, 21, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

function drawParqueChurch(x, baseY, scale = 1) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);
    const wall = ctx.createLinearGradient(-80, 0, 90, 0);
    wall.addColorStop(0, '#a96836'); wall.addColorStop(.48, '#c98949'); wall.addColorStop(1, '#8e562f');
    ctx.fillStyle = wall;
    ctx.fillRect(-92, -96, 184, 96);
    ctx.fillRect(-33, -185, 66, 185);
    ctx.fillStyle = '#744328';
    ctx.beginPath(); ctx.moveTo(-105, -96); ctx.lineTo(0, -129); ctx.lineTo(105, -96); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d6974c';
    ctx.beginPath(); ctx.moveTo(-39, -185); ctx.lineTo(0, -256); ctx.lineTo(39, -185); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6a3a24';
    ctx.beginPath(); ctx.arc(0, -55, 17, Math.PI, 0); ctx.fillRect(-17, -55, 34, 55); ctx.fill();
    ctx.fillStyle = '#3f2a24';
    ctx.beginPath(); ctx.arc(0, -151, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7a4b2a'; ctx.lineWidth = 4;
    ctx.strokeRect(-24, -179, 48, 58);
    ctx.strokeStyle = '#9a641f'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -266); ctx.lineTo(0, -247); ctx.moveTo(-7, -258); ctx.lineTo(7, -258); ctx.stroke();
    ctx.restore();
}

// Fachada ilustrada de la Escuela N° 3 Justo José de Urquiza.
// Toma como referencia el edificio real frente a Plaza Constitución:
// volumen largo en esquina, revoque claro, ventanas altas y remate histórico.
function drawEscuelaUrquiza(x, baseY, scale = 1) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);

    ctx.shadowColor = 'rgba(78,56,45,.2)';
    ctx.shadowBlur = 10;

    // Cuerpo principal y lateral de la esquina.
    const schoolWall = ctx.createLinearGradient(-290, 0, 310, 0);
    schoolWall.addColorStop(0, '#d7c9a9');
    schoolWall.addColorStop(.5, '#eee1c3');
    schoolWall.addColorStop(1, '#cdbb98');
    ctx.fillStyle = schoolWall;
    ctx.fillRect(-286, -174, 535, 174);
    ctx.beginPath();
    ctx.moveTo(249, -174); ctx.lineTo(318, -151); ctx.lineTo(318, 0); ctx.lineTo(249, 0); ctx.closePath(); ctx.fill();

    // Zócalo y molduras horizontales.
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#a79b83'; ctx.fillRect(-286, -19, 604, 19);
    ctx.fillStyle = '#c7b99a'; ctx.fillRect(-286, -93, 604, 7);
    ctx.fillStyle = '#aa9d82'; ctx.fillRect(-286, -179, 535, 8);
    ctx.fillStyle = '#e9ddc0'; ctx.fillRect(-278, -168, 520, 4);

    // Pilastras verticales que marcan el ritmo de la fachada histórica.
    [-274, -174, -74, 26, 126, 226].forEach(px => {
        ctx.fillStyle = '#c9b99a'; ctx.fillRect(px, -168, 13, 149);
        ctx.fillStyle = 'rgba(255,247,222,.45)'; ctx.fillRect(px + 2, -165, 3, 142);
        ctx.fillStyle = '#b3a489'; ctx.fillRect(px - 3, -95, 19, 6);
    });

    // Ventanas altas en dos plantas, inspiradas en la foto de referencia.
    const windowXs = [-244, -144, -44, 56, 156];
    windowXs.forEach((wx, index) => {
        [-145, -72].forEach((wy, floor) => {
            ctx.fillStyle = '#9a8c75'; ctx.fillRect(wx - 4, wy - 4, 35, 50);
            const glass = ctx.createLinearGradient(wx, wy, wx + 26, wy + 42);
            glass.addColorStop(0, floor === 0 ? '#83949a' : '#768a8e');
            glass.addColorStop(1, '#5f6b6b');
            ctx.fillStyle = glass; ctx.fillRect(wx, wy, 27, 42);
            ctx.strokeStyle = 'rgba(239,226,195,.78)'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(wx + 13.5, wy); ctx.lineTo(wx + 13.5, wy + 42);
            ctx.moveTo(wx, wy + 19); ctx.lineTo(wx + 27, wy + 19); ctx.stroke();
            ctx.fillStyle = '#e7d9ba'; ctx.fillRect(wx - 6, wy + 43, 39, 5);
        });
        if (index % 2 === 0) {
            ctx.fillStyle = 'rgba(246,231,194,.32)';
            ctx.fillRect(wx + 4, -154, 5, 28);
        }
    });

    // Puerta clara que ayuda a reconocer la fachada de la referencia.
    ctx.fillStyle = '#9e8d70'; ctx.fillRect(177, -78, 43, 78);
    ctx.fillStyle = '#d8c46b'; ctx.fillRect(182, -73, 33, 73);
    ctx.fillStyle = '#8e825d'; ctx.fillRect(197, -70, 3, 70);
    ctx.fillStyle = '#f6e8b9'; ctx.beginPath(); ctx.arc(208, -35, 2.4, 0, Math.PI * 2); ctx.fill();

    // Ventanas del lateral de la esquina.
    [265, 294].forEach((wx, index) => {
        const top = -131 + index * 7;
        ctx.fillStyle = '#9a8c75'; ctx.fillRect(wx, top, 20, 42);
        ctx.fillStyle = '#66777a'; ctx.fillRect(wx + 3, top + 3, 14, 34);
        ctx.strokeStyle = '#e5d7b8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(wx + 10, top + 3); ctx.lineTo(wx + 10, top + 37); ctx.stroke();
    });

    // Cornisa, parapeto y pequeños pináculos del techo.
    ctx.fillStyle = '#a99778'; ctx.fillRect(-292, -187, 548, 10);
    ctx.fillStyle = '#d9c7a5';
    ctx.beginPath();
    ctx.moveTo(-286, -187); ctx.lineTo(-286, -206); ctx.lineTo(-246, -206);
    ctx.lineTo(-238, -191); ctx.lineTo(-202, -191); ctx.lineTo(-194, -210);
    ctx.lineTo(-150, -210); ctx.lineTo(-140, -191); ctx.lineTo(123, -191);
    ctx.lineTo(133, -208); ctx.lineTo(178, -208); ctx.lineTo(188, -191);
    ctx.lineTo(249, -191); ctx.lineTo(249, -187); ctx.closePath(); ctx.fill();
    [-246, -194, 133, 188, 242].forEach(px => {
        ctx.fillStyle = '#b7a481'; ctx.beginPath(); ctx.arc(px, -211, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(px - 2.5, -207, 5, 12);
    });

    // Placa escolar visible cuando Miau pasa frente al edificio.
    ctx.fillStyle = 'rgba(89,84,68,.78)';
    traceRoundedRect(ctx, -65, -112, 146, 31, 4); ctx.fill();
    ctx.fillStyle = '#fff5d6'; ctx.textAlign = 'center';
    ctx.font = 'bold 10px Fredoka'; ctx.fillText('ESCUELA N° 3 URQUIZA', 8, -99);
    ctx.font = 'bold 7px Fredoka'; ctx.fillText('JUSTO JOSÉ DE URQUIZA', 8, -88);

    ctx.restore();
}

// Pinta el suelo con acabados diferentes segun el mundo actual.
function drawThemedGround(block, x, y) {
    if (currentLevel === 1 && levelOneSection === 3) {
        // V22: el piso acompaña el viaje: vereda -> puente -> isla.
        const bridgeMix = typeof streetSceneBlend === 'function' ? streetSceneBlend(2470, 3180) : 0;
        const islandMix = typeof streetSceneBlend === 'function' ? streetSceneBlend(3820, 4440) : 0;
        const pathFace = ctx.createLinearGradient(x, y, x, y + block.height);
        pathFace.addColorStop(0, islandMix > .58 ? '#3b454b' : bridgeMix > .58 ? '#56636b' : '#59635c');
        pathFace.addColorStop(.42, islandMix > .58 ? '#303b43' : bridgeMix > .58 ? '#414d55' : '#46534c');
        pathFace.addColorStop(1, islandMix > .58 ? '#18252d' : bridgeMix > .58 ? '#25313a' : '#25382f');
        ctx.fillStyle = pathFace;
        ctx.fillRect(x, y, block.width, block.height);
        ctx.fillStyle = 'rgba(226,232,240,.12)';
        ctx.fillRect(x, y, block.width, 2);
        ctx.strokeStyle = 'rgba(203,213,225,.09)';
        ctx.lineWidth = 1;
        for (let px = 18; px < block.width; px += 92) {
            ctx.beginPath();
            ctx.moveTo(x + px, y);
            ctx.lineTo(x + px - 9, y + block.height);
            ctx.stroke();
        }
        ctx.fillStyle = 'rgba(148,163,184,.07)';
        for (let px = 42; px < block.width; px += 148) {
            ctx.beginPath();
            ctx.ellipse(x + px, y + 30 + (px % 11), 24, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Línea central de la avenida: pertenece a la superficie gris
        // jugable, no al panorama situado por encima del cordón.
        const streetAlpha = 1 - Math.max(bridgeMix, islandMix);
        if (streetAlpha > 0.02) {
            ctx.save();
            ctx.globalAlpha = streetAlpha;
            ctx.fillStyle = 'rgba(245,214,111,.78)';
            const firstMarkX = Math.floor(cameraX / 172) * 172;
            for (let worldX = firstMarkX; worldX < cameraX + canvas.width + 84; worldX += 172) {
                ctx.fillRect(worldX - cameraX, y + STREET_LANE_MARK_OFFSET_Y, 84, 3);
            }
            ctx.restore();
        }
        return;
    }

    if (currentLevel === 1 && levelOneSection <= 2) {
        // V15: borde de césped y piedra cálida de plaza. Sólo cambia
        // la piel visual; el bloque físico conserva tamaño y posición.
        const soil = ctx.createLinearGradient(x, y, x, y + block.height);
        soil.addColorStop(0, '#7a512f');
        soil.addColorStop(.45, '#5c3927');
        soil.addColorStop(1, '#34251f');
        ctx.fillStyle = soil;
        ctx.fillRect(x, y, block.width, block.height);

        ctx.fillStyle = '#81a23e';
        ctx.fillRect(x, y, block.width, 9);
        ctx.fillStyle = '#b3c55c';
        ctx.fillRect(x, y, block.width, 3);

        // Hilera de piedras doradas como en la referencia visual.
        for (let px = 0; px < block.width; px += 42) {
            const w = Math.min(40, block.width - px);
            const stone = ctx.createLinearGradient(x + px, y + 9, x + px, y + 29);
            stone.addColorStop(0, '#d59a4f');
            stone.addColorStop(1, '#9a6536');
            ctx.fillStyle = stone;
            traceRoundedRect(ctx, x + px + 1, y + 9, Math.max(1, w - 2), 21, 6);
            ctx.fill();
            ctx.strokeStyle = 'rgba(91,58,36,.42)'; ctx.lineWidth = 1;
            traceRoundedRect(ctx, x + px + 1, y + 9, Math.max(1, w - 2), 21, 6); ctx.stroke();
        }

        ctx.fillStyle = 'rgba(45,30,25,.32)';
        for (let px = 18; px < block.width; px += 76) {
            ctx.beginPath(); ctx.ellipse(x + px, y + 48 + (px % 13), 8, 3, -.16, 0, Math.PI * 2); ctx.fill();
        }
        return;
    }

    const palettes = {
        1: { top:'#5c9361', mid:'#254d37', deep:'#14251e', edge:'#b8efb2', glow:'#6ee7b7' },
        2: { top:'#74428b', mid:'#3d1f50', deep:'#160d1d', edge:'#e9d5ff', glow:'#c084fc' },
        3: { top:'#7eaa3e', mid:'#3f6212', deep:'#1c3210', edge:'#d9f99d', glow:'#86efac' },
        4: { top:'#a94621', mid:'#582313', deep:'#211b1a', edge:'#fed7aa', glow:'#fb923c' },
        5: { top:'#c9ba82', mid:'#28627a', deep:'#12384a', edge:'#e0f2fe', glow:'#67e8f9' },
        6: { top:'#7b343d', mid:'#3e2025', deep:'#191012', edge:'#fecdd3', glow:'#f87171' },
        7: { top:'#21836b', mid:'#164e3f', deep:'#171322', edge:'#d1fae5', glow:'#34d399' }
    };
    const palette = palettes[currentLevel];
    const side = ctx.createLinearGradient(x, y, x, y + Math.max(80, block.height));
    side.addColorStop(0, palette.mid);
    side.addColorStop(.38, palette.deep);
    side.addColorStop(1, '#070b12');
    ctx.fillStyle = side;
    ctx.fillRect(x, y, block.width, block.height);

    const topFace = ctx.createLinearGradient(x, y, x, y + 16);
    topFace.addColorStop(0, palette.edge);
    topFace.addColorStop(.2, palette.top);
    topFace.addColorStop(1, palette.mid);
    ctx.fillStyle = topFace;
    ctx.fillRect(x, y, block.width, 16);
    ctx.fillStyle = 'rgba(255,255,255,.16)';
    ctx.fillRect(x, y, block.width, 2);
    ctx.fillStyle = 'rgba(2,6,23,.24)';
    ctx.fillRect(x, y + 14, block.width, 3);

    ctx.strokeStyle = palette.glow; ctx.lineWidth = 1.6; ctx.globalAlpha = .48;
    ctx.beginPath();
    for (let px = 0; px <= block.width; px += 24) {
        const py = y + 5 + Math.sin((block.x + px) * .055 + currentLevel) * 3;
        if (px === 0) ctx.moveTo(x + px, py); else ctx.lineTo(x + px, py);
    }
    ctx.stroke(); ctx.globalAlpha = 1;

    // Ranuras verticales irregulares simulan volumen y material.
    ctx.globalAlpha = .2;
    ctx.strokeStyle = palette.edge;
    ctx.lineWidth = 1;
    for (let px = 28; px < block.width; px += 63) {
        ctx.beginPath();
        ctx.moveTo(x + px, y + 20);
        ctx.quadraticCurveTo(x + px - 8, y + 45, x + px + 5, y + 72);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;

    if (currentLevel === 1) {
        ctx.fillStyle = '#0f172a'; for (let px=18; px<block.width; px+=74) ctx.fillRect(x+px,y+28,34,4);
    } else if (currentLevel === 2) {
        ctx.strokeStyle='#6b21a8'; ctx.lineWidth=2; for(let px=15;px<block.width;px+=65){ctx.beginPath();ctx.moveTo(x+px,y+10);ctx.quadraticCurveTo(x+px+22,y+35,x+px+42,y+62);ctx.stroke();}
    } else if (currentLevel === 3) {
        ctx.fillStyle='#84cc16'; for(let px=12;px<block.width;px+=42){ctx.beginPath();ctx.ellipse(x+px,y+25,8,3,.5,0,Math.PI*2);ctx.fill();}
    } else if (currentLevel === 4) {
        ctx.strokeStyle='#f97316';ctx.lineWidth=2;for(let px=25;px<block.width;px+=70){ctx.beginPath();ctx.moveTo(x+px,y+10);ctx.lineTo(x+px-8,y+34);ctx.lineTo(x+px+12,y+52);ctx.stroke();}
    } else if (currentLevel === 5) {
        ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;for(let py=26;py<65;py+=15){ctx.beginPath();ctx.moveTo(x,y+py);ctx.quadraticCurveTo(x+block.width/2,y+py-8,x+block.width,y+py);ctx.stroke();}
    } else if (currentLevel === 6) {
        ctx.strokeStyle='#3f3f46';ctx.lineWidth=1;for(let px=0;px<block.width;px+=48)ctx.strokeRect(x+px,y+14+(px%96?18:0),46,20);
    } else {
        ['#c084fc','#38bdf8','#fb923c'].forEach((c,i)=>{ctx.fillStyle=c;ctx.globalAlpha=.25;ctx.fillRect(x+i*11,y+18+i*12,Math.max(0,block.width-i*30),3);});ctx.globalAlpha=1;
    }
}

// Dibuja columnas, troncos o estructuras verticales segun la tematica del nivel.
function drawThemedStructure(block, x, y) {
    if (currentLevel === 1) {
        for (let py=y; py<y+block.height; py+=24) {
            ctx.fillStyle = (Math.floor(py/24)%2) ? '#9a5f32' : '#b7793f'; ctx.fillRect(x,py,48,Math.min(23,y+block.height-py));
            ctx.fillStyle='#d6a66b';ctx.fillRect(x+21,py,6,Math.min(23,y+block.height-py));
            if(py===y) drawPawMark(ctx,x+12,py+13,.38,'#5b3620');
        }
    } else if (currentLevel === 2) {
        ctx.fillStyle='#e9d5ff';ctx.fillRect(x+17,y+8,14,block.height-8);ctx.fillStyle='#7e22ce';ctx.shadowColor='#c084fc';ctx.shadowBlur=10;
        ctx.beginPath();ctx.ellipse(x+24,y+8,34,16,0,Math.PI,0);ctx.fill();ctx.shadowBlur=0;
    } else if (currentLevel === 3) {
        ctx.fillStyle='#166534';ctx.fillRect(x+18,y,12,block.height);ctx.strokeStyle='#4ade80';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+24,y);ctx.lineTo(x+24,y+block.height);ctx.stroke();
        ctx.fillStyle='#22c55e';ctx.beginPath();ctx.ellipse(x+7,y+20,18,7,-.4,0,Math.PI*2);ctx.ellipse(x+41,y+42,18,7,.4,0,Math.PI*2);ctx.fill();
    } else if (currentLevel === 5) {
        ctx.strokeStyle='#0891b2';ctx.lineWidth=12;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+24,y+block.height);ctx.lineTo(x+24,y+10);ctx.moveTo(x+24,y+36);ctx.lineTo(x+4,y+18);ctx.moveTo(x+24,y+55);ctx.lineTo(x+45,y+34);ctx.stroke();
        ctx.fillStyle='#f472b6';ctx.beginPath();ctx.arc(x+4,y+18,6,0,Math.PI*2);ctx.arc(x+45,y+34,6,0,Math.PI*2);ctx.fill();
    } else {
        ctx.fillStyle='#211416';ctx.fillRect(x,y,48,block.height);ctx.strokeStyle='#7f1d1d';ctx.lineWidth=4;ctx.strokeRect(x+3,y+3,42,block.height-3);
        ctx.fillStyle='#e5e7eb';for(let py=y+15;py<y+block.height;py+=28){ctx.fillRect(x+13,py,22,4);ctx.beginPath();ctx.arc(x+13,py+2,4,0,Math.PI*2);ctx.arc(x+35,py+2,4,0,Math.PI*2);ctx.fill();}
    }
}

const PLAYGROUND_BLOCK_TYPES = new Set([
    'park_bench_obstacle','play_slide_step','play_slide_deck','play_slide_lane','play_slide_slope',
    'swing_bar','swing_seat','sandbox','seesaw','monkey_bar','monkey_step','ring_frame','hanging_ring','traffic_island'
]);

// Dibuja plataformas y bloques interactivos con estilo propio de cada dimension.
function drawPlaygroundBlock(block, x, y) {
    ctx.save();
    const type = block.type;

    if (type === 'park_bench_obstacle') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 14, y + 26, 7, block.height + 12);
        ctx.fillRect(x + block.width - 22, y + 26, 7, block.height + 12);
        const wood = ctx.createLinearGradient(x, y, x, y + block.height);
        wood.addColorStop(0, '#f6c46f'); wood.addColorStop(1, '#9a5f32');
        ctx.fillStyle = wood;
        traceRoundedRect(ctx, x, y, block.width, 13, 5); ctx.fill();
        traceRoundedRect(ctx, x, y + 20, block.width, 14, 5); ctx.fill();
        ctx.strokeStyle = '#5b3620'; ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, block.width - 4, 9);
    } else if (type === 'play_slide_step') {
        ctx.fillStyle = '#0f766e';
        traceRoundedRect(ctx, x, y, block.width, block.height, 5); ctx.fill();
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 3;
        for (let py = y + 11; py < y + block.height; py += 24) {
            ctx.beginPath(); ctx.moveTo(x + 8, py); ctx.lineTo(x + block.width - 8, py); ctx.stroke();
        }
    } else if (type === 'play_slide_deck') {
        const deck = ctx.createLinearGradient(x, y, x, y + block.height);
        deck.addColorStop(0, '#fb7185'); deck.addColorStop(1, '#be123c');
        ctx.fillStyle = deck; traceRoundedRect(ctx, x, y, block.width, block.height, 7); ctx.fill();
        ctx.strokeStyle = '#fecdd3'; ctx.lineWidth = 2; ctx.strokeRect(x + 2, y + 2, block.width - 4, block.height - 4);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(x + 12, y); ctx.lineTo(x + 12, y - 42); ctx.moveTo(x + block.width - 12, y); ctx.lineTo(x + block.width - 12, y - 42); ctx.stroke();
    } else if (type === 'play_slide_lane') {
        const lane = ctx.createLinearGradient(x, y, x, y + block.height);
        lane.addColorStop(0, '#60a5fa'); lane.addColorStop(1, '#1d4ed8');
        ctx.fillStyle = lane; traceRoundedRect(ctx, x, y, block.width, block.height, 7); ctx.fill();
        ctx.strokeStyle = '#bfdbfe'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 5, y + 4); ctx.lineTo(x + block.width - 5, y + 4); ctx.stroke();
    } else if (type === 'play_slide_slope') {
        // Resbaladilla continua: lo que se ve coincide con la línea
        // usada por la física para deslizar a Miau.
        const slide = ctx.createLinearGradient(x, y, x + block.width, y + block.height);
        slide.addColorStop(0, '#7dd3fc'); slide.addColorStop(.55, '#3b82f6'); slide.addColorStop(1, '#1d4ed8');
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 24;
        ctx.beginPath(); ctx.moveTo(x + 2, y + 2); ctx.lineTo(x + block.width - 4, y + block.height - 3); ctx.stroke();
        ctx.strokeStyle = slide; ctx.lineWidth = 18;
        ctx.beginPath(); ctx.moveTo(x + 2, y + 1); ctx.lineTo(x + block.width - 4, y + block.height - 4); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x + 3, y - 4); ctx.lineTo(x + block.width - 5, y + block.height - 9); ctx.stroke();
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x + block.width * .72, y + block.height * .72); ctx.lineTo(x + block.width * .72, 380);
        ctx.moveTo(x + block.width - 20, y + block.height - 10); ctx.lineTo(x + block.width - 20, 380);
        ctx.stroke();
    } else if (type === 'swing_bar') {
        ctx.strokeStyle = '#fb7185'; ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x + 8, y + block.height); ctx.lineTo(x - 20, 380); ctx.moveTo(x + block.width - 8, y + block.height); ctx.lineTo(x + block.width + 20, 380); ctx.stroke();
        ctx.fillStyle = '#fbbf24'; traceRoundedRect(ctx, x, y, block.width, block.height, 7); ctx.fill();
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
        [64, 156].forEach(offset => { ctx.beginPath(); ctx.moveTo(x + offset, y + block.height); ctx.lineTo(x + offset, 286); ctx.stroke(); });
    } else if (type === 'swing_seat') {
        ctx.fillStyle = '#22c55e'; traceRoundedRect(ctx, x, y, block.width, block.height, 5); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x + 6, y + 3, block.width - 12, 3);
    } else if (type === 'sandbox') {
        ctx.fillStyle = '#9a5f32'; traceRoundedRect(ctx, x, y, block.width, block.height, 8); ctx.fill();
        ctx.fillStyle = '#fde68a'; traceRoundedRect(ctx, x + 8, y + 5, block.width - 16, block.height - 9, 7); ctx.fill();
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(x + block.width * .35, y + 14, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(x + block.width * .68, y + 8, 14, 12);
    } else if (type === 'seesaw') {
        ctx.fillStyle = '#475569'; ctx.beginPath(); ctx.moveTo(x + block.width / 2 - 18, 380); ctx.lineTo(x + block.width / 2, y + 12); ctx.lineTo(x + block.width / 2 + 18, 380); ctx.fill();
        ctx.save(); ctx.translate(x + block.width / 2, y + 8); ctx.rotate(Math.sin(gameTick * .03) * .06);
        ctx.fillStyle = '#f43f5e'; traceRoundedRect(ctx, -block.width / 2, -8, block.width, 16, 6); ctx.fill();
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    } else if (type === 'monkey_bar') {
        ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x + 8, y + block.height); ctx.lineTo(x + 8, 380); ctx.moveTo(x + block.width - 8, y + block.height); ctx.lineTo(x + block.width - 8, 380); ctx.stroke();
        ctx.fillStyle = '#c4b5fd'; traceRoundedRect(ctx, x, y, block.width, block.height, 6); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4;
        for (let px = 24; px < block.width - 12; px += 30) { ctx.beginPath(); ctx.moveTo(x + px, y + block.height); ctx.lineTo(x + px, y + 52); ctx.stroke(); }
    } else if (type === 'monkey_step') {
        ctx.fillStyle = '#8b5cf6'; traceRoundedRect(ctx, x, y, block.width, block.height, 6); ctx.fill();
    } else if (type === 'ring_frame') {
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 9; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x + 10, y + block.height); ctx.lineTo(x + 10, 380);
        ctx.moveTo(x + block.width - 10, y + block.height); ctx.lineTo(x + block.width - 10, 380);
        ctx.stroke();
        const frame = ctx.createLinearGradient(x, y, x, y + block.height);
        frame.addColorStop(0, '#fbbf24'); frame.addColorStop(1, '#d97706');
        ctx.fillStyle = frame; traceRoundedRect(ctx, x, y, block.width, block.height, 8); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x + 10, y + 3, block.width - 20, 3);
    } else if (type === 'hanging_ring') {
        const swingX = getRingSwingOffset(block);
        const centerX = x + block.width / 2 + swingX;
        const centerY = y + block.height / 2;
        const anchorY = block.anchorY ?? (block.y - 62);
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x + block.width / 2, anchorY); ctx.lineTo(centerX, centerY - block.height * .42); ctx.stroke();
        ctx.shadowColor = '#fde047'; ctx.shadowBlur = getShadowBlurValue(player.hangingRing === block ? 14 : 7, 5, 0);
        ctx.strokeStyle = player.hangingRing === block ? '#fef08a' : '#fbbf24';
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(centerX, centerY, block.width * .36, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#fff7ed'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(centerX - 2, centerY - 2, block.width * .28, Math.PI * 1.05, Math.PI * 1.7); ctx.stroke();
    } else if (type === 'traffic_island') {
        ctx.fillStyle = '#cbd5e1'; traceRoundedRect(ctx, x, y, block.width, block.height, 8); ctx.fill();
        ctx.fillStyle = '#64748b'; ctx.fillRect(x, y + 13, block.width, block.height - 13);
        ctx.fillStyle = '#fde047'; for (let px = 8; px < block.width; px += 26) ctx.fillRect(x + px, y + 5, 14, 4);
    }
    ctx.restore();
}

// Carteles breves dentro del propio nivel para descubrir las nuevas
// mecánicas sin interrumpir la partida con una pantalla extra.
function drawPlaygroundMechanicHints() {
    if (currentLevel !== 1 || levelOneSection !== 2) return;

    const hints = [
        { x: 820, y: 126, w: 205, title: '🛝 TOBOGÁN', text: 'Subí y deslizate por la pendiente', color: '#38bdf8' },
        { x: 3100, y: 74, w: 280, title: '⭕ AROS', text: 'Saltá para agarrarte · SALTAR otra vez para soltarte', color: '#fbbf24' }
    ];

    hints.forEach(hint => {
        const sx = hint.x - cameraX;
        if (!isScreenPosition(sx, hint.w, 90)) return;
        ctx.save();
        ctx.fillStyle = 'rgba(2,6,23,.88)';
        traceRoundedRect(ctx, sx, hint.y, hint.w, 47, 10); ctx.fill();
        ctx.strokeStyle = hint.color; ctx.lineWidth = 2;
        traceRoundedRect(ctx, sx + 1, hint.y + 1, hint.w - 2, 45, 9); ctx.stroke();
        ctx.textAlign = 'center';
        ctx.fillStyle = hint.color; ctx.font = 'bold 11px Fredoka';
        ctx.fillText(hint.title, sx + hint.w / 2, hint.y + 17);
        ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 9px Fredoka';
        ctx.fillText(hint.text, sx + hint.w / 2, hint.y + 34);
        ctx.restore();
    });
}

function drawThemedPlatform(block, x, y) {
    if (block.type === 'hanging_vine') {
        const center = getRingCenter(block);
        const screenCenterX = center.x - cameraX;
        ctx.save();
        ctx.strokeStyle = '#365314';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(screenCenterX - Math.sin(gameTick * .02 + block.ringIndex) * 7, -14);
        ctx.bezierCurveTo(screenCenterX - 28, 70, screenCenterX + 22, 145, screenCenterX, center.y);
        ctx.stroke();
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(screenCenterX - 3, -10);
        ctx.bezierCurveTo(screenCenterX - 24, 72, screenCenterX + 19, 145, screenCenterX - 2, center.y - 3);
        ctx.stroke();
        ctx.fillStyle = '#4d7c0f';
        ctx.beginPath(); ctx.ellipse(screenCenterX + 5, center.y + 7, 20, 8, -.18, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#bef264'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(screenCenterX, center.y, 13, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
        return;
    }

    if (block.type === 'bridge_plank') {
        const shake = block.fallTimer >= 0 && !block.falling ? Math.sin(gameTick * .9 + block.plankIndex) * 2.4 : 0;
        ctx.save();
        ctx.translate(shake, 0);
        ctx.fillStyle = '#6b3f24';
        traceRoundedRect(ctx, x, y, block.width, block.height, 3); ctx.fill();
        ctx.fillStyle = '#a16207';
        ctx.fillRect(x + 3, y + 3, Math.max(2, block.width - 6), 5);
        ctx.strokeStyle = '#fbbf24'; ctx.globalAlpha = .34; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x + 7, y + 12); ctx.lineTo(x + block.width - 7, y + 10); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#292524';
        ctx.beginPath(); ctx.arc(x + 6, y + 9, 1.6, 0, Math.PI * 2); ctx.arc(x + block.width - 6, y + 9, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - 2, y - 3); ctx.lineTo(x + block.width + 2, y - 3); ctx.stroke();
        ctx.restore();
        return;
    }

    if (PLAYGROUND_BLOCK_TYPES.has(block.type)) {
        drawPlaygroundBlock(block, x, y);
        return;
    }

    if (block.type === 'question') {
        const accent = getCurrentIdentity().accent;
        const radius = Math.min(block.width, block.height) * .47;
        const cx = x + block.width / 2;
        const cy = y + block.height / 2;
        ctx.save();
        ctx.fillStyle = 'rgba(2,6,23,.38)';
        ctx.beginPath(); ctx.ellipse(cx + 2, cy + radius * .72, radius * .82, radius * .36, 0, 0, Math.PI * 2); ctx.fill();
        ctx.shadowColor = accent;
        ctx.shadowBlur = getShadowBlurValue(block.hasBeenHit ? 2 : 17, block.hasBeenHit ? 1 : 8, 0);
        const orb = ctx.createRadialGradient(cx - radius * .28, cy - radius * .34, 1, cx, cy, radius * 1.15);
        orb.addColorStop(0, block.hasBeenHit ? '#94a3b8' : '#ffffff');
        orb.addColorStop(.22, block.hasBeenHit ? '#64748b' : accent);
        orb.addColorStop(1, block.hasBeenHit ? '#334155' : '#172554');
        ctx.fillStyle = orb;
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = block.hasBeenHit ? '#cbd5e1' : '#e0f2fe';
        ctx.globalAlpha = .7; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(cx, cy, radius - 1, Math.PI * 1.05, Math.PI * 1.78); ctx.stroke();
        ctx.globalAlpha = 1;
        drawPawMark(ctx,cx,cy+1,.65,block.hasBeenHit?'#cbd5e1':'#ffffff');
        ctx.restore();
        return;
    }

    if (block.type === 'brick') {
        const colors=['','#9a5f32','#3f1d4d','#365314','#292524','#155e75','#3f1d24','#312e4a'];
        const brickFace = ctx.createLinearGradient(x, y, x, y + block.height);
        brickFace.addColorStop(0, getCurrentIdentity().accent);
        brickFace.addColorStop(.16, colors[currentLevel]);
        brickFace.addColorStop(1, '#111827');
        ctx.fillStyle=brickFace;traceRoundedRect(ctx,x,y,block.width,block.height,4);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.2)';traceRoundedRect(ctx,x+2,y+2,Math.max(0,block.width-4),3,1.5);ctx.fill();
        ctx.strokeStyle=getCurrentIdentity().accent;ctx.lineWidth=1.5;traceRoundedRect(ctx,x+1,y+1,block.width-2,block.height-2,3);ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+block.width*.2,y);ctx.lineTo(x+block.width*.45,y+block.height*.55);ctx.lineTo(x+block.width*.35,y+block.height);ctx.moveTo(x+block.width*.72,y);ctx.lineTo(x+block.width*.56,y+block.height*.42);ctx.stroke();
        if(currentLevel===1){ctx.fillStyle='#d6a66b';ctx.fillRect(x+block.width*.45,y,6,block.height);}
        return;
    }

    // Plataformas sólidas: banco, raíz, hoja, basalto, ruina, puente o fragmento.
    if (currentLevel === 1) {
        ctx.fillStyle='rgba(2,6,23,.38)';traceRoundedRect(ctx,x+5,y+5,block.width,block.height,6);ctx.fill();
        const timber = ctx.createLinearGradient(x,y,x,y+block.height);
        timber.addColorStop(0,'#f0b766');timber.addColorStop(.25,'#b86e2f');timber.addColorStop(1,'#5b301b');
        ctx.fillStyle=timber;traceRoundedRect(ctx,x,y,block.width,block.height,6);ctx.fill();
        ctx.strokeStyle='#3b2217';ctx.lineWidth=1.5;traceRoundedRect(ctx,x+.75,y+.75,block.width-1.5,block.height-1.5,5);ctx.stroke();
        ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+7,y+3);ctx.lineTo(x+block.width-7,y+3);ctx.stroke();
        ctx.fillStyle='#334155';
        for(let px=10;px<block.width;px+=38){ctx.beginPath();ctx.arc(x+px,y+block.height/2,2.2,0,Math.PI*2);ctx.fill();}
    } else if (currentLevel === 2) {
        ctx.fillStyle='#24102d';ctx.beginPath();ctx.ellipse(x+block.width/2,y+block.height/2,block.width/2,block.height/2,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a855f7';ctx.lineWidth=2;ctx.stroke();
    } else if (currentLevel === 3) {
        ctx.fillStyle='#15803d';ctx.beginPath();ctx.ellipse(x+block.width/2,y+block.height/2,block.width/2,block.height/2,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#86efac';ctx.beginPath();ctx.moveTo(x,y+block.height/2);ctx.lineTo(x+block.width,y+block.height/2);ctx.stroke();
    } else if (currentLevel === 4) {
        ctx.fillStyle='#292524';ctx.beginPath();ctx.moveTo(x,y+block.height);ctx.lineTo(x+6,y);ctx.lineTo(x+block.width-8,y+2);ctx.lineTo(x+block.width,y+block.height);ctx.closePath();ctx.fill();ctx.strokeStyle='#fb923c';ctx.stroke();
    } else if (currentLevel === 5) {
        ctx.fillStyle='#164e63';ctx.fillRect(x,y,block.width,block.height);ctx.strokeStyle='#67e8f9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+3);ctx.quadraticCurveTo(x+block.width/2,y-5,x+block.width,y+3);ctx.stroke();
    } else if (currentLevel === 6) {
        ctx.fillStyle='#292126';ctx.fillRect(x,y,block.width,block.height);ctx.fillStyle='#7f1d1d';ctx.fillRect(x,y,block.width,4);for(let px=12;px<block.width;px+=28){ctx.strokeStyle='#52525b';ctx.strokeRect(x+px,y+6,20,Math.max(4,block.height-8));}
    } else {
        ctx.save();ctx.shadowColor='#34d399';ctx.shadowBlur=getShadowBlurValue(8, 4, 0);ctx.fillStyle='#1e293b';ctx.beginPath();ctx.moveTo(x,y+block.height*.25);ctx.lineTo(x+block.width*.9,y);ctx.lineTo(x+block.width,y+block.height*.8);ctx.lineTo(x+block.width*.12,y+block.height);ctx.closePath();ctx.fill();ctx.strokeStyle='#34d399';ctx.stroke();ctx.restore();
    }
}

function drawVampireRoomBackground() {
    if (!isVampireBattleSection() || !vampireBattle.entered) return;

    ctx.save();
    const wall = ctx.createLinearGradient(0, 0, 0, 380);
    wall.addColorStop(0, '#070712');
    wall.addColorStop(0.6, '#17122b');
    wall.addColorStop(1, '#251536');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, canvas.width, 380);

    // Piedras grandes y discretas para que se lea como una habitación
    // interior y no como otra zona del bosque.
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = '#6d5a88';
    ctx.lineWidth = 1;
    for (let row = 0; row < 6; row++) {
        const y = 74 + row * 48;
        const offset = row % 2 ? -42 : 0;
        for (let x = offset; x < canvas.width + 90; x += 84) {
            ctx.strokeRect(x, y, 82, 46);
        }
    }
    ctx.globalAlpha = 1;

    // Ventanas altas con luna violeta y cortinas oscuras.
    [145, 650].forEach((windowX, index) => {
        ctx.save();
        ctx.fillStyle = '#050816';
        ctx.strokeStyle = '#63517b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(windowX - 48, 215);
        ctx.lineTo(windowX - 48, 112);
        ctx.arc(windowX, 112, 48, Math.PI, 0);
        ctx.lineTo(windowX + 48, 215);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(196,181,253,.34)';
        ctx.beginPath(); ctx.arc(windowX + (index ? -14 : 14), 135, 22, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(221,214,254,.34)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(windowX, 68); ctx.lineTo(windowX, 215); ctx.moveTo(windowX - 46, 155); ctx.lineTo(windowX + 46, 155); ctx.stroke();
        ctx.restore();
    });

    // Alfombra central y pequeñas luces mágicas, sin elementos que
    // alteren las colisiones del combate.
    ctx.fillStyle = '#3b173f';
    ctx.fillRect(0, 350, canvas.width, 30);
    ctx.fillStyle = '#6b285f';
    ctx.fillRect(0, 350, canvas.width, 4);
    [70, 400, 730].forEach((lampX, index) => {
        const glow = 0.55 + Math.sin(gameTick * 0.08 + index) * 0.18;
        ctx.fillStyle = `rgba(196,181,253,${glow * 0.18})`;
        ctx.beginPath(); ctx.arc(lampX, 292, 28, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#c4b5fd';
        ctx.beginPath(); ctx.arc(lampX, 292, 4.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
}

function drawVampireDoor(x, y, unlocked, entrance = false) {
    ctx.save();
    ctx.shadowColor = unlocked ? '#86efac' : '#a855f7';
    ctx.shadowBlur = getShadowBlurValue(18, 9, 0);
    ctx.fillStyle = unlocked ? '#183c31' : '#25102f';
    ctx.strokeStyle = unlocked ? '#86efac' : '#c084fc';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y + 104);
    ctx.lineTo(x, y + 34);
    ctx.arc(x + 31, y + 34, 31, Math.PI, 0);
    ctx.lineTo(x + 62, y + 104);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = unlocked ? '#4ade80' : '#7e22ce';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 10, y + 44, 42, 60);
    ctx.fillStyle = unlocked ? '#fde68a' : '#e9d5ff';
    ctx.beginPath(); ctx.arc(x + 46, y + 75, 3, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = 'rgba(2,6,23,.9)';
    traceRoundedRect(ctx, x - 28, y - 28, 118, 21, 7); ctx.fill();
    ctx.fillStyle = unlocked ? '#bbf7d0' : '#e9d5ff';
    ctx.font = 'bold 10px Fredoka';
    ctx.textAlign = 'center';
    ctx.fillText(entrance ? 'EXTRA · ENTRAR' : (unlocked ? 'SALIDA ABIERTA' : 'SALIDA CERRADA'), x + 31, y - 14);
    ctx.restore();
}

function drawVampireEncounter() {
    if (!isVampireBattleSection()) return;

    if (!vampireBattle.entered) {
        const door = getVampireDoorHitbox();
        if (isOnScreen(door.x, door.width, 100)) {
            drawVampireDoor(door.x - cameraX, door.y, false, true);
        }
        return;
    }

    const exitDoorX = flagpole.x - 8 - cameraX;
    if (isScreenPosition(exitDoorX, 62, 100)) {
        drawVampireDoor(exitDoorX, 276, vampireBattle.defeated, false);
    }

    if (!vampireBattle.active || vampireBattle.defeated) return;
    if (!isOnScreen(vampireBattle.x, vampireBattle.width, 110)) return;

    const x = vampireBattle.x - cameraX;
    const y = vampireBattle.y;
    const dir = vampireBattle.vx >= 0 ? 1 : -1;
    const floatWave = Math.sin(vampireBattle.phase * 2.1) * 3;
    const flashing = vampireBattle.hurtTimer > 0 && Math.floor(gameTick / 3) % 2 === 0;

    ctx.save();
    ctx.translate(x + vampireBattle.width / 2, y + vampireBattle.height / 2 + floatWave);
    ctx.scale(dir, 1);
    ctx.shadowColor = flashing ? '#cffafe' : '#a855f7';
    ctx.shadowBlur = getShadowBlurValue(flashing ? 22 : 14, 8, 0);

    // Capa amplia y silueta caricaturesca del jefe extra.
    ctx.fillStyle = flashing ? '#cffafe' : '#35114c';
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.quadraticCurveTo(-38, 6, -31, 41);
    ctx.lineTo(-7, 29);
    ctx.lineTo(0, 38);
    ctx.lineTo(8, 28);
    ctx.lineTo(31, 41);
    ctx.quadraticCurveTo(36, 6, 7, -18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = flashing ? '#e0f2fe' : '#111827';
    traceRoundedRect(ctx, -13, -14, 26, 42, 8); ctx.fill();
    ctx.fillStyle = '#ede9fe';
    ctx.beginPath(); ctx.arc(0, -25, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#181026';
    ctx.beginPath();
    ctx.arc(0, -29, 15, Math.PI, Math.PI * 2);
    ctx.lineTo(13, -23); ctx.lineTo(4, -27); ctx.lineTo(-2, -19); ctx.lineTo(-7, -27); ctx.lineTo(-14, -22); ctx.closePath(); ctx.fill();

    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = getShadowBlurValue(8, 4, 0);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(-5, -25, 2.2, 0, Math.PI * 2); ctx.arc(5, -25, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-5, -18); ctx.lineTo(-2, -12); ctx.lineTo(0, -18); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(2, -18); ctx.lineTo(5, -12); ctx.lineTo(7, -18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(0, -4, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

// Dibuja todo lo visible del frame actual: fondo, mapa, enemigos, jugador y efectos.
function drawLevelThreeSectionBackdrop() {
    if (currentLevel !== 3) return;

    if (levelThreeSection === 2) {
        // Túnel cerrado: tapa por completo el cielo del valle.
        const dirt = ctx.createLinearGradient(0, 0, 0, canvas.height);
        dirt.addColorStop(0, '#1c120c');
        dirt.addColorStop(.38, '#4a2f1c');
        dirt.addColorStop(1, '#24150d');
        ctx.fillStyle = dirt;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#120b08';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = -60; x <= canvas.width + 80; x += 80) {
            const worldX = x + cameraX * .32;
            ctx.lineTo(x, 52 + Math.sin(worldX * .014) * 17 + ((Math.floor(worldX / 80) % 3) * 7));
        }
        ctx.lineTo(canvas.width, 0);
        ctx.closePath(); ctx.fill();

        // Vetillas, piedras y raíces hacen que el recorrido se lea
        // como interior subterráneo aun cuando la cámara avance.
        for (let i = -1; i < 11; i++) {
            const x = ((i * 103 - cameraX * .28) % 1130 + 1130) % 1130 - 70;
            const y = 105 + (i % 4) * 58;
            ctx.fillStyle = i % 2 ? 'rgba(120,72,38,.34)' : 'rgba(78,47,29,.42)';
            ctx.beginPath(); ctx.ellipse(x, y, 38 + (i % 3) * 9, 16 + (i % 2) * 5, -.18, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = '#3f6212'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) {
            const x = ((i * 190 - cameraX * .42) % 1140 + 1140) % 1140 - 100;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.bezierCurveTo(x - 35, 65, x + 45, 100, x + (i % 2 ? 15 : -18), 155 + (i % 3) * 18);
            ctx.stroke();
        }

        const glow = ctx.createLinearGradient(0, 250, 0, 390);
        glow.addColorStop(0, 'rgba(251,191,36,0)');
        glow.addColorStop(1, 'rgba(251,191,36,.07)');
        ctx.fillStyle = glow; ctx.fillRect(0, 220, canvas.width, 170);

        const mouthX = 155 - cameraX;
        if (mouthX > -180 && mouthX < canvas.width + 80) {
            ctx.save();
            ctx.fillStyle = '#080504';
            ctx.beginPath();
            ctx.moveTo(mouthX - 82, 380); ctx.lineTo(mouthX - 82, 278);
            ctx.arc(mouthX, 278, 82, Math.PI, 0);
            ctx.lineTo(mouthX + 82, 380); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#78512f'; ctx.lineWidth = 13;
            ctx.beginPath(); ctx.moveTo(mouthX - 86, 380); ctx.lineTo(mouthX - 86, 278); ctx.arc(mouthX, 278, 86, Math.PI, 0); ctx.lineTo(mouthX + 86, 380); ctx.stroke();
            ctx.fillStyle = '#fde68a'; ctx.font = 'bold 11px Fredoka'; ctx.textAlign = 'center'; ctx.fillText('TÚNELES DE LOS TOPOS', mouthX, 235);
            ctx.restore();
        }
    } else if (levelThreeSection === 3) {
        // Bajo los puentes hay un vacío vegetal profundo. El piso
        // sólido y las tablas se dibujan encima de esta capa.
        const gorge = ctx.createLinearGradient(0, 300, 0, canvas.height);
        gorge.addColorStop(0, 'rgba(5,46,22,.28)');
        gorge.addColorStop(.3, '#052e16');
        gorge.addColorStop(1, '#020d08');
        ctx.fillStyle = gorge;
        ctx.fillRect(0, 330, canvas.width, canvas.height - 330);
        ctx.fillStyle = 'rgba(74,222,128,.08)';
        for (let x = -80; x < canvas.width + 120; x += 92) {
            const sway = Math.sin(gameTick * .02 + x * .04) * 6;
            ctx.beginPath(); ctx.ellipse(x + sway, 405, 58, 16, 0, 0, Math.PI * 2); ctx.fill();
        }
    } else {
        ctx.save();
        ctx.strokeStyle = 'rgba(226,232,240,.16)';
        ctx.lineWidth = 1.3;
        for (let x = 90; x < canvas.width; x += 155) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x + 28, 92);
            ctx.moveTo(x - 24, 44); ctx.lineTo(x + 30, 44);
            ctx.stroke();
        }
        ctx.restore();
    }
}

function drawLevelThreeMechanics() {
    if (currentLevel !== 3) return;

    if (levelThreeSection === 1) {
        fallingWebs.forEach(web => {
            const x = web.x - cameraX;
            if (!isScreenPosition(x - 70, 140, 90)) return;
            const y = web.state === 'falling' ? web.y : 26 + Math.sin(gameTick * .04 + web.phase) * 4;
            ctx.save();
            ctx.strokeStyle = web.state === 'falling' ? '#f8fafc' : 'rgba(226,232,240,.52)';
            ctx.lineWidth = web.state === 'falling' ? 2.1 : 1.2;
            if (web.state === 'falling') {
                ctx.beginPath(); ctx.moveTo(x, -10); ctx.lineTo(x, y + 8); ctx.stroke();
            }
            for (let ring = 1; ring <= 3; ring++) {
                ctx.beginPath(); ctx.arc(x, y + 28, ring * 9, 0, Math.PI * 2); ctx.stroke();
            }
            for (let ray = 0; ray < 8; ray++) {
                const a = ray * Math.PI / 4;
                ctx.beginPath(); ctx.moveTo(x, y + 28); ctx.lineTo(x + Math.cos(a) * 30, y + 28 + Math.sin(a) * 30); ctx.stroke();
            }
            if (web.state !== 'falling' && web.cooldown <= 0) {
                ctx.fillStyle = 'rgba(15,23,42,.78)'; traceRoundedRect(ctx, x - 38, y + 58, 76, 17, 7); ctx.fill();
                ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 8px Fredoka'; ctx.textAlign = 'center'; ctx.fillText('¡CUIDADO!', x, y + 70);
            }
            ctx.restore();
        });
        return;
    }

    if (levelThreeSection === 2) {
        moleHoles.forEach(hole => {
            const x = hole.x - cameraX;
            if (!isScreenPosition(x, hole.width, 80)) return;
            ctx.save();
            ctx.fillStyle = '#0d0805';
            ctx.beginPath(); ctx.ellipse(x + hole.width / 2, 376, hole.width / 2, 15, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#a16207'; ctx.lineWidth = 2; ctx.globalAlpha = .7;
            ctx.beginPath(); ctx.ellipse(x + hole.width / 2, 375, hole.width / 2 - 5, 11, 0, Math.PI, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgba(2,6,23,.82)'; traceRoundedRect(ctx, x + 15, 334, hole.width - 30, 18, 7); ctx.fill();
            ctx.fillStyle = '#fde68a'; ctx.font = 'bold 8px Fredoka'; ctx.textAlign = 'center'; ctx.fillText('↓ / S · ESCONDER', x + hole.width / 2, 347);
            ctx.restore();
        });

        tunnelMoles.forEach(mole => {
            const x = mole.x - cameraX;
            if (!isScreenPosition(x - 260, 520, 80)) return;
            const dir = mole.vx >= 0 ? 1 : -1;
            ctx.save();
            const cone = ctx.createLinearGradient(x + 19, 0, x + 19 + dir * 230, 0);
            cone.addColorStop(0, mole.alertTimer > 0 ? 'rgba(248,113,113,.22)' : 'rgba(253,230,138,.16)');
            cone.addColorStop(1, 'rgba(253,230,138,0)');
            ctx.fillStyle = cone;
            ctx.beginPath();
            ctx.moveTo(x + 19, 360);
            ctx.lineTo(x + 19 + dir * 235, 326);
            ctx.lineTo(x + 19 + dir * 235, 386);
            ctx.closePath(); ctx.fill();

            ctx.fillStyle = '#3f2a1f';
            ctx.beginPath(); ctx.ellipse(x + 19, mole.y + 20, 19, 16, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#8b5e3c';
            ctx.beginPath(); ctx.arc(x + 19, mole.y + 10, 13, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f5d0a9'; ctx.beginPath(); ctx.ellipse(x + 19 + dir * 9, mole.y + 13, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = mole.alertTimer > 0 ? '#ef4444' : '#f8fafc';
            ctx.beginPath(); ctx.arc(x + 19 + dir * 5, mole.y + 7, 2.2, 0, Math.PI * 2); ctx.fill();
            if (mole.spottedFlash > 0) {
                ctx.fillStyle = '#ef4444'; ctx.font = 'bold 19px Fredoka'; ctx.textAlign = 'center'; ctx.fillText('!', x + 19, mole.y - 8);
            }
            ctx.restore();
        });
        return;
    }

    // Carteles discretos para enseñar la regla del puente y la liana
    // sin interrumpir el juego con un cuadro modal.
    const hints = [
        {x:690, text:'¡LAS TABLAS CAEN! SEGUÍ AVANZANDO'},
        {x:1685, text:'SALTÁ HACIA LA LIANA · SALTÁ OTRA VEZ PARA SOLTARTE'}
    ];
    hints.forEach(hint => {
        const x = hint.x - cameraX;
        if (!isScreenPosition(x, 255, 80)) return;
        ctx.save(); ctx.fillStyle = 'rgba(2,6,23,.84)'; traceRoundedRect(ctx, x, 286, 255, 29, 9); ctx.fill();
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1.5; traceRoundedRect(ctx, x + 1, 287, 253, 27, 8); ctx.stroke();
        ctx.fillStyle = '#dcfce7'; ctx.font = 'bold 9px Fredoka'; ctx.textAlign = 'center'; ctx.fillText(hint.text, x + 127, 304); ctx.restore();
    });
}

function renderGame() {
    ctx.save();

    if (shakeDuration > 0) {
        let dx = (Math.random() - 0.5) * shakeIntensity;
        let dy = (Math.random() - 0.5) * shakeIntensity;
        ctx.translate(dx, dy);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Las tres secciones del capítulo 1 ya tienen fondos propios.
    if (currentLevel === 1 && levelOneSection === 3) {
        drawStreetEnvironment();
    } else if (currentLevel === 1 && levelOneSection <= 2) {
        drawParqueSurenoEnvironment();
    } else {
        drawAtmosphericBackdrop();
    }

    drawLevelThreeSectionBackdrop();

    backgroundDecorations.forEach(deco => {
        let drawX = deco.x - cameraX * deco.depth;
        const approxWidth = getDecorationApproxWidth(deco);
        if (!isScreenPosition(drawX - approxWidth * 0.5, approxWidth * 1.5, 200)) return;
        
        if (deco.type === 'star') {
            let currentAlpha = 0.3 + Math.abs(Math.sin(gameTick * 0.04 + deco.phase)) * 0.7;
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
            ctx.fillRect(drawX, deco.y, deco.size, deco.size);
        } else if (deco.type === 'nebula') {
            ctx.fillStyle = deco.color;
            ctx.beginPath();
            ctx.ellipse(drawX, deco.y, deco.width, deco.height, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (deco.type === 'planet') {
            ctx.save();
            if (useMediumVisualEffects()) {
                let grad = ctx.createRadialGradient(drawX - deco.radius * 0.3, deco.y - deco.radius * 0.3, 2, drawX, deco.y, deco.radius);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.3, deco.color1);
                grad.addColorStop(1, deco.color2);
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = deco.color1;
            }
            ctx.beginPath();
            ctx.arc(drawX, deco.y, deco.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (deco.type === 'tree') {
            ctx.fillStyle = deco.color1;
            ctx.beginPath();
            ctx.arc(drawX, deco.y, deco.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = deco.color2;
            ctx.fillRect(drawX - 6, deco.y + deco.radius - 10, 12, 190);
        } else if (deco.type === 'volcano') {
            ctx.fillStyle = '#140c0d';
            ctx.beginPath();
            ctx.moveTo(drawX - deco.size / 2, 380);
            ctx.lineTo(drawX, 380 - deco.size);
            ctx.lineTo(drawX + deco.size / 2, 380);
            ctx.closePath();
            ctx.fill();
        } else if (deco.type === 'castle_tower') {
            ctx.fillStyle = '#1f1315';
            ctx.fillRect(drawX, deco.y, deco.width, deco.height);
            ctx.fillStyle = '#120a0b';
            ctx.fillRect(drawX - 5, deco.y, 15, 20);
            ctx.fillRect(drawX + 35, deco.y, 15, 20);
            ctx.fillRect(drawX + 70, deco.y, 15, 20);
        } else if (deco.type === 'lightray') {
            ctx.save();
            ctx.fillStyle = useMediumVisualEffects() ? 'rgba(14, 116, 144, 0.14)' : 'rgba(14, 116, 144, 0.08)';
            ctx.beginPath();
            ctx.moveTo(drawX, 0);
            ctx.lineTo(drawX + deco.width, 0);
            ctx.lineTo(drawX + deco.width + 80, canvas.height);
            ctx.lineTo(drawX + 80, canvas.height);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (deco.type === 'lightray_purple') {
            ctx.save();
            ctx.fillStyle = useMediumVisualEffects() ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.07)';
            ctx.beginPath();
            ctx.moveTo(drawX, 0);
            ctx.lineTo(drawX + deco.width, 0);
            ctx.lineTo(drawX + deco.width + 80, canvas.height);
            ctx.lineTo(drawX + 80, canvas.height);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (deco.type === 'lightray_red') {
            ctx.save();
            ctx.fillStyle = useMediumVisualEffects() ? 'rgba(239, 68, 68, 0.14)' : 'rgba(239, 68, 68, 0.08)';
            ctx.beginPath();
            ctx.moveTo(drawX, 0);
            ctx.lineTo(drawX + deco.width, 0);
            ctx.lineTo(drawX + deco.width + 80, canvas.height);
            ctx.lineTo(drawX + 80, canvas.height);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (deco.type === 'spooky_tree') {
            ctx.save();
            ctx.fillStyle = '#090514'; 
            ctx.fillRect(drawX, deco.y, 8, 380 - deco.y);
            ctx.beginPath();
            ctx.moveTo(drawX + 4, deco.y + 10);
            ctx.quadraticCurveTo(drawX - 15, deco.y - 10, drawX - 25, deco.y - 5);
            ctx.moveTo(drawX + 4, deco.y + 25);
            ctx.quadraticCurveTo(drawX + 20, deco.y + 5, drawX + 30, deco.y + 12);
            ctx.strokeStyle = '#090514';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
        } else if (deco.type === 'city_skyline') {
            ctx.save();
            for (let i = 0; i < 24; i++) {
                const w = 34 + (i % 4) * 13;
                const h = 55 + (i % 6) * 17;
                const x = drawX + i * 62;
                ctx.fillStyle = i % 2 ? '#111827' : '#172033';
                ctx.fillRect(x, deco.y - h, w, h + 130);
                ctx.fillStyle = 'rgba(250,204,21,0.35)';
                for (let wy = deco.y - h + 12; wy < deco.y - 8; wy += 18) {
                    ctx.fillRect(x + 8, wy, 5, 7);
                    if (w > 45) ctx.fillRect(x + 24, wy, 5, 7);
                }
            }
            ctx.fillStyle = 'rgba(14,116,144,0.25)';
            ctx.fillRect(drawX, 286, 1700, 48);
            ctx.restore();
        } else if (deco.type === 'cardboard_home') {
            ctx.save();
            ctx.fillStyle = '#9a5f32';
            ctx.fillRect(drawX, deco.y, 82, 48);
            ctx.fillStyle = '#6b3f24';
            ctx.beginPath();
            ctx.moveTo(drawX, deco.y); ctx.lineTo(drawX + 24, deco.y - 18); ctx.lineTo(drawX + 82, deco.y); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#25160f';
            ctx.beginPath(); ctx.arc(drawX + 42, deco.y + 48, 20, Math.PI, 0); ctx.fill();
            ctx.strokeStyle = '#d7a56d'; ctx.lineWidth = 2; ctx.strokeRect(drawX + 5, deco.y + 5, 72, 38);
            drawPawMark(ctx, drawX + 65, deco.y + 20, 0.65, '#fcd34d');
            ctx.restore();
        } else if (deco.type === 'park_lamp') {
            ctx.save();
            ctx.strokeStyle = '#475569'; ctx.lineWidth = 6;
            ctx.beginPath(); ctx.moveTo(drawX, deco.y + 48); ctx.lineTo(drawX, deco.y - 55); ctx.stroke();
            ctx.shadowColor = '#fef08a'; ctx.shadowBlur = getShadowBlurValue(18, 8, 0); ctx.fillStyle = '#fef3c7';
            ctx.beginPath(); ctx.arc(drawX, deco.y - 60, 10, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        } else if (deco.type === 'park_bench') {
            ctx.save(); ctx.fillStyle = '#713f12';
            ctx.fillRect(drawX, deco.y, 74, 9); ctx.fillRect(drawX, deco.y - 18, 74, 8);
            ctx.fillStyle = '#334155'; ctx.fillRect(drawX + 8, deco.y + 8, 5, 28); ctx.fillRect(drawX + 60, deco.y + 8, 5, 28);
            ctx.restore();
        } else if (deco.type === 'playground_sign' || deco.type === 'park_exit_sign' || deco.type === 'avenue_sign' || deco.type === 'safe_gate') {
            const labels = {
                playground_sign: ['JUEGOS', 'NIVEL 1.2'],
                park_exit_sign: ['SALIDA', 'A LA AVENIDA'],
                avenue_sign: ['AVENIDA', 'CRUZÁ CON CUIDADO'],
                safe_gate: ['REFUGIO', '¡CASI LLEGÁS!']
            };
            const [title, detail] = labels[deco.type];
            ctx.save();
            const isStreetSign = deco.type === 'avenue_sign' || deco.type === 'safe_gate';
            const signBaseY = isStreetSign ? 303 : deco.y + 80;
            const signTopY = isStreetSign ? 223 : deco.y - 54;
            const postTopY = isStreetSign ? signTopY + 54 : deco.y - 4;
            ctx.strokeStyle = '#475569'; ctx.lineWidth = 7;
            ctx.beginPath(); ctx.moveTo(drawX + 10, signBaseY); ctx.lineTo(drawX + 10, postTopY); ctx.moveTo(drawX + 126, signBaseY); ctx.lineTo(drawX + 126, postTopY); ctx.stroke();
            ctx.fillStyle = deco.type === 'avenue_sign' ? '#0f766e' : deco.type === 'safe_gate' ? '#166534' : '#7c3aed';
            traceRoundedRect(ctx, drawX, signTopY, 136, 58, 9); ctx.fill();
            ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 2; traceRoundedRect(ctx, drawX + 2, signTopY + 2, 132, 54, 8); ctx.stroke();
            ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 14px Fredoka'; ctx.fillText(title, drawX + 68, signTopY + 24);
            ctx.fillStyle = '#fde68a'; ctx.font = 'bold 9px Fredoka'; ctx.fillText(detail, drawX + 68, signTopY + 40);
            ctx.restore();
        } else if (deco.type === 'street_light') {
            ctx.save(); ctx.strokeStyle = '#334155'; ctx.lineWidth = 7;
            ctx.beginPath(); ctx.moveTo(drawX, 303); ctx.lineTo(drawX, deco.y - 76); ctx.quadraticCurveTo(drawX, deco.y - 95, drawX + 28, deco.y - 95); ctx.stroke();
            ctx.shadowColor = '#fef08a'; ctx.shadowBlur = getShadowBlurValue(16, 7, 0); ctx.fillStyle = '#fef3c7';
            ctx.beginPath(); ctx.ellipse(drawX + 31, deco.y - 92, 12, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        } else if (deco.type === 'storm_tree') {
            ctx.save(); ctx.strokeStyle = '#2b1b18'; ctx.lineWidth = 14; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(drawX, 380); ctx.lineTo(drawX + 8, deco.y - 100); ctx.lineTo(drawX - 35, deco.y - 140); ctx.moveTo(drawX + 7, deco.y - 80); ctx.lineTo(drawX + 55, deco.y - 122); ctx.stroke();
            ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 3; ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = getShadowBlurValue(15, 7, 0);
            ctx.beginPath(); ctx.moveTo(drawX + 15, deco.y - 155); ctx.lineTo(drawX - 5, deco.y - 122); ctx.lineTo(drawX + 20, deco.y - 128); ctx.lineTo(drawX + 2, deco.y - 92); ctx.stroke();
            ctx.restore();
        } else if (deco.type === 'giant_mushroom') {
            ctx.save(); ctx.fillStyle = '#312e81'; ctx.fillRect(drawX - 4, deco.y - deco.size, 8, deco.size + 38);
            ctx.shadowColor = '#c084fc'; ctx.shadowBlur = getShadowBlurValue(10, 5, 0); ctx.fillStyle = '#7e22ce';
            ctx.beginPath(); ctx.ellipse(drawX, deco.y - deco.size, deco.size, deco.size * 0.45, 0, Math.PI, 0); ctx.fill();
            ctx.fillStyle = '#f0abfc'; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(drawX + i * deco.size * .38, deco.y - deco.size - 4, 3, 0, Math.PI * 2); ctx.fill(); }
            ctx.restore();
        } else if (deco.type === 'root_arch') {
            ctx.save(); ctx.strokeStyle = '#1c0f24'; ctx.lineWidth = 18; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.arc(drawX, deco.y, 62, Math.PI, 0); ctx.stroke();
            ctx.strokeStyle = '#6b21a8'; ctx.lineWidth = 2; ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(drawX, deco.y, 54, Math.PI, 0); ctx.stroke(); ctx.restore();
        } else if (deco.type === 'giant_leaf') {
            ctx.save(); ctx.translate(drawX, deco.y); ctx.rotate(-0.28 + (deco.x % 3) * .12);
            ctx.fillStyle = '#166534'; ctx.beginPath(); ctx.ellipse(0, 0, deco.size, deco.size * .38, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#86efac'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-deco.size, 0); ctx.lineTo(deco.size, 0); ctx.stroke();
            for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * deco.size / 5, 0); ctx.lineTo(i * deco.size / 5 + 18, -deco.size * .25); ctx.stroke(); }
            ctx.restore();
        } else if (deco.type === 'ant_hill') {
            ctx.save(); ctx.fillStyle = '#5b3a24'; ctx.beginPath(); ctx.ellipse(drawX, deco.y, 70, 48, 0, Math.PI, 0); ctx.fill();
            ctx.fillStyle = '#1c120c'; ctx.beginPath(); ctx.ellipse(drawX, deco.y - 6, 14, 20, 0, Math.PI, 0); ctx.fill(); ctx.restore();
        } else if (deco.type === 'basalt_spire') {
            ctx.save(); ctx.fillStyle = '#292524'; ctx.beginPath(); ctx.moveTo(drawX - deco.size/2, 380); ctx.lineTo(drawX - 8, deco.y - deco.size); ctx.lineTo(drawX + 12, deco.y - deco.size*.65); ctx.lineTo(drawX + deco.size/2, 380); ctx.fill();
            ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(drawX - 8, deco.y - deco.size); ctx.lineTo(drawX + 3, 350); ctx.stroke(); ctx.restore();
        } else if (deco.type === 'paw_totem') {
            ctx.save(); ctx.fillStyle = '#44403c'; ctx.fillRect(drawX - 15, deco.y - 72, 30, 104);
            ctx.shadowColor = '#fb923c'; ctx.shadowBlur = getShadowBlurValue(12, 6, 0); drawPawMark(ctx, drawX, deco.y - 38, 1, '#fb923c');
            ctx.restore();
        } else if (deco.type === 'coral_garden') {
            ctx.save(); ctx.strokeStyle = deco.x % 2 ? '#f472b6' : '#fb7185'; ctx.lineWidth = 7; ctx.lineCap = 'round';
            [-18,0,18].forEach((dx,i) => { ctx.beginPath(); ctx.moveTo(drawX + dx, deco.y); ctx.quadraticCurveTo(drawX + dx + (i-1)*12, deco.y - deco.size*.65, drawX + dx + (i-1)*18, deco.y - deco.size); ctx.stroke(); });
            ctx.restore();
        } else if (deco.type === 'sunken_arch') {
            ctx.save(); ctx.strokeStyle = '#164e63'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(drawX, deco.y, 62, Math.PI, 0); ctx.stroke();
            ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 2; ctx.globalAlpha = .45; ctx.beginPath(); ctx.arc(drawX, deco.y, 52, Math.PI, 0); ctx.stroke(); ctx.restore();
        } else if (deco.type === 'kelp') {
            ctx.save(); ctx.strokeStyle = '#0d9488'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(drawX, deco.y); ctx.bezierCurveTo(drawX-14,deco.y-deco.height*.35,drawX+14,deco.y-deco.height*.65,drawX,deco.y-deco.height); ctx.stroke(); ctx.restore();
        } else if (deco.type === 'torn_banner') {
            ctx.save(); ctx.fillStyle = deco.mark ? '#7f1d1d' : '#3f0b18';
            ctx.beginPath(); ctx.moveTo(drawX,deco.y); ctx.lineTo(drawX+48,deco.y); ctx.lineTo(drawX+42,deco.y+90); ctx.lineTo(drawX+27,deco.y+72); ctx.lineTo(drawX+12,deco.y+90); ctx.closePath(); ctx.fill();
            drawPawMark(ctx, drawX+24, deco.y+34, .8, '#fecaca'); ctx.restore();
        } else if (deco.type === 'hanging_chain') {
            ctx.save(); ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
            for (let i=0;i<12;i++) { ctx.beginPath(); ctx.ellipse(drawX + Math.sin(i)*2, deco.y+i*18, 6, 10, 0, 0, Math.PI*2); ctx.stroke(); }
            ctx.restore();
        } else if (deco.type === 'world_shard') {
            const shardColors = ['#38bdf8','#c084fc','#4ade80','#fb923c','#22d3ee','#f87171'];
            ctx.save(); ctx.translate(drawX,deco.y); ctx.rotate(Math.sin(gameTick*.01+deco.x)*.25);
            ctx.shadowColor = shardColors[deco.world-1]; ctx.shadowBlur = getShadowBlurValue(12, 6, 0); ctx.fillStyle = shardColors[deco.world-1]+'55'; ctx.strokeStyle = shardColors[deco.world-1]; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(-30,-18); ctx.lineTo(28,-26); ctx.lineTo(18,25); ctx.lineTo(-22,20); ctx.closePath(); ctx.fill(); ctx.stroke();
            drawPawMark(ctx,0,0,.75,shardColors[deco.world-1]); ctx.restore();
        } else if (deco.type === 'dimensional_rift') {
            ctx.save(); ctx.translate(drawX,deco.y); ctx.rotate(gameTick*.008); ctx.shadowColor='#34d399'; ctx.shadowBlur=getShadowBlurValue(25, 12, 0); ctx.strokeStyle='#34d399'; ctx.lineWidth=8;
            ctx.beginPath(); ctx.ellipse(0,0,46,105,0,0,Math.PI*2); ctx.stroke(); ctx.strokeStyle='#a7f3d0'; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(0,0,28,86,0,0,Math.PI*2); ctx.stroke(); ctx.restore();
        }
    });

    // Al atravesar la puerta del 2.3, esta capa tapa por completo el
    // bosque y transforma la zona final en una habitación interior.
    drawVampireRoomBackground();

    // Dibujar Río de Lava burbujeante (Nivel 4 y Nivel 7)
    if (currentLevel === 4 || currentLevel === 7) {
        if (useMediumVisualEffects()) {
            let lavaGrad = ctx.createLinearGradient(0, 380, 0, canvas.height);
            lavaGrad.addColorStop(0, '#f97316'); 
            lavaGrad.addColorStop(0.3, '#ef4444'); 
            lavaGrad.addColorStop(1, '#7f1d1d'); 
            ctx.fillStyle = lavaGrad;
        } else {
            ctx.fillStyle = '#b91c1c';
        }
        ctx.fillRect(0, 380, canvas.width, 70);

        ctx.save();
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = getShadowBlurValue(10, 5, 0);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 15) {
            let y = 380 + Math.sin(x * 0.05 + gameTick * 0.08) * 4;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    blocks.forEach(block => {
        if (!isOnScreen(block.x, block.width)) return;
        let bx = block.x - cameraX;
        let by = block.y + (block.bounceOffset || 0);

        ctx.save();

        if (block.type === 'ground') drawThemedGround(block, bx, by);
        else if (block.type === 'pipe') drawThemedStructure(block, bx, by);
        else drawThemedPlatform(block, bx, by);
        ctx.restore();
    });

    drawPlaygroundMechanicHints();
    drawLevelThreeMechanics();

    if (currentLevel === 2 && levelTwoSection === 3) {
        if (batSprayPickup && !batSprayPickup.collected && isOnScreen(batSprayPickup.x, batSprayPickup.width, 100)) {
            const sprayX = batSprayPickup.x - cameraX;
            const sprayY = batSprayPickup.y + Math.sin(gameTick * 0.08) * 3;
            ctx.save();
            ctx.shadowColor = '#67e8f9';
            ctx.shadowBlur = getShadowBlurValue(18, 8, 0);
            ctx.fillStyle = 'rgba(207,250,254,.14)';
            ctx.beginPath(); ctx.ellipse(sprayX + 12, sprayY + 20, 24, 31, 0, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#e2e8f0'; traceRoundedRect(ctx, sprayX + 4, sprayY + 7, 16, 28, 5); ctx.fill();
            ctx.fillStyle = '#10b981'; ctx.fillRect(sprayX + 5, sprayY + 18, 14, 10);
            ctx.fillStyle = '#0f172a'; ctx.font = 'bold 7px Fredoka'; ctx.textAlign = 'center'; ctx.fillText('ANTI', sprayX + 12, sprayY + 25);
            ctx.fillStyle = '#cbd5e1'; traceRoundedRect(ctx, sprayX + 7, sprayY + 2, 10, 7, 2); ctx.fill();
            ctx.fillStyle = '#94a3b8'; ctx.fillRect(sprayX + 16, sprayY + 3, 7, 3);
            ctx.fillStyle = 'rgba(2,6,23,.92)';
            traceRoundedRect(ctx, sprayX - 68, sprayY - 59, 160, 45, 9); ctx.fill();
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5;
            traceRoundedRect(ctx, sprayX - 67, sprayY - 58, 158, 43, 8); ctx.stroke();
            ctx.fillStyle = '#a7f3d0'; ctx.font = 'bold 10px Fredoka'; ctx.textAlign = 'center';
            ctx.fillText('RECOGÉ EL AEROSOL', sprayX + 12, sprayY - 42);
            ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 8px Fredoka';
            ctx.fillText('F / SHIFT / ATAQUE: ESPANTA MURCIÉLAGOS', sprayX + 12, sprayY - 26);
            ctx.restore();
        }

        forestChests.forEach(chest => {
            if (!isOnScreen(chest.x, chest.width, 80)) return;
            const x = chest.x - cameraX;
            const y = chest.y;
            ctx.save();
            ctx.fillStyle = 'rgba(2,6,23,.35)';
            ctx.beginPath(); ctx.ellipse(x + 22, y + 31, 25, 5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#78350f';
            traceRoundedRect(ctx, x, y + 8, 44, 24, 5); ctx.fill();
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.strokeRect(x + 2, y + 10, 40, 20);
            ctx.fillStyle = '#fbbf24'; traceRoundedRect(ctx, x + 18, y + 17, 8, 9, 2); ctx.fill();

            ctx.save();
            ctx.translate(x + 22, y + 9);
            ctx.rotate(chest.opened ? -0.62 : 0);
            ctx.fillStyle = chest.opened ? '#92400e' : '#a16207';
            traceRoundedRect(ctx, -22, -8, 44, 13, 5); ctx.fill();
            ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 2; traceRoundedRect(ctx, -20, -6, 40, 9, 4); ctx.stroke();
            ctx.restore();

            if (!chest.opened) {
                ctx.shadowColor = '#818cf8'; ctx.shadowBlur = getShadowBlurValue(12, 6, 0);
                ctx.fillStyle = '#c7d2fe'; ctx.font = 'bold 10px Fredoka'; ctx.textAlign = 'center';
                ctx.fillText('¿?', x + 22, y - 8 + Math.sin(gameTick * 0.08 + chest.phase) * 3);
            }
            ctx.restore();
        });

        bats.forEach(bat => {
            if (!isOnScreen(bat.x, bat.width, 100)) return;
            const x = bat.x - cameraX + bat.width / 2;
            const y = bat.y + bat.height / 2;
            const flap = Math.sin(gameTick * 0.32 + bat.phase) * 6;
            const direction = bat.vx >= 0 ? 1 : -1;
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(direction, 1);
            ctx.fillStyle = '#111827';
            ctx.beginPath(); ctx.ellipse(0, 0, 7, 6, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1e1b4b';
            ctx.beginPath();
            ctx.moveTo(-4, -1); ctx.quadraticCurveTo(-15, -10 - flap, -21, 2); ctx.quadraticCurveTo(-13, -2, -5, 5);
            ctx.moveTo(4, -1); ctx.quadraticCurveTo(15, -10 + flap, 21, 2); ctx.quadraticCurveTo(13, -2, 5, 5); ctx.fill();
            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-2.4, -1.5, 1.2, 0, Math.PI * 2); ctx.arc(2.4, -1.5, 1.2, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        });

        drawVampireEncounter();

        if (player.batSprayOwned && player.batSprayFlashTimer > 0) {
            const sprayDir = player.direction >= 0 ? 1 : -1;
            const sprayOriginX = player.x - cameraX + player.width / 2 + sprayDir * 12;
            const sprayOriginY = player.y + player.height * .45;
            const alpha = Math.min(.34, player.batSprayFlashTimer / 38);
            ctx.save();
            const sprayMist = ctx.createLinearGradient(sprayOriginX, sprayOriginY, sprayOriginX + sprayDir * 210, sprayOriginY);
            sprayMist.addColorStop(0, `rgba(207,250,254,${alpha})`);
            sprayMist.addColorStop(1, 'rgba(167,243,208,0)');
            ctx.fillStyle = sprayMist;
            ctx.beginPath();
            ctx.moveTo(sprayOriginX, sprayOriginY - 5);
            ctx.lineTo(sprayOriginX + sprayDir * 215, sprayOriginY - 72);
            ctx.lineTo(sprayOriginX + sprayDir * 215, sprayOriginY + 72);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    if (currentLevel === 1 && levelOneSection === 3) {
        trafficCars.forEach(drawTrafficCar);
        drawStreetBird();
        drawDogcatcher();
    }

    if (currentLevel === 7) {
        hazards.forEach(h => {
            if (!isOnScreen(h.x, h.width || 20, 80)) return;
            let hx = h.x - cameraX;
            ctx.save();
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = getShadowBlurValue(12, 5, 0);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(hx + 10, h.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    poppedPowerups.forEach(pw => {
        if (!isOnScreen(pw.x, pw.width, 80)) return;
        let px = pw.x - cameraX;
        ctx.save();
        
        if (pw.type === 'coin') {
            ctx.shadowColor = '#facc15'; ctx.shadowBlur = getShadowBlurValue(10, 5, 0);
            drawPawMark(ctx, px + 10, pw.y + 10, 0.75, '#facc15');
        } else if (pw.type === 'extra_life') {
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = getShadowBlurValue(10, 5, 0);
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.moveTo(px + 10, pw.y + 16);
            ctx.bezierCurveTo(px + 3, pw.y + 10, px + 3, pw.y + 4, px + 10, pw.y + 4);
            ctx.bezierCurveTo(px + 17, pw.y + 4, px + 17, pw.y + 10, px + 10, pw.y + 16);
            ctx.fill();
        } else if (pw.type === 'lightning') {
            // Maullido Estelar: Dibujar una estrella amarilla brillante en lugar de rayo cian
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = getShadowBlurValue(12, 6, 0);
            ctx.fillStyle = '#facc15';
            drawStarShape(ctx, px + 10, pw.y + 10, 5, 10, 4);
        } else if (pw.type === 'strength') {
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = getShadowBlurValue(12, 6, 0);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(px + 4, pw.y + 8, 12, 10);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(px + 7, pw.y + 4, 6, 4);
            ctx.fillStyle = '#fca5a5';
            ctx.fillRect(px + 6, pw.y + 10, 4, 4);
        }
        
        ctx.restore();
    });

    // Proyectiles Maullido Estelar (¡Forma de estrellas de energía!)
    playerProjectiles.forEach(proj => {
        if (!isOnScreen(proj.x, proj.width, 90)) return;
        let prX = proj.x - cameraX;
        ctx.save();
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = getShadowBlurValue(12, 6, 0);
        ctx.fillStyle = '#ffffff';
        ctx.translate(prX + proj.width/2, proj.y + proj.height/2);
        ctx.rotate(proj.rotation);
        drawStarShape(ctx, 0, 0, 5, proj.width/2, proj.width/4);
        ctx.restore();
    });

    coins.forEach(coin => {
        if (coin.collected) return;
        if (!isOnScreen(coin.x, coin.width, 80)) return;
        let cx = coin.x - cameraX;
        let cy = coin.y + Math.sin(gameTick * 0.15 + coin.bobOffset) * 4;
        ctx.save();
        ctx.shadowColor = getCurrentIdentity().accent;
        ctx.shadowBlur = getShadowBlurValue(9 + Math.abs(Math.sin(gameTick * .08 + coin.bobOffset)) * 5, 5, 0);
        const pawScale = .72 + Math.abs(Math.sin(gameTick * .06 + coin.bobOffset)) * .14;
        drawPawMark(ctx, cx + 9, cy + 9, pawScale, '#fde047');
        ctx.restore();
    });

    if (currentLevel === 5) {
        bubbles.forEach(b => {
            if (!b.available) return;
            if (!isOnScreen(b.x, b.width, 80)) return;
            let bx = b.x - cameraX;
            ctx.save();
            const pulse = 0.88 + Math.sin(gameTick * 0.08 + b.phase) * 0.12;
            ctx.globalAlpha = pulse;
            ctx.shadowColor = '#67e8f9';
            ctx.shadowBlur = getShadowBlurValue(16, 8, 0);
            ctx.fillStyle = 'rgba(34, 211, 238, 0.18)';
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(bx + 17, b.y + 17, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Dos burbujas pequeñas convierten el objeto en una
            // estación de aire reconocible y no en decoración suelta.
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.arc(bx + 8, b.y + 8, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bx + 29, b.y + 5, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = getShadowBlurValue(5, 2, 0);
            ctx.fillStyle = '#cffafe';
            ctx.font = 'bold 9px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText('+ AIRE', bx + 17, b.y + 48);
            ctx.restore();
        });
    }

    if (currentLevel === 5) {
        const waterIntroAge = gameTick - levelStartedAt;
        const shouldShowBubbleHint = waterIntroAge < 420 || player.oxygen < 60;
        const nearestBubble = bubbles.reduce((closest, bubble) => {
            if (!bubble.available) return closest;
            const distance = Math.abs((bubble.x + bubble.width / 2) - (player.x + player.width / 2)) + Math.abs((bubble.y + bubble.height / 2) - (player.y + player.height / 2));
            if (!closest || distance < closest.distance) {
                return { bubble, distance };
            }
            return closest;
        }, null);

        if (shouldShowBubbleHint) {
            ctx.save();
            ctx.fillStyle = 'rgba(3, 17, 34, 0.8)';
            ctx.fillRect(170, 20, 460, 70);
            ctx.strokeStyle = '#67e8f9';
            ctx.lineWidth = 2;
            ctx.strokeRect(170, 20, 460, 70);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#cffafe';
            ctx.font = 'bold 14px Fredoka';
            ctx.fillText('NIVEL ACUÁTICO', 400, 42);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Fredoka';
            ctx.fillText('Buscá burbujas +AIRE para no ahogarte', 400, 64);
            ctx.fillStyle = '#a5f3fc';
            ctx.font = '12px Fredoka';
            ctx.fillText('Podés bajar con S o con el botón ⬇️', 400, 82);
            ctx.restore();
        }

        if (nearestBubble && player.oxygen < 58) {
            const bubbleScreenX = nearestBubble.bubble.x - cameraX + nearestBubble.bubble.width / 2;
            const clampedX = Math.max(70, Math.min(canvas.width - 70, bubbleScreenX));
            const arrowDirection = bubbleScreenX < 70 ? -1 : (bubbleScreenX > canvas.width - 70 ? 1 : 0);

            ctx.save();
            ctx.fillStyle = 'rgba(6, 24, 38, 0.86)';
            ctx.fillRect(clampedX - 74, 96, 148, 48);
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2;
            ctx.strokeRect(clampedX - 74, 96, 148, 48);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ecfeff';
            ctx.font = 'bold 12px Fredoka';
            ctx.fillText('BURBUJA DE AIRE', clampedX, 114);
            ctx.fillStyle = '#67e8f9';
            ctx.font = 'bold 18px Fredoka';
            ctx.fillText(arrowDirection < 0 ? '⬅️' : (arrowDirection > 0 ? '➡️' : '⬇️'), clampedX, 134);
            ctx.restore();
        }
    }

    // Ocultar el portal final de nivel en el Castillo (Nivel 6)
    if (currentLevel !== 6 && !isVampireBattleSection()) {
        let fX = flagpole.x - cameraX;
        let fY = flagpole.y;
        let fW = flagpole.width;
        let fH = flagpole.height;

        // El portal final de 1.3 ocupa la abertura del pórtico rosado.
        // Sólo cambia su dibujo; la colisión sigue usando flagpole.
        const islandGatewayPortal = currentLevel === 1 && levelOneSection === 3;
        if (islandGatewayPortal) {
            fX -= 17;
            fY = 254;
            fW = 79;
            fH = 126;
        }

        ctx.save();
        
        let portalColor = islandGatewayPortal ? '#8b5cf6' : '#ec4899'; 
        if (currentLevel === 2) portalColor = '#a855f7'; 
        if (currentLevel === 3) portalColor = '#10b981'; 
        if (currentLevel === 4) portalColor = '#f97316'; 
        if (currentLevel === 5) portalColor = '#22d3ee'; 
        if (currentLevel === 7) portalColor = '#34d399'; 
        
        const finalPortalActive = currentLevel === 7 && finalPortalSequence.active;
        const collapseAmount = finalPortalActive ? finalPortalSequence.collapse : 0;
        const shatterAmount = finalPortalActive ? finalPortalSequence.shatter : 0;
        const pulseAmount = finalPortalActive ? finalPortalSequence.pulse : 0;
        const beamAmount = finalPortalActive ? finalPortalSequence.beam : 0;
        const portalInnerScale = finalPortalActive
            ? Math.max(0.05, 1 - collapseAmount * 0.9 - shatterAmount * 0.45)
            : Math.abs(Math.sin(gameTick * 0.05));

        if (finalPortalActive) {
            ctx.save();
            ctx.globalAlpha = Math.min(0.82, 0.18 + beamAmount * 0.4);
            const beamGrad = ctx.createLinearGradient(fX + fW / 2, fY - 160, fX + fW / 2, fY + fH + 30);
            beamGrad.addColorStop(0, 'rgba(196, 181, 253, 0)');
            beamGrad.addColorStop(0.2, 'rgba(125, 211, 252, 0.22)');
            beamGrad.addColorStop(0.5, 'rgba(167, 243, 208, 0.4)');
            beamGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = beamGrad;
            ctx.beginPath();
            ctx.ellipse(fX + fW / 2, fY + fH / 2, 18 + beamAmount * 22, 110 + beamAmount * 46, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        ctx.shadowColor = portalColor;
        ctx.shadowBlur = getShadowBlurValue(15, 7, 0);
        ctx.strokeStyle = portalColor;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(fX, fY + fH);
        ctx.lineTo(fX, fY + 20);
        ctx.quadraticCurveTo(fX + fW/2, fY - 10, fX + fW, fY + 20);
        ctx.lineTo(fX + fW, fY + fH);
        ctx.stroke();
        
        if (useMediumVisualEffects()) {
            let swirlGrad = ctx.createRadialGradient(fX + fW/2, fY + fH/2, 2, fX + fW/2, fY + fH/2, fW);
            swirlGrad.addColorStop(0, '#090514');
            swirlGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.7)');
            swirlGrad.addColorStop(1, portalColor);
            ctx.fillStyle = swirlGrad;
        } else {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
        }
        
        ctx.beginPath();
        ctx.moveTo(fX + 3, fY + fH);
        ctx.lineTo(fX + 3, fY + 20);
        ctx.quadraticCurveTo(fX + fW/2, fY - 5, fX + fW - 3, fY + 20);
        ctx.lineTo(fX + fW - 3, fY + fH);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = finalPortalActive
            ? Math.max(0.12, 0.55 - collapseAmount * 0.3)
            : 0.4 + Math.sin(gameTick * 0.1) * 0.2;
        ctx.beginPath();
        ctx.ellipse(fX + fW/2, fY + fH/2, (fW/2.2) * portalInnerScale, fH/2.2, gameTick * 0.03, 0, Math.PI * 2);
        ctx.stroke();

        if (finalPortalActive) {
            ctx.globalAlpha = 0.45 + pulseAmount * 0.28;
            ctx.strokeStyle = '#a7f3d0';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.ellipse(fX + fW/2, fY + fH/2, fW * (0.86 + pulseAmount), fH * (0.56 + pulseAmount * 0.22), 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.95;
            ctx.strokeStyle = '#d1fae5';
            ctx.lineWidth = 2.2;
            const crackSpread = 8 + shatterAmount * 26;
            for (let i = 0; i < 4; i++) {
                const crackY = fY + 20 + i * 18;
                ctx.beginPath();
                ctx.moveTo(fX + fW / 2, crackY);
                ctx.lineTo(fX + fW / 2 + (i % 2 === 0 ? crackSpread : -crackSpread), crackY - 10);
                ctx.lineTo(fX + fW / 2 + (i % 2 === 0 ? crackSpread * 1.2 : -crackSpread * 1.2), crackY - 22);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    enemies.forEach(enemy => {
        if (!enemy.alive && enemy.squishTime <= 0) return;
        if (!isOnScreen(enemy.x, enemy.width, 100)) return;

        let ex = enemy.x - cameraX;
        let ey = enemy.y;

        ctx.save();
        if (!enemy.alive) {
            ctx.fillStyle = '#64748b';
            ctx.fillRect(ex, ey + 15, enemy.width, 5);
            ctx.restore();
            return;
        }

        if (enemy.type === 'bug') {
            // Nivel 3: Bichos gigantes del valle (Araña con patas y antenas)
            ctx.translate(ex + enemy.width / 2, ey + enemy.height / 2);
            let dir = enemy.vx > 0 ? 1 : -1;
            ctx.scale(dir, 1);

            const bugBody = enemy.variant === 'leaper' ? '#65a30d' : enemy.variant === 'shell' ? '#78350f' : '#065f46';
            const bugHead = enemy.variant === 'leaper' ? '#a3e635' : enemy.variant === 'shell' ? '#92400e' : '#047857';
            ctx.fillStyle = bugBody;
            ctx.beginPath();
            ctx.ellipse(0, 0, 12, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = bugHead;
            ctx.beginPath();
            ctx.arc(8, -4, 6, 0, Math.PI * 2);
            ctx.fill();

            // Ojos rojos brillantes
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(10, -5, 2, 0, Math.PI * 2);
            ctx.fill();

            // Patas móviles
            ctx.strokeStyle = '#022c22';
            ctx.lineWidth = 2.5;
            let wiggle = Math.sin(gameTick * 0.25) * 6;
            ctx.beginPath();
            ctx.moveTo(-6, 2); ctx.lineTo(-12, 8 + wiggle);
            ctx.moveTo(0, 2); ctx.lineTo(0, 10 - wiggle);
            ctx.moveTo(6, 2); ctx.lineTo(12, 8 + wiggle);
            ctx.stroke();
            if (enemy.variant === 'shell') {
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.arc(0, -1, 7, Math.PI, 0);
                ctx.stroke();
            }

        } else if (enemy.type === 'jellyfish') {
            // Medusas del mar profundo
            const jellyColor = enemy.variant === 'surger' ? 'rgba(59, 130, 246, 0.88)' : enemy.variant === 'mine' ? 'rgba(244, 114, 182, 0.82)' : 'rgba(34, 211, 238, 0.85)';
            ctx.shadowColor = enemy.variant === 'mine' ? '#f472b6' : '#22d3ee';
            ctx.shadowBlur = enemy.variant === 'mine'
                ? getShadowBlurValue(16, 8, 0)
                : getShadowBlurValue(10, 5, 0);
            ctx.fillStyle = jellyColor;
            ctx.beginPath();
            ctx.ellipse(ex + 14, ey + 10, 12, 10, 0, Math.PI, 0); 
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(ex + 10, ey + 6, 3, 2, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2;
            let wave = Math.sin(gameTick * 0.15) * 4;
            ctx.beginPath();
            ctx.moveTo(ex + 6, ey + 10); ctx.quadraticCurveTo(ex + 4 + wave, ey + 18, ex + 6 + wave, ey + 22);
            ctx.moveTo(ex + 14, ey + 10); ctx.quadraticCurveTo(ex + 14 - wave, ey + 18, ex + 14 - wave, ey + 22);
            ctx.moveTo(ex + 22, ey + 10); ctx.quadraticCurveTo(ex + 24 + wave, ey + 18, ex + 22 + wave, ey + 22);
            ctx.stroke();
            if (enemy.variant === 'mine') {
                ctx.strokeStyle = 'rgba(244, 114, 182, 0.55)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(ex + 14, ey + 12, 12 + enemy.pulse * 16, 0, Math.PI * 2);
                ctx.stroke();
            }

        } else if (enemy.type === 'zombie') {
            // Zombis caricaturescos de 2.2: silueta verde fácil de
            // reconocer, sin detalles gráficos.
            const zombieDir = enemy.vx >= 0 ? 1 : -1;
            const zombieStep = Math.sin(gameTick * 0.12 + enemy.phase) * 3;
            const skin = enemy.variant === 'brute' ? '#65a30d' : enemy.variant === 'lurker' ? '#86efac' : '#4ade80';
            ctx.translate(ex + enemy.width / 2, ey + enemy.height);
            ctx.scale(zombieDir, 1);
            ctx.fillStyle = 'rgba(2,6,23,.35)'; ctx.beginPath(); ctx.ellipse(0, 2, 16, 4, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#3f3f46'; ctx.lineWidth = 5; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(-5, -8); ctx.lineTo(-7 + zombieStep, 0); ctx.moveTo(5, -8); ctx.lineTo(8 - zombieStep, 0); ctx.stroke();
            ctx.fillStyle = enemy.variant === 'brute' ? '#7c2d12' : '#4338ca';
            traceRoundedRect(ctx, -9, -21, 18, 15, 4); ctx.fill();
            ctx.strokeStyle = skin; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.moveTo(-7, -18); ctx.lineTo(-15, -12 + zombieStep); ctx.moveTo(7, -18); ctx.lineTo(15, -12 - zombieStep); ctx.stroke();
            ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, -27, enemy.variant === 'brute' ? 10 : 9, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(-3.4, -29, 2.5, 0, Math.PI * 2); ctx.arc(3.8, -29, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#312e81'; ctx.beginPath(); ctx.arc(-3, -28.6, 1.2, 0, Math.PI * 2); ctx.arc(4.2, -28.6, 1.2, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#365314'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-3, -23); ctx.lineTo(4, -23); ctx.stroke();
            if (enemy.variant === 'brute') {
                ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.strokeRect(-10, -22, 20, 17);
            }

        } else if (enemy.type === 'ghost') {
            // Fantasmas del Bosque (Nivel 2.1)
            ctx.save();
            // V15: la silueta es bastante más grande sin inflar la
            // caja de colisión, para que sigan siendo justos al jugar.
            const ghostScale = enemy.variant === 'stalker' ? 1.75 : 1.6;
            const ghostCenterX = ex + 14;
            const ghostCenterY = ey + 11;
            ctx.translate(ghostCenterX, ghostCenterY);
            ctx.scale(ghostScale, ghostScale);
            ctx.translate(-ghostCenterX, -ghostCenterY);
            ctx.shadowColor = enemy.variant === 'blink' ? 'rgba(34, 211, 238, 0.45)' : 'rgba(168, 85, 247, 0.4)';
            ctx.shadowBlur = enemy.variant === 'stalker'
                ? getShadowBlurValue(14, 7, 0)
                : getShadowBlurValue(10, 5, 0);
            ctx.fillStyle = enemy.variant === 'stalker' ? 'rgba(216, 180, 254, 0.82)' : enemy.variant === 'blink' ? 'rgba(224, 242, 254, 0.8)' : 'rgba(241, 245, 249, 0.8)'; 
            ctx.beginPath();
            ctx.arc(ex + 14, ey + 10, 10, Math.PI, 0, false);
            ctx.lineTo(ex + 24, ey + 22);
            let wav = Math.sin(gameTick * 0.2) * 3;
            ctx.quadraticCurveTo(ex + 19, ey + 18 + wav, ex + 14, ey + 22);
            ctx.quadraticCurveTo(ex + 9, ey + 18 + wav, ex + 4, ey + 22);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(ex + 10, ey + 9, 2.2, 0, Math.PI * 2);
            ctx.arc(ex + 18, ey + 9, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(ex + 10, ey + 9, 0.8, 0, Math.PI * 2);
            ctx.arc(ex + 18, ey + 9, 0.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ex + 14, ey + 14, 2, 0, Math.PI);
            ctx.stroke();
            if (enemy.variant === 'blink') {
                ctx.strokeStyle = '#67e8f9';
                ctx.beginPath();
                ctx.arc(ex + 14, ey + 12, 13, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();

        } else {
            // Nivel 1: exploradores de Firulais con volumen y silueta
            // propia. Sus cajas de impacto siguen siendo las originales.
            const mouseBody = enemy.variant === 'charger' ? '#f87171' : enemy.variant === 'brute' ? '#475569' : '#94a3b8';
            const mouseHead = enemy.variant === 'charger' ? '#fecaca' : enemy.variant === 'brute' ? '#cbd5e1' : '#e2e8f0';
            const mouseDir = enemy.vx >= 0 ? 1 : -1;
            const mouseStep = Math.sin(gameTick * .25 + enemy.phase) * 2;
            ctx.translate(ex + enemy.width / 2, ey + enemy.height / 2);
            ctx.scale(mouseDir, 1);

            ctx.fillStyle = 'rgba(2,6,23,.3)';
            ctx.beginPath();ctx.ellipse(0,10,15,3.5,0,0,Math.PI*2);ctx.fill();

            ctx.strokeStyle = enemy.variant === 'charger' ? '#fca5a5' : '#64748b';
            ctx.lineWidth = 2.2; ctx.lineCap = 'round';
            ctx.beginPath();ctx.moveTo(-10,2);ctx.bezierCurveTo(-20,-2+mouseStep,-21,7-mouseStep,-27,4);ctx.stroke();

            const mouseGradient = ctx.createRadialGradient(5,-4,1,0,1,17);
            mouseGradient.addColorStop(0, mouseHead);
            mouseGradient.addColorStop(.38, mouseBody);
            mouseGradient.addColorStop(1, enemy.variant === 'brute' ? '#1e293b' : '#475569');
            ctx.fillStyle = mouseGradient;
            ctx.strokeStyle = '#1e293b';ctx.lineWidth = 1;
            ctx.beginPath();ctx.ellipse(0,1,13.5,9.4,-.05,0,Math.PI*2);ctx.fill();ctx.stroke();

            // Patas pequeñas alternadas al desplazarse.
            ctx.fillStyle = '#334155';
            ctx.beginPath();ctx.ellipse(-5+mouseStep,9,4,2,0,0,Math.PI*2);ctx.ellipse(6-mouseStep,9,4,2,0,0,Math.PI*2);ctx.fill();

            ctx.fillStyle = mouseHead;
            ctx.beginPath();ctx.ellipse(9,-2,8,7,-.08,0,Math.PI*2);ctx.fill();ctx.stroke();
            ctx.fillStyle = '#fda4af';
            ctx.beginPath();ctx.arc(5,-8,4,0,Math.PI*2);ctx.fill();
            ctx.fillStyle = mouseHead;ctx.beginPath();ctx.arc(5,-8,2.2,0,Math.PI*2);ctx.fill();

            ctx.fillStyle = '#111827';
            ctx.beginPath();ctx.arc(11,-3,1.7,0,Math.PI*2);ctx.fill();
            ctx.fillStyle = '#ffffff';ctx.beginPath();ctx.arc(11.5,-3.7,.55,0,Math.PI*2);ctx.fill();
            ctx.fillStyle = '#fb7185';
            ctx.beginPath();ctx.ellipse(17,0,2.2,1.55,0,0,Math.PI*2);ctx.fill();

            ctx.strokeStyle = 'rgba(226,232,240,.8)';ctx.lineWidth = .7;
            ctx.beginPath();ctx.moveTo(14,1);ctx.lineTo(22,-2);ctx.moveTo(14,2);ctx.lineTo(23,3);ctx.stroke();

            if (enemy.variant === 'charger') {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();ctx.moveTo(-5,-7);ctx.lineTo(2,-7);ctx.lineTo(4,6);ctx.lineTo(-1,7);ctx.closePath();ctx.fill();
                ctx.fillStyle='#fde047';ctx.beginPath();ctx.arc(1,-5,1.3,0,Math.PI*2);ctx.fill();
            } else if (enemy.variant === 'brute') {
                ctx.fillStyle = '#fde68a';
                traceRoundedRect(ctx,-5,-7,10,3,1.5);ctx.fill();
                ctx.strokeStyle='#94a3b8';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-6,-2);ctx.lineTo(5,4);ctx.stroke();
            }
        }
        ctx.restore();
    });

    // Dibujado del Boss: ¡Firulais el Perro Negro Gigante de Ojos Rojos! (Nivel 6)
    if (currentLevel === 6 && boss.active) {
        let bx = boss.x - cameraX;
        let by = boss.y;

        if (boss.hp > 0) {
            ctx.save();
            
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath();
            ctx.ellipse(bx + 40, by + 95, 35, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            if (boss.hurtTimer > 0 && Math.floor(gameTick / 4) % 2 === 0) {
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(bx, by, boss.width, boss.height);
            } else {
                // Cuerpo negro gigante del perro de lore
                let bGrad = ctx.createRadialGradient(bx + 40, by + 40, 5, bx + 40, by + 50, 48);
                bGrad.addColorStop(0, '#1c1917'); // Color carbón muy oscuro
                bGrad.addColorStop(0.8, '#090514'); // Sombra negra
                bGrad.addColorStop(1, '#020205'); 
                ctx.fillStyle = bGrad;
                ctx.beginPath();
                ctx.ellipse(bx + 40, by + 50, 38, 45, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ef4444'; // Collar de pinchos rojo malvado
                ctx.fillRect(bx + 6, by + 35, 68, 10);
                ctx.fillStyle = '#ffffff'; 
                ctx.fillRect(bx + 14, by + 32, 6, 6);
                ctx.fillRect(bx + 34, by + 32, 6, 6);
                ctx.fillRect(bx + 54, by + 32, 6, 6);

                // Cabeza
                ctx.fillStyle = '#090514';
                ctx.beginPath();
                ctx.arc(bx + 40, by + 20, 22, 0, Math.PI * 2);
                ctx.fill();

                // Ojos rojos malvados gigantescos
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 12;
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(bx + 28, by + 16, 5.5, 0, Math.PI * 2);
                ctx.arc(bx + 52, by + 16, 5.5, 0, Math.PI * 2);
                ctx.fill();

                // Brillo malvado en los ojos
                ctx.fillStyle = '#ffffff'; 
                ctx.beginPath();
                ctx.arc(bx + 28, by + 16, 1.5, 0, Math.PI * 2);
                ctx.arc(bx + 52, by + 16, 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; 

                // Colmillos blancos
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(bx + 26, by + 28); ctx.lineTo(bx + 30, by + 34); ctx.lineTo(bx + 34, by + 28); ctx.closePath(); ctx.fill();
                ctx.beginPath();
                ctx.moveTo(bx + 46, by + 28); ctx.lineTo(bx + 50, by + 34); ctx.lineTo(bx + 54, by + 28); ctx.closePath(); ctx.fill();

                ctx.fillStyle = '#1c1917';
                let step = Math.sin(gameTick * 0.2) * 8;
                ctx.fillRect(bx + 10, by + 85, 18, 15 + step);
                ctx.fillRect(bx + 52, by + 85, 18, 15 - step);
            }

            // Barra de salud del Boss
            let hpPercent = boss.hp / boss.maxHp;
            ctx.fillStyle = '#44403c';
            ctx.fillRect(bx + 10, by - 16, 60, 6);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(bx + 10, by - 16, 60 * hpPercent, 6);

            ctx.restore();
        }

        // Huesos de energía lanzados por Firulais
        bones.forEach(bone => {
            if (!isOnScreen(bone.x, bone.width, 90)) return;
            let bonX = bone.x - cameraX;
            ctx.save();
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(bonX + 12, bone.y + 8, 12, 5, 0, 0, Math.PI * 2);
            ctx.arc(bonX + 3, bone.y + 4, 4, 0, Math.PI * 2);
            ctx.arc(bonX + 3, bone.y + 12, 4, 0, Math.PI * 2);
            ctx.arc(bonX + 21, bone.y + 4, 4, 0, Math.PI * 2);
            ctx.arc(bonX + 21, bone.y + 12, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    // Familia Secuestrada: Mamá gata, Papá gato y la Hermana pequeña
    if (currentLevel === 6) {
        let px = princess.x - cameraX;
        ctx.save();
        
        // 1. PAPÁ GATITO (Gris con bigote gracioso)
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(px + 10, princess.y + 18, 10, 0, Math.PI * 2); 
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + 10, princess.y + 10, 7, 0, Math.PI * 2); 
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px + 4, princess.y + 6); ctx.lineTo(px + 5, princess.y + 1); ctx.lineTo(px + 8, princess.y + 5); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px + 12, princess.y + 5); ctx.lineTo(px + 15, princess.y + 1); ctx.lineTo(px + 16, princess.y + 6); ctx.fill();
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + 7, princess.y + 12); ctx.lineTo(px + 5, princess.y + 11);
        ctx.moveTo(px + 13, princess.y + 12); ctx.lineTo(px + 15, princess.y + 11);
        ctx.stroke();

        // 2. MAMÁ GATITO (Crema con lazo rosa)
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(px + 34, princess.y + 18, 10, 0, Math.PI * 2); 
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + 34, princess.y + 10, 7, 0, Math.PI * 2); 
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px + 28, princess.y + 6); ctx.lineTo(px + 29, princess.y + 1); ctx.lineTo(px + 32, princess.y + 5); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px + 36, princess.y + 5); ctx.lineTo(px + 39, princess.y + 1); ctx.lineTo(px + 40, princess.y + 6); ctx.fill();
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(px + 34, princess.y + 5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 3. LA HERMANITA MENOR (Blanca al centro)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px + 22, princess.y + 22, 6, 0, Math.PI * 2); 
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + 22, princess.y + 16, 5, 0, Math.PI * 2); 
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px + 18, princess.y + 14); ctx.lineTo(px + 19, princess.y + 10); ctx.lineTo(px + 21, princess.y + 13); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px + 23, princess.y + 13); ctx.lineTo(px + 25, princess.y + 10); ctx.lineTo(px + 26, princess.y + 14); ctx.fill();

        // Jaula dorada del lore
        if (princess.jailed) {
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 3.5;
            ctx.fillStyle = 'rgba(250, 204, 21, 0.05)';
            ctx.fillRect(px - 4, princess.y - 8, princess.width + 8, princess.height + 8);
            ctx.strokeRect(px - 4, princess.y - 8, princess.width + 8, princess.height + 8);

            ctx.beginPath();
            ctx.moveTo(px + 3, princess.y - 8); ctx.lineTo(px + 3, princess.y + 32);
            ctx.moveTo(px + 13, princess.y - 8); ctx.lineTo(px + 13, princess.y + 32);
            ctx.moveTo(px + 23, princess.y - 8); ctx.lineTo(px + 23, princess.y + 32);
            ctx.moveTo(px + 33, princess.y - 8); ctx.lineTo(px + 33, princess.y + 32);
            ctx.moveTo(px + 43, princess.y - 8); ctx.lineTo(px + 43, princess.y + 32);
            ctx.stroke();

            ctx.fillStyle = '#f43f5e';
            ctx.font = 'bold 11px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText('¡Ayuda!', px + 22, princess.y - 14);
        }

        ctx.restore();
    }

    particles.forEach(p => {
        if (!isOnScreen(p.x, p.size || 6, 60)) return;
        p.draw();
    });

    // Renderizar SUPER MIAU
    ctx.save();
    if (finalPortalSequence.active) {
        ctx.globalAlpha = finalPortalSequence.playerAlpha;
    } else if (player.hiddenInHole) {
        ctx.globalAlpha = .24;
    }
    drawCat(
        ctx,
        player.x,
        player.y,
        player.width,
        player.height,
        player.direction,
        player.isMoving,
        !player.grounded,
        gameTick,
        finalPortalSequence.active ? 0 : player.invulnerable
    );
    if (player.zombieStunTimer > 0) {
        const secondsLeft = Math.max(1, Math.ceil(player.zombieStunTimer / 60));
        const labelX = player.x + player.width / 2 - cameraX;
        const labelY = Math.max(24, player.y - 18);
        ctx.fillStyle = 'rgba(20,83,45,.92)';
        traceRoundedRect(ctx, labelX - 48, labelY - 15, 96, 21, 8); ctx.fill();
        ctx.strokeStyle = '#86efac'; ctx.lineWidth = 1.5; traceRoundedRect(ctx, labelX - 48, labelY - 15, 96, 21, 8); ctx.stroke();
        ctx.fillStyle = '#dcfce7'; ctx.font = 'bold 10px Fredoka'; ctx.textAlign = 'center';
        ctx.fillText(`ATURDIDO · ${secondsLeft}s`, labelX, labelY);
    }
    if (player.webStunTimer > 0) {
        const secondsLeft = Math.max(1, Math.ceil(player.webStunTimer / 60));
        const centerX = player.x + player.width / 2 - cameraX;
        const centerY = player.y + player.height / 2;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 1.6;
        for (let ring = 1; ring <= 3; ring++) {
            ctx.beginPath(); ctx.arc(centerX, centerY, 8 + ring * 7, 0, Math.PI * 2); ctx.stroke();
        }
        for (let ray = 0; ray < 7; ray++) {
            const angle = ray * Math.PI * 2 / 7;
            ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(centerX + Math.cos(angle) * 29, centerY + Math.sin(angle) * 29); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(15,23,42,.92)'; traceRoundedRect(ctx, centerX - 58, Math.max(18, player.y - 28), 116, 22, 8); ctx.fill();
        ctx.strokeStyle = '#e2e8f0'; traceRoundedRect(ctx, centerX - 58, Math.max(18, player.y - 28), 116, 22, 8); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px Fredoka'; ctx.textAlign = 'center';
        ctx.fillText(`ATRAPADO · ${secondsLeft}s`, centerX, Math.max(33, player.y - 13));
    } else if (player.hiddenInHole) {
        const centerX = player.x + player.width / 2 - cameraX;
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(5,46,22,.92)'; traceRoundedRect(ctx, centerX - 40, player.y - 25, 80, 20, 8); ctx.fill();
        ctx.strokeStyle = '#86efac'; ctx.lineWidth = 1.4; traceRoundedRect(ctx, centerX - 40, player.y - 25, 80, 20, 8); ctx.stroke();
        ctx.fillStyle = '#dcfce7'; ctx.font = 'bold 9px Fredoka'; ctx.textAlign = 'center'; ctx.fillText('OCULTO ✓', centerX, player.y - 11);
    }
    ctx.restore();

    // Bruma, luz de borde y viñeta suave unen las capas del escenario.
    drawForegroundDepth();
    drawLevelOneStormOverlay();
    drawVampireBattleHud();

    // Cartela breve al entrar: presenta cada mundo como un capítulo de
    // la historia, no solamente como un número de nivel.
    const introAge = gameTick - levelStartedAt;
    if (introAge >= 0 && introAge < 190) {
        const identity = getCurrentIdentity();
        const fade = Math.min(1, introAge / 20, (190 - introAge) / 30);
        ctx.save(); ctx.globalAlpha = Math.max(0, fade);
        ctx.fillStyle = 'rgba(2,6,23,.88)'; ctx.fillRect(150, 32, 500, 82);
        ctx.strokeStyle = identity.accent; ctx.lineWidth = 2; ctx.strokeRect(150, 32, 500, 82);
        ctx.textAlign = 'center'; ctx.fillStyle = identity.accent; ctx.font = 'bold 13px Fredoka';
        ctx.fillText(`${identity.icon}  NIVEL ${getCurrentLevelLabel()}`, 400, 54);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 27px Fredoka'; ctx.fillText(identity.name, 400, 84);
        ctx.fillStyle = '#cbd5e1'; ctx.font = '13px Fredoka'; ctx.fillText(identity.subtitle, 400, 103);
        ctx.restore();
    }

    if (finalPortalSequence.active) {
        ctx.save();
        const panelAlpha = Math.max(0, 1 - finalPortalSequence.fade * 0.85);
        const overlayLabel = finalPortalSequence.phase === 'reunion' || finalPortalSequence.phase === 'afterglow' || finalPortalSequence.phase === 'fade'
            ? 'REGRESO A CASA'
            : 'PORTAL FINAL';
        const finalProgress = Math.min(
            1,
            0.1 +
            finalPortalSequence.collapse * 0.34 +
            finalPortalSequence.shatter * 0.24 +
            finalPortalSequence.homeGlow * 0.18 +
            finalPortalSequence.fade * 0.24
        );
        ctx.globalAlpha = panelAlpha;
        ctx.fillStyle = 'rgba(2, 6, 23, 0.78)';
        ctx.fillRect(90, 18, 620, 122);
        if (finalPortalSequence.flash > 0) {
            ctx.fillStyle = `rgba(186, 230, 253, ${Math.min(0.32, finalPortalSequence.flash * 0.32)})`;
            ctx.fillRect(90, 18, 620, 122);
        }
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 2;
        ctx.strokeRect(90, 18, 620, 122);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(142, 109, 516, 10);
        ctx.fillStyle = '#34d399';
        ctx.fillRect(144, 111, 512 * finalProgress, 6);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#a7f3d0';
        ctx.font = 'bold 14px Fredoka';
        ctx.fillText(overlayLabel, 400, 44);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 27px Fredoka';
        ctx.fillText(finalPortalSequence.message, 400, 76);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '14px Fredoka';
        ctx.fillText(finalPortalSequence.detail, 400, 99);
        ctx.font = 'bold 11px Fredoka';
        ctx.fillStyle = '#86efac';
        ctx.fillText('Secuencia final en progreso', 400, 132);
        if (finalPortalSequence.phase === 'reunion' || finalPortalSequence.phase === 'afterglow' || finalPortalSequence.phase === 'fade') {
            ctx.fillStyle = `rgba(253, 224, 71, ${Math.min(0.22, finalPortalSequence.homeGlow * 0.22)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height * 0.42);
        }
        if (finalPortalSequence.phase === 'fade') {
            ctx.fillStyle = `rgba(2, 6, 23, ${Math.min(0.96, finalPortalSequence.fade)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        if (finalPortalSequence.flash > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.26, finalPortalSequence.flash * 0.22)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.restore();
    }

    ctx.restore(); 
}

// Elige la pose PNG a partir del estado real del personaje. Los
// temporizadores visuales no intervienen en movimiento ni colisiones.
function loop(timestamp) {
    if (!gameActive) return;

    const now = typeof timestamp === 'number' ? timestamp : performance.now();
    let frameDelta = 0;
    let updatesThisFrame = 0;

    if (isPaused) {
        lastTime = now;
        physicsAccumulator = 0;
    } else {
        frameDelta = Math.min(MAX_FRAME_DELTA, Math.max(0, now - lastTime));
        lastTime = now;
        physicsAccumulator += frameDelta;

        while (
            gameActive &&
            physicsAccumulator >= FIXED_TIME_STEP &&
            updatesThisFrame < MAX_UPDATES_PER_FRAME
        ) {
            updateGame();
            physicsAccumulator -= FIXED_TIME_STEP;
            updatesThisFrame++;
        }

        // Si el navegador estuvo detenido, descartamos el retraso
        // sobrante para que el juego no acelere intentando recuperarlo.
        if (updatesThisFrame === MAX_UPDATES_PER_FRAME) {
            physicsAccumulator = 0;
        }
    }
    lastUpdatesThisFrame = frameDelta > 0 ? updatesThisFrame : 0;
    updateRuntimeQuality(frameDelta);
    updateDebugHud();
    renderGame();

    if (gameActive) {
        animationFrameId = requestAnimationFrame(loop);
    }
}

// Ajusta el tamano del lienzo al espacio disponible sin deformar la partida.
function resizeCanvas() {
    canvas.width = 800;
    canvas.height = 450;
    cutsceneCanvas.width = 800;
    cutsceneCanvas.height = 450;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    cutsceneCtx.imageSmoothingEnabled = true;
    if (cutsceneActive) {
        const elapsed = cutsceneStartTime === null
            ? 0
            : Math.min(CUTSCENE_DURATION, performance.now() - cutsceneStartTime);
        renderCutsceneFrameSafely(elapsed);
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        resetInputState();
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        suspendedByVisibility = gameActive && !isPaused;
        lastTime = performance.now();
        physicsAccumulator = 0;
        return;
    }

    if (suspendedByVisibility && gameActive && !isPaused && !animationFrameId) {
        suspendedByVisibility = false;
        lastTime = performance.now();
        physicsAccumulator = 0;
        animationFrameId = requestAnimationFrame(loop);
    }
});

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 200);
});
document.addEventListener('fullscreenchange', updateFullscreenButtons);
document.addEventListener('webkitfullscreenchange', updateFullscreenButtons);

loadProgress();

// Prepara el lienzo y la interfaz apenas el navegador termina de cargar el archivo.
window.onload = () => {
    resizeCanvas();
    setCutsceneVisible(false);
    syncWalletDisplays();
    toggleDeveloperPanel(false);
    populateDeveloperLevelOptions();
    updateShopUI();
    updateFullscreenButtons();
};
