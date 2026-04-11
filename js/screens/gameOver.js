/* ============================================
   GARRA GUARANÍ — Game Over Screen
   ============================================ */

const GameOverScreen = (() => {
    let time = 0;

    function update(dt) {
        time += dt;

        if (time < 1.5) return null; // Delay before allowing input

        if (Input.isTouching()) {
            const pos = Input.getTouchGamePos();
            if (pos) {
                if (pos.y > 420 && pos.y < 470) return 'retry';
                if (pos.y > 490 && pos.y < 540) return 'menu';
            }
        }

        if (Input.isKeyDown('Enter') || Input.isKeyDown('Space')) return 'retry';
        if (Input.isKeyDown('Escape')) return 'menu';

        return null;
    }

    function draw(ctx, player, levelIndex) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        // Dark overlay
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, W, H);

        // "ELIMINADO"
        ctx.font = '18px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = CONFIG.COLORS.PY_RED;
        ctx.fillText('ELIMINADO', W/2, 160);

        // Skull/sad emoji
        ctx.font = '50px serif';
        ctx.fillText('😢', W/2, 240);

        // Stats
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
        ctx.fillText(`Nivel: ${levelIndex + 1} / 8`, W/2, 300);
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText(`Score: ₲${player.score.toLocaleString()}`, W/2, 325);

        // Motivational quote
        ctx.font = '7px "Press Start 2P"';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        const quotes = [
            '¡La garra no se rinde!',
            '¡Volve mas fuerte, crack!',
            '¡Paraguay no se achica!',
            '¡Un terere e intentar de nuevo!',
        ];
        ctx.fillText(quotes[Math.floor(time) % quotes.length], W/2, 360);

        // Buttons
        if (time >= 1.5) {
            // Retry
            ctx.fillStyle = 'rgba(206, 17, 38, 0.6)';
            ctx.fillRect(80, 420, W - 160, 40);
            ctx.strokeStyle = CONFIG.COLORS.PY_RED;
            ctx.lineWidth = 1;
            ctx.strokeRect(80, 420, W - 160, 40);
            ctx.font = '9px "Press Start 2P"';
            ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
            ctx.fillText('🔄 REINTENTAR', W/2, 445);

            // Menu
            ctx.fillStyle = 'rgba(50,50,70,0.5)';
            ctx.fillRect(80, 490, W - 160, 40);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.strokeRect(80, 490, W - 160, 40);
            ctx.font = '8px "Press Start 2P"';
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillText('← MENÚ', W/2, 515);
        }
    }

    function reset() {
        time = 0;
    }

    return { update, draw, reset };
})();
