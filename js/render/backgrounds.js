// Fondos y escenografía sin lógica de colisiones. Cargar antes de game.js.

function drawParqueFence(baseY) {
    ctx.save();
    const offset = -((cameraX * .74) % 29) - 29;
    ctx.strokeStyle = '#27313b';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, baseY - 34); ctx.lineTo(canvas.width, baseY - 34); ctx.moveTo(0, baseY - 8); ctx.lineTo(canvas.width, baseY - 8); ctx.stroke();
    for (let x = offset; x < canvas.width + 29; x += 29) {
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, baseY + 3); ctx.lineTo(x, baseY - 54); ctx.stroke();
        ctx.fillStyle = '#27313b';
        ctx.beginPath(); ctx.moveTo(x - 5, baseY - 54); ctx.lineTo(x, baseY - 63); ctx.lineTo(x + 5, baseY - 54); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
}

function drawParqueLamp(x, baseY, scale = 1) {
    ctx.save();
    ctx.translate(x, baseY); ctx.scale(scale, scale);
    ctx.strokeStyle = '#313840'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -112); ctx.stroke();
    ctx.fillStyle = '#313840'; ctx.fillRect(-12, -123, 24, 8);
    ctx.shadowColor = '#ffd166'; ctx.shadowBlur = getShadowBlurValue(14, 7, 0);
    ctx.fillStyle = '#ffe6a1';
    ctx.beginPath(); ctx.moveTo(-10, -121); ctx.lineTo(-7, -145); ctx.lineTo(7, -145); ctx.lineTo(10, -121); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = '#313840'; ctx.beginPath(); ctx.moveTo(-12, -145); ctx.lineTo(0, -154); ctx.lineTo(12, -145); ctx.closePath(); ctx.fill();
    ctx.restore();
}

function drawParqueBench(x, baseY, scale = 1) {
    ctx.save(); ctx.translate(x, baseY); ctx.scale(scale, scale);
    ctx.fillStyle = '#6c3e25'; ctx.fillRect(-35, -28, 70, 9); ctx.fillRect(-35, -45, 70, 9); ctx.fillRect(-35, -58, 70, 8);
    ctx.fillStyle = '#303942'; ctx.fillRect(-28, -19, 6, 23); ctx.fillRect(22, -19, 6, 23);
    ctx.strokeStyle = '#303942'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-30, -57); ctx.lineTo(-25, -15); ctx.moveTo(30, -57); ctx.lineTo(25, -15); ctx.stroke();
    ctx.restore();
}

function drawParqueFlag(x, baseY, scale = 1) {
    ctx.save(); ctx.translate(x, baseY); ctx.scale(scale, scale);
    ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -180); ctx.stroke();
    const wave = Math.sin(gameTick * .055) * 4;
    ctx.fillStyle = '#72bde8'; ctx.beginPath(); ctx.moveTo(3, -174); ctx.quadraticCurveTo(39, -184 + wave, 78, -168); ctx.lineTo(78, -144); ctx.quadraticCurveTo(39, -158 + wave, 3, -150); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.moveTo(3, -166); ctx.quadraticCurveTo(39, -174 + wave, 78, -158); ctx.lineTo(78, -151); ctx.quadraticCurveTo(39, -164 + wave, 3, -157); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f5b82e'; ctx.beginPath(); ctx.arc(40, -161 + wave * .25, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

function drawParqueWoodSign(x, baseY, title, detail) {
    ctx.save(); ctx.translate(x, baseY);
    ctx.fillStyle = '#76502f'; ctx.fillRect(10, -7, 7, 66); ctx.fillRect(113, -7, 7, 66);
    const wood = ctx.createLinearGradient(0, -62, 0, 0);
    wood.addColorStop(0, '#b87835'); wood.addColorStop(1, '#80502b');
    ctx.fillStyle = wood; traceRoundedRect(ctx, 0, -62, 130, 58, 7); ctx.fill();
    ctx.strokeStyle = '#5a361f'; ctx.lineWidth = 3; traceRoundedRect(ctx, 2, -60, 126, 54, 6); ctx.stroke();
    ctx.fillStyle = '#fff0c2'; ctx.textAlign = 'center'; ctx.font = 'bold 13px Fredoka'; ctx.fillText(title, 65, -38);
    ctx.fillStyle = '#ffe09a'; ctx.font = 'bold 9px Fredoka'; ctx.fillText(detail, 65, -21);
    ctx.restore();
}

