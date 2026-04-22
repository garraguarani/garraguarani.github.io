/* ============================================
   GARRA GUARANÍ — Did You Know? (Facts) Screen
   Shows educational cards between levels
   ============================================ */

const FactsScreen = (() => {
    let factId = 1;
    let buttons = [];
    let time = 0;

    function init(levelIndex) {
        // levelIndex is 1-based or 0-based? 
        // L2 won = index 1. L4 won = index 3. L6 won = index 5. L8 won = index 7.
        // We want Fact 1 after L2, Fact 2 after L4, etc.
        factId = Math.floor((levelIndex + 1) / 2);
        if (factId < 1) factId = 1;
        if (factId > 4) factId = 4;

        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        buttons.length = 0;
        buttons.push({
            x: W / 2,
            y: H - 80,
            w: 220,
            h: 50,
            text: 'CONTINUAR ▶',
            color: CONFIG.COLORS.PY_RED,
            textColor: '#FFFFFF',
            action: 'next'
        });
        
        time = 0;
    }

    function update(dt, input) {
        time += dt;

        // Prevent inputs carrying over from the previous screen (Shop)
        if (time < 1.0) return null;

        let action = null;
        
        if (input.isTapActive()) {
            const p = input.getTapPosition();
            buttons.forEach(btn => {
                if (p.x > btn.x - btn.w/2 && p.x < btn.x + btn.w/2 &&
                    p.y > btn.y - btn.h/2 && p.y < btn.y + btn.h/2) {
                    action = btn.action;
                }
            });
        }

        // Keyboard shortcuts
        if (input.isKeyDown('Enter') || input.isKeyDown(' ')) {
            action = 'next';
        }

        return action;
    }

    function draw(ctx) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        // ---- FONDO DE CANCHA (v30) ----
        Background.draw(ctx);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'; // Overlay para legibilidad
        ctx.fillRect(0, 0, W, H);

        // ---- TÍTULO OFICIAL (v30) ----
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Sombra
        ctx.font = '22px "Press Start 2P"';
        ctx.fillStyle = 'rgba(100,0,0,0.8)';
        ctx.fillText('GARRA', W/2 + 2, 54 + Math.sin(time * 2) * 2);
        // Texto
        ctx.fillStyle = CONFIG.COLORS.PY_RED;
        ctx.fillText('GARRA', W/2, 52 + Math.sin(time * 2) * 2);

        // Franja blanca
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(W/2 - 70, 66 + Math.sin(time * 2) * 2, 140, 3);

        // Subtítulo
        ctx.font = '14px "Press Start 2P"';
        ctx.fillStyle = '#4488FF';
        ctx.fillText('GUARANÍ', W/2, 82 + Math.sin(time * 2) * 2);

        // Fact Image
        const img = Renderer.getImage(`fact${factId}`);
        if (img) {
            // scale to fit width with some padding
            const padding = 20;
            const targetW = W - padding * 2;
            const targetH = (targetW / img.width) * img.height;
            
            // v30: Layout ajustado para el logo
            ctx.drawImage(img, W/2 - targetW/2, 160, targetW, targetH);
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
