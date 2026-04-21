/* ============================================
   GARRA GUARANÍ — Main Menu Screen
   ============================================ */

const MenuScreen = (() => {
    let time = 0;
    
    // Coordenadas fijas para hitboxes (centradas en el canvas de 360x640)
    const BUTTONS = {
        PLAY:     { x: 180, y: 380, w: 220, h: 50, label: 'JUGAR' },
        CONTROLS: { x: 180, y: 445, w: 220, h: 50, label: 'CONTROLES' },
        AUDIO:    { x: 180, y: 510, w: 220, h: 50, label: 'SONIDO: ON' }
    };

    function update(dt) {
        time += dt;

        if (Input.isTapActive()) {
            const tap = Input.getTapPosition();
            
            if (_checkHit(tap, BUTTONS.PLAY)) {
                return 'play';
            }
            if (_checkHit(tap, BUTTONS.CONTROLS)) {
                return 'controls';
            }
            if (_checkHit(tap, BUTTONS.AUDIO)) {
                const isEnabled = !CONFIG.AUDIO_ENABLED;
                CONFIG.AUDIO_ENABLED = isEnabled;
                BUTTONS.AUDIO.label = `SONIDO: ${isEnabled ? 'ON' : 'OFF'}`;
                Audio.setEnabled(isEnabled);
                Audio.menuSelect();
            }
        }
        return null;
    }

    function _checkHit(tap, btn) {
        return tap.x >= btn.x - btn.w/2 && 
               tap.x <= btn.x + btn.w/2 && 
               tap.y >= btn.y - btn.h/2 && 
               tap.y <= btn.y + btn.h/2;
    }

    function draw(ctx) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        // --- Fondo base ---
        ctx.fillStyle = CONFIG.COLORS.BG_DARK;
        ctx.fillRect(0, 0, W, H);

        // --- Arte Principal (Nuevo Protagonista) ---
        const protaImg = Renderer.getImage('menu_prota');
        if (protaImg) {
            // Dibujar la imagen del protagonista centrada arriba de los botones
            const imgW = 280;
            const imgH = 280;
            const imgX = W / 2 - imgW / 2;
            const imgY = 60 + Math.sin(time * 2) * 10; // Suave flotación
            ctx.drawImage(protaImg, imgX, imgY, imgW, imgH);
        } else {
            // Fallback: Logo de texto si no carga la imagen
            ctx.fillStyle = CONFIG.COLORS.PY_RED;
            ctx.font = '24px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText('GARRA', W/2, 160);
            ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
            ctx.fillText('GUARANÍ', W/2, 200);
        }

        // --- Subtítulo Mundial ---
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.textAlign = 'center';
        ctx.fillText('WORLD CUP 2026', W/2, 280);

        // --- Botones Mejorados ---
        Object.values(BUTTONS).forEach(btn => {
            _drawButton(ctx, btn);
        });

        // --- Footer ---
        ctx.font = '6px "Press Start 2P"';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText('© 2026 RETRATO AI', W/2, H - 20);
    }

    function _drawButton(ctx, btn) {
        const isPressed = false; // Implementar estado visual si se desea
        
        ctx.save();
        ctx.translate(btn.x, btn.y);

        // Sombras y bordes
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(-btn.w/2 + 4, -btn.h/2 + 4, btn.w, btn.h);

        // Cuerpo del botón
        const grad = ctx.createLinearGradient(0, -btn.h/2, 0, btn.h/2);
        grad.addColorStop(0, '#CE1126');
        grad.addColorStop(1, '#8B0000');
        ctx.fillStyle = grad;
        ctx.fillRect(-btn.w/2, -btn.h/2, btn.w, btn.h);

        // Borde dorado
        ctx.strokeStyle = CONFIG.COLORS.PY_GOLD;
        ctx.lineWidth = 2;
        ctx.strokeRect(-btn.w/2, -btn.h/2, btn.w, btn.h);

        // Texto
        ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.label, 0, 0);

        ctx.restore();
    }

    return { draw, update };
})();