function drawParqueSurenoEnvironment() {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#020617');
    sky.addColorStop(.48, '#07152a');
    sky.addColorStop(.78, '#0d2038');
    sky.addColorStop(1, '#16283a');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noche cerrada: sólo queda un resplandor frío detrás de las nubes.
    const sunX = 620 - cameraX * .022;
    const glow = ctx.createRadialGradient(sunX, 118, 8, sunX, 118, 180);
    glow.addColorStop(0, 'rgba(191,219,254,.13)'); glow.addColorStop(.5, 'rgba(96,165,250,.055)'); glow.addColorStop(1, 'rgba(30,64,175,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 40, canvas.width, 300);

    const drift = (gameTick * .028) % 120;
    drawParqueCloud(95 - drift * .22, 83, .72, .72);
    drawParqueCloud(370 - drift * .13, 132, .58, .54);
    drawParqueCloud(680 - drift * .17, 78, .9, .65);
    drawParqueCloud(865 - drift * .1, 155, .6, .42);

    // Arquitectura baja y cálida en la distancia.
    ctx.save();
    const cityOffset = -((cameraX * .075) % 210) - 80;
    for (let i = -1; i < 7; i++) {
        const x = cityOffset + i * 190;
        const h = 54 + ((i + levelOneSection + 8) % 3) * 15;
        ctx.fillStyle = i % 2 ? 'rgba(38,55,74,.52)' : 'rgba(47,63,82,.46)';
        ctx.fillRect(x, 286 - h, 150, h + 44);
        ctx.fillStyle = 'rgba(7,16,29,.5)';
        for (let wx = x + 18; wx < x + 135; wx += 32) ctx.fillRect(wx, 298 - h, 12, 18);
        ctx.fillStyle = 'rgba(12,23,38,.58)';
        ctx.beginPath(); ctx.moveTo(x - 8, 286 - h); ctx.lineTo(x + 75, 266 - h); ctx.lineTo(x + 158, 286 - h); ctx.closePath(); ctx.fill();
    }
    ctx.restore();

    // La Escuela Urquiza está frente a la plaza. El parallax lento hace
    // que se lea como un edificio grande al otro lado de la calle.
    if (levelOneSection === 1) {
        drawEscuelaUrquiza(990 - cameraX * .18, 310, .72);
    } else {
        drawEscuelaUrquiza(475 - cameraX * .13, 310, .67);
        drawEscuelaUrquiza(1850 - cameraX * .21, 310, .59);
    }

    // Calle de fondo entre la escuela y la plaza. Es sólo decorativa:
    // no agrega plataformas, obstáculos ni modifica las colisiones.
    ctx.fillStyle = 'rgba(77,78,82,.78)'; ctx.fillRect(0, 294, canvas.width, 18);
    ctx.fillStyle = 'rgba(233,224,205,.72)'; ctx.fillRect(0, 305, canvas.width, 4);

    // Dos hitos de la plaza: en 1.2 quedan más lejos para que parezca
    // que Miau continuó caminando hacia el sector de juegos.
    if (levelOneSection === 1) {
        drawParqueChurch(720 - cameraX * .31, 326, .78);
        drawPlazaColumn(445 - cameraX * .52, 326, .88);
        drawParqueFlag(1080 - cameraX * .66, 330, .72);
    } else {
        drawParqueChurch(-25 - cameraX * .16, 326, .58);
        drawPlazaColumn(-170 - cameraX * .24, 326, .58);
        drawParqueFlag(1540 - cameraX * .72, 332, .7);
    }

    // Arboleda con posiciones propias a lo largo del recorrido.
    const treeWorld = levelOneSection === 1
        ? [30, 360, 920, 1450, 2020, 2620, 3180, 3790, 4350, 4970, 5480]
        : [180, 720, 1260, 1800, 2360, 2920, 3480, 4040, 4610, 5190, 5660];
    treeWorld.forEach((worldX, index) => {
        const sx = worldX - cameraX * .78;
        if (sx < -100 || sx > canvas.width + 100) return;
        drawParqueTree(sx, 330, .7 + (index % 3) * .08, index);
    });

    // Césped y cantero detrás de la reja; no forma parte de las colisiones.
    const lawn = ctx.createLinearGradient(0, 302, 0, 380);
    lawn.addColorStop(0, '#314c35'); lawn.addColorStop(.55, '#213c2f'); lawn.addColorStop(1, '#142c28');
    ctx.fillStyle = lawn; ctx.fillRect(0, 307, canvas.width, 73);
    ctx.fillStyle = 'rgba(191,219,254,.18)';
    for (let x = -((cameraX * .81) % 83); x < canvas.width; x += 83) {
        ctx.beginPath(); ctx.arc(x + 22, 325 + (x % 2) * 4, 2.2, 0, Math.PI * 2); ctx.fill();
    }

    drawParqueFence(339);

    // Mobiliario en profundidad. Es decorativo y no altera el mapa.
    const benches = levelOneSection === 1 ? [260, 1510, 2860, 4140] : [510, 1970, 3730, 4860];
    benches.forEach((worldX, index) => {
        const sx = worldX - cameraX * .91;
        if (sx > -90 && sx < canvas.width + 90) drawParqueBench(sx, 358, .78 + (index % 2) * .06);
    });
    const lamps = levelOneSection === 1 ? [120, 1320, 2380, 3560, 4740] : [260, 1120, 2160, 3260, 4380, 5150];
    lamps.forEach((worldX, index) => {
        const sx = worldX - cameraX * .94;
        if (sx > -60 && sx < canvas.width + 60) drawParqueLamp(sx, 358, .78 + (index % 2) * .05);
    });

    if (levelOneSection === 1) {
        const signX = 78 - cameraX * .98;
        if (signX > -150) drawParqueWoodSign(signX, 355, 'PLAZA CONSTITUCIÓN', 'PARQUE SUREÑO');
    } else {
        const signX = 92 - cameraX * .98;
        if (signX > -150) drawParqueWoodSign(signX, 355, 'ZONA DE JUEGOS', 'PARQUE SUREÑO');
        const exitX = 5000 - cameraX * .98;
        if (exitX > -150 && exitX < canvas.width + 150) drawParqueWoodSign(exitX, 355, 'SALIDA', 'HACIA LA AVENIDA');
    }

    // Baño azul uniforme para que la escuela, la plaza y los juegos
    // también pertenezcan visualmente a la misma noche de tormenta.
    ctx.fillStyle = 'rgba(2,6,23,.24)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawAtmosphericBackdrop() {
    const style = SKY_25D[currentLevel] || SKY_25D[1];
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, style.top);
    sky.addColorStop(0.54, style.middle);
    sky.addColorStop(1, style.bottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    const orbX = 650 - cameraX * 0.025;
    const orbY = currentLevel === 5 ? 82 : 90;
    const orbRadius = currentLevel === 1 ? 46 : 35;
    const orbGlow = ctx.createRadialGradient(orbX, orbY, 3, orbX, orbY, orbRadius * 2.8);
    orbGlow.addColorStop(0, style.glow);
    orbGlow.addColorStop(0.18, style.glow + 'bb');
    orbGlow.addColorStop(0.46, style.haze + '35');
    orbGlow.addColorStop(1, 'rgba(2,6,23,0)');
    ctx.fillStyle = orbGlow;
    ctx.beginPath();
    ctx.arc(orbX, orbY, orbRadius * 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = currentLevel === 6 ? .35 : .82;
    ctx.fillStyle = style.glow;
    ctx.beginPath();
    ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Tres bandas de bruma con distinta velocidad producen profundidad
    // sin agregar objetos que interfieran con la lectura del recorrido.
    for (let layer = 0; layer < 3; layer++) {
        const baseY = 235 + layer * 58;
        const offset = -((cameraX * (0.035 + layer * .028)) % 210);
        ctx.globalAlpha = .09 + layer * .055;
        ctx.fillStyle = layer === 2 ? style.middle : style.haze;
        ctx.beginPath();
        ctx.moveTo(-80, canvas.height);
        ctx.lineTo(-80, baseY);
        for (let px = -80; px <= canvas.width + 160; px += 105) {
            const py = baseY + Math.sin((px + offset) * .013 + layer * 1.7) * (14 + layer * 7);
            ctx.quadraticCurveTo(px + 50 + offset, py - 18, px + 105 + offset, py);
        }
        ctx.lineTo(canvas.width + 180, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (currentLevel === 1) {
        const drift = (gameTick * .08) % 980;
        drawSoftCloud(140 - drift * .15, 90, .72, .28);
        drawSoftCloud(520 - drift * .08, 142, .95, .2);
        drawSoftCloud(890 - drift * .12, 65, .62, .22);
    }
    ctx.restore();
}

function drawForegroundDepth() {
    ctx.save();
    const vignette = ctx.createRadialGradient(400, 205, 150, 400, 225, 520);
    vignette.addColorStop(0, 'rgba(2,6,23,0)');
    vignette.addColorStop(.72, 'rgba(2,6,23,.06)');
    vignette.addColorStop(1, 'rgba(2,6,23,.42)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lowerMist = ctx.createLinearGradient(0, 335, 0, 450);
    lowerMist.addColorStop(0, 'rgba(255,255,255,0)');
    lowerMist.addColorStop(1, currentLevel === 5 ? 'rgba(34,211,238,.10)' : 'rgba(148,163,184,.045)');
    ctx.fillStyle = lowerMist;
    ctx.fillRect(0, 335, canvas.width, 115);
    ctx.restore();
}

// La tormenta es un rasgo narrativo de TODO el capítulo 1. Esta capa
// común evita que 1.1, 1.2 o 1.3 puedan volver a verse como de día al
// cambiar el fondo particular de cada sección.
function drawLevelOneStormOverlay() {
    if (currentLevel !== 1) return;

    const cycle = gameTick % 360;
    const flash = cycle < 5 ? (5 - cycle) / 5 : (cycle >= 13 && cycle < 17 ? (17 - cycle) / 8 : 0);
    if (flash > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(191,219,254,${0.13 * flash})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (cycle < 5) {
            const strikeSeed = Math.floor(gameTick / 360);
            const boltX = 125 + ((strikeSeed * 271 + 180) % 530);
            ctx.strokeStyle = `rgba(224,242,254,${0.72 * flash})`;
            ctx.shadowColor = '#93c5fd';
            ctx.shadowBlur = getShadowBlurValue(18, 8, 0);
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(boltX, -8);
            ctx.lineTo(boltX - 18, 43);
            ctx.lineTo(boltX + 7, 72);
            ctx.lineTo(boltX - 10, 112);
            ctx.lineTo(boltX + 12, 151);
            ctx.stroke();
        }
        ctx.restore();
    }
}

// V18 · Panorama de la calle Juan Perón / Puerto Viejo para el nivel 1.3.
// La ilustración ahora está en assets/backgrounds para facilitar la edición en VS Code.
// V19 conserva la ilustración de V18 por compatibilidad, sin usarla como panorama fijo.
// V20 reactiva la ilustración de V18, pero sólo como material artístico
// recortado en hitos del mundo. Nunca vuelve a ser un panorama fijo.
const JUAN_PERON_STREET_BACKGROUND = new Image();
JUAN_PERON_STREET_BACKGROUND.src = 'assets/backgrounds/juan-peron-puerto-viejo.jpg';

// Escudo real aportado como referencia para las banderas del recorrido.
const PARQUE_SUR_SHIELD_V20 = new Image();
PARQUE_SUR_SHIELD_V20.src = 'assets/logos/parque-sur.png';

function drawStreetTreeV19(x, baseY, scale = 1, seed = 0) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);

    ctx.strokeStyle = '#1b1b19';
    ctx.lineCap = 'round';
    ctx.lineWidth = 17;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.quadraticCurveTo(-5, -58, -18, -116);
    ctx.quadraticCurveTo(-27, -158, -62, -205);
    ctx.moveTo(-14, -100);
    ctx.quadraticCurveTo(28, -145, 62, -194);
    ctx.moveTo(-34, -146);
    ctx.quadraticCurveTo(-66, -177, -99, -195);
    ctx.stroke();

    const leafColors = ['#143a2c', '#184633', '#1f5639'];
    const crowns = [
        [-82, -201, 58, 32], [-30, -226, 72, 37], [38, -204, 68, 34],
        [78, -178, 48, 28], [-112, -170, 45, 29], [8, -171, 76, 34]
    ];
    crowns.forEach((leaf, index) => {
        ctx.fillStyle = leafColors[(index + seed) % leafColors.length];
        ctx.beginPath();
        ctx.ellipse(leaf[0], leaf[1], leaf[2], leaf[3], (index % 2 ? -.15 : .12), 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}

function drawVintageStreetLampV19(x, baseY, scale = 1) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);
    ctx.strokeStyle = '#20252b';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -142);
    ctx.quadraticCurveTo(0, -164, 22, -164);
    ctx.lineTo(34, -164);
    ctx.stroke();
    ctx.fillStyle = '#20252b';
    ctx.beginPath();
    ctx.arc(0, 1, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = '#ffd47b';
    ctx.shadowBlur = getShadowBlurValue(18, 8, 0);
    ctx.fillStyle = '#ffe8a8';
    ctx.beginPath();
    ctx.moveTo(25, -170);
    ctx.lineTo(45, -170);
    ctx.lineTo(50, -148);
    ctx.lineTo(20, -148);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#20252b';
    ctx.fillRect(18, -174, 34, 5);
    ctx.restore();
}

function drawStreetHouseV19(x, baseY, width, tone = 0) {
    ctx.save();
    ctx.translate(x, baseY);
    const walls = ['#84909a', '#7d878f', '#73808d', '#8d8784'];
    const trims = ['#505b65', '#5d4c46', '#3d5666', '#62504b'];
    ctx.fillStyle = walls[tone % walls.length];
    ctx.fillRect(0, -112, width, 112);
    ctx.fillStyle = trims[tone % trims.length];
    ctx.fillRect(-5, -118, width + 10, 9);
    ctx.fillRect(0, -8, width, 8);

    for (let wx = 24; wx < width - 32; wx += 74) {
        ctx.fillStyle = '#263645';
        ctx.fillRect(wx, -86, 38, 50);
        ctx.fillStyle = 'rgba(255,220,145,.28)';
        ctx.fillRect(wx + 5, -80, 28, 37);
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 3;
        ctx.strokeRect(wx, -86, 38, 50);
        ctx.beginPath();
        ctx.moveTo(wx + 19, -86); ctx.lineTo(wx + 19, -36);
        ctx.moveTo(wx, -61); ctx.lineTo(wx + 38, -61);
        ctx.stroke();
    }
    ctx.fillStyle = '#35414c';
    ctx.fillRect(width - 52, -68, 32, 68);
    ctx.restore();
}

function drawKioscoSurenoV19(x, baseY, scale = 1) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#e8e2d8';
    ctx.fillRect(-155, -170, 310, 170);
    ctx.fillStyle = '#a73434';
    ctx.fillRect(-160, -176, 320, 18);
    ctx.beginPath();
    ctx.moveTo(-154, -176);
    ctx.lineTo(-118, -202);
    ctx.lineTo(116, -202);
    ctx.lineTo(156, -176);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#b83938';
    ctx.fillRect(-150, -89, 300, 20);
    ctx.beginPath();
    ctx.moveTo(-150, -69);
    ctx.lineTo(150, -69);
    ctx.lineTo(132, -39);
    ctx.lineTo(-136, -39);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#8f2e30';
    ctx.fillRect(-135, -36, 270, 36);
    ctx.fillStyle = '#283747';
    [-114, -53, 11, 72].forEach(wx => ctx.fillRect(wx, -34, 43, 34));
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    [-114, -53, 11, 72].forEach(wx => ctx.strokeRect(wx, -34, 43, 34));

    ctx.fillStyle = '#b83938';
    traceRoundedRect(ctx, 18, -147, 116, 48, 5);
    ctx.fill();
    ctx.fillStyle = '#fff7ed';
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px Fredoka';
    ctx.fillText('KIOSCO', 76, -127);
    ctx.font = 'bold 12px Fredoka';
    ctx.fillText('EL SUREÑO', 76, -110);
    ctx.font = 'bold 13px Fredoka';
    ctx.fillText('EL SUREÑO', 0, -50);
    ctx.restore();
}

function drawUtnV19(x, baseY, scale = 1) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#d9dde0';
    ctx.fillRect(0, -158, 560, 158);
    ctx.fillStyle = '#eef1f3';
    ctx.fillRect(-5, -168, 570, 18);
    ctx.fillStyle = '#c8ced3';
    ctx.fillRect(0, -12, 560, 12);

    // Pórtico lateral inspirado en el gran arco de la sede FRCU.
    ctx.fillStyle = '#eef1f3';
    ctx.fillRect(-82, -166, 104, 166);
    ctx.fillStyle = '#34414c';
    ctx.beginPath();
    ctx.moveTo(-64, 0);
    ctx.lineTo(-64, -72);
    ctx.arc(-30, -72, 34, Math.PI, 0);
    ctx.lineTo(4, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#36424c';
    ctx.lineWidth = 4;
    for (let wx = 44; wx < 525; wx += 78) {
        ctx.beginPath();
        ctx.moveTo(wx, -16);
        ctx.lineTo(wx, -102);
        ctx.arc(wx + 22, -102, 22, Math.PI, 0);
        ctx.lineTo(wx + 44, -16);
        ctx.closePath();
        ctx.stroke();
        for (let gx = wx + 8; gx < wx + 42; gx += 9) {
            ctx.beginPath(); ctx.moveTo(gx, -18); ctx.lineTo(gx, -105); ctx.stroke();
        }
    }

    ctx.fillStyle = '#263748';
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Fredoka';
    ctx.fillText('UTN · FRCU', 338, -128);
    ctx.font = 'bold 9px Fredoka';
    ctx.fillText('UNIVERSIDAD TECNOLÓGICA NACIONAL', 337, -114);
    ctx.restore();
}

function drawParqueSurBannerV19(x, baseY, scale = 1) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);
    ctx.strokeStyle = '#2b3540';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -174); ctx.stroke();

    const wave = Math.sin(gameTick * .06 + x * .01) * 4;
    ctx.fillStyle = '#123480';
    ctx.beginPath();
    ctx.moveTo(4, -167);
    ctx.quadraticCurveTo(46, -178 + wave, 92, -162);
    ctx.lineTo(92, -101);
    ctx.quadraticCurveTo(48, -114 + wave, 4, -108);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    // V20 usa el escudo real de la referencia en lugar de reinterpretarlo.
    if (PARQUE_SUR_SHIELD_V20.complete && PARQUE_SUR_SHIELD_V20.naturalWidth) {
        ctx.save();
        ctx.translate(47, -139 + wave * .2);
        ctx.rotate(wave * .0025);
        ctx.drawImage(PARQUE_SUR_SHIELD_V20, -23, -24, 46, 49);
        ctx.restore();
    } else {
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.ellipse(47, -139 + wave * .2, 24, 26, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#123480';
        ctx.beginPath();
        ctx.moveTo(47, -160 + wave * .2);
        ctx.lineTo(62, -139 + wave * .2);
        ctx.lineTo(47, -118 + wave * .2);
        ctx.lineTo(32, -139 + wave * .2);
        ctx.closePath();
        ctx.fill();
    }
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.font = 'bold 8px Fredoka';
    ctx.fillText('PARQUE SUR', 47, -104);
    ctx.restore();
}

function drawStreetNameSignV19(x, baseY) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.fillStyle = '#273746';
    ctx.fillRect(6, -12, 7, 72);
    ctx.fillStyle = '#254f70';
    traceRoundedRect(ctx, -3, -52, 185, 44, 6);
    ctx.fill();
    ctx.strokeStyle = '#d7e4ec';
    ctx.lineWidth = 2;
    traceRoundedRect(ctx, -1, -50, 181, 40, 5);
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.font = 'bold 13px Fredoka';
    ctx.fillText('JUAN D. PERÓN', 90, -33);
    ctx.font = 'bold 9px Fredoka';
    ctx.fillText('PUERTO VIEJO', 90, -19);
    ctx.restore();
}

