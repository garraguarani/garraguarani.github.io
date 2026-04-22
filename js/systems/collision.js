/* ============================================
   GARRA GUARANÍ — Collision System
   AABB collision detection
   ============================================ */

const Collision = (() => {

    /** Axis-Aligned Bounding Box overlap check */
    function aabb(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw &&
               ax + aw > bx &&
               ay < by + bh &&
               ay + ah > by;
    }

    /** Circle collision (more forgiving for player hitbox) */
    function circles(x1, y1, r1, x2, y2, r2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dist = dx * dx + dy * dy;
        const radii = r1 + r2;
        return dist < radii * radii;
    }

    /** Check point inside rectangle */
    function pointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }

    /**
     * Process all collisions for a game frame.
     * Takes pools of active entities and resolves hits.
     */
    function processAll(game) {
        const player = game.player;
        if (!player || !player.alive) return;

        const playerBullets = game.playerBullets.active;
        const enemyBullets = game.enemyBullets.active;
        const enemies = game.enemies.active;
        const powerups = game.powerups.active;
        const boss = game.currentBoss;

        // --- Player Bullets vs Enemies ---
        for (let i = playerBullets.length - 1; i >= 0; i--) {
            const b = playerBullets[i];
            if (!b.active) continue;

            // vs regular enemies
            for (let j = enemies.length - 1; j >= 0; j--) {
                const e = enemies[j];
                if (!e.active) continue;

                if (aabb(
                    b.x - b.width / 2, b.y - b.height / 2, b.width, b.height,
                    e.x - e.width / 2, e.y - e.height / 2, e.width, e.height
                )) {
                    e.takeDamage(b.damage);
                    if (!b.piercing) {
                        b.active = false;
                    }
                    if (!e.alive) {
                        game.onEnemyKilled(e);
                    } else {
                        Audio.enemyHit();
                    }
                }
            }

            // vs boss
            if (boss && boss.active && boss.alive) {
                if (aabb(
                    b.x - b.width / 2, b.y - b.height / 2, b.width, b.height,
                    boss.x - boss.width / 2, boss.y - boss.height / 2, boss.width, boss.height
                )) {
                    boss.takeDamage(b.damage);
                    if (!b.piercing) {
                        b.active = false;
                    }
                    Particles.explode(b.x, b.y, 3, CONFIG.COLORS.PY_GOLD, 50, 2);
                    if (!boss.alive) {
                        game.onBossKilled(boss);
                    } else {
                        Audio.enemyHit();
                    }
                }
            }
        }

        // --- Enemy Bullets vs Player ---
        if (!player.invulnerable) {
            for (let i = enemyBullets.length - 1; i >= 0; i--) {
                const b = enemyBullets[i];
                if (!b.active) continue;

                if (circles(
                    b.x, b.y, 4,
                    player.x, player.y, CONFIG.PLAYER_HITBOX_RADIUS
                )) {
                    b.active = false;
                    player.takeDamage(b.damage || 10);
                }
            }
        }

        // --- Enemies body vs Player ---
        if (!player.invulnerable) {
            for (let i = enemies.length - 1; i >= 0; i--) {
                const e = enemies[i];
                if (!e.active) continue;

                if (circles(
                    e.x, e.y, e.width / 2 * 0.6,
                    player.x, player.y, CONFIG.PLAYER_HITBOX_RADIUS
                )) {
                    player.takeDamage(15);
                    e.takeDamage(999); // enemy dies on contact
                    game.onEnemyKilled(e);
                }
            }
        }

        // --- Power-ups vs Player ---
        const collectRadius = player.hasMagnet ? 60 : 20;
        for (let i = powerups.length - 1; i >= 0; i--) {
            const p = powerups[i];
            if (!p.active) continue;

            if (circles(
                p.x, p.y, 8,
                player.x, player.y, collectRadius
            )) {
                game.onPowerupCollected(p);
                p.active = false;
            }

            // Magnet attraction
            if (player.hasMagnet && p.active) {
                const dx = player.x - p.x;
                const dy = player.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    const strength = 200 / Math.max(dist, 1);
                    p.x += (dx / dist) * strength;
                    p.y += (dy / dist) * strength;
                }
            }
        }
    }

    return { aabb, circles, pointInRect, processAll };
})();
