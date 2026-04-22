/* ============================================
   GARRA GUARANÍ — Coming Soon Screen
   Placeholder for future game modes
   ============================================ */

const ComingSoonScreen = (() => {
    let time = 0;

    function init() {
        time = 0;
    }

    function update(dt) {
        time += dt;

        // Return to menu on any click/key after a short delay
        if (time > 0.5) {
            if (Input.isKeyDown('Enter') || Input.isKeyDown('Space') || Input.isKeyDown('Escape')) {
                Audio.menuSelect();
                return -1; // signals return to menu
            }
            if (Input.isTouching()) {
                Audio.menuSelect();
                return -1;
            }
        }
        return null;
    }

    function draw(ctx) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        // Background (Reuse game field background)
        Background.draw(ctx);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, W, H);

        // Title
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.font = '16px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText('CAMPEONATO PYO', W / 2, 80);

        // Vibrant "PROXIMAMENTE"
        const scale = 1 + Math.sin(time * 5) * 0.05;
        const alpha = 0.7 + Math.sin(time * 8) * 0.3;
        
        ctx.save();
        ctx.translate(W/2, H/2);
        ctx.scale(scale, scale);
        
        ctx.font = '22px "Press Start 2P"';
        // Shadow/Glow
        ctx.fillStyle = `rgba(206, 17, 38, ${alpha})`;
        ctx.fillText('PROXIMAMENTE', 2, 2);
        
        ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
        ctx.fillText('PROXIMAMENTE', 0, 0);
        ctx.restore();

        // Paraguay flag details
        ctx.font = '40px serif';
        ctx.fillText('🇵🇾', W/2, H/2 + 60);

        // Footer
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        const pulse = Math.sin(time * 3) * 0.5 + 0.5;
        ctx.globalAlpha = 0.5 + pulse * 0.5;
        ctx.fillText('← TOCAR PARA VOLVER', W/2, H - 60);
        ctx.globalAlpha = 1;
    }

    return { init, update, draw };
})();
