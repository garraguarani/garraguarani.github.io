/* ============================================
   GARRA GUARANÍ — Menu Screen
   Main menu drawn on canvas
   ============================================ */

const MenuScreen = (() => {
    let time = 0;
    let selectedOption = 0;
    let inputCooldown = 0;
    const OPTIONS = ['JUGAR', 'CONTROLES', 'SONIDO: ON'];
    let soundOn = true;
    let audioContextStarted = false;

    // Constantes de diseño para alineación perfecta
    const OPTIONS_START_Y = 390;
    const OPTIONS_SPACING = 58;
    const BUTTON_WIDTH = 230;
    const BUTTON_HEIGHT = 46;

    function update(dt) {
        if (!audioContextStarted) {
            audioContextStarted = true;
            try { Audio.resume(); Audio.playBGM('menu'); } catch (e) {}
        }

        time += dt;
        if (inputCooldown > 0) inputCooldown -= dt;

        // Keyboard navigation
        if (inputCooldown <= 0) {
            if (Input.isKeyDown('ArrowDown') || Input.isKeyDown('KeyS')) {
                selectedOption = (selectedOption + 1) % OPTIONS.length;
                inputCooldown = 0.2;
                Audio.menuSelect();
            } else if (Input.isKeyDown('ArrowUp') || Input.isKeyDown('KeyW')) {
                selectedOption = (selectedOption - 1 + OPTIONS.length) % OPTIONS.length;
                inputCooldown = 0.2;
                Audio.menuSelect();
            }
        }

        // Touch / click detection
        if (Input.isTapActive()) {
            const pos = Input.getTapPosition();
            if (pos) {
                const W = CONFIG.GAME_WIDTH;
                for (let i = 0; i < OPTIONS.length; i++) {
                    const btnY = OPTIONS_START_Y + i * OPTIONS_SPACING;
                    if (pos.x > W / 2 - BUTTON_WIDTH / 2 &&
                        pos.x < W / 2 + BUTTON_WIDTH / 2 &&
                        pos.y > btnY - BUTTON_HEIGHT / 2 &&
                        pos.y < btnY + BUTTON_HEIGHT / 2) {
                        if (i === 0) { Audio.menuSelect(); return 'play'; }
                        if (i === 1) { Audio.menuSelect(); return 'controls'; }
                        if (i === 2 && inputCooldown <= 0) { _toggleSound(); inputCooldown = 0.3; }
                    }
                }
            }
        }

        // Enter / Space
        if (inputCooldown <= 0 && (Input.isKeyDown('Enter') || Input.isKeyDown('Space'))) {
            inputCooldown = 0.3;
            if (selectedOption === 0) { Audio.menuSelect(); return 'play'; }
            if (selectedOption === 1) { Audio.menuSelect(); return 'controls'; }
            if (selectedOption === 2) _toggleSound();
        }

        return null;
    }

    function _toggleSound() {
        soundOn = !soundOn;
        Audio.setEnabled(soundOn);
        OPTIONS[2] = `SONIDO: ${soundOn ? 'ON' : 'OFF'}`;
        if (soundOn) Audio.menuSelect();
    }

    function draw(ctx) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        // Fondo de cancha
        Background.draw(ctx);

        // Overlay oscuro suave
        ctx.fillStyle = 'rgba(0,0,0,0.72)';
        ctx.fillRect(0, 0, W, H);

        // ---- TÍTULO "GARRA" ----
        const titleY = 88 + Math.sin(time * 1.8) * 4;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = '28px "Press Start 2P"';
        ctx.fillStyle = 'rgba(120,0,0,0.7)';
        ctx.fillText('GARRA', W / 2 + 3, titleY + 3);

        ctx.fillStyle = CONFIG.COLORS.PY_RED;
        ctx.fillText('GARRA', W / 2, titleY);

        // Franja blanca
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(W / 2 - 80, titleY + 20, 160, 4);

        // Subtítulo GUARANÍ
        ctx.font = '18px "Press Start 2P"';
        ctx.fillStyle = '#3A7BD5';
        ctx.fillText('GUARANÍ', W / 2, titleY + 44);

        // ---- PROTAGONISTA (imagen grande central) ----
        const protaImg = Renderer.getImage('menu_prota');
        const decorCenterY = 220;

        if (protaImg) {
            const imgW = 160;
            const imgH = 200;
            const imgX = W / 2 - imgW / 2;
            const imgY = decorCenterY - imgH / 2 + Math.sin(time * 2) * 6;

            // Glow dorado detrás de la imagen
            ctx.save();
            ctx.shadowColor = CONFIG.COLORS.PY_GOLD;
            ctx.shadowBlur = 28 + Math.sin(time * 3) * 8;
            ctx.drawImage(protaImg, imgX, imgY, imgW, imgH);
            ctx.shadowBlur = 0;
            ctx.restore();
        } else {
            // Fallback: trofeo procedural + emoji
            _drawTrophy(ctx, W / 2, decorCenterY, time);
        }

        // ---- PELOTAS FLOTANTES ----
        _drawFloatingBalls(ctx, W, H, time);

        // Línea decorativa
        ctx.strokeStyle = CONFIG.COLORS.PY_RED;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, OPTIONS_START_Y - 28);
        ctx.lineTo(W - 50, OPTIONS_START_Y - 28);
        ctx.stroke();

        // ---- OPCIONES DEL MENÚ ----
        for (let i = 0; i < OPTIONS.length; i++) {
            const y = OPTIONS_START_Y + i * OPTIONS_SPACING;
            const isSelected = i === selectedOption;
            _drawButton(ctx, W / 2, y, BUTTON_WIDTH, BUTTON_HEIGHT, OPTIONS[i], isSelected, time);
        }

        // Footer
        ctx.font = '6px "Press Start 2P"';
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.textAlign = 'center';
        ctx.fillText('⚽ MUNDIAL 2026 — GARRA GUARANÍ ⚽', W / 2, H - 24);
        ctx.fillText('v1.0 — Hecho con ❤️ en Paraguay', W / 2, H - 10);
    }

    function _drawButton(ctx, cx, cy, w, h, label, isSelected, time) {
        ctx.save();
        ctx.translate(cx, cy);

        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(-w / 2 + 3, -h / 2 + 3, w, h);

        // Fondo
        if (isSelected) {
            const pulse = Math.sin(time * 6) * 0.15 + 0.85;
            const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
            grad.addColorStop(0, `rgba(206, 17, 38, ${pulse})`);
            grad.addColorStop(1, `rgba(100, 0, 15, ${pulse})`);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = 'rgba(15, 15, 30, 0.8)';
        }
        ctx.fillRect(-w / 2, -h / 2, w, h);

        // Borde
        ctx.strokeStyle = isSelected ? CONFIG.COLORS.PY_GOLD : 'rgba(255,255,255,0.18)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // Texto
        ctx.font = '11px "Press Start 2P"';
        ctx.fillStyle = isSelected ? CONFIG.COLORS.PY_GOLD : CONFIG.COLORS.PY_WHITE;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 0, 0);

        // Cursor > si seleccionado
        if (isSelected) {
            ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
            ctx.font = '10px "Press Start 2P"';
            ctx.textAlign = 'left';
            ctx.fillText('▶', -w / 2 + 6, 0);
        }

        ctx.restore();
    }

    function _drawTrophy(ctx, cx, cy, time) {
        const pulse = Math.sin(time * 1.5) * 0.05 + 1;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(-20, 40, 40, 8);
        ctx.fillRect(-15, 48, 30, 6);
        ctx.fillRect(-8, 25, 16, 15);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-25, -10, 50, 35);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(-18, -5, 36, 25);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, -10, 12, Math.PI, 0);
        ctx.fill();
        if (Math.sin(time * 4) > 0.5) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(15, -20, 3, 3);
            ctx.fillRect(-18, -15, 2, 2);
        }
        ctx.restore();
    }

    function _drawFloatingBalls(ctx, W, H, time) {
        const balls = [
            { x: W * 0.12, y: H * 0.32, offset: 0 },
            { x: W * 0.88, y: H * 0.28, offset: 1.3 },
            { x: W * 0.18, y: H * 0.55, offset: 2.1 },
            { x: W * 0.82, y: H * 0.52, offset: 3.5 },
            { x: W * 0.08, y: H * 0.70, offset: 0.7 },
            { x: W * 0.92, y: H * 0.68, offset: 2.8 }
        ];
        ctx.font = '18px serif';
        for (const ball of balls) {
            const floatY = ball.y + Math.sin(time * 2 + ball.offset) * 10;
            const alpha = 0.25 + Math.sin(time * 1.5 + ball.offset) * 0.12;
            ctx.globalAlpha = alpha;
            ctx.fillText('⚽', ball.x, floatY);
        }
        ctx.globalAlpha = 1;
    }

    return { update, draw };
})();
