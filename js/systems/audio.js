/* ============================================
   GARRA GUARANÍ — Audio System 2.2
   16-bit Professional Synthetic Engine
   Improved Menu Audio (Soft waveforms)
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
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    }

    function _playTone(freq, duration, type = 'square', volume = 0.3, detune = 0, fadeOut = true) {
        if (!enabled || !ctx) return;
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.detune.setValueAtTime(detune, ctx.currentTime);
            gain.gain.setValueAtTime(volume * masterVolume, ctx.currentTime);
            if (fadeOut) {
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            }
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch(e){}
    }

    function _playBass(freq, duration, volume = 0.2) {
        // Softer bass for menu if needed, but keeping for level
        _playTone(freq, duration, 'triangle', volume * 1.5, 0);
        _playTone(freq, duration * 0.8, 'sawtooth', volume * 0.5, 5);
    }

    const MELODIES = {
        menu: {
            tempo: 130, // Relaxed tempo
            lead: [
                [261, 8], [293, 8], [329, 8], [349, 8], [392, 4], [0, 8], [349, 8], [329, 4]
            ],
            bass: [
                [130, 4], [146, 8], [130, 8], [110, 4], [123, 4]
            ],
            type: 'triangle' // Much softer than square
        },
        level: { 
            tempo: 170,
            lead: [
                [392, 16], [392, 16], [440, 16], [392, 16], [523, 8], [493, 8],
                [392, 16], [392, 16], [440, 16], [392, 16], [587, 8], [523, 8]
            ],
            bass: [
                [98, 8], [98, 8], [110, 8], [98, 8], [130, 8], [123, 8],
                [98, 8], [98, 8], [110, 8], [98, 8], [146, 8], [130, 8]
            ],
            drums: [true, false, true, false, true, false, true, false],
            type: 'square' // Fast & exciting for gameplay
        }
    };

    function playBGM(type = 'menu') {
        if (!enabled || !ctx) return;
        resume();
        stopBGM();
        isPlayingBgm = true;
        const melody = MELODIES[type] || MELODIES.menu;
        let step = 0;

        function nextStep() {
            if (!isPlayingBgm) return;
            
            const stepDuration = (60 / melody.tempo) / 4;
            const waveType = melody.type || 'square';
            
            if (melody.lead) {
                const note = melody.lead[step % melody.lead.length];
                if (note[0] > 0) _playTone(note[0], stepDuration * (16/note[1]), waveType, 0.08);
            }
            if (melody.bass) {
                const bNote = melody.bass[step % melody.bass.length];
                if (bNote[0] > 0) {
                    const bassType = type === 'menu' ? 'triangle' : 'sawtooth';
                    _playTone(bNote[0], stepDuration * (16/bNote[1]), bassType, 0.1);
                }
            }
            if (melody.drums && melody.drums[step % melody.drums.length]) {
                const noiseVol = type === 'menu' ? 0.02 : 0.04;
                _playNoise(0.04, noiseVol, 1500);
            }
            step++;
            bgmTimer = setTimeout(nextStep, stepDuration * 1000);
        }
        nextStep();
    }

    function stopBGM() {
        isPlayingBgm = false;
        if (bgmTimer) clearTimeout(bgmTimer);
    }

    function _playNoise(duration, volume = 0.2, filterFreq = 1000) {
        if (!enabled || !ctx) return;
        try {
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
            source.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            source.start();
        } catch(e){}
    }

    function shoot() { _playTone(1000, 0.05, 'square', 0.1); }
    function enemyHit() { _playTone(180, 0.07, 'sawtooth', 0.12); }
    function enemyDie() { _playNoise(0.2, 0.2, 500); }
    function playerHit() { _playNoise(0.3, 0.35, 150); }
    function powerup() { _playTone(880, 0.1, 'sine', 0.15); setTimeout(()=>_playTone(1100, 0.15, 'sine', 0.15), 70); }
    function coinPickup() { _playTone(1320, 0.05, 'sine', 0.2); setTimeout(()=>_playTone(1760, 0.08, 'sine', 0.15), 50); }
    function victory() { playBGM('menu'); }
    function gameOver() { stopBGM(); _playTone(150, 0.6, 'sawtooth', 0.3); }
    function menuSelect() { _playTone(700, 0.05, 'square', 0.1); }
    function bossAppear() { _playTone(100, 1.5, 'sawtooth', 0.3); _playNoise(0.5, 0.2, 200); }
    
    function garraActivate() {
        _playTone(100, 0.5, 'sawtooth', 0.3, 0, false);
        _playTone(200, 0.5, 'sawtooth', 0.2, 0, false);
        _playNoise(1.0, 0.3, 300);
    }

    function megaGol() {
        _playTone(110, 0.2, 'square', 0.4);
        setTimeout(() => _playTone(220, 0.4, 'sawtooth', 0.3), 100);
        _playNoise(1.5, 0.5, 100);
    }

    function hinchaCharge() {
        const duration = 0.5;
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + duration);
            gain.gain.setValueAtTime(0.15 * masterVolume, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + duration);
        } catch(e){}
    }

    function arbitroWhistle() {
        _playTone(2200, 0.1, 'sine', 0.15);
        setTimeout(() => _playTone(2200, 0.25, 'sine', 0.15), 120);
    }

    function cardToss() { _playNoise(0.1, 0.08, 4000); }
    function setEnabled(val) { enabled = val; if (!val) stopBGM(); }

    return {
        init, resume, setEnabled, playBGM, stopBGM, setAmbientVolume,
        shoot, enemyHit, enemyDie, playerHit, powerup, victory, gameOver, 
        menuSelect, hinchaCharge, arbitroWhistle, cardToss, bossAppear,
        garraActivate, megaGol, coinPickup
    };
})();
