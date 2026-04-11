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
    let bgmInitialized = false;
    let audioContextStarted = false;

    function update(dt) {
        // Iniciar música de fondo con la primera interacción del usuario
        if (!audioContextStarted) {
            audioContextStarted = true;
            try {
                Audio.resume();
                Audio.playBGM();
            } catch (e) {
                console.log('BGM play failed:', e);
            }
        }

        time += dt;

        if (inputCooldown > 0) {
            inputCooldown -= dt;
        }

        // Keyboard navigation
        if (inputCooldown <= 0) {
            if (Input.isKeyDown('ArrowDown') || Input.isKeyDown('KeyS')) {
                selectedOption = (selectedOption + 1) % OPTIONS.length;
                inputCooldown = 0.2;
            } else if (Input.isKeyDown('ArrowUp') || Input.isKeyDown('KeyW')) {
                selectedOption = (selectedOption - 1 + OPTIONS.length) % OPTIONS.length;
                inputCooldown = 0.2;
            }
        }

        // Touch detection
if (Input.isTouching()) {
    const pos = Input.getTouchGamePos();
    if (pos) {
        // Check "JUGAR" button area
        if (pos.y > 325 && pos.y < 355 && pos.x > 80 && pos.x < 280) {
            return 'play';
        }
        // Check "CONTROLES" button area
        if (pos.y > 355 && pos.y < 405 && pos.x > 80 && pos.x < 280) {
            return 'controls';
        }
        // Check "SONIDO" button area
        if (pos.y > 425 && pos.y < 455 && pos.x > 80 && pos.x < 280) {
            soundOn = !soundOn;
            Audio.setEnabled(soundOn);
            OPTIONS[2] = `SONIDO: ${soundOn ? 'ON' : 'OFF'}`;
            Audio.menuSelect();
            return null;
        }
    }
}

        // Enter/Space to select
        if (inputCooldown <= 0 && (Input.isKeyDown('Enter') || Input.isKeyDown('Space'))) {
            inputCooldown = 0.3; // debounce
            if (selectedOption === 0) return 'play';
            if (selectedOption === 1) return 'controls';
            if (selectedOption === 2) {
                soundOn = !soundOn;
                Audio.setEnabled(soundOn);
                OPTIONS[2] = `SONIDO: ${soundOn ? 'ON' : 'OFF'}`;
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
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, W, H);

        // Title: "GARRA"
        const titleY = 100 + Math.sin(time * 2) * 3;
        ctx.font = '28px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Title shadow
        ctx.fillStyle = CONFIG.COLORS.PY_RED_DARK;
        ctx.fillText('GARRA', W / 2 + 2, titleY + 2);
        // Title
        ctx.fillStyle = CONFIG.COLORS.PY_RED;
        ctx.fillText('GARRA', W / 2, titleY);

        // Subtitle: "GUARANI" (Blue)
        ctx.font = '20px "Press Start 2P"';
        ctx.fillStyle = '#0038A8'; // Blue for Guarani
        ctx.fillText('GUARANI', W / 2, titleY + 40);

        // White stripe between GARRA and GUARANI
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(W / 2 - 80, titleY + 18, 160, 4);

        // --- Decorative Section: Trophy, Protagonist, Soccer Balls ---
        const decorY = 200;

       // Floating soccer balls
_drawFloatingBalls(ctx, W, H, time);

// Imagen protagonista inicio
_drawProtagonistInicio(ctx, W / 2, decorY + 40, time);
        // Decorative line
        ctx.strokeStyle = CONFIG.COLORS.PY_RED;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, 320);
        ctx.lineTo(W - 60, 320);
        ctx.stroke();

        // Menu options
        ctx.font = '11px "Press Start 2P"';
        for (let i = 0; i < OPTIONS.length; i++) {
            const y = 360 + i * 50;
            const isSelected = i === selectedOption;

            if (isSelected) {
                // Selection indicator
                const pulse = Math.sin(time * 6) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(206, 17, 38, ${pulse * 0.3})`;
                ctx.fillRect(80, y - 15, 200, 30);
                ctx.strokeStyle = CONFIG.COLORS.PY_RED;
                ctx.lineWidth = 1;
                ctx.strokeRect(80, y - 15, 200, 30);
                ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
            } else {
                ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
            }

            ctx.textAlign = 'center';
            ctx.fillText(OPTIONS[i], W / 2, y);
        }

        // Footer
        ctx.font = '6px "Press Start 2P"';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText('⚽ Toca para jugar ⚽', W / 2, H - 40);
        ctx.fillText('v1.0 — Hecho con ❤️ GARRA GUARANI', W / 2, H - 20);

        ctx.globalAlpha = 1;
    }

    // Draw Copa del Mundo trophy
    function _drawTrophy(ctx, cx, cy, time) {
        const pulse = Math.sin(time * 1.5) * 0.05 + 1;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);

        // Trophy base
        ctx.fillStyle = '#D4AF37'; // Gold
        ctx.fillRect(-20, 40, 40, 8);
        ctx.fillRect(-15, 48, 30, 6);

        // Trophy stem
        ctx.fillRect(-8, 25, 16, 15);

        // Trophy cup body
        ctx.fillStyle = '#FFD700'; // Bright gold
        ctx.fillRect(-25, -10, 50, 35);

        // Cup inner (darker for depth)
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(-18, -5, 36, 25);

        // Trophy top (globe hint)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, -10, 12, Math.PI, 0);
        ctx.fill();

        // Sparkle effect
        if (Math.sin(time * 4) > 0.5) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(15, -20, 3, 3);
            ctx.fillRect(-18, -15, 2, 2);
        }

        ctx.restore();
    }

    // Draw floating soccer balls
    function _drawFloatingBalls(ctx, W, H, time) {
        const balls = [
            { x: W * 0.15, y: H * 0.35, offset: 0 },
            { x: W * 0.85, y: H * 0.30, offset: 1 },
            { x: W * 0.20, y: H * 0.50, offset: 2 },
            { x: W * 0.80, y: H * 0.48, offset: 3 }
        ];

        ctx.font = '20px serif';
        for (const ball of balls) {
            const floatY = ball.y + Math.sin(time * 2 + ball.offset) * 8;
            ctx.globalAlpha = 0.3 + Math.sin(time * 1.5 + ball.offset) * 0.1;
            ctx.fillText('⚽', ball.x, floatY);
        }
        ctx.globalAlpha = 1;
    }

  // Draw protagonist image
    function _drawProtagonist(ctx, cx, cy, time) {
        const img = Renderer.getImage('protagonist');
        if (img) {
            const size = 48;
            const glow = Math.sin(time * 3) * 0.1 + 0.4;
            ctx.shadowColor = CONFIG.COLORS.PY_GOLD;
            ctx.shadowBlur = 15 + glow * 10;
            ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
            ctx.shadowBlur = 0;
        } else {
            ctx.font = '32px serif';
            ctx.globalAlpha = 0.5;
            ctx.fillText('🦸', cx, cy);
            ctx.globalAlpha = 1;
        }
    }

    function _drawProtagonistInicio(ctx, cx, cy, time) {
        const img = Renderer.getImage('protagonista_inicio');
        if (img) {
            const size = 160;
            const glow = Math.sin(time * 3) * 0.1 + 0.4;
            ctx.shadowColor = CONFIG.COLORS.PY_GOLD;
            ctx.shadowBlur = 15 + glow * 10;
            ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
            ctx.shadowBlur = 0;
        }
    }

    return { update, draw };
})();
