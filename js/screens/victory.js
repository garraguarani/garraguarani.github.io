/* ============================================
   GARRA GUARANÍ — Victory Screen
   Level complete / Tournament victory
   ============================================ */

const VictoryScreen = (() => {
    let time = 0;
    let isFinalVictory = false;

    function update(dt) {
        time += dt;

        if (time < 2) return null;

        if (Input.isTouching()) {
            const pos = Input.getTouchGamePos();
            if (pos && pos.y > 500 && pos.y < 560) {
                return isFinalVictory ? 'menu' : 'shop';
            }
            // Share button
            if (pos && pos.y > 560 && pos.y < 610) {
                _share();
                return null;
            }
        }

        if (Input.isKeyDown('Enter') || Input.isKeyDown('Space')) {
            return isFinalVictory ? 'menu' : 'shop';
        }

        return null;
    }

    function setFinalVictory(val) {
        isFinalVictory = val;
    }

    function _share() {
        const text = isFinalVictory
            ? '🇵🇾 ¡CAMPEON DEL MUNDO con Paraguay en Garra Guarani! ⚽🔥'
            : '🇵🇾 ¡Estoy avanzando en el Mundial con Paraguay en Garra Guarani! 🔥';
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({ title: 'Garra Guaraní', text, url }).catch(() => {});
        } else {
            // Fallback: WhatsApp
            const waUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            window.open(waUrl, '_blank');
        }
    }

    function draw(ctx, player, levelIndex, teamKey) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;
        const team = CONFIG.TEAMS[teamKey];

        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, W, H);

        if (isFinalVictory) {
            _drawFinalVictory(ctx, W, H, player);
        } else {
            _drawLevelVictory(ctx, W, H, player, levelIndex, team);
        }
    }

    function _drawLevelVictory(ctx, W, H, player, levelIndex, team) {
        // "¡VICTORIA!"
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText('¡VICTORIA!', W/2, 120);

        // Emojis
        ctx.font = '40px serif';
        ctx.fillText('🇵🇾⚽🔥', W/2, 190);

        // Match result
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
        ctx.fillText(`🇵🇾 PY vs ${team ? team.flag : ''} ${team ? team.name : '???'}`, W/2, 250);

        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText(`Nivel ${levelIndex + 1} / 8 completado`, W/2, 280);

        // Score earned
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText(`₲${player.score.toLocaleString()} acumulados`, W/2, 330);

        // Health
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_RED;
        ctx.fillText(`❤ ${player.health} / ${player.maxHealth}`, W/2, 360);

        // Next match hint
        if (levelIndex < 6) {
            ctx.font = '7px "Press Start 2P"';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillText('Visita la tienda antes del', W/2, 420);
            ctx.fillText('siguiente partido...', W/2, 440);
        }

        // Button
        if (time >= 2) {
            ctx.fillStyle = 'rgba(0, 100, 0, 0.6)';
            ctx.fillRect(80, 500, W - 160, 40);
            ctx.strokeStyle = CONFIG.COLORS.PY_GOLD;
            ctx.lineWidth = 2;
            ctx.strokeRect(80, 500, W - 160, 40);
            ctx.font = '9px "Press Start 2P"';
            ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
            ctx.fillText('TIENDA ▶', W/2, 525);

            // Share
            ctx.fillStyle = 'rgba(37, 211, 102, 0.4)';
            ctx.fillRect(80, 560, W - 160, 35);
            ctx.font = '7px "Press Start 2P"';
            ctx.fillStyle = '#25D366';
            ctx.fillText('📱 COMPARTIR', W/2, 582);
        }
    }

    function _drawFinalVictory(ctx, W, H, player) {
        // Epic final screen background effects
        const pulse = Math.sin(time * 3) * 0.2 + 0.8;
        const img = Renderer.getImage('campeones');

        // Header
        ctx.textAlign = 'center';
        ctx.font = '18px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
        ctx.fillText('¡CAMPEONES!', W/2, 60);
        ctx.shadowBlur = 0;

        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
        ctx.fillText('PARAGUAY ES EL NUEVO', W/2, 95);
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText('DUEÑO DEL MUNDO', W/2, 115);

        // Main Illustration (campeones.png)
        if (img) {
            const imgW = W - 40;
            const imgH = (imgW / img.width) * img.height;
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(255, 215, 0, 0.3)';
            ctx.drawImage(img, W/2 - imgW/2, 150, imgW, imgH);
            ctx.restore();
        } else {
            // Fallback flag
            ctx.font = '80px serif';
            ctx.fillText('🇵🇾', W/2, 240);
        }

        // Stars floating around
        for (let i = 0; i < 8; i++) {
            const angle = (time * 0.5) + (i * Math.PI / 4);
            const r = 140 + Math.sin(time + i) * 10;
            const sx = W/2 + Math.cos(angle) * r;
            const sy = 280 + Math.sin(angle) * r;
            ctx.font = '12px serif';
            ctx.globalAlpha = 0.4 + Math.sin(time * 2 + i) * 0.4;
            ctx.fillText('⭐', sx, sy);
        }
        ctx.globalAlpha = 1;

        // Stats Footer
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText(`PUNTUACIÓN: ₲${player.score.toLocaleString()}`, W/2, 420);
        
        ctx.font = '40px serif';
        ctx.fillText('🏆', W/2, 470);

        ctx.font = '7px "Press Start 2P"';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('¡COMPARTÍ ESTE LOGRO HISTÓRICO!', W/2, H - 150);

        if (time >= 2) {
            // Menu button
            ctx.fillStyle = 'rgba(206, 17, 38, 0.6)';
            ctx.fillRect(80, 500, W - 160, 40);
            ctx.strokeStyle = CONFIG.COLORS.PY_GOLD;
            ctx.lineWidth = 2;
            ctx.strokeRect(80, 500, W - 160, 40);
            ctx.font = '9px "Press Start 2P"';
            ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
            ctx.fillText('MENÚ PRINCIPAL', W/2, 525);

            // Share
            ctx.fillStyle = 'rgba(37, 211, 102, 0.5)';
            ctx.fillRect(80, 560, W - 160, 35);
            ctx.font = '7px "Press Start 2P"';
            ctx.fillStyle = '#25D366';
            ctx.fillText('📱 COMPARTIR EN WA', W/2, 582);
        }
    }

    function reset() {
        time = 0;
        isFinalVictory = false;
    }

    return { update, draw, reset, setFinalVictory };
})();
