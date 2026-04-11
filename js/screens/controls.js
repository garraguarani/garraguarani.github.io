/* ============================================
   GARRA GUARANÍ — Controls Screen
   Explains how to play the game
   ============================================ */

const ControlsScreen = (() => {
    let time = 0;

    function init() {
        time = 0;
    }

    function update(dt) {
        time += dt;

        // Any significant touch or key press returns to menu
        if (time > 0.5) {
            if (Input.isKeyDown('Enter') || Input.isKeyDown('Space') || Input.isKeyDown('Escape')) {
                Audio.menuSelect();
                return -1; // -1 signals return to menu
            }
            if (Input.isTouching()) {
                const pos = Input.getTouchGamePos();
                if (pos && pos.y > CONFIG.GAME_HEIGHT - 60) {
                    Audio.menuSelect();
                    return -1;
                }
            }
        }
        return null;
    }

    function draw(ctx) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        // Background
        Background.draw(ctx);

        // Overlay
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, W, H);

        // Title
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText('CONTROLES', W / 2, 60);

        // Instructions
        ctx.textAlign = 'left';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = '#FFFFFF';
        
        let y = 110;
        const spacing = 40;

        ctx.fillText('👆 Mover: Arrastra en la pantalla', 20, y);
        ctx.fillStyle = '#AAAAAA';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('    o usa las Flechas / WASD', 20, y + 15);
        
        y += spacing + 10;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText('🔥 Disparo: ¡Automático!', 20, y);
        
        y += spacing;
        ctx.fillText('💣 Cambiar Arma: Botón o [Q]', 20, y);

        y += spacing;
        ctx.fillText('🏆 Mega Gol: Botón o [R]', 20, y);

        y += spacing;
        ctx.fillStyle = CONFIG.COLORS.PY_RED;
        ctx.fillText('⭐ MODO GARRA: Botón o [E]', 20, y);
        ctx.fillStyle = '#AAAAAA';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('    (¡Invencibilidad y daño triple!)', 20, y + 15);

        // Footer button
        ctx.textAlign = 'center';
        ctx.font = '10px "Press Start 2P"';
        const pulse = Math.sin(time * 5) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255,255,255, ${0.5 + pulse * 0.5})`;
        ctx.fillText('← VOLVER AL MENÚ', W / 2, H - 30);
    }

    return { init, update, draw };
})();
