/* ============================================
   GARRA GUARANÍ — Audio System 4.0
   Motor de 5 capas, tema de inicio épico
   Inspirado en ISS Deluxe / SFII
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
        if (!enabled || !ctx || freq <= 0) return;
        try {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            g.gain.setValueAtTime(0, ctx.currentTime + delay);
            g.gain.linearRampToValueAtTime(vol * masterVolume, ctx.currentTime + delay + 0.008);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
            osc.connect(g); g.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + dur + 0.05);
        } catch(e) {}
    }

    /* Genera ruido filtrado (percusión) */
    function _noise(dur, vol = 0.1, filterFreq = 800, delay = 0) {
        if (!enabled || !ctx) return;
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
            src.connect(flt); flt.connect(g); g.connect(ctx.destination);
            src.start(ctx.currentTime + delay);
        } catch(e) {}
    }

    // =====================================================
    // MELODÍAS
    // =====================================================

    /**
     * MENU — Anthem épico 150 BPM, escala de E menor
     * Inspirado en ISS Deluxe / Football anthems
     * Cada entrada: [frecuencia, pasos en 16vas]
     * (stepDur = 1 paso = una semicorchea = 60/BPM/4)
     */
    const MENU_LEAD = [
        // Frase 1: arranque explosivo
        [330,2],[370,2],[415,2],[370,2],
        [494,2],[440,2],[415,4],
        // Frase 2: subida y grito
        [494,2],[523,2],[587,2],[659,2],
        [784,4],[659,4],
        // Frase 3: respuesta bajando
        [587,2],[523,2],[494,2],[440,2],
        [415,2],[370,2],[330,4],
        // Frase 4: remate final
        [415,2],[494,2],[587,2],[523,2],
        [659,4],[784,4],[0,4]
    ]; // total = 48 steps

    const MENU_BASS = [
        // I - VII - VI - VII (Em - D - C - D)  
        [82,8],[98,8],[131,8],[98,8], // a
        [82,8],[73,8],[98,8],[82,8]  // b
    ]; // total = 64 steps → loop diferente al lead (poliritmia natural)

    // Counter-melody / arpeggio en 16vas sobre los acordes
    const MENU_ARP = [
        165,196,247,196, 220,261,330,261, // Am arp
        196,247,294,247, 220,261,330,220, // bm arp
        175,220,261,220, 196,247,294,247, // C arp
        196,261,330,261, 247,294,370,294  // D arp
    ]; // 32 notas = 32 steps

    // Acordes de pad (pad largo, 4 notas cada 8 pasos)
    const MENU_CHORDS = [
        [164,196,247],  // Am/C
        [196,247,294],  // Bm (paso a D)
        [175,220,261],  // C
        [196,247,330],  // D
    ];

    /**
     * LEVEL — Metal urgente 172 BPM, escala de E frigio
     */
    const LEVEL_LEAD = [
        [659,1],[659,1],[784,1],[659,1],[0,1],[831,1],[784,2],
        [698,1],[698,1],[784,1],[698,1],[0,1],[988,1],[880,2],
        [659,1],[0,1],[659,1],[784,1],[659,2],[523,2],
        [659,2],[587,2],[523,2],[587,4]
    ]; // 28 steps

    const LEVEL_BASS = [
        [82,4],[82,2],[98,2],[110,4],[98,4],
        [82,4],[73,4],[82,8]
    ]; // 32 steps

    function _bgmLoop(type) {
        if (!isPlayingBgm || !ctx) return;
        const isMenu = type === 'menu';
        const BPM = isMenu ? 150 : 172;
        const step = 60 / BPM / 4; // duración de 1 semicorchea en segundos

        // ----- CAPA 1: Melodía lead -----
        const lead = isMenu ? MENU_LEAD : LEVEL_LEAD;
        let t = 0;
        for (const [freq, steps] of lead) {
            const dur = step * steps;
            if (freq > 0) {
                _note(freq, dur * 0.80, isMenu ? 'square' : 'sawtooth',
                      isMenu ? 0.07 : 0.08, t);
            }
            t += dur;
        }
        const loopDur = t; // duración real del loop

        // ----- CAPA 2: Bajo -----
        const bass = isMenu ? MENU_BASS : LEVEL_BASS;
        let tb = 0;
        for (const [freq, steps] of bass) {
            const dur = step * steps;
            _note(freq,       dur * 0.7, 'triangle', isMenu ? 0.11 : 0.14, tb);
            _note(freq * 0.5, dur * 0.4, 'sawtooth', isMenu ? 0.04 : 0.06, tb + 0.01);
            tb += dur;
            if (tb >= loopDur) break; // no sobrepasar el loop
        }

        // ----- CAPA 3: Arpeggio de 16vas (solo menu) -----
        if (isMenu) {
            for (let i = 0; i < MENU_ARP.length && i * step < loopDur; i++) {
                const freq = MENU_ARP[i];
                _note(freq, step * 0.45, 'sine', 0.035, i * step);
            }
        }

        // ----- CAPA 4: Pad armónico (solo menu) -----
        if (isMenu) {
            for (let ci = 0; ci < MENU_CHORDS.length; ci++) {
                const chordTime = ci * step * 8;
                if (chordTime >= loopDur) break;
                const chordDur = step * 7.5;
                for (const f of MENU_CHORDS[ci]) {
                    _note(f, chordDur, 'sine', 0.022, chordTime);
                }
            }
        }

        // ----- CAPA 5: Percusión -----
        const totalSteps = Math.round(loopDur / step);
        for (let i = 0; i < totalSteps; i++) {
            const pt = i * step;
            if (i % 8 === 0)                        _noise(0.14, isMenu ? 0.07 : 0.10, 100,  pt); // Kick
            if (i % 8 === 4)                        _noise(0.12, isMenu ? 0.05 : 0.08, 2500, pt); // Snare
            if (!isMenu && i % 2 === 1)             _noise(0.04, 0.025, 9000, pt);               // Hi-hat nivel
            if (isMenu && i % 16 === 12)            _noise(0.06, 0.035, 6000, pt);               // Open hi-hat menu
        }

        bgmTimer = setTimeout(() => _bgmLoop(type), loopDur * 1000);
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

    // =====================================================
    // SFX
    // =====================================================
    function shoot()      { _note(1046, 0.05, 'square', 0.09); }
    function enemyHit()   { _note(185,  0.07, 'sawtooth', 0.11); }
    function enemyDie()   { _noise(0.18, 0.18, 500); }
    function playerHit()  { _noise(0.28, 0.30, 150); }
    function powerup()    { _note(880, 0.08, 'sine', 0.13); _note(1100, 0.13, 'sine', 0.12, 0.07); }
    function coinPickup() { _note(1320, 0.05, 'sine', 0.18); _note(1760, 0.08, 'sine', 0.14, 0.05); }
    function menuSelect() { _note(700,  0.04, 'square', 0.09); }
    function gameOver()   { stopBGM(); _note(150, 0.6, 'sawtooth', 0.28); }
    function victory()    { playBGM('menu'); }

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
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.45);
            g.gain.setValueAtTime(0.14 * masterVolume, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45);
            osc.connect(g); g.connect(ctx.destination);
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
