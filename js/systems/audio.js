/* ============================================
   GARRA GUARANÍ — Audio System 3.0
   Engine sintético de 3 capas
   Melodía + Arpeggio + Bajo + Pad + Percusión
   ============================================ */

const Audio = (() => {
    let ctx = null;
    let enabled = true;
    let masterVolume = 0.5;
    let bgmTimer = null;
    let isPlayingBgm = false;
    let ambientGain = null;

    function init() {
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
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
        ambientGain.connect(ctx.destination);
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        source.connect(filter);
        filter.connect(ambientGain);
        source.start();
    }

    function setAmbientVolume(vol) {
        if (!ambientGain || !enabled) return;
        ambientGain.gain.setTargetAtTime(vol * 0.04 * masterVolume, ctx.currentTime, 0.5);
    }

    function resume() {
        if (ctx && ctx.state === 'suspended') ctx.resume();
    }

    function _note(freq, dur, type = 'triangle', vol = 0.1, delay = 0) {
        if (!enabled || !ctx) return;
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            gain.gain.setValueAtTime(0, ctx.currentTime + delay);
            gain.gain.linearRampToValueAtTime(vol * masterVolume, ctx.currentTime + delay + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + dur + 0.05);
        } catch(e) {}
    }

    function _noise(dur, vol = 0.1, filterFreq = 800, delay = 0) {
        if (!enabled || !ctx) return;
        try {
            const size = Math.max(1, Math.floor(ctx.sampleRate * dur));
            const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const filt = ctx.createBiquadFilter();
            filt.frequency.setValueAtTime(filterFreq, ctx.currentTime);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(vol * masterVolume, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
            source.connect(filt);
            filt.connect(gain);
            gain.connect(ctx.destination);
            source.start(ctx.currentTime + delay);
        } catch(e) {}
    }

    // =========================================
    // MELODÍAS (3 capas por tipo)
    // =========================================

    // -- MENU: Himno épico en C mayor, 128 BPM --
    // Cada paso es una corchea (1/8 note)
    // step = [freq, durInSteps]
    const MENU_MELODY = [
        [523, 2], [587, 1], [659, 1], [698, 2], [659, 2],
        [523, 1], [587, 1], [659, 2], [523, 4],
        [659, 2], [698, 1], [784, 1], [880, 4],
        [784, 2], [698, 1], [659, 1], [523, 4]
    ];

    const MENU_BASS = [
        [131, 4], [165, 4], [196, 4], [131, 4],
        [131, 4], [165, 4], [196, 4], [165, 4]
    ];

    // Arpeggio alternado: C-E-G / A-C-E / F-A-C / G-B-D
    const MENU_ARP = [
        262, 330, 392, 220, 262, 330,
        175, 220, 262, 196, 247, 294,
        262, 330, 392, 220, 262, 330,
        175, 220, 262, 247, 294, 330
    ];

    // -- LEVEL: Metal urgente en E menor, 170 BPM --
    const LEVEL_MELODY = [
        [659, 1], [659, 1], [784, 1], [659, 1], [880, 2], [831, 2],
        [698, 1], [698, 1], [784, 1], [698, 1], [988, 2], [880, 2],
        [659, 1], [0, 1], [659, 1], [784, 1], [659, 2], [0, 2],
        [523, 1], [587, 1], [659, 2], [587, 1], [523, 4]
    ];

    const LEVEL_BASS = [
        [82, 2], [82, 2], [98, 2], [82, 2],
        [110, 2], [98, 2], [82, 4],
        [82, 2], [82, 2], [73, 2], [82, 4]
    ];

    function _bgmLoop(type) {
        if (!isPlayingBgm || !ctx) return;

        const isMenu = type === 'menu';
        const BPM = isMenu ? 128 : 170;
        const eighth = (60 / BPM) / 2; // duración de una corchea en segundos

        const melody = isMenu ? MENU_MELODY : LEVEL_MELODY;
        const bass   = isMenu ? MENU_BASS   : LEVEL_BASS;

        // ---- CAPA 1: Melodía principal ----
        let tLead = 0;
        for (const [freq, steps] of melody) {
            const dur = eighth * steps;
            if (freq > 0) _note(freq, dur * 0.85, isMenu ? 'triangle' : 'square', isMenu ? 0.07 : 0.08, tLead);
            tLead += dur;
        }

        // ---- CAPA 2: Bajo ----
        let tBass = 0;
        for (const [freq, steps] of bass) {
            const dur = eighth * steps;
            _note(freq, dur * 0.7, 'triangle', isMenu ? 0.10 : 0.14, tBass);
            // sub-bass con sawtooth
            _note(freq, dur * 0.5, 'sawtooth', isMenu ? 0.04 : 0.06, tBass + 0.01);
            tBass += dur;
        }

        // ---- CAPA 3: Arpeggio (solo menu) ----
        if (isMenu) {
            for (let i = 0; i < MENU_ARP.length; i++) {
                _note(MENU_ARP[i], eighth * 0.4, 'sine', 0.04, i * eighth);
            }
        }

        // ---- CAPA 4: Pad envolvente (solo menu) ----
        if (isMenu) {
            // Acorde C-E-G suave y largo
            const padFreqs = [262, 330, 392];
            const padDur = eighth * MENU_ARP.length;
            for (const f of padFreqs) {
                _note(f, padDur * 0.95, 'sine', 0.025);
            }
        }

        // ---- CAPA 5: Percusión ----
        const totalSteps = isMenu ? MENU_ARP.length : 16;
        for (let i = 0; i < totalSteps; i++) {
            const t = i * eighth;
            // Kick en tiempos 1 y 3
            if (i % 4 === 0) _noise(0.12, isMenu ? 0.06 : 0.09, 120, t);
            // Snare en tiempos 2 y 4
            if (i % 4 === 2) _noise(0.10, isMenu ? 0.04 : 0.07, 2000, t);
            // Hi-hat en todos
            if (!isMenu && i % 2 === 1) _noise(0.04, 0.02, 8000, t);
        }

        const loopDuration = eighth * totalSteps * 1000;
        bgmTimer = setTimeout(() => _bgmLoop(type), loopDuration);
    }

    function playBGM(type = 'menu') {
        if (!enabled || !ctx) return;
        resume();
        stopBGM();
        isPlayingBgm = true;
        _bgmLoop(type);
    }

    function stopBGM() {
        isPlayingBgm = false;
        if (bgmTimer) { clearTimeout(bgmTimer); bgmTimer = null; }
    }

    // =========================================
    // SFX
    // =========================================
    function shoot()      { _note(1046, 0.05, 'square', 0.09); }
    function enemyHit()   { _note(185, 0.07, 'sawtooth', 0.11); }
    function enemyDie()   { _noise(0.18, 0.18, 500); }
    function playerHit()  { _noise(0.28, 0.30, 150); }
    function powerup()    { _note(880, 0.08, 'sine', 0.13); _note(1100, 0.13, 'sine', 0.12, 0.07); }
    function coinPickup() { _note(1320, 0.05, 'sine', 0.18); _note(1760, 0.08, 'sine', 0.14, 0.05); }
    function menuSelect() { _note(700, 0.04, 'square', 0.09); }
    function gameOver()   { stopBGM(); _note(150, 0.6, 'sawtooth', 0.28); }
    function victory()    { playBGM('menu'); }

    function bossAppear() {
        _note(80,  1.5, 'sawtooth', 0.28);
        _note(100, 1.2, 'sawtooth', 0.18, 0.1);
        _noise(0.5, 0.18, 180);
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
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.45);
            gain.gain.setValueAtTime(0.14 * masterVolume, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45);
            osc.connect(gain); gain.connect(ctx.destination);
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
        if (!val) stopBGM();
    }

    return {
        init, resume, setEnabled, playBGM, stopBGM, setAmbientVolume,
        shoot, enemyHit, enemyDie, playerHit, powerup, victory, gameOver,
        menuSelect, hinchaCharge, arbitroWhistle, cardToss, bossAppear,
        garraActivate, megaGol, coinPickup
    };
})();
