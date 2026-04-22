/* ============================================
   GARRA GUARANÍ — Shop Screen
   Buy/upgrade weapons between levels
   ============================================ */

const ShopScreen = (() => {
    let time = 0;
    let selectedItem = 0;

    const ITEMS = [
        { id: 'upgrade_basic', name: 'Mejorar Básica', price: 1000, emoji: '⚽', type: 'upgrade', weapon: 'basic' },
        { id: 'unlock_fire', name: 'Pelota Fuego', price: 2000, emoji: '🔥', type: 'unlock', weapon: 'fire' },
        { id: 'unlock_triple', name: 'Triple Pelota', price: 3000, emoji: '🫓', type: 'unlock', weapon: 'triple' },
        { id: 'unlock_guided', name: 'Pelota Guiada', price: 5000, emoji: '🧉', type: 'unlock', weapon: 'guided' },
        { id: 'unlock_bomb', name: 'Pelota Bomba', price: 7000, emoji: '🧨', type: 'unlock', weapon: 'bomb' },
        { id: 'megagol', name: 'Mega Gol x1', price: 10000, emoji: '💣', type: 'megagol' },
        { id: 'heal', name: 'Restaurar Vida', price: 600, emoji: '❤', type: 'heal' },
        { id: 'shield', name: 'Escudo Extra', price: 3000, emoji: '🛡', type: 'shield' },
    ];

    function _isItemAvailable(item, levelIndex) {
        if (!item.weapon && item.type !== 'megagol') return true; // heal, shield, basic upgrade always allowed

        const w = item.weapon || item.type; // e.g. 'fire', 'triple', 'guided', 'bomb', 'megagol'

        if (levelIndex < 2) {
            // Only fire is allowed
            if (['triple', 'guided', 'bomb', 'megagol'].includes(w)) return false;
        } else if (levelIndex < 3) {
            // Level 2
            if (['bomb', 'megagol'].includes(w)) return false;
        }
        return true;
    }

    function update(dt, player, levelIndex = 0) {
        time += dt;

        // Touch
        if (Input.isTouching()) {
            const pos = Input.getTouchGamePos();
            if (pos) {
                // Check items
                for (let i = 0; i < ITEMS.length; i++) {
                    const y = 120 + i * 55;
                    if (pos.y > y - 20 && pos.y < y + 20 && pos.x > 30 && pos.x < 330) {
                        if (_isItemAvailable(ITEMS[i], levelIndex)) {
                            _buyItem(i, player);
                        }
                        return null;
                    }
                }
                // Continue button
                if (pos.y > 570 && pos.y < 620) {
                    return 'continue';
                }
            }
        }

        // Keyboard
        if (Input.isKeyDown('Enter') || Input.isKeyDown('Space')) {
            return 'continue';
        }

        return null;
    }

    function _buyItem(index, player) {
        const item = ITEMS[index];
        if (player.score < item.price) return;

        switch (item.type) {
            case 'unlock':
                if (player.weapons[item.weapon].unlocked) {
                    // Already unlocked, upgrade instead
                    if (player.weapons[item.weapon].level < 2) {
                        player.weapons[item.weapon].level++;
                        player.score -= item.price;
                        Audio.powerup();
                    }
                    return;
                }
                player.weapons[item.weapon].unlocked = true;
                player.score -= item.price;
                Audio.powerup();
                break;
            case 'upgrade':
                if (player.weapons[item.weapon].level < 2) {
                    player.weapons[item.weapon].level++;
                    player.score -= item.price;
                    Audio.powerup();
                }
                break;
            case 'megagol':
                if (player.megaGols < 3) {
                    player.megaGols++;
                    player.score -= item.price;
                    Audio.powerup();
                }
                break;
            case 'heal':
                if (player.health < player.maxHealth) {
                    player.health = player.maxHealth;
                    player.score -= item.price;
                    Audio.powerup();
                }
                break;
            case 'shield':
                player.maxHealth += 25;
                player.health += 25;
                player.score -= item.price;
                Audio.powerup();
                break;
        }
    }

    function draw(ctx, player, levelIndex = 0) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        ctx.fillStyle = CONFIG.COLORS.BG_DARK;
        ctx.fillRect(0, 0, W, H);

        // Title
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText('🏪 TIENDA', W/2, 35);

        // Player money
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText(`₲${player.score.toLocaleString()}`, W/2, 65);

        // Health bar
        ctx.font = '7px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
        ctx.textAlign = 'left';
        ctx.fillText(`❤ ${player.health}/${player.maxHealth}`, 30, 85);
        ctx.textAlign = 'right';
        ctx.fillText(`🏆×${player.megaGols}`, W - 30, 85);

        // Items
        for (let i = 0; i < ITEMS.length; i++) {
            const item = ITEMS[i];
            const y = 120 + i * 55;
            const canBuy = player.score >= item.price;

            // Check if upgrade is maxed
            let maxed = false;
            if (item.type === 'unlock' && player.weapons[item.weapon]?.unlocked && player.weapons[item.weapon]?.level >= 2) maxed = true;
            if (item.type === 'upgrade' && player.weapons[item.weapon]?.level >= 2) maxed = true;
            if (item.type === 'megagol' && player.megaGols >= 3) maxed = true;
            if (item.type === 'heal' && player.health >= player.maxHealth) maxed = true;

            const available = _isItemAvailable(item, levelIndex);

            // Background
            ctx.fillStyle = !available ? 'rgba(20,20,20,0.8)' : (maxed ? 'rgba(50,50,50,0.3)' : (canBuy ? 'rgba(206, 17, 38, 0.15)' : 'rgba(30,30,50,0.3)'));
            ctx.fillRect(30, y - 20, W - 60, 44);
            ctx.strokeStyle = !available ? 'rgba(30,30,30,0.8)' : (maxed ? 'rgba(100,100,100,0.3)' : (canBuy ? CONFIG.COLORS.PY_RED : 'rgba(255,255,255,0.1)'));
            ctx.lineWidth = 1;
            ctx.strokeRect(30, y - 20, W - 60, 44);

            // Emoji
            ctx.font = '16px serif';
            ctx.textAlign = 'left';
            ctx.fillText(item.emoji, 42, y + 6);

            // Name
            ctx.font = '7px "Press Start 2P"';
            ctx.fillStyle = !available ? 'rgba(100,100,100,0.5)' : (maxed ? 'rgba(255,255,255,0.3)' : CONFIG.COLORS.PY_WHITE);
            ctx.fillText(item.name, 70, y - 2);

            // Status/level
            if (!available) {
                let status = (levelIndex < 2 && ['triple', 'guided'].includes(item.weapon)) ? 'DESBLOQUEO NVL 3' : 'DESBLOQUEO NVL 4';
                ctx.font = '6px "Press Start 2P"';
                ctx.fillStyle = 'rgba(255,0,0,0.4)';
                ctx.fillText(status, 70, y + 12);
            } else if (item.weapon && player.weapons[item.weapon]) {
                const wState = player.weapons[item.weapon];
                let status = wState.unlocked ? `Nv.${wState.level + 1}` : 'BLOQUEADO';
                if (maxed) status = 'MAX';
                ctx.font = '6px "Press Start 2P"';
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.fillText(status, 70, y + 12);
            }

            // Price
            if (!available) {
                ctx.textAlign = 'right';
                ctx.font = '7px "Press Start 2P"';
                ctx.fillStyle = 'rgba(100,100,100,0.3)';
                ctx.fillText('---', W - 42, y + 4);
            } else if (!maxed) {
                ctx.textAlign = 'right';
                ctx.font = '7px "Press Start 2P"';
                ctx.fillStyle = canBuy ? CONFIG.COLORS.PY_GOLD : '#FF4444';
                ctx.fillText(`₲${item.price}`, W - 42, y + 4);
            } else {
                ctx.textAlign = 'right';
                ctx.font = '7px "Press Start 2P"';
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillText('MAX', W - 42, y + 4);
            }
        }

        // Continue button
        const btnPulse = Math.sin(time * 4) * 0.15 + 0.85;
        ctx.fillStyle = `rgba(206, 17, 38, ${btnPulse})`;
        ctx.fillRect(80, 570, W - 160, 40);
        ctx.strokeStyle = CONFIG.COLORS.PY_GOLD;
        ctx.lineWidth = 2;
        ctx.strokeRect(80, 570, W - 160, 40);
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
        ctx.fillText('CONTINUAR ▶', W/2, 595);
    }

    function init(player) {
        time = 0;
        selectedItem = 0;
    }

    return { init, update, draw };
})();
