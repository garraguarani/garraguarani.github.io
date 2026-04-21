/* ============================================
   GARRA GUARANÍ — Crowd System
   ISS Deluxe style animated audience
   ============================================ */

const Crowd = (() => {
    let time = 0;
    const BLOCK_SIZE = 6;
    const ROWS = 4;
    const COLORS = ['#CE1126', '#FFFFFF', '#0038A8', '#FFD700'];

    function update(dt) {
        time += dt;
    }

    function draw(ctx) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        ctx.save();
        // Draw on sides (left and right margins)
        _drawSide(ctx, 0, time);
        _drawSide(ctx, W - (BLOCK_SIZE * ROWS), time);
        ctx.restore();
    }

    function _drawSide(ctx, startX, time) {
        const H = CONFIG.GAME_HEIGHT;
        for (let y = 0; y < H; y += BLOCK_SIZE * 2) {
            for (let r = 0; r < ROWS; r++) {
                const x = startX + r * BLOCK_SIZE;
                const colorIdx = (Math.floor(y / 20) + r) % COLORS.length;
                ctx.fillStyle = COLORS[colorIdx];
                
                // Animation offset based on row and pulse
                const jump = Math.sin(time * 5 + (y * 0.1)) > 0.7 ? 2 : 0;
                ctx.fillRect(x, y - jump, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }

    return { update, draw };
})();
