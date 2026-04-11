/* ============================================
   GARRA GUARANÍ — Audio System
   Web Audio API for SFX + Music
   ============================================ */

const Audio = (() => {
    let ctx = null;
    let enabled = true;
    let masterVolume = 0.5;
    let bgmElement = null;
    let bgmPlaying = false;

    function init() {
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            enabled = false;
        }

        // Cargar música de fondo para el menú (con manejo de errores)
        // Se inicializa null y se crea al entrar al menú para evitar errores de carga
        bgmElement = null;
    }

    function playBGM() {
        if (enabled && !bgmElement) {
            // Crear el elemento de audio la primera vez que se necesita
            try {
                const bgmPath = 'assets/audio/menu.mp3';
                bgmElement = new Audio(bgmPath);
                bgmElement.loop = true;
                bgmElement.volume = 0.3;
                bgmElement.addEventListener('error', () => {
                    console.log('BGM error: file not found or cannot load');
                    bgmElement = null;
                });
            } catch (e) {
                console.log('BGM create failed:', e);
                return;
            }
        }
        if (bgmElement && enabled) {
            bgmElement.currentTime = 0;
            bgmElement.play().catch(e => console.log('BGM autoplay bloqueado:', e));
            bgmPlaying = true;
        }
    }

    function stopBGM() {
        if (bgmElement && bgmPlaying) {
            bgmElement.pause();
            bgmPlaying = false;
        }
    }

    function resume() {
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    }

    /** Generate a simple synth sound */
    function _playTone(freq, duration, type = 'square', volume = 0.3) {
        if (!enabled || !ctx) return;
        resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume * masterVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    /** Simple noise burst for explosions */
    function _playNoise(duration, volume = 0.2) {
        if (!enabled || !ctx) return;
        resume();
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume * masterVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    }

    // --- Sound Effects ---
    function shoot() {
        _playTone(880, 0.06, 'square', 0.15);
    }

    function shootHeavy() {
        _playTone(440, 0.1, 'sawtooth', 0.2);
        _playTone(220, 0.15, 'square', 0.1);
    }

    function enemyHit() {
        _playTone(300, 0.08, 'square', 0.15);
    }

    function enemyDie() {
        _playNoise(0.15, 0.2);
        _playTone(200, 0.15, 'sawtooth', 0.15);
    }

    function playerHit() {
        _playNoise(0.2, 0.3);
        _playTone(150, 0.2, 'sawtooth', 0.25);
    }

    function powerup() {
        _playTone(523, 0.1, 'sine', 0.25);
        setTimeout(() => _playTone(659, 0.1, 'sine', 0.25), 80);
        setTimeout(() => _playTone(784, 0.15, 'sine', 0.25), 160);
    }

    function megaGol() {
        _playNoise(0.5, 0.4);
        _playTone(100, 0.5, 'sawtooth', 0.3);
        setTimeout(() => _playTone(150, 0.3, 'square', 0.3), 200);
    }

    function garraActivate() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => _playTone(200 + i * 100, 0.2, 'sawtooth', 0.2), i * 60);
        }
    }

    function bossAppear() {
        _playTone(100, 0.5, 'sawtooth', 0.3);
        setTimeout(() => _playTone(80, 0.5, 'sawtooth', 0.3), 300);
        setTimeout(() => _playTone(60, 0.8, 'sawtooth', 0.3), 600);
    }

    function victory() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((n, i) => {
            setTimeout(() => _playTone(n, 0.3, 'sine', 0.3), i * 150);
        });
    }

    function gameOver() {
        const notes = [400, 350, 300, 200];
        notes.forEach((n, i) => {
            setTimeout(() => _playTone(n, 0.4, 'sawtooth', 0.2), i * 200);
        });
    }

    function menuSelect() {
        _playTone(660, 0.08, 'square', 0.15);
    }

    function coinPickup() {
        _playTone(1200, 0.05, 'sine', 0.15);
        setTimeout(() => _playTone(1600, 0.08, 'sine', 0.15), 50);
    }

    function setEnabled(val) {
        enabled = val;
        if (bgmElement) {
            bgmElement.muted = !val;
        }
    }

    return {
        init, resume, setEnabled, playBGM, stopBGM,
        shoot, shootHeavy, enemyHit, enemyDie,
        playerHit, powerup, megaGol, garraActivate,
        bossAppear, victory, gameOver, menuSelect, coinPickup
    };
})();
