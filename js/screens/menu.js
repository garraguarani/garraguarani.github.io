/* ============================================
   GARRA GUARANÍ — Menu Screen v3
   Layout compacto, botones abajo
   ============================================ */

const MenuScreen = (() => {
    let time = 0;
    let selectedOption = 0;
    let inputCooldown = 0;
    const OPTIONS = ['JUGAR', 'CONTROLES', 'SONIDO: ON'];
    let soundOn = true;
    let audioContextStarted = false;

    // Layout: canvas 360x640
    // Zona superior (título + imagen): y=0..340
    // Zona inferior (botones + footer): y=350..640
    const BTN_START_Y = 370;
    const BTN_SPACING = 58;
    const BTN_W = 240;
    const BTN_H = 48;

    function update(dt) {
        if (!audioContextStarted) {
            audioContextStarted = true;
            try { Audio.resume(); } catch (e) {}
        }
        time += dt;
        if (inputCooldown > 0) inputCooldown -= dt;

        if (inputCooldown <= 0) {
            if (Input.isKeyDown('ArrowDown') || Input.isKeyDown('KeyS')) {
                selectedOption = (selectedOption + 1) % OPTIONS.length;
                inputCooldown = 0.2; Audio.menuSelect();
            } else if (Input.isKeyDown('ArrowUp') || Input.isKeyDown('KeyW')) {
                selectedOption = (selectedOption - 1 + OPTIONS.length) % OPTIONS.length;
                inputCooldown = 0.2; Audio.menuSelect();
            }
        }

        if (Input.isTapActive()) {
            const pos = Input.getTapPosition();
            const W = CONFIG.GAME_WIDTH;
            for (let i = 0; i < OPTIONS.length; i++) {
                const btnY = BTN_START_Y + i * BTN_SPACING;
                if (pos.x > W/2 - BTN_W/2 && pos.x < W/2 + BTN_W/2 &&
                    pos.y > btnY - BTN_H/2 && pos.y < btnY + BTN_H/2) {
                    if (i === 0) { Audio.menuSelect(); return 'play'; }
                    if (i === 1) { Audio.menuSelect(); return 'controls'; }
                    if (i === 2 && inputCooldown <= 0) { _toggleSound(); inputCooldown = 0.3; }
                }
            }
        }

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
        const W = CONFIG.GAME_WIDTH;   // 360
        const H = CONFIG.GAME_HEIGHT;  // 640

        // Reset explícito del canvas state (evita lineDash o globalAlpha residual)
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;

        // ---- FONDO DE CANCHA ----
        Background.draw(ctx);
        ctx.fillStyle = 'rgba(0,0,0,0.74)';
        ctx.fillRect(0, 0, W, H);

        // ---- TÍTULO (compacto) ----
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Sombra
        ctx.font = '22px "Press Start 2P"';
        ctx.fillStyle = 'rgba(100,0,0,0.8)';
        ctx.fillText('GARRA', W/2 + 2, 54);
        // Texto
        ctx.fillStyle = CONFIG.COLORS.PY_RED;
        ctx.fillText('GARRA', W/2, 52);

        // Franja blanca
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(W/2 - 70, 66, 140, 3);

        // Subtítulo
        ctx.font = '14px "Press Start 2P"';
        ctx.fillStyle = '#4488FF';
        ctx.fillText('GUARANÍ', W/2, 82);

        const protaImg = Renderer.getImage('menu_prota');
        let finalW, finalH, imgX, imgY;

        if (protaImg) {
            const nativeW = protaImg.width;
            const nativeH = protaImg.height;
            const ratio = nativeW / nativeH;

            // Definir límites elegantes: Alto máximo ~220px, Ancho máximo ~75% del canvas
            const maxAllowedH = 220;
            const maxAllowedW = W * 0.75;

            finalH = maxAllowedH;
            finalW = finalH * ratio;

            // Si el ancho resultante es muy grande, escalar hacia abajo por ancho
            if (finalW > maxAllowedW) {
                const scale = maxAllowedW / finalW;
                finalW = maxAllowedW;
                finalH *= scale;
            }

            imgX = W/2 - finalW/2;
            imgY = 100 + Math.sin(time * 2) * 5;
        }

        if (protaImg) {
            ctx.save();
            // Brillo dorado pulsante
            ctx.shadowColor = CONFIG.COLORS.PY_GOLD;
            ctx.shadowBlur = 20 + Math.sin(time * 3) * 8;
            ctx.drawImage(protaImg, imgX, imgY, finalW, finalH);
            ctx.shadowBlur = 0;
            ctx.restore();
        } else {
            _drawTrophy(ctx, W/2, 190, time);
        }

        // ---- PELOTAS FLOTANTES (en los costados, no en el centro) ----
        _drawFloatingBalls(ctx, W, H, time);

        // (Separador eliminado por solicitud del usuario)

        // ---- BOTONES ----
        for (let i = 0; i < OPTIONS.length; i++) {
            const y = BTN_START_Y + i * BTN_SPACING;
            _drawButton(ctx, W/2, y, BTN_W, BTN_H, OPTIONS[i], i === selectedOption, time);
        }

        // ---- FOOTER ----
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.textAlign = 'center';
        ctx.fillText('⚽ MUNDIAL 2026 — GARRA GUARANÍ ⚽', W/2, H - 16);
        ctx.fillText('Hecho con ❤️ en Paraguay', W/2, H - 6);
    }

    function _drawButton(ctx, cx, cy, w, h, label, isSelected, t) {
        // Reset state del canvas para evitar artefactos visuales
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.save();
        ctx.translate(cx, cy);

        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(-w/2 + 3, -h/2 + 3, w, h);

        // Fondo
        if (isSelected) {
            const pulse = Math.sin(t * 6) * 0.12 + 0.88;
            const g = ctx.createLinearGradient(0, -h/2, 0, h/2);
            g.addColorStop(0, `rgba(210,20,40,${pulse})`);
            g.addColorStop(1, `rgba(100,0,10,${pulse})`);
            ctx.fillStyle = g;
        } else {
            ctx.fillStyle = 'rgba(12,12,28,0.85)';
        }
        ctx.fillRect(-w/2, -h/2, w, h);

        // Borde
        ctx.strokeStyle = isSelected ? CONFIG.COLORS.PY_GOLD : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.strokeRect(-w/2, -h/2, w, h);

        // Texto
        ctx.font = '11px "Press Start 2P"';
        ctx.fillStyle = isSelected ? CONFIG.COLORS.PY_GOLD : CONFIG.COLORS.PY_WHITE;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 0, 0);

        if (isSelected) {
            ctx.font = '10px "Press Start 2P"';
            ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
            ctx.textAlign = 'left';
            ctx.fillText('▶', -w/2 + 7, 0);
        }

        ctx.restore();
    }

    function _drawTrophy(ctx, cx, cy, t) {
        const p = Math.sin(t * 1.5) * 0.05 + 1;
        ctx.save(); ctx.translate(cx, cy); ctx.scale(p, p);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(-20, 40, 40, 8); ctx.fillRect(-15, 48, 30, 6);
        ctx.fillRect(-8, 25, 16, 15);
        ctx.fillStyle = '#FFD700'; ctx.fillRect(-25, -10, 50, 35);
        ctx.fillStyle = '#B8860B'; ctx.fillRect(-18, -5, 36, 25);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath(); ctx.arc(0, -10, 12, Math.PI, 0); ctx.fill();
        if (Math.sin(t * 4) > 0.5) {
            ctx.fillStyle = '#FFF';
            ctx.fillRect(15, -20, 3, 3); ctx.fillRect(-18, -15, 2, 2);
        }
        ctx.restore();
    }

    function _drawFloatingBalls(ctx, W, H, t) {
        // Solo en los márgenes laterales para no tapar la imagen
        const balls = [
            { x: W * 0.07, y: H * 0.25, o: 0.0 },
            { x: W * 0.93, y: H * 0.22, o: 1.2 },
            { x: W * 0.06, y: H * 0.50, o: 2.1 },
            { x: W * 0.94, y: H * 0.48, o: 3.3 },
            { x: W * 0.08, y: H * 0.72, o: 0.9 },
            { x: W * 0.92, y: H * 0.70, o: 2.5 },
        ];
        ctx.font = '16px serif';
        for (const b of balls) {
            ctx.globalAlpha = 0.22 + Math.sin(t * 1.8 + b.o) * 0.10;
            ctx.fillText('⚽', b.x, b.y + Math.sin(t * 2 + b.o) * 8);
        }
        ctx.globalAlpha = 1;
    }

    return { update, draw };
})();
