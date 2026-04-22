/* ============================================
   GARRA GUARANÍ — Audio System 4.0
   Motor de 5 capas, tema de inicio épico
   Inspirado en ISS Deluxe / SFII
   ============================================ */

const Audio = (() => {
    let ctx = null;
    let enabled = true;
    let masterVolume = 0.5;
    let masterGain = null;   // Nodo central: permite mute instantáneo
    let bgmTimer = null;
    let isPlayingBgm = false;
    let ambientGain = null;
    let lastHitTime = 0;  // Para limitar frecuencia de sonidos de impacto

    function init() {
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            // Master gain — permite mute instantáneo de todo el audio
            masterGain = ctx.createGain();
            masterGain.gain.value = 1.0;
            masterGain.connect(ctx.destination);
            _initAmbient();
        } catch (e) {
            console.warn('Web Audio API not supported');
            enabled = false;
        }
    }

    function _initAmbient() {
        if (!ctx) return;
        ambientGain = ctx.createGain();
        ambientGain.gain.setValueAtTime(0, ctx.currentTime);
        ambientGain.connect(masterGain);  // → masterGain → destination
        const sz = ctx.sampleRate * 2;
        const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf; src.loop = true;
        const flt = ctx.createBiquadFilter();
        flt.type = 'lowpass'; flt.frequency.value = 400;
        src.connect(flt); flt.connect(ambientGain); src.start();
    }

    function setAmbientVolume(vol) {
        if (!ambientGain || !enabled) return;
        ambientGain.gain.setTargetAtTime(vol * 0.04 * masterVolume, ctx.currentTime, 0.5);
    }

    function resume() {
        if (ctx && ctx.state === 'suspended') ctx.resume();
    }

    /* Genera un tono simple */
    function _note(freq, dur, type = 'triangle', vol = 0.1, delay = 0) {
        if (!enabled || !ctx || !masterGain || freq <= 0) return;
        try {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            g.gain.setValueAtTime(0, ctx.currentTime + delay);
            g.gain.linearRampToValueAtTime(vol * masterVolume, ctx.currentTime + delay + 0.008);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
            osc.connect(g); g.connect(masterGain);  // → masterGain → destination
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + dur + 0.05);
        } catch(e) {}
    }

    /* Genera ruido filtrado (percusión) */
    function _noise(dur, vol = 0.1, filterFreq = 800, delay = 0) {
        if (!enabled || !ctx || !masterGain) return;
        try {
            const sz = Math.max(1, Math.floor(ctx.sampleRate * dur));
            const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
            const d = buf.getChannelData(0);
            for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const flt = ctx.createBiquadFilter();
            flt.frequency.value = filterFreq;
            const g = ctx.createGain();
            g.gain.setValueAtTime(vol * masterVolume, ctx.currentTime + delay);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
            src.connect(flt); flt.connect(g); g.connect(masterGain);  // → masterGain
            src.start(ctx.currentTime + delay);
        } catch(e) {}
    }

    function setAmbientVolume(vol) {
        if (!ambientGain || !enabled) return;
        ambientGain.gain.setTargetAtTime(vol * 0.04 * masterVolume, ctx.currentTime, 0.5);
    }

    // =====================================================
    // MÚSICA (DESACTIVADA)
    // =====================================================
    function playBGM(type = 'menu') { /* Música desactivada */ }
    function stopBGM() { /* Música desactivada */ }

    // =====================================================
    // SFX
    // =====================================================
    function shoot()      { _note(980 + Math.random() * 100, 0.04, 'square', 0.06); }
    function enemyHit() {
        if (!ctx || ctx.currentTime - lastHitTime < 0.075) return;
        lastHitTime = ctx.currentTime;
        const freq = 160 + Math.random() * 40;
        _note(freq, 0.06, 'triangle', 0.07);
    }
    function enemyDie()   { _noise(0.18, 0.18, 500); }
    function playerHit()  { _noise(0.28, 0.30, 150); }
    function powerup()    { _note(880, 0.08, 'sine', 0.13); _note(1100, 0.13, 'sine', 0.12, 0.07); }
    function coinPickup() { _note(1320, 0.05, 'sine', 0.18); _note(1760, 0.08, 'sine', 0.14, 0.05); }
    function menuSelect() { _note(700,  0.04, 'square', 0.09); }
    function gameOver()   { stopBGM(); _note(150, 0.6, 'sawtooth', 0.28); }
    function victory() {
        // Fanfare ascendente: no reinicia el bucle de música durante el gameplay
        _note(523, 0.15, 'square', 0.18);
        _note(659, 0.15, 'square', 0.16, 0.15);
        _note(784, 0.20, 'square', 0.18, 0.30);
        _note(1047, 0.40, 'square', 0.20, 0.50);
        _note(880, 0.15, 'sine',   0.10, 0.55);
        _note(1047, 0.60, 'sine',  0.15, 0.70);
    }

    function bossAppear() {
        _note(80,  1.4, 'sawtooth', 0.28);
        _note(120, 1.0, 'sawtooth', 0.16, 0.15);
        _noise(0.5, 0.18, 160);
    }

    function garraActivate() {
        _note(110, 0.5, 'sawtooth', 0.28);
        _note(220, 0.5, 'sawtooth', 0.18, 0.05);
        _noise(0.8, 0.25, 300);
    }

    function megaGol() {
        _note(110, 0.2, 'square', 0.35);
        _note(220, 0.4, 'sawtooth', 0.28, 0.1);
        _noise(1.5, 0.40, 90);
    }

    function hinchaCharge() {
        try {
            if (!ctx || !masterGain) return;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.45);
            g.gain.setValueAtTime(0.14 * masterVolume, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45);
            osc.connect(g); g.connect(masterGain);  // → masterGain
            osc.start(); osc.stop(ctx.currentTime + 0.5);
        } catch(e) {}
    }

    function arbitroWhistle() {
        _note(2200, 0.08, 'sine', 0.14);
        _note(2200, 0.22, 'sine', 0.14, 0.12);
    }

    function cardToss() { _noise(0.09, 0.07, 4500); }

    function setEnabled(val) {
        enabled = val;
        if (masterGain && ctx) {
            // Mute/unmute instantáneo a través del master gain
            masterGain.gain.setValueAtTime(val ? 1.0 : 0, ctx.currentTime);
        }
        if (!val) {
            stopBGM();
        }
    }

    return {
        init, resume, setEnabled, playBGM, stopBGM, setAmbientVolume,
        shoot, enemyHit, enemyDie, playerHit, powerup, victory, gameOver,
        menuSelect, hinchaCharge, arbitroWhistle, cardToss, bossAppear,
        garraActivate, megaGol, coinPickup
    };
})();
