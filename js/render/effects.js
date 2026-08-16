// Partículas, sacudidas y utilidades visuales compartidas.

// Mantiene bajo control la cantidad de particulas para cuidar el rendimiento en escenas largas.
function trimParticles() {
    const limit = getParticleSoftLimit();
    if (particles.length > limit) {
        particles.splice(0, particles.length - limit);
    }
}

// Activa una sacudida de camara para dar peso visual a golpes y eventos importantes.
function triggerShake(duration, intensity) {
    shakeDuration = duration;
    shakeIntensity = intensity * getShakeScale();
}

// Clase Partícula
// Modela particulas peque?as que hacen que golpes, saltos, agua y magia se vean mas vivos.
class Particle {
    constructor(x, y, vx, vy, color, size, life, type = 'spark') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxLife = life;
        this.life = life;
        this.type = type; // 'spark', 'smoke', 'dust', 'bubble', 'electricity', 'rain', 'fire'
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.type === 'spark') {
            this.vy += 0.12; 
        } else if (this.type === 'smoke') {
            this.vy -= 0.05; 
            this.vx *= 0.98;
            this.size += 0.15; 
        } else if (this.type === 'dust') {
            this.vy -= 0.01;
            this.vx *= 0.95;
            this.size = Math.max(0.1, this.size - 0.04);
        } else if (this.type === 'bubble') {
            this.vy -= 0.08; 
            this.x += Math.sin(gameTick * 0.1) * 0.2;
        } else if (this.type === 'electricity') {
            this.x += (Math.random() - 0.5) * 2;
            this.y += (Math.random() - 0.5) * 2;
        } else if (this.type === 'fire') {
            this.vy -= 0.06;
            this.vx *= 0.96;
            this.size = Math.max(0.1, this.size - 0.08);
        } else if (this.type === 'rain') {
            // Cae en diagonal rápida
        }
        this.life--;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        if (this.type === 'bubble') {
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x - cameraX, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.type === 'smoke') {
            ctx.fillStyle = `rgba(148, 163, 184, ${this.life / this.maxLife})`;
            ctx.beginPath();
            ctx.arc(this.x - cameraX, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'electricity') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.beginPath();
            ctx.moveTo(this.x - cameraX, this.y);
            ctx.lineTo(this.x - cameraX + (Math.random() - 0.5) * 10, this.y + (Math.random() - 0.5) * 10);
            ctx.stroke();
        } else if (this.type === 'rain') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.beginPath();
            ctx.moveTo(this.x - cameraX, this.y);
            ctx.lineTo(this.x - cameraX + this.vx * 2, this.y + this.vy * 2);
            ctx.stroke();
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - cameraX, this.y, this.size, this.size);
        }
        ctx.restore();
    }
}

// Dibuja una huellita brillante reutilizable en distintos elementos del juego.
function drawPawMark(targetCtx, x, y, scale = 1, color = '#fde047') {
    targetCtx.save();
    targetCtx.fillStyle = color;
    targetCtx.beginPath();
    targetCtx.ellipse(x, y + 4 * scale, 6 * scale, 5 * scale, 0, 0, Math.PI * 2);
    targetCtx.fill();
    [[-6,-4],[-2,-8],[3,-8],[7,-4]].forEach(([dx, dy]) => {
        targetCtx.beginPath();
        targetCtx.ellipse(x + dx * scale, y + dy * scale, 2.3 * scale, 3 * scale, 0, 0, Math.PI * 2);
        targetCtx.fill();
    });
    targetCtx.restore();
}

// Dibuja una estrella simple para proyectiles y adornos de energia.
function drawStarShape(targetCtx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    targetCtx.beginPath();
    targetCtx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        targetCtx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        targetCtx.lineTo(x, y);
        rot += step;
    }
    targetCtx.lineTo(cx, cy - outerRadius);
    targetCtx.closePath();
    targetCtx.fill();
}

// Utilidades visuales de la version 2.5D. Todas dibujan solamente en
// canvas: no modifican colisiones, fisica ni posiciones del mapa.
function traceRoundedRect(targetCtx, x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    targetCtx.beginPath();
    targetCtx.moveTo(x + r, y);
    targetCtx.lineTo(x + width - r, y);
    targetCtx.quadraticCurveTo(x + width, y, x + width, y + r);
    targetCtx.lineTo(x + width, y + height - r);
    targetCtx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    targetCtx.lineTo(x + r, y + height);
    targetCtx.quadraticCurveTo(x, y + height, x, y + height - r);
    targetCtx.lineTo(x, y + r);
    targetCtx.quadraticCurveTo(x, y, x + r, y);
    targetCtx.closePath();
}
