/* ============================================
   GARRA GUARANÍ — Level Select Screen
   World Cup fixture as level map
   ============================================ */

const LevelSelectScreen = (() => {
    let time = 0;
    let hoveredLevel = -1;
    let assignedTeams = {};

    function init(unlockedLevels) {
        time = 0;
        // Assign random teams to knockout/final levels
        _assignTeams();
    }

    function _assignTeams() {
        assignedTeams = {};
        const usedKnockout = [];

        for (let i = 3; i <= 6; i++) {
            let team;
            do {
                team = CONFIG.KNOCKOUT_POOL[Math.floor(Math.random() * CONFIG.KNOCKOUT_POOL.length)];
            } while (usedKnockout.includes(team));
            usedKnockout.push(team);
            assignedTeams[i] = team;
        }

        // Final — random from final pool
        assignedTeams[7] = CONFIG.FINAL_POOL[Math.floor(Math.random() * CONFIG.FINAL_POOL.length)];
    }

    function getTeamForLevel(levelIndex) {
        if (levelIndex < 3) {
            return CONFIG.GROUP_MATCHES[levelIndex];
        }
        return assignedTeams[levelIndex] || 'ESP';
    }

    function update(dt, unlockedLevels) {
        time += dt;

        // Touch/click detection
        if (Input.isTouching()) {
            const pos = Input.getTouchGamePos();
            if (pos) {
                for (let i = 0; i < 8; i++) {
                    const { x, y } = _getLevelPos(i);
                    // Match the visual rectangle width (300px) and height (44px)
                    if (i < unlockedLevels && pos.x > x - 150 && pos.x < x + 150 && pos.y > y - 22 && pos.y < y + 22) {
                        Audio.menuSelect();
                        return i;
                    }
                }
                // Back button
                if (pos.y > 590 && pos.y < 630) {
                    return -1; // go back to menu
                }
            }
        }

        // Keyboard
        if (Input.isKeyDown('Escape')) return -1;

        return null;
    }

    function _getLevelPos(i) {
        const startY = 70;
        const spacing = 65;
        return {
            x: CONFIG.GAME_WIDTH / 2,
            y: startY + i * spacing
        };
    }

    function draw(ctx, unlockedLevels) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        // BG
        ctx.fillStyle = CONFIG.COLORS.BG_DARK;
        ctx.fillRect(0, 0, W, H);

        // Title
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.textAlign = 'center';
        ctx.fillText('FIXTURE MUNDIAL 2026', W/2, 40);

        // Line connecting levels
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const pos = _getLevelPos(i);
            if (i === 0) ctx.moveTo(pos.x, pos.y);
            else ctx.lineTo(pos.x, pos.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw each level node
        const labels = [
            'FASE DE GRUPOS', 'FASE DE GRUPOS', 'FASE DE GRUPOS',
            '16VOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', '⭐ FINAL ⭐'
        ];

        for (let i = 0; i < 8; i++) {
            const { x, y } = _getLevelPos(i);
            const unlocked = i < unlockedLevels;
            const completed = i < unlockedLevels - 1;

            // Team info
            const teamKey = i < 3 ? CONFIG.GROUP_MATCHES[i] : (assignedTeams[i] || '???');
            const team = CONFIG.TEAMS[teamKey];

            // Node background
            if (completed) {
                ctx.fillStyle = 'rgba(0, 100, 0, 0.4)';
            } else if (unlocked) {
                const pulse = Math.sin(time * 3) * 0.15 + 0.35;
                ctx.fillStyle = `rgba(206, 17, 38, ${pulse})`;
            } else {
                ctx.fillStyle = 'rgba(50, 50, 70, 0.4)';
            }
            ctx.fillRect(x - 150, y - 22, 300, 44);

            // Border
            ctx.strokeStyle = completed ? '#00AA00' : (unlocked ? CONFIG.COLORS.PY_RED : 'rgba(255,255,255,0.15)');
            ctx.lineWidth = 1;
            ctx.strokeRect(x - 150, y - 22, 300, 44);

            // Label (stage name)
            ctx.font = '6px "Press Start 2P"';
            ctx.fillStyle = unlocked ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)';
            ctx.textAlign = 'left';
            ctx.fillText(labels[i], x - 140, y - 8);

            // Matchup
            ctx.font = '8px "Press Start 2P"';
            ctx.fillStyle = unlocked ? CONFIG.COLORS.PY_WHITE : 'rgba(255,255,255,0.3)';
            const teamName = team ? team.name.toUpperCase() : '???';
            ctx.fillText(`Paraguay vs ${team ? team.flag : '🔒'} ${teamName}`, x - 140, y + 8);

            // Completed check
            if (completed) {
                ctx.font = '14px serif';
                ctx.textAlign = 'right';
                ctx.fillText('✅', x + 140, y + 6);
            } else if (unlocked) {
                ctx.font = '8px "Press Start 2P"';
                ctx.textAlign = 'right';
                ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
                ctx.fillText('▶ JUGAR', x + 140, y + 6);
            } else {
                ctx.font = '14px serif';
                ctx.textAlign = 'right';
                ctx.fillText('🔒', x + 140, y + 6);
            }
        }

        // Back button
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('← VOLVER AL MENÚ', W/2, 610);
    }

    return { init, update, draw, getTeamForLevel, _assignTeams };
})();