// V22 · El final de 1.3 deja la calle Juan Perón y se convierte en un
// viaje reconocible hacia la Isla del Puerto. La referencia del puente
// se traduce a vista lateral para que Miau realmente pueda recorrerlo.
function streetSceneBlend(from, to) {
    const t = Math.max(0, Math.min(1, (cameraX - from) / Math.max(1, to - from)));
    return t * t * (3 - 2 * t);
}

function drawIslandBridgeV22(alpha) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    const sky = ctx.createLinearGradient(0, 0, 0, 285);
    sky.addColorStop(0, '#020617');
    sky.addColorStop(.55, '#09203a');
    sky.addColorStop(1, '#173d51');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nubes bajas: mantiene la misma tormenta que comenzó en 1.1.
    const cloudShift = (gameTick * .028) % 190;
    ctx.fillStyle = 'rgba(15,23,42,.82)';
    [80, 330, 620, 860].forEach((baseX, index) => {
        const cx = baseX - cloudShift * (.18 + index * .02);
        const cy = 52 + (index % 3) * 34;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 92, 19, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 62, cy + 4, 61, 15, 0, 0, Math.PI * 2);
        ctx.fill();
    });

    // Costa e islas del río Uruguay, inspiradas en la vista aérea de
    // la referencia pero llevadas al lenguaje lateral del juego.
    ctx.fillStyle = '#123c32';
    ctx.beginPath();
    ctx.moveTo(0, 238);
    for (let x = 0; x <= canvas.width + 80; x += 70) {
        ctx.lineTo(x, 226 + Math.sin((x + cameraX * .08) * .025) * 14);
    }
    ctx.lineTo(canvas.width, 282);
    ctx.lineTo(0, 282);
    ctx.closePath();
    ctx.fill();

    const river = ctx.createLinearGradient(0, 235, 0, 380);
    river.addColorStop(0, '#28556b');
    river.addColorStop(.45, '#1d4b61');
    river.addColorStop(1, '#102f44');
    ctx.fillStyle = river;
    ctx.fillRect(0, 245, canvas.width, 135);
    ctx.strokeStyle = 'rgba(186,230,253,.18)';
    ctx.lineWidth = 1.4;
    for (let y = 262; y < 372; y += 19) {
        const drift = -((cameraX * (.08 + y * .0002)) % 86);
        for (let x = drift; x < canvas.width; x += 86) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + 26, y - 3, x + 58, y);
            ctx.stroke();
        }
    }

    // Los altos pilares blancos son la silueta más reconocible del
    // puente de la Isla del Puerto de Concepción del Uruguay.
    [3340, 3660, 3980, 4300, 4620].forEach((worldX, index) => {
        const x = worldX - cameraX;
        if (x < -90 || x > canvas.width + 90) return;
        ctx.fillStyle = index % 2 ? '#aeb8bd' : '#c8d1d5';
        ctx.fillRect(x - 7, 337, 14, 66);
        ctx.fillRect(x + 44, 337, 11, 66);
        ctx.fillStyle = 'rgba(226,232,240,.55)';
        ctx.fillRect(x - 12, 336, 72, 6);
    });

    // Tablero del puente y baranda: la parte superior coincide con el
    // piso físico y evita que Miau parezca correr por el agua.
    ctx.fillStyle = '#8b969b';
    ctx.fillRect(0, 368, canvas.width, 12);
    ctx.fillStyle = '#303b43';
    ctx.fillRect(0, 350, canvas.width, 20);
    ctx.fillStyle = 'rgba(250,204,21,.72)';
    for (let x = -((cameraX * .98) % 150); x < canvas.width; x += 150) {
        ctx.fillRect(x, 359, 74, 3);
    }

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 326); ctx.lineTo(canvas.width, 326);
    ctx.moveTo(0, 345); ctx.lineTo(canvas.width, 345);
    ctx.stroke();
    ctx.lineWidth = 3;
    for (let worldX = 3180; worldX <= 4780; worldX += 72) {
        const x = worldX - cameraX;
        if (x < -15 || x > canvas.width + 15) continue;
        ctx.beginPath(); ctx.moveTo(x, 326); ctx.lineTo(x, 369); ctx.stroke();
    }

    const signX = 3190 - cameraX;
    if (signX > -220 && signX < canvas.width + 60) {
        ctx.fillStyle = '#214e70';
        traceRoundedRect(ctx, signX, 270, 196, 43, 6); ctx.fill();
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
        traceRoundedRect(ctx, signX + 2, 272, 192, 39, 5); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.textAlign = 'center';
        ctx.font = 'bold 12px Fredoka'; ctx.fillText('PUENTE A LA ISLA', signX + 98, 289);
        ctx.font = 'bold 9px Fredoka'; ctx.fillText('DEL PUERTO', signX + 98, 303);
    }

    ctx.restore();
}

