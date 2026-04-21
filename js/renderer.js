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
            hero_bg:    'assets/images/ui/hero_bg.png',
            player:     'assets/images/sprites/player.png',
            enemy_base: 'assets/images/sprites/enemy_base.png',
            boss:       'assets/images/sprites/boss.png',
            // Jefes por nivel
            boss2:      'assets/images/boss-2.png',
            boss3:      'assets/images/boss-3.png',
            boss4:      'assets/images/boss-4.png',
            boss5:      'assets/images/boss-5.png',
            boss6:      'assets/images/boss-6.png',
            boss7:      'assets/images/boss-7.png',
            bossFinal:  'assets/images/boss-final.png',
            // Pantalla de inicio
            menu_prota: 'assets/images/protagonista.png',
            // Enemigos especiales
            arbitro:    'assets/images/arbitro.png',
            hincha:     'assets/images/hincha.png',
            hincha2:    'assets/images/hincha-2.png',
            trophy:     'assets/images/ui/trophy.png'
        };

        const loaders = Object.entries(assetList).map(([name, url]) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    images[name] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.log(`Failed to load: ${url}`);
                    resolve();
                };
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
            displayW = windowW;
            displayH = windowW / gameRatio;
        } else {
            displayH = windowH;
            displayW = windowH * gameRatio;
        }

        canvas.style.width = displayW + 'px';
        canvas.style.height = displayH + 'px';

        scaleX = displayW / CONFIG.GAME_WIDTH;
        scaleY = displayH / CONFIG.GAME_HEIGHT;

        Input.updateScale(scaleX, scaleY);

        const hud = document.getElementById('hud');
        if (hud) {
            hud.style.width = displayW + 'px';
            hud.style.height = displayH + 'px';
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
