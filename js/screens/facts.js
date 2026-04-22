/* ============================================
   GARRA GUARANÍ — Did You Know? (Facts) Screen
   Shows educational cards between levels
   ============================================ */

const FactsScreen = (() => {
    let factId = 1;
    let buttons = [];

    function init(levelIndex) {
        // levelIndex is 1-based or 0-based? 
        // L2 won = index 1. L4 won = index 3. L6 won = index 5. L8 won = index 7.
        // We want Fact 1 after L2, Fact 2 after L4, etc.
        factId = Math.floor((levelIndex + 1) / 2);
        if (factId < 1) factId = 1;
        if (factId > 4) factId = 4;

        buttons = [
            {
                id: 'continue',
                text: 'CONTINUAR ▶',
                x: CONFIG.GAME_WIDTH / 2,
                y: CONFIG.GAME_HEIGHT - 60,
                w: 220,
                h: 45,
                color: CONFIG.COLORS.PY_RED,
                textColor: '#FFFFFF',
                action: 'next'
            }
        ];
    }

    function update(dt, input) {
        let action = null;
        buttons.forEach(btn => {
            if (input.isPointerDown()) {
                const p = input.getPointer();
                if (p.x > btn.x - btn.w/2 && p.x < btn.x + btn.w/2 &&
                    p.y > btn.y - btn.h/2 && p.y < btn.y + btn.h/2) {
                    action = btn.action;
                }
            }
        });

        // Keyboard shortcuts
        if (input.isKeyDown('Enter') || input.isKeyDown(' ')) {
            action = 'next';
        }

        return action;
    }

    function draw(ctx) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        // Background
        ctx.fillStyle = CONFIG.COLORS.BG_DARK;
        ctx.fillRect(0, 0, W, H);

        // Header Title
        ctx.textAlign = 'center';
        ctx.font = '16px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText('¿SABÍAS QUÉ?', W/2, 60);

        // Fact Image
        const img = Renderer.getImage(`fact${factId}`);
        if (img) {
            // scale to fit width with some padding
            const padding = 20;
            const targetW = W - padding * 2;
            const targetH = (targetW / img.width) * img.height;
            
            ctx.drawImage(img, W/2 - targetW/2, 100, targetW, targetH);
        } else {
            // Fallback
            ctx.font = '10px "Press Start 2P"';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`[Imagen de Curiosidad ${factId}]`, W/2, H/2);
        }

        // Draw continue button
        buttons.forEach(btn => {
            _drawButton(ctx, btn);
        });
    }

    function _drawButton(ctx, btn) {
        ctx.save();
        
        // Shadow/Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        
        // Button body
        const grad = ctx.createLinearGradient(btn.x, btn.y - btn.h/2, btn.x, btn.y + btn.h/2);
        grad.addColorStop(0, btn.color);
        grad.addColorStop(1, CONFIG.COLORS.PY_RED_DARK);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(btn.x - btn.w/2, btn.y - btn.h/2, btn.w, btn.h, 8);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Text
        ctx.shadowBlur = 0;
        ctx.fillStyle = btn.textColor;
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.text, btn.x, btn.y);
        
        ctx.restore();
    }

    return { init, update, draw };
})();
