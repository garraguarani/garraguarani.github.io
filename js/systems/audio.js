/* ============================================
   GARRA GUARANÍ — Audio System
   100% Synthetic 16-bit Style (Web Audio API)
   ============================================ */

const Audio = (() => {
    let ctx = null;
    let enabled = true;
    let masterVolume = 0.5;
    let currentBgm = null;
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

        // Crowd murmur simulation with white noise + lowpass
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
        ambientGain.gain.setTargetAtTime(vol * 0.05 * masterVolume, ctx.currentTime, 0.5);
    }

    function resume() {
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    }

    function _playTone(freq, duration, type = 'square', volume = 0.3, detune = 0) {
        if (!enabled || !ctx) return;
        resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime(detune, ctx.currentTime);
        gain.gain.setValueAtTime(volume * masterVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    function _playNoise(duration, volume = 0.2, filterFreq = 1000) {
        if (!enabled || !ctx) return;
        resume();
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume * masterVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    }

    // --- BGM Engine ---
    const MELODIES = {
        menu: {
            tempo: 140,
            notes: [
                [261, 4], [329, 4], [392, 4], [523, 2], [392, 4], [329, 4],
                [293, 4], [349, 4], [440, 4], [587, 2], [440, 4], [349, 4]
            ]
        },
        level: { // Base para niveles emocionantes
            tempo: 160,
            notes: [
                [196, 8], [196, 8], [261, 4], [196, 8], [196, 8], [293, 4],
                [196, 8], [196, 8], [329, 4], [392, 4], [349, 4], [293, 4]
            ]
        }
    };

    function playBGM(type = 'menu') {
        if (!enabled) return;
        stopBGM();
        isPlayingBgm = true;
        const melody = MELODIES[type] || MELODIES.menu;
        let noteIndex = 0;

        function nextNote() {
            if (!isPlayingBgm) return;
            const note = melody.notes[noteIndex];
            const duration = (60 / melody.tempo) * (4 / note[1]);
            _playTone(note[0], duration, 'square', 0.1);
            
            noteIndex = (noteIndex + 1) % melody.notes.length;
            bgmTimer = setTimeout(nextNote, duration * 1000);
        }
        nextNote();
    }

    function stopBGM() {
        isPlayingBgm = false;
        if (bgmTimer) clearTimeout(bgmTimer);
    }

    // --- SFII Style SFX ---
    function hinchaCharge() {
        // Grito de carga ascendente
        const duration = 0.4;
        const startFreq = 100;
        const endFreq = 400;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.2 * masterVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    function arbitroWhistle() {
        _playTone(2000, 0.1, 'sine', 0.2);
        setTimeout(() => _playTone(2000, 0.2, 'sine', 0.2), 120);
    }

    function cardToss() {
        _playNoise(0.1, 0.1, 3000);
    }

    // Existing SFX migrated to clean synth
    function shoot() { _playTone(880, 0.05, 'square', 0.1); }
    function enemyHit() { _playTone(150, 0.08, 'sawtooth', 0.15); }
    function enemyDie() { _playNoise(0.2, 0.25, 400); }
    function playerHit() { _playNoise(0.3, 0.4, 200); _playTone(100, 0.3, 'sawtooth', 0.2); }
    function powerup() { _playTone(523, 0.1, 'sine', 0.2); setTimeout(()=>_playTone(659, 0.15, 'sine', 0.2), 80); }
    function victory() { playBGM('menu'); }
    function gameOver() { stopBGM(); _playTone(200, 0.5, 'sawtooth', 0.3); }
    function menuSelect() { _playTone(600, 0.06, 'square', 0.1); }

    function setEnabled(val) { enabled = val; if (!val) stopBGM(); }

    return {
        init, resume, setEnabled, playBGM, stopBGM, setAmbientVolume,
        shoot, enemyHit, enemyDie, playerHit, powerup, victory, gameOver, 
        menuSelect, hinchaCharge, arbitroWhistle, cardToss
    };
})();
