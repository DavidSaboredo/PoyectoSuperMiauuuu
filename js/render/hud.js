// Interfaz visual del juego. No contiene física ni reglas de combate.

function toggleDebugHud() {
    debugHudVisible = !debugHudVisible;
    if (debugHudVisible) {
        ui.debugHud.classList.remove('hidden');
        updateDebugHud(true);
    } else {
        ui.debugHud.classList.add('hidden');
    }
}

function updateDebugHud(force = false) {
    if (!debugHudVisible) return;
    if (!force) {
        debugHudRefreshCountdown++;
        if (debugHudRefreshCountdown < 6) return;
    }
    debugHudRefreshCountdown = 0;

    const activeEnemies = enemies.reduce((count, enemy) => count + (enemy.alive ? 1 : 0), 0);
    const activeObjects = activeEnemies + hazards.length + bubbles.length + bones.length + playerProjectiles.length + poppedPowerups.length + bats.length + forestChests.length;
    const fps = smoothedFrameMs > 0 ? (1000 / smoothedFrameMs) : 0;

    ui.debugFps.textContent = fps.toFixed(1);
    ui.debugFrame.textContent = `${smoothedFrameMs.toFixed(1)} ms`;
    ui.debugQuality.textContent = runtimeQuality;
    ui.debugParticles.textContent = `${particles.length}/${getParticleSoftLimit()}`;
    ui.debugEnemies.textContent = `${activeEnemies}`;
    ui.debugEntities.textContent = `${activeObjects}`;
    ui.debugUpdates.textContent = `${lastUpdatesThisFrame}`;
    ui.debugLevel.textContent = getCurrentLevelLabel();
}

// Refresca el contador de huellas recogidas durante la partida actual.
function syncHudCoins() {
    ui.headerCoins.textContent = player.coins;
}

// Refresca las vidas visibles del jugador en la interfaz.
function syncHudLives() {
    ui.headerLives.textContent = player.lives;
}

function refreshLevelHud() {
    const identity = getCurrentIdentity();
    ui.headerLevel.textContent = getCurrentLevelLabel();
    ui.headerLevelName.textContent = identity.name;
}

// Actualiza el indicador visual del poder activo del jugador.
function updatePowerBadge() {
    const sprayActive = currentLevel === 2 && levelTwoSection === 3 && player.batSprayOwned;
    const dragonFireActive = ((currentLevel === 5 && levelFiveSection === 3) || (currentLevel === 6 && levelSixSection === 1)) && !!dragonBoss?.mounted;
    const actionIcon = ui.btnShoot.querySelector('span:first-child');
    const actionLabel = ui.btnShoot.querySelector('span:last-child');
    if (actionIcon) actionIcon.textContent = dragonFireActive ? '🔥' : sprayActive ? '🧴' : '⭐';
    if (actionLabel) actionLabel.textContent = dragonFireActive ? 'FUEGO' : sprayActive ? 'AEROSOL' : 'ESTELAR';

    if (dragonFireActive) {
        ui.powerBadge.classList.remove('hidden');
        ui.powerBadge.className = "hud-pill bg-orange-950/70 px-3 py-1 rounded-full border border-orange-400/50 text-orange-200 font-bold flex items-center gap-1 animate-pulse";
        ui.powerIcon.textContent = '🔥';
        ui.powerText.textContent = 'Fuego de dragón';
        ui.powerTimerText.classList.add('hidden');
        ui.btnShoot.classList.remove('opacity-40', 'text-gray-500', 'text-cyan-300', 'text-emerald-300');
        ui.btnShoot.classList.add('text-orange-300');
    } else if (sprayActive) {
        ui.powerBadge.classList.remove('hidden');
        ui.powerBadge.className = "hud-pill bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-400/50 text-emerald-200 font-bold flex items-center gap-1 animate-pulse";
        ui.powerIcon.textContent = '🧴';
        ui.powerText.textContent = 'Anti-murciélagos';
        ui.powerTimerText.classList.add('hidden');
        ui.btnShoot.classList.remove('opacity-40', 'text-gray-500', 'text-cyan-300');
        ui.btnShoot.classList.remove('text-orange-300');
        ui.btnShoot.classList.add('text-emerald-300');
    } else if (player.powerup === 'none') {
        ui.powerBadge.classList.add('hidden');
        ui.btnShoot.classList.add('opacity-40', 'text-gray-500');
        ui.btnShoot.classList.remove('text-cyan-300', 'text-emerald-300', 'text-orange-300');
    } else if (player.powerup === 'lightning') {
        ui.powerBadge.classList.remove('hidden');
        ui.powerBadge.className = "hud-pill bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-500/50 text-cyan-300 font-bold flex items-center gap-1 animate-pulse";
        ui.powerIcon.textContent = '⭐';
        ui.powerText.textContent = 'M. Estelar';
        ui.powerTimerText.classList.add('hidden');
        ui.btnShoot.classList.remove('opacity-40', 'text-gray-500');
        ui.btnShoot.classList.remove('text-emerald-300', 'text-orange-300');
        ui.btnShoot.classList.add('text-cyan-300');
    } else if (player.powerup === 'strength') {
        ui.powerBadge.classList.remove('hidden');
        ui.powerBadge.className = "hud-pill bg-red-950/70 px-3 py-1 rounded-full border border-red-500/50 text-red-300 font-bold flex items-center gap-1";
        ui.powerIcon.textContent = '💪';
        ui.powerText.textContent = 'Fuerza Felina';
        ui.powerTimerText.classList.remove('hidden');
        ui.powerTimerText.textContent = `${Math.ceil(player.powerTimer / 60)}s`;
        ui.btnShoot.classList.add('opacity-40', 'text-gray-500');
        ui.btnShoot.classList.remove('text-cyan-300', 'text-emerald-300', 'text-orange-300');
    }
}

