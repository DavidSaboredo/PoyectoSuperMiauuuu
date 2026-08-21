// Entidades visuales sin lógica de actualización o colisión.

function drawTrafficCar(car) {
    if (!isOnScreen(car.x, car.width, 100)) return;
    const x = car.x - cameraX;
    const y = car.y;
    ctx.save();
    ctx.fillStyle = 'rgba(2,6,23,.45)'; ctx.beginPath(); ctx.ellipse(x + car.width / 2, y + car.height + 5, car.width * .48, 7, 0, 0, Math.PI * 2); ctx.fill();
    const body = ctx.createLinearGradient(x, y, x, y + car.height);
    body.addColorStop(0, '#ffffff'); body.addColorStop(.12, car.color); body.addColorStop(1, '#1e293b');
    ctx.fillStyle = body; traceRoundedRect(ctx, x, y + car.height * .28, car.width, car.height * .58, 10); ctx.fill();
    ctx.fillStyle = car.kind === 'colectivo' ? '#1e3a5f' : '#dbeafe';
    traceRoundedRect(ctx, x + car.width * .18, y, car.width * .56, car.height * .42, 8); ctx.fill();
    ctx.fillStyle = '#7dd3fc';
    if (car.kind === 'colectivo') {
        for (let wx = x + 12; wx < x + car.width - 18; wx += 24) ctx.fillRect(wx, y + 7, 17, 14);
    } else {
        ctx.fillRect(x + car.width * .24, y + 7, car.width * .2, 14);
        ctx.fillRect(x + car.width * .49, y + 7, car.width * .18, 14);
    }
    ctx.fillStyle = '#0f172a';
    [x + car.width * .22, x + car.width * .78].forEach(cx => { ctx.beginPath(); ctx.arc(cx, y + car.height * .84, 10, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#94a3b8';
    [x + car.width * .22, x + car.width * .78].forEach(cx => { ctx.beginPath(); ctx.arc(cx, y + car.height * .84, 4, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#fef08a'; ctx.fillRect(x + 2, y + car.height * .49, 7, 7);
    if (car.waiting) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + car.width - 7, y + car.height * .48, 5, 8);
    }
    ctx.restore();
}

function drawStreetBird() {
    if (!streetBird || !streetBird.active || !isOnScreen(streetBird.x, streetBird.width, 140)) return;

    const x = streetBird.x - cameraX;
    const y = streetBird.y;
    const flap = Math.sin(streetBird.phase * 2.1) * 7;
    ctx.save();
    ctx.translate(x, y);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(14, 13);
    ctx.quadraticCurveTo(3, -2 - flap, -8, 6);
    ctx.moveTo(16, 13);
    ctx.quadraticCurveTo(27, -2 + flap, 35, 7);
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.beginPath(); ctx.ellipse(15, 13, 15, 10, -.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(26, 8, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(28, 6, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fb923c';
    ctx.beginPath(); ctx.moveTo(33, 8); ctx.lineTo(42, 11); ctx.lineTo(33, 13); ctx.closePath(); ctx.fill();

    if (dogcatcher && dogcatcher.distractedTimer > 0) {
        ctx.fillStyle = 'rgba(255,255,255,.94)';
        traceRoundedRect(ctx, -12, -31, 52, 19, 8); ctx.fill();
        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 10px Fredoka';
        ctx.textAlign = 'center';
        ctx.fillText('¡PÍO!', 14, -18);
    }
    ctx.restore();
}

function drawDogcatcher() {
    if (!dogcatcher || !dogcatcher.active || !isOnScreen(dogcatcher.x, dogcatcher.width, 120)) return;
    const x = dogcatcher.x - cameraX;
    const y = dogcatcher.y;
    const bob = Math.abs(Math.sin(dogcatcher.runPhase)) * 0.8;
    ctx.save();
    ctx.fillStyle = 'rgba(2,6,23,.5)'; ctx.beginPath(); ctx.ellipse(x + 21, 382, 25, 6, 0, 0, Math.PI * 2); ctx.fill();
    if (DOGCATCHER_SPRITE.complete && DOGCATCHER_SPRITE.naturalWidth > 0) {
        const drawHeight = 138;
        const drawWidth = drawHeight * (DOGCATCHER_SPRITE.naturalWidth / DOGCATCHER_SPRITE.naturalHeight);
        const feetAnchorY = 1486 / 1672;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(DOGCATCHER_SPRITE, x + 21 - drawWidth / 2, y + dogcatcher.height + 2 - drawHeight * feetAnchorY - bob, drawWidth, drawHeight);
    }
    if (dogcatcher.distractedTimer > 0) {
        ctx.fillStyle = 'rgba(254,249,195,.96)'; traceRoundedRect(ctx, x + 48, y - 15, 48, 22, 9); ctx.fill();
        ctx.fillStyle = '#854d0e'; ctx.font = 'bold 11px Fredoka'; ctx.textAlign = 'center'; ctx.fillText('¿EH?', x + 72, y);
    }
    ctx.restore();
}

function getSuperMiauSpriteState(isMoving, isJumping) {
    if (player.hurtAnimationTimer > 0) return 'golpeado';
    if (player.celebrateAnimationTimer > 0 || (flagpole.reached && !finalPortalSequence.active)) return 'festejando';

    if (player.attackAnimationTimer > 0) {
        return player.attackAnimationTimer > 9 ? 'maullando' : 'disparando';
    }

    if (player.landingAnimationTimer > 0) return 'aterrizando';
    if (isJumping) return player.vy < 1.1 ? 'volando' : 'aterrizando';
    if (isMoving) return 'caminando';
    return 'quieto';
}

// Dibuja una ilustracion sobre la caja fisica del jugador. El punto de
// apoyo de cada PNG mantiene las patas en el suelo y permite reflejar
// automaticamente todas las poses cuando Miau mira a la izquierda.
function drawSuperMiauSprite(ctx, x, y, width, height, direction, isMoving, isJumping, tick) {
    const state = getSuperMiauSpriteState(isMoving, isJumping);
    const data = SUPER_MIAU_SPRITE_DATA[state];
    const image = SUPER_MIAU_SPRITES[state];

    if (!data || !image || !image.complete || image.naturalWidth <= 0) return false;

    const centerX = x + width / 2 - cameraX;
    const feetY = y + height;
    const characterScale = Math.min(width / 32, height / 32);
    // V6: tamaño más compacto, con los pies apoyados en el mismo punto.
    const visualScale = 0.58;
    const drawHeight = data.height * characterScale * visualScale;
    const drawWidth = drawHeight * (image.naturalWidth / image.naturalHeight);
    const speedRatio = Math.min(1, Math.abs(player.vx) / Math.max(1, player.speed));
    const runWave = Math.sin(tick * (0.24 + speedRatio * 0.08));
    const bob = state === 'caminando'
        ? -Math.abs(runWave) * 1.6 * characterScale
        : (state === 'quieto' ? Math.sin(tick * 0.055) * 0.45 * characterScale : 0);
    const tilt = isJumping
        ? Math.max(-0.06, Math.min(0.06, player.vy * 0.007))
        : (state === 'caminando' ? runWave * 0.012 : 0);
    const shadowScale = player.grounded ? 1 : 0.52;

    ctx.save();
    const shadow = ctx.createRadialGradient(centerX, feetY + 2, 1, centerX, feetY + 2, width * 1.05);
    shadow.addColorStop(0, `rgba(2,6,23,${0.42 * shadowScale})`);
    shadow.addColorStop(1, 'rgba(2,6,23,0)');
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(centerX, feetY + 3, width * 0.95 * shadowScale, 5.5 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Los poderes siguen teniendo una lectura clara alrededor del PNG.
    if (player.powerup === 'strength') {
        ctx.save();
        ctx.globalAlpha = 0.34 + Math.sin(tick * 0.18) * 0.08;
        ctx.strokeStyle = '#fde047';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = getShadowBlurValue(20, 9, 2);
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(centerX, feetY - drawHeight * 0.48, drawWidth * 0.4, drawHeight * 0.56, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    ctx.save();
    ctx.translate(centerX, feetY + bob);
    ctx.scale(direction === -1 ? -1 : 1, 1);
    ctx.rotate(tilt);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.shadowColor = player.powerup === 'lightning' ? 'rgba(250,204,21,.48)' : 'rgba(15,23,42,.34)';
    ctx.shadowBlur = getShadowBlurValue(player.powerup === 'lightning' ? 12 : 7, 4, 0);
    ctx.shadowOffsetY = 2;
    if (player.zombieStunTimer > 0) {
        ctx.filter = 'hue-rotate(78deg) saturate(2.1) brightness(.95)';
        ctx.shadowColor = 'rgba(74,222,128,.8)';
        ctx.shadowBlur = getShadowBlurValue(16, 8, 2);
    }
    ctx.drawImage(image, -drawWidth * data.anchorX, -drawHeight, drawWidth, drawHeight);
    ctx.restore();

    return true;
}

// Super Miau 2.5D. El dibujo puede sobresalir un poco de la caja de
// colision, pero la caja real (width/height) no se modifica.
function drawCat(ctx, x, y, width, height, direction, isMoving, isJumping, tick, isInvulnerable) {
    if (isInvulnerable > 0 && player.zombieStunTimer <= 0 && Math.floor(tick / 4) % 2 === 0) return;
    if (drawSuperMiauSprite(ctx, x, y, width, height, direction, isMoving, isJumping, tick)) return;

    // Indicador temporal mientras el sprite solicitado todavía se está cargando.
    ctx.save();
    ctx.translate(x + width / 2 - cameraX, y + height / 2);
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#be123c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#881337';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', 0, 1);
    ctx.restore();
}
