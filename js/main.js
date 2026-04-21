/* ============================================
   GARRA GUARANÍ — Main Game Controller
   State machine, game loop, and orchestrator
   ============================================ */

const Game = (() => {
    // State
    let state = CONFIG.STATES.LOADING;
    let player = null;
    let levelIndex = 0;
    let unlockedLevels = 1;
    let currentTeamKey = 'USA';
    let currentBoss = null;
    let bossIntroTimer = 0;

    // Object pools
    let playerBullets = null;
    let enemyBullets = null;
    let enemies = null;
    let powerups = null;

    // Delta time
    let lastTime = 0;
    let accumulator = 0;

    // --- Initialization ---
    async function init() {
        try {
            // Setup loading state
            state = CONFIG.STATES.LOADING;

            // Register service worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js').catch(() => {});
            }

            // Init systems (Awaiting Renderer which loads assets)
            await Renderer.init();
            
            Input.init(Renderer.getCanvas());
            Audio.init();
            Background.init();
            Particles.init();
            HUD.init();

            // Create player
            player = new Player();

            // Create pools
            playerBullets = new Pool(() => new Bullet(), CONFIG.MAX_PLAYER_BULLETS);
            enemyBullets = new Pool(() => new Bullet(), CONFIG.MAX_ENEMY_BULLETS);
            enemies = new Pool(() => new Enemy(), CONFIG.MAX_ENEMIES);
            powerups = new Pool(() => new PowerUp(), CONFIG.MAX_POWERUPS);

            // Boss instance
            currentBoss = new Boss();

            // Load saved progress
            _loadProgress();

            // Init level select
            LevelSelectScreen.init(unlockedLevels);

            // Set state to MENU only after everything is loaded
            state = CONFIG.STATES.MENU;

            // Start game loop
            lastTime = performance.now();
            requestAnimationFrame(gameLoop);

            // Resume audio en primer gesto del usuario (requerimiento de navegadores)
            function startAudio() { Audio.resume(); }
            document.addEventListener('touchstart', startAudio, { once: true });
            document.addEventListener('click', startAudio, { once: true });
            document.addEventListener('keydown', startAudio, { once: true });
            
            console.log("Game initialized successfully");
        } catch (error) {
            console.error("Game initialization failed:", error);
            // Show emergency error message on canvas if possible
            const ctx = Renderer.getCtx();
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillText('Error al cargar el juego. Reintenta.', 20, 50);
            }
        }
    }

    // --- Game Loop ---
    function gameLoop(timestamp) {
        try {
            const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // cap at 50ms
            lastTime = timestamp;

            update(dt);
            render();

            requestAnimationFrame(gameLoop);
        } catch (e) {
            console.error("Game Loop Crashed:", e);
            const hud = document.getElementById('hud');
            if (hud) {
                hud.classList.remove('hidden');
                hud.innerHTML = `<div style="background:#CE1126; color:white; padding:15px; position:absolute; z-index:9999; top:0; left:0; width:100%; height:100%; overflow:auto; box-sizing:border-box;">
                    <h3 style="font-family:sans-serif;">💥 ERROR CRÍTICO</h3>
                    <p style="font-family:monospace; font-size:14px; margin-bottom:10px;">${e.message}</p>
                    <pre style="font-size:10px; white-space:pre-wrap;">${e.stack}</pre>
                </div>`;
            }
        }
    }

    // --- Update ---
    function update(dt) {
        Background.update(dt);
        Weather.update(dt);

        switch (state) {
            case CONFIG.STATES.MENU:
                _updateMenu(dt);
                break;
            case CONFIG.STATES.LEVEL_SELECT:
                _updateLevelSelect(dt);
                break;
            case CONFIG.STATES.PLAYING:
                _updatePlaying(dt);
                break;
            case CONFIG.STATES.BOSS_INTRO:
                _updateBossIntro(dt);
                break;
            case CONFIG.STATES.SHOP:
                _updateShop(dt);
                break;
            case CONFIG.STATES.GAME_OVER:
                _updateGameOver(dt);
                break;
            case CONFIG.STATES.VICTORY:
                _updateVictory(dt);
                break;
            case 'controls':
                _updateControls(dt);
                break;
            case 'paused':
                // Do not update game logic when paused
                _updatePaused(dt);
                break;
        }
    }

    function _updateMenu(dt) {
        const result = MenuScreen.update(dt);
        if (result === 'play') {
            state = CONFIG.STATES.LEVEL_SELECT;
            Audio.menuSelect();
        } else if (result === 'controls') {
            state = 'controls';
            ControlsScreen.init();
            Audio.menuSelect();
        }
    }

    function _updateControls(dt) {
        const result = ControlsScreen.update(dt);
        if (result === -1) {
            state = CONFIG.STATES.MENU;
        }
    }

    function _updateLevelSelect(dt) {
        const result = LevelSelectScreen.update(dt, unlockedLevels);
        if (result === -1) {
            state = CONFIG.STATES.MENU;
            Audio.menuSelect();
        } else if (result !== null && result >= 0) {
            _startLevel(result);
        }
    }

    function _updatePlaying(dt) {
        // Update player
        player.update(dt);

        // Update spawner
        Spawner.update(dt, Game);

        // Update pools
        playerBullets.updateAll(dt);
        enemyBullets.updateAll(dt);
        enemies.updateAll(dt);
        powerups.updateAll(dt);

        // Update boss
        if (currentBoss.active) {
            currentBoss.update(dt);
        }

        // Update particles
        Particles.update(dt);

        // Process collisions
        Collision.processAll(Game);

        // Update HUD
        HUD.update(player);

        // Check for boss spawn
        if (Spawner.shouldSpawnBoss() && !currentBoss.active) {
            _startBossIntro();
        }

        // Check player death
        if (!player.alive) {
            state = CONFIG.STATES.GAME_OVER;
            GameOverScreen.reset();
            HUD.hide();
            Audio.gameOver();
            Audio.setAmbientVolume(0);
            Weather.setType('none');
        }

        // Keyboard shortcuts
        if (Input.isKeyDown('KeyQ')) {
            player.cycleSelectableWeapon();
        }
        if (Input.isKeyDown('KeyE')) {
            player.activateGarra();
        }
        if (Input.isKeyDown('KeyR')) {
            if (player.useMegaGol()) {
                _megaGolEffect();
            }
        }
    }

    function _updateBossIntro(dt) {
        bossIntroTimer -= dt;
        Particles.update(dt);
        if (bossIntroTimer <= 0) {
            state = CONFIG.STATES.PLAYING;
        }
    }

    function _updateShop(dt) {
        const result = ShopScreen.update(dt, player, levelIndex);
        if (result === 'continue') {
            // Next level
            levelIndex++;
            if (levelIndex >= LEVELS.length) {
                // The game is won!
                state = CONFIG.STATES.VICTORY;
                VictoryScreen.reset();
                VictoryScreen.setFinalVictory(true);
                Audio.victory();
                Audio.setAmbientVolume(0);
                Weather.setType('none');
            } else {
                state = CONFIG.STATES.LEVEL_SELECT;
            }
        }
    }

    function _updateGameOver(dt) {
        Particles.update(dt);
        const result = GameOverScreen.update(dt);
        if (result === 'retry') {
            _startLevel(levelIndex);
        } else if (result === 'menu') {
            state = CONFIG.STATES.MENU;
            player.fullReset();
            Audio.setAmbientVolume(0);
            Weather.setType('none');
        }
    }

    function _updateVictory(dt) {
        Particles.update(dt);
        const result = VictoryScreen.update(dt);
        if (result === 'shop') {
            state = CONFIG.STATES.SHOP;
            ShopScreen.init(player);
        } else if (result === 'menu') {
            state = CONFIG.STATES.MENU;
            player.fullReset();
            Audio.setAmbientVolume(0);
            Weather.setType('none');
        }
    }

    function _updatePaused(dt) {
        // Unpause via Enter/Escape/P maybe in future, but handled via HTML button
        Particles.update(dt * 0.05); // Just a bit of movement
    }

    // --- Render ---
    function render() {
        const ctx = Renderer.getCtx();
        Renderer.clear();

        switch (state) {
            case CONFIG.STATES.MENU:
                MenuScreen.draw(ctx);
                break;
            case CONFIG.STATES.LEVEL_SELECT:
                LevelSelectScreen.draw(ctx, unlockedLevels);
                break;
            case CONFIG.STATES.PLAYING:
            case CONFIG.STATES.BOSS_INTRO:
                _renderPlaying(ctx);
                break;
            case CONFIG.STATES.SHOP:
                _renderPlaying(ctx);
                ShopScreen.draw(ctx, player, levelIndex);
                break;
            case CONFIG.STATES.GAME_OVER:
                _renderPlaying(ctx);
                GameOverScreen.draw(ctx, player, levelIndex);
                break;
            case CONFIG.STATES.VICTORY:
                _renderPlaying(ctx);
                VictoryScreen.draw(ctx, player, levelIndex, currentTeamKey);
                break;
            case 'controls':
                ControlsScreen.draw(ctx);
                break;
            case 'paused':
                _renderPlaying(ctx);
                _renderPaused(ctx);
                break;
        }
    }

    function _renderPlaying(ctx) {
        Background.draw(ctx);
        powerups.drawAll(ctx);
        enemies.drawAll(ctx);
        if (currentBoss.active) currentBoss.draw(ctx);
        playerBullets.drawAll(ctx);
        enemyBullets.drawAll(ctx);
        player.draw(ctx);
        Particles.draw(ctx);
        Weather.draw(ctx);

        // Boss intro text
        if (state === CONFIG.STATES.BOSS_INTRO) {
            _drawBossIntro(ctx);
        }

        // Garra mode screen effect
        if (player.garraActive) {
            ctx.globalAlpha = 0.08 + Math.sin(player.time * 8) * 0.05;
            ctx.fillStyle = CONFIG.COLORS.PY_RED;
            ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
            ctx.globalAlpha = 1;
        }

        // Wave info
        if (state === CONFIG.STATES.PLAYING && !currentBoss.active) {
            const waveInfo = Spawner.getWaveInfo();
            ctx.font = '6px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillText(`Wave ${waveInfo.current}/${waveInfo.total}`, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT - 8);
        }
    }

    function _drawBossIntro(ctx) {
        const W = CONFIG.GAME_WIDTH;
        const team = CONFIG.TEAMS[currentTeamKey];

        // Dark bars
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, W, 60);
        ctx.fillRect(0, CONFIG.GAME_HEIGHT - 60, W, 60);

        // Warning text
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = CONFIG.COLORS.PY_RED;
        ctx.fillText('⚠ ¡ALERTA! ⚠', W/2, 25);

        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
        ctx.fillText(`${team ? team.flag : ''} ${currentBoss.name}`, W/2, 48);
    }

    function _renderPaused(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = CONFIG.COLORS.PY_WHITE;
        ctx.fillText('PAUSA', CONFIG.GAME_WIDTH/2, CONFIG.GAME_HEIGHT/2);
    }

    // --- Level Management ---
    function _startLevel(index) {
        levelIndex = index;
        const level = LEVELS[levelIndex];

        // Determine team
        if (level.teamKey) {
            currentTeamKey = level.teamKey;
        } else if (levelIndex === 6) {
            currentTeamKey = LevelSelectScreen.getTeamForLevel(levelIndex);
        } else {
            currentTeamKey = LevelSelectScreen.getTeamForLevel(levelIndex);
        }

        // Weather and Ambient Audio
        Weather.setType(level.weather || 'none');
        Audio.setAmbientVolume(0.5);

        // Reset game state
        playerBullets.releaseAll();
        enemyBullets.releaseAll();
        enemies.releaseAll();
        powerups.releaseAll();
        Particles.clear();
        currentBoss.active = false;
        currentBoss.alive = false;

        player.reset();

        // Start spawner
        Spawner.startLevel(levelIndex);

        // Show HUD
        HUD.show();
        HUD.update(player);

        state = CONFIG.STATES.PLAYING;
        Audio.menuSelect();
    }

    function _startBossIntro() {
        const level = LEVELS[levelIndex];
        const team = CONFIG.TEAMS[currentTeamKey];

        currentBoss.init(level.boss, team);
        if (!level.boss.name) {
            currentBoss.name = `Capitán ${team.name}`;
        }

        Spawner.markBossSpawned();
        bossIntroTimer = 2.5;
        state = CONFIG.STATES.BOSS_INTRO;
        Audio.bossAppear();
    }

    // --- Event Callbacks ---
    function onEnemyKilled(enemy) {
        // Particles
        const team = CONFIG.TEAMS[currentTeamKey];
        Particles.enemyExplode(enemy.x, enemy.y, team ? team.colors : ['#FF4444']);
        Audio.enemyDie();

        // Score
        player.score += enemy.reward;
        player.addGarraCharge(CONFIG.GARRA_CHARGE_PER_KILL);

        // Drop power-up
        const dropType = DROP_TABLE.roll(levelIndex);
        if (dropType) {
            const pu = powerups.get();
            if (pu) {
                pu.init(enemy.x, enemy.y, dropType);
            }
        }
    }

    function onBossKilled(boss) {
        Particles.bossExplode(boss.x, boss.y);
        Audio.victory();
        Audio.setAmbientVolume(0);
        Weather.setType('none');

        // Bonus score
        player.score += 2000;

        // Unlock next level
        if (levelIndex + 1 > unlockedLevels - 1) {
            unlockedLevels = levelIndex + 2;
            _saveProgress();
        }

        // Clean up
        enemyBullets.releaseAll();
        HUD.hide();

        // Victory screen
        if (levelIndex === 6) {
            VictoryScreen.setFinalVictory(true);
        } else {
            VictoryScreen.setFinalVictory(false);
        }
        VictoryScreen.reset();
        state = CONFIG.STATES.VICTORY;
    }

    function onPowerupCollected(pu) {
        const def = POWERUP_TYPES[pu.type];
        if (!def) return;

        Particles.powerupCollect(pu.x, pu.y, def.color);
        player.addGarraCharge(CONFIG.GARRA_CHARGE_PER_POWERUP);

        if (def.weapon) {
            if (def.weapon === 'megagol') {
                // Add mega gol
                player.megaGols = Math.min(3, player.megaGols + 1);
                Audio.powerup();
            } else {
                // Gate de armas por nivel
                // terere (guided): Nivel 3+ (index 2+)
                // bomb (sopa): Nivel 5+ (index 4+)
                const canUnlock =
                    (def.weapon === 'guided' && levelIndex >= 2) ||
                    (def.weapon === 'bomb' && levelIndex >= 4) ||
                    (def.weapon !== 'guided' && def.weapon !== 'bomb');

                if (canUnlock) {
                    const w = player.weapons[def.weapon];
                    if (!w.unlocked) {
                        w.unlocked = true;
                    } else if (w.level < 2) {
                        w.level++;
                    }
                    Audio.powerup();
                }
            }
        } else if (def.effect === 'heal') {
            player.health = Math.min(player.maxHealth, player.health + (def.healAmount || 25));
            Audio.powerup();
        } else if (def.effect === 'money') {
            player.score += def.amount || 200;
            Audio.coinPickup();
        }
    }

    function _megaGolEffect() {
        // Kill all enemies on screen
        for (let i = enemies.active.length - 1; i >= 0; i--) {
            const e = enemies.active[i];
            if (e.active) {
                e.takeDamage(999);
                onEnemyKilled(e);
            }
        }
        // Damage boss
        if (currentBoss.active && currentBoss.alive) {
            currentBoss.takeDamage(20);
            Particles.bossExplode(currentBoss.x, currentBoss.y);
            if (!currentBoss.alive) {
                onBossKilled(currentBoss);
            }
        }
        // Clear enemy bullets
        enemyBullets.releaseAll();
        // Screen flash
        Particles.explode(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, 40, CONFIG.COLORS.PY_GOLD, 300, 5);
    }

    // --- Save/Load ---
    function _saveProgress() {
        try {
            localStorage.setItem('garra_unlocked', unlockedLevels.toString());
        } catch (e) {}
    }

    function _loadProgress() {
        try {
            const saved = localStorage.getItem('garra_unlocked');
            if (saved) {
                unlockedLevels = Math.max(1, parseInt(saved) || 1);
            }
        } catch (e) {}
    }

    function togglePause() {
        if (state === CONFIG.STATES.PLAYING) {
            state = 'paused';
            Audio.menuSelect();
        } else if (state === 'paused') {
            state = CONFIG.STATES.PLAYING;
            Audio.menuSelect();
        }
    }

    function restartCurrentLevel() {
        if (state === CONFIG.STATES.PLAYING || state === 'paused') {
            _startLevel(levelIndex);
        }
    }

    // Expose for collision system and bullets
    return {
        init,
        togglePause,
        restartCurrentLevel,
        get state() { return state; },
        get unlockedLevels() { return unlockedLevels; },
        get player() { return player; },
        get playerBullets() { return playerBullets; },
        get enemyBullets() { return enemyBullets; },
        get enemies() { return enemies; },
        get powerups() { return powerups; },
        get currentBoss() { return currentBoss; },
        get currentTeamKey() { return currentTeamKey; },
        get levelIndex() { return levelIndex; },
        onEnemyKilled,
        onBossKilled,
        onPowerupCollected
    };
})();

// Make globally accessible
window.Game = Game;

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