function drawVampireBattleHud() {
    if (!isVampireBattleSection() || !vampireBattle.entered) return;
    if (vampireBattle.defeated && vampireBattle.introTimer <= 0) return;

    const drawHealthBar = (x, y, width, value, maxValue, color, label, alignRight = false) => {
        const ratio = Math.max(0, Math.min(1, value / maxValue));
        ctx.fillStyle = 'rgba(2,6,23,.9)';
        traceRoundedRect(ctx, x - 6, y - 21, width + 12, 43, 10); ctx.fill();
        ctx.fillStyle = '#1e293b';
        traceRoundedRect(ctx, x, y, width, 12, 5); ctx.fill();
        ctx.fillStyle = color;
        if (ratio > 0) {
            traceRoundedRect(ctx, x, y, Math.max(4, width * ratio), 12, 5); ctx.fill();
        }
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px Fredoka';
        ctx.textAlign = alignRight ? 'right' : 'left';
        ctx.fillText(`${label}  ${Math.ceil(value)}/${maxValue}`, alignRight ? x + width : x, y - 7);
    };

    ctx.save();
    drawHealthBar(54, 31, 250, vampireBattle.playerHp, vampireBattle.playerMaxHp, '#22c55e', 'SUPER MIAU');
    drawHealthBar(496, 31, 250, vampireBattle.hp, vampireBattle.maxHp, '#a855f7', 'VAMPIRO', true);

    if (vampireBattle.introTimer > 0) {
        const introAlpha = Math.min(1, vampireBattle.introTimer / 25);
        ctx.globalAlpha = introAlpha;
        ctx.fillStyle = 'rgba(2,6,23,.88)';
        traceRoundedRect(ctx, 205, 74, 390, 54, 12); ctx.fill();
        ctx.strokeStyle = vampireBattle.defeated ? '#86efac' : '#c084fc';
        ctx.lineWidth = 2;
        traceRoundedRect(ctx, 205, 74, 390, 54, 12); ctx.stroke();
        ctx.textAlign = 'center';
        ctx.fillStyle = vampireBattle.defeated ? '#bbf7d0' : '#f3e8ff';
        ctx.font = 'bold 18px Fredoka';
        ctx.fillText(vampireBattle.defeated ? '¡VAMPIRO DERROTADO! LA SALIDA SE ABRIÓ' : '¡JEFE EXTRA! · VAMPIRO DE LA CRIPTA', 400, 97);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 11px Fredoka';
        ctx.fillText(vampireBattle.defeated ? 'Cruzá la puerta verde para continuar' : 'Rocialo con el aerosol · F / SHIFT / botón de ataque', 400, 116);
    }
    ctx.restore();
}
