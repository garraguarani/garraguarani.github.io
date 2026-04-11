/* ============================================
   GARRA GUARANÍ — Renderer
   Canvas setup + scaling for mobile
   ============================================ */

const Renderer = (() => {
    let canvas = null;
    let ctx = null;
    let scaleX = 1;
    let scaleY = 1;

    let images = {};

    async function init() {
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');

        // Set logical size
        canvas.width = CONFIG.GAME_WIDTH;
        canvas.height = CONFIG.GAME_HEIGHT;

        // Disable smoothing for pixel art
        ctx.imageSmoothingEnabled = false;

        // Load assets
        await loadAssets();

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('orientationchange', () => setTimeout(resize, 100));
    }

    async function loadAssets() {
        const assetList = {
            hero_bg: 'assets/images/ui/hero_bg.png',
            player: 'assets/images/sprites/player.png',
            enemy_base: 'assets/images/sprites/enemy_base.png',
            boss: 'assets/images/sprites/boss.png',
            protagonist: 'assets/images/protagonist.png',
            trophy: 'assets/images/ui/trophy.png'
            protagonista_inicio: 'assets/images/ui/protagonista-inicio.png'
        };

        const loaders = Object.entries(assetList).map(([name, url]) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    images[name] = img;
                    resolve();
                };
                img.onerror = resolve; // Continue even if one fails
                img.src = url;
            });
        });

        await Promise.all(loaders);
    }

    function getImage(name) {
        return images[name];
    }

    function resize() {
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;
        const gameRatio = CONFIG.GAME_WIDTH / CONFIG.GAME_HEIGHT;
        const windowRatio = windowW / windowH;

        let displayW, displayH;
        if (windowRatio < gameRatio) {
            // Window is taller (portrait) — fit width
            displayW = windowW;
            displayH = windowW / gameRatio;
        } else {
            // Window is wider — fit height
            displayH = windowH;
            displayW = windowH * gameRatio;
        }

        canvas.style.width = displayW + 'px';
        canvas.style.height = displayH + 'px';

        scaleX = displayW / CONFIG.GAME_WIDTH;
        scaleY = displayH / CONFIG.GAME_HEIGHT;

        // Update input scale
        Input.updateScale(scaleX, scaleY);

        // Position HUD overlay to match canvas
        const hud = document.getElementById('hud');
        if (hud) {
            hud.style.width = displayW + 'px';
            hud.style.height = displayH + 'px';
            // Center the HUD
            hud.style.left = ((windowW - displayW) / 2) + 'px';
            hud.style.top = ((windowH - displayH) / 2) + 'px';
        }
    }

    function clear() {
        ctx.fillStyle = CONFIG.COLORS.BG_DARK;
        ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    }

    function getCtx() {
        return ctx;
    }

    function getCanvas() {
        return canvas;
    }

    return { init, resize, clear, getCtx, getCanvas, getImage };
})();
