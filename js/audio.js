// El audio se crea de forma diferida: algunos navegadores bloquean la
// creación de AudioContext hasta que el usuario pulsa un botón.
let audioCtx = null;

// Prepara el audio del navegador solo cuando hace falta para evitar errores en equipos o navegadores limitados.
function ensureAudioContext() {
    if (audioCtx) return audioCtx;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    try {
        audioCtx = new AudioContextClass();
    } catch (error) {
        console.warn('El audio no está disponible; el juego continuará sin sonido.', error);
        audioCtx = null;
    }
    return audioCtx;
}

// Reproduce efectos simples generados por codigo para no depender de archivos de sonido externos.
function playSound(type) {
    if (!ensureAudioContext()) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }

    const now = audioCtx.currentTime;
    const createSimpleTone = () => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        return { osc, gain };
    };

    if (type === 'jump') {
        const { osc, gain } = createSimpleTone();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.16);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
    } else if (type === 'coin') {
        const { osc, gain } = createSimpleTone();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.setValueAtTime(0.1, now + 0.08);
        gain.gain.linearRampToValueAtTime(0, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'stomp') {
        const { osc, gain } = createSimpleTone();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.14);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
    } else if (type === 'hurt') {
        const { osc, gain } = createSimpleTone();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
    } else if (type === 'shoot') {
        const { osc, gain } = createSimpleTone();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (type === 'powerup') {
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
            const oscNote = audioCtx.createOscillator();
            const gainNote = audioCtx.createGain();
            oscNote.type = 'sine';
            oscNote.frequency.value = freq;
            oscNote.connect(gainNote);
            gainNote.connect(audioCtx.destination);
            gainNote.gain.setValueAtTime(0.12, now + idx * 0.06);
            gainNote.gain.linearRampToValueAtTime(0, now + idx * 0.06 + 0.18);
            oscNote.start(now + idx * 0.06);
            oscNote.stop(now + idx * 0.06 + 0.2);
        });
    } else if (type === 'lifeup') {
        const notes = [330.00, 392.00, 659.00, 523.00, 587.00, 784.00];
        notes.forEach((freq, idx) => {
            const oscNote = audioCtx.createOscillator();
            const gainNote = audioCtx.createGain();
            oscNote.type = 'sine';
            oscNote.frequency.value = freq;
            oscNote.connect(gainNote);
            gainNote.connect(audioCtx.destination);
            gainNote.gain.setValueAtTime(0.1, now + idx * 0.05);
            gainNote.gain.linearRampToValueAtTime(0, now + idx * 0.05 + 0.15);
            oscNote.start(now + idx * 0.05);
            oscNote.stop(now + idx * 0.05 + 0.2);
        });
    } else if (type === 'victory') {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const oscNote = audioCtx.createOscillator();
            const gainNote = audioCtx.createGain();
            oscNote.type = 'sine';
            oscNote.frequency.value = freq;
            oscNote.connect(gainNote);
            gainNote.connect(audioCtx.destination);
            gainNote.gain.setValueAtTime(0.1, now + idx * 0.08);
            gainNote.gain.linearRampToValueAtTime(0, now + idx * 0.08 + 0.18);
            oscNote.start(now + idx * 0.08);
            oscNote.stop(now + idx * 0.08 + 0.2);
        });
    } else if (type === 'portalCharge') {
        [164.81, 246.94, 329.63, 493.88].forEach((freq, idx) => {
            const oscNote = audioCtx.createOscillator();
            const gainNote = audioCtx.createGain();
            oscNote.type = idx % 2 === 0 ? 'triangle' : 'sine';
            oscNote.frequency.setValueAtTime(freq, now + idx * 0.07);
            oscNote.frequency.linearRampToValueAtTime(freq * 1.35, now + idx * 0.07 + 0.28);
            oscNote.connect(gainNote);
            gainNote.connect(audioCtx.destination);
            gainNote.gain.setValueAtTime(0.05, now + idx * 0.07);
            gainNote.gain.linearRampToValueAtTime(0.11, now + idx * 0.07 + 0.08);
            gainNote.gain.linearRampToValueAtTime(0, now + idx * 0.07 + 0.34);
            oscNote.start(now + idx * 0.07);
            oscNote.stop(now + idx * 0.07 + 0.36);
        });
    } else if (type === 'portalBurst') {
        [880, 1174.66, 1567.98].forEach((freq, idx) => {
            const oscNote = audioCtx.createOscillator();
            const gainNote = audioCtx.createGain();
            oscNote.type = 'sawtooth';
            oscNote.frequency.setValueAtTime(freq, now + idx * 0.03);
            oscNote.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 0.28), now + idx * 0.03 + 0.26);
            oscNote.connect(gainNote);
            gainNote.connect(audioCtx.destination);
            gainNote.gain.setValueAtTime(0.12, now + idx * 0.03);
            gainNote.gain.linearRampToValueAtTime(0, now + idx * 0.03 + 0.28);
            oscNote.start(now + idx * 0.03);
            oscNote.stop(now + idx * 0.03 + 0.3);
        });
    } else if (type === 'gameover') {
        const notes = [392.00, 349.23, 311.13, 220.00];
        notes.forEach((freq, idx) => {
            const oscNote = audioCtx.createOscillator();
            const gainNote = audioCtx.createGain();
            oscNote.type = 'sawtooth';
            oscNote.frequency.value = freq;
            oscNote.connect(gainNote);
            gainNote.connect(audioCtx.destination);
            gainNote.gain.setValueAtTime(0.15, now + idx * 0.18);
            gainNote.gain.linearRampToValueAtTime(0, now + idx * 0.18 + 0.25);
            oscNote.start(now + idx * 0.18);
            oscNote.stop(now + idx * 0.18 + 0.3);
        });
    } else if (type === 'click') {
        const { osc, gain } = createSimpleTone();
        osc.type = 'square';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(340, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
    }
}