function drawIslandGatewayV22(alpha) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    const sky = ctx.createLinearGradient(0, 0, 0, 300);
    sky.addColorStop(0, '#020617');
    sky.addColorStop(.58, '#0b2439');
    sky.addColorStop(1, '#22485a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Río visible detrás del acceso, como en la fotografía de la isla.
    ctx.fillStyle = '#1e4e62';
    ctx.fillRect(0, 205, canvas.width, 92);
    ctx.strokeStyle = 'rgba(186,230,253,.16)';
    for (let y = 220; y < 292; y += 17) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y + 2); ctx.stroke();
    }

    // Vegetación abundante a ambos lados del pórtico rosado.
    const treeOffset = -((cameraX * .24) % 112) - 112;
    for (let i = 0; i < 10; i++) {
        const x = treeOffset + i * 112;
        const radius = 42 + (i % 3) * 9;
        ctx.fillStyle = i % 2 ? '#174a35' : '#1d5a3e';
        ctx.beginPath(); ctx.arc(x, 297 - (i % 2) * 12, radius, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(74,222,128,.08)';
        ctx.beginPath(); ctx.arc(x - 12, 280 - (i % 2) * 12, radius * .55, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = '#31583f';
    ctx.fillRect(0, 330, canvas.width, 50);
    ctx.fillStyle = '#303b43';
    ctx.fillRect(0, 351, canvas.width, 29);
    ctx.fillStyle = '#e8c950';
    for (let x = -((cameraX * .98) % 146); x < canvas.width; x += 146) ctx.fillRect(x, 363, 72, 3);

    // Pórtico rosado de acceso. Se fija en el mundo, por eso se acerca
    // de forma natural al avanzar y no permanece pegado a la cámara.
    const gateCenterWorld = 5092;
    const gateCenterX = gateCenterWorld - cameraX;
    const leftTowerX = gateCenterX - 245;
    const rightTowerX = gateCenterX + 145;
    const pink = '#cf8191';
    const pinkLight = '#e3a0ad';
    const trim = '#f0c1c8';

    ctx.fillStyle = 'rgba(2,6,23,.28)';
    ctx.fillRect(leftTowerX - 10, 375, 510, 7);

    function drawGatewayTower(x) {
        ctx.fillStyle = pink;
        ctx.fillRect(x, 201, 100, 179);
        ctx.fillStyle = pinkLight;
        ctx.fillRect(x - 5, 194, 110, 13);
        ctx.fillStyle = '#b76879';
        ctx.fillRect(x + 12, 181, 76, 14);
        ctx.fillStyle = trim;
        ctx.fillRect(x + 17, 229, 66, 4);
        ctx.fillStyle = '#173146';
        ctx.fillRect(x + 30, 244, 18, 29);
        ctx.fillRect(x + 57, 244, 18, 29);
        ctx.strokeStyle = trim; ctx.lineWidth = 2;
        ctx.strokeRect(x + 28, 242, 22, 33);
        ctx.strokeRect(x + 55, 242, 22, 33);
    }

    drawGatewayTower(leftTowerX);
    drawGatewayTower(rightTowerX);

    // Pasarela superior y gran arco central. El portal dimensional se
    // dibuja luego exactamente dentro de esta abertura.
    ctx.fillStyle = pink;
    ctx.fillRect(leftTowerX + 100, 225, 290, 31);
    ctx.fillStyle = trim;
    ctx.fillRect(leftTowerX + 100, 223, 290, 5);
    ctx.strokeStyle = pink;
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(gateCenterX, 351, 112, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = pink;
    ctx.fillRect(gateCenterX - 123, 350, 22, 30);
    ctx.fillRect(gateCenterX + 101, 350, 22, 30);
    ctx.strokeStyle = trim;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(gateCenterX, 351, 99, Math.PI, 0); ctx.stroke();

    // Nombre del lugar sobre el acceso, legible sin competir con el portal.
    ctx.fillStyle = '#7c3f4c';
    traceRoundedRect(ctx, gateCenterX - 91, 238, 182, 28, 7); ctx.fill();
    ctx.fillStyle = '#fff7ed'; ctx.textAlign = 'center';
    ctx.font = 'bold 11px Fredoka'; ctx.fillText('ISLA DEL PUERTO', gateCenterX, 249);
    ctx.font = 'bold 7.5px Fredoka'; ctx.fillText('CONCEPCIÓN DEL URUGUAY', gateCenterX, 260);

    // Huellas violetas conducen directamente a la abertura del portal.
    for (let worldX = 4630; worldX < 5050; worldX += 84) {
        const x = worldX - cameraX;
        if (x < -30 || x > canvas.width + 30) continue;
        drawPawMark(ctx, x, 369, .36, worldX % 168 ? '#c084fc' : '#67e8f9');
    }

    ctx.restore();
}

function drawIslandJourneyV22() {
    const bridgeAlpha = streetSceneBlend(2470, 3180);
    if (bridgeAlpha > 0) drawIslandBridgeV22(bridgeAlpha);
    const gatewayAlpha = streetSceneBlend(3820, 4440);
    if (gatewayAlpha > 0) drawIslandGatewayV22(gatewayAlpha);
}

function drawJuanPeronPainterlyV20() {
    const image = JUAN_PERON_STREET_BACKGROUND;
    if (!image.complete || !image.naturalWidth || !image.naturalHeight) return false;

    // La ilustración que gustó en V18 se divide ahora en escenas. Cada
    // recorte tiene una coordenada real del nivel y se mueve con el
    // mundo, igual que los hitos de 1.1 y 1.2.
    const panels = [
        { worldX: 650,  sx: .10, sy: .10, sw: .44, sh: .70, h: 350, alpha: .98 }, // Kiosco y casonas
        { worldX: 1940, sx: .32, sy: .08, sw: .43, sh: .72, h: 348, alpha: .90 }, // árboles y faroles
        { worldX: 3500, sx: .60, sy: .08, sw: .40, sh: .72, h: 350, alpha: .98 }  // UTN
    ];

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, 354);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    for (const panel of panels) {
        const sourceX = Math.round(image.naturalWidth * panel.sx);
        const sourceY = Math.round(image.naturalHeight * panel.sy);
        const sourceW = Math.min(image.naturalWidth - sourceX, Math.round(image.naturalWidth * panel.sw));
        const sourceH = Math.min(image.naturalHeight - sourceY, Math.round(image.naturalHeight * panel.sh));
        const drawW = panel.h * (sourceW / sourceH);
        const drawX = panel.worldX - cameraX * .96;
        if (drawX > canvas.width + 80 || drawX + drawW < -80) continue;

        // Un halo oscuro integra el recorte con el resto del escenario
        // y evita el efecto de una foto rectangular pegada encima.
        ctx.save();
        ctx.globalAlpha = panel.alpha;
        ctx.shadowColor = 'rgba(2,6,23,.72)';
        ctx.shadowBlur = 18;
        ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, drawX, 2, drawW, panel.h);
        ctx.restore();
    }
    ctx.restore();
    return true;
}

// V21: la ilustracion deja de cortarse en paneles. Se usa como una
// unica calle continua y la camara recorre el panorama de izquierda a
// derecha. El primer tramo muestra el Kiosco El Sureno y, al avanzar,
// la UTN entra naturalmente en escena. El primer plano sigue siendo
// una vereda jugable independiente, igual que en 1.1 y 1.2.
function drawStreetEnvironmentV21() {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#020617');
    sky.addColorStop(.56, '#07182a');
    sky.addColorStop(1, '#152d3c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const image = JUAN_PERON_STREET_BACKGROUND;
    if (image.complete && image.naturalWidth && image.naturalHeight) {
        // Ventana mas cerrada que V18: evita mostrar kiosco y UTN al
        // mismo tiempo durante todo el nivel y da sensacion de viaje.
        const sourceWidth = Math.round(image.naturalWidth * .55);
        const sourceHeight = Math.min(
            image.naturalHeight,
            Math.round(sourceWidth * (380 / canvas.width))
        );
        const sourceY = Math.max(
            0,
            Math.min(image.naturalHeight - sourceHeight, Math.round(image.naturalHeight * .12))
        );
        const maxSourceX = Math.max(0, image.naturalWidth - sourceWidth);
        const maxCameraX = Math.max(1, LEVEL_WIDTH - canvas.width);
        const levelProgress = Math.max(0, Math.min(1, cameraX / maxCameraX));
        // El panorama completa su recorrido un poco antes del final,
        // para que la UTN tenga un tramo propio y reconocible.
        const panoramaProgress = Math.min(1, levelProgress * 1.55);
        const sourceX = Math.round(maxSourceX * panoramaProgress);

        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
            image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, canvas.width, 380
        );
        // Mantiene la misma noche tormentosa del resto del capitulo 1.
        ctx.fillStyle = 'rgba(2,6,23,.10)';
        ctx.fillRect(0, 0, canvas.width, 380);
        ctx.restore();
    } else {
        const cloudDrift = (gameTick * .035) % 170;
        drawParqueCloud(100 - cloudDrift * .16, 74, .84, .6);
        drawParqueCloud(430 - cloudDrift * .10, 126, .68, .48);
        drawParqueCloud(755 - cloudDrift * .14, 65, .92, .58);
    }

    // Calzada real para los autos. El fondo ilustrado queda por detras
    // y sus reflejos se conservan gracias a la transparencia.
    const road = ctx.createLinearGradient(0, STREET_ROAD_TOP, 0, STREET_CURB_Y + 2);
    road.addColorStop(0, 'rgba(40,50,60,.58)');
    road.addColorStop(.55, 'rgba(25,34,43,.78)');
    road.addColorStop(1, 'rgba(13,23,31,.94)');
    ctx.fillStyle = road;
    ctx.fillRect(0, STREET_ROAD_TOP, canvas.width, STREET_CURB_Y + 2 - STREET_ROAD_TOP);
    // Cordón que separa la foto de la superficie jugable. Las marcas
    // viales se dibujan después, sobre el bloque gris de primer plano.
    ctx.fillStyle = '#c8c2b4';
    ctx.fillRect(0, STREET_CURB_Y, canvas.width, 4);
    const sidewalk = ctx.createLinearGradient(0, 380, 0, canvas.height);
    sidewalk.addColorStop(0, '#68736d');
    sidewalk.addColorStop(.48, '#4b5851');
    sidewalk.addColorStop(1, '#293b32');
    ctx.fillStyle = sidewalk;
    ctx.fillRect(0, 380, canvas.width, canvas.height - 380);
    ctx.strokeStyle = 'rgba(226,232,240,.10)';
    ctx.lineWidth = 1;
    for (let x = -((cameraX * .96) % 94); x < canvas.width; x += 94) {
        ctx.beginPath();
        ctx.moveTo(x, 380);
        ctx.lineTo(x - 14, canvas.height);
        ctx.stroke();
    }

    // Solo elementos vectoriales utiles para la lectura del recorrido;
    // no se vuelven a dibujar casas, arboles ni recortes sobre la foto.
    const signX = 100 - cameraX * .98;
    if (signX > -210 && signX < canvas.width + 60) {
        drawStreetNameSignV19(signX, 376);
    }

    // Sombras y destellos humedos que unen fondo y piso sin taparlos.
    ctx.fillStyle = 'rgba(191,219,254,.045)';
    for (let x = -((cameraX * .72) % 220); x < canvas.width; x += 220) {
        ctx.beginPath();
        ctx.ellipse(x + 54, 407, 52, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Último acto de 1.3: la avenida se funde con el puente y después
    // con la entrada rosada donde espera el portal a 2.1.
    drawIslandJourneyV22();
}

function drawStreetEnvironmentV19() {
    // Mismo lenguaje visual de 1.1/1.2: una escena 2D lateral cuyos
    // lugares existen en el mundo y aparecen sólo cuando Miau avanza.
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#020617');
    sky.addColorStop(.5, '#07182a');
    sky.addColorStop(.78, '#10283b');
    sky.addColorStop(1, '#1b3443');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const glowX = 610 - cameraX * .018;
    const glow = ctx.createRadialGradient(glowX, 105, 5, glowX, 105, 165);
    glow.addColorStop(0, 'rgba(191,219,254,.12)');
    glow.addColorStop(.45, 'rgba(96,165,250,.045)');
    glow.addColorStop(1, 'rgba(15,23,42,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, 260);

    const cloudDrift = (gameTick * .035) % 170;
    drawParqueCloud(100 - cloudDrift * .16, 74, .84, .6);
    drawParqueCloud(420 - cloudDrift * .1, 128, .64, .46);
    drawParqueCloud(760 - cloudDrift * .14, 66, .92, .58);

    // Casas bajas antiguas: no se repiten pegadas a la cámara. Cada
    // tramo tiene coordenada propia, dejando respirar a los hitos.
    const houseSegments = [
        [40, 430, 0], [520, 390, 2], [1500, 460, 1],
        [2180, 470, 3], [2860, 430, 0], [4480, 500, 2], [5050, 390, 1]
    ];
    houseSegments.forEach((entry, index) => {
        const sx = entry[0] - cameraX * .91;
        if (sx < -entry[1] - 80 || sx > canvas.width + 120) return;
        drawStreetHouseV19(sx, 306, entry[1], entry[2] + index);
    });

    // La calle corre detrás de Miau. Él avanza por la vereda ancha del
    // primer plano; así deja de parecer que corre por el carril.
    ctx.fillStyle = '#2a333c';
    ctx.fillRect(0, 292, canvas.width, 58);
    ctx.fillStyle = 'rgba(255,255,255,.07)';
    for (let x = -((cameraX * .9) % 154); x < canvas.width; x += 154) {
        ctx.fillRect(x, 318, 70, 3);
    }
    ctx.fillStyle = '#c9c3b4';
    ctx.fillRect(0, 348, canvas.width, 7);

    // V20: riqueza visual de la imagen ilustrada + desplazamiento real
    // de V19. Los lugares aparecen y se van a medida que Miau avanza.
    const painterlyLandmarksReady = drawJuanPeronPainterlyV20();

    const sidewalk = ctx.createLinearGradient(0, 355, 0, canvas.height);
    sidewalk.addColorStop(0, '#6f756f');
    sidewalk.addColorStop(.42, '#525b55');
    sidewalk.addColorStop(1, '#34443e');
    ctx.fillStyle = sidewalk;
    ctx.fillRect(0, 355, canvas.width, canvas.height - 355);

    // Baldosas húmedas y pequeños reflejos de los faroles.
    ctx.strokeStyle = 'rgba(203,213,225,.10)';
    ctx.lineWidth = 1;
    for (let x = -((cameraX * .96) % 88); x < canvas.width; x += 88) {
        ctx.beginPath(); ctx.moveTo(x, 355); ctx.lineTo(x - 18, canvas.height); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(191,219,254,.055)';
    for (let x = -((cameraX * .72) % 210); x < canvas.width; x += 210) {
        ctx.beginPath(); ctx.ellipse(x + 50, 401, 46, 3, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Hitos reales: todos usan coordenadas del mundo, no del viewport.
    const kioskX = 1060 - cameraX * .96;
    if (!painterlyLandmarksReady && kioskX > -260 && kioskX < canvas.width + 260) drawKioscoSurenoV19(kioskX, 341, .78);

    const utnX = 3650 - cameraX * .96;
    if (!painterlyLandmarksReady && utnX > -520 && utnX < canvas.width + 180) drawUtnV19(utnX, 342, .73);

    const signX = 120 - cameraX * .98;
    if (signX > -210 && signX < canvas.width + 60) drawStreetNameSignV19(signX, 349);

    [590, 2070, 3160, 4680].forEach((worldX, index) => {
        const sx = worldX - cameraX * .97;
        if (sx > -120 && sx < canvas.width + 120) drawParqueSurBannerV19(sx, 352, .72 + (index % 2) * .06);
    });

    [310, 1380, 2420, 3370, 4320, 5120].forEach((worldX, index) => {
        const sx = worldX - cameraX * .95;
        if (sx > -80 && sx < canvas.width + 80) drawVintageStreetLampV19(sx, 352, .77 + (index % 2) * .05);
    });

    // Árboles grandes de la calle Juan Perón. Se dibujan al final para
    // formar el techo vegetal característico sin ocultar al jugador.
    [80, 720, 1640, 2560, 3460, 4380, 5220].forEach((worldX, index) => {
        const sx = worldX - cameraX * .88;
        if (sx > -180 && sx < canvas.width + 180) drawStreetTreeV19(sx, 350, .72 + (index % 3) * .055, index);
    });

    // Capa azul nocturna común al capítulo 1.
    ctx.fillStyle = 'rgba(2,6,23,.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStreetEnvironment() {
    if (currentLevel !== 1 || levelOneSection !== 3) return;
    drawStreetEnvironmentV21();
}
