/* ============================================
   GARRA GUARANÍ — Wave Spawner System
   Controls enemy waves per level
   ============================================ */

const Spawner = (() => {
    let currentWave = 0;
    let waveTimer = 0;
    let spawnTimer = 0;
    let wavePause = false;
    let wavePauseTimer = 0;
    let levelData = null;
    let spawnIdx = 0;
    let waveComplete = false;
    let allWavesComplete = false;
    let bossSpawned = false;

    function startLevel(levelIndex) {
        levelData = LEVELS[levelIndex];
        currentWave = 0;
        waveTimer = 0;
        spawnTimer = 0;
        spawnIdx = 0;
        wavePause = false;
        wavePauseTimer = 0;
        waveComplete = false;
        allWavesComplete = false;
        bossSpawned = false;
    }

    function update(dt, game) {
        if (!levelData || allWavesComplete) return;

        // Pause between waves
        if (wavePause) {
            wavePauseTimer -= dt;
            if (wavePauseTimer <= 0) {
                wavePause = false;
                currentWave++;
                spawnIdx = 0;
                waveComplete = false;

                if (currentWave >= levelData.waves.length) {
                    // All waves done — spawn boss
                    allWavesComplete = true;
                    return;
                }
            }
            return;
        }

        const wave = levelData.waves[currentWave];
        if (!wave) {
            allWavesComplete = true;
            return;
        }

        // Spawn enemies from the wave definition
        spawnTimer -= dt;
        if (spawnTimer <= 0 && spawnIdx < wave.enemies.length) {
            const enemyDef = wave.enemies[spawnIdx];
            _spawnEnemy(enemyDef, game);
            spawnIdx++;
            // Reduce spawn interval by 25% for more pressure
            spawnTimer = (wave.spawnInterval || 0.5) * 0.75;
        }

        // Check if wave is complete (all enemies spawned and dead)
        if (spawnIdx >= wave.enemies.length && game.enemies.count === 0 && !waveComplete) {
            waveComplete = true;
            wavePause = true;
            // Reduce pause between waves from 1.5s to 1.0s
            wavePauseTimer = wave.pauseAfter ? wave.pauseAfter * 0.66 : 1.0;
        }

        // REAR SPAWN MECHANIC: If player stays still > 2.5s, spawn enemy behind them
        _updateRearSpawnMechanic(dt, game);
    }

    // Rear spawn mechanic: punish player for staying still
    let playerLastPos = { x: 0, y: 0 };
    let playerStillTimer = 0;
    let rearSpawnCooldown = 0;

    function _updateRearSpawnMechanic(dt, game) {
        rearSpawnCooldown -= dt;

        const player = game.player;
        if (!player || !player.alive) return;

        // Check if player is moving
        const dx = player.x - playerLastPos.x;
        const dy = player.y - playerLastPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
            // Player is still
            playerStillTimer += dt;
        } else {
            // Player moved, reset timer
            playerStillTimer = 0;
        }

        // Update last position
        playerLastPos.x = player.x;
        playerLastPos.y = player.y;

        // Spawn enemy behind player if still for > 2.5s
        if (playerStillTimer > 2.5 && rearSpawnCooldown <= 0) {
            _spawnRearEnemy(game);
            rearSpawnCooldown = 4.0; // 4 second cooldown between rear spawns
            playerStillTimer = 0;
        }
    }

    function _spawnRearEnemy(game) {
        const player = game.player;
        if (!player) return;

        const enemy = game.enemies.get();
        if (!enemy) return;

        // Spawn behind player (at top of screen relative to player)
        const behindX = player.x + (Math.random() - 0.5) * 100;
        const behindY = player.y - 150; // Behind player

        const types = ['runner', 'dribbler', 'lateral'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const typeDef = ENEMY_TYPES[randomType];
        const teamKey = game.currentTeamKey;
        const team = CONFIG.TEAMS[teamKey];
        const difficulty = (team ? team.difficulty : 1) * (game.levelIndex * 0.1 + 1);

        enemy.init({
            x: behindX,
            y: behindY,
            type: randomType,
            health: Math.ceil(typeDef.health * difficulty),
            speed: typeDef.speed * (0.8 + difficulty * 0.2),
            shootRate: typeDef.shootRate,
            pattern: 'straight',
            reward: Math.ceil(typeDef.reward * difficulty),
            width: typeDef.width,
            height: typeDef.height,
            colors: team ? team.colors : ['#FF4444', '#FFFFFF', '#FF4444'],
            damage: typeDef.damage || 10
        });

        // Visual warning
        Particles.explode(behindX, behindY, 10, '#FF0000', 30, 2);
    }

    function _spawnEnemy(def, game) {
        const enemy = game.enemies.get();
        if (!enemy) return;

        const type = ENEMY_TYPES[def.type] || ENEMY_TYPES.runner;
        const teamKey = game.currentTeamKey;
        const team = CONFIG.TEAMS[teamKey];
        const difficulty = (team ? team.difficulty : 1) * (game.levelIndex * 0.1 + 1);

        // Start position
        let startX, startY;
        const side = def.side || 'top';
        if (side === 'left') {
            startX = -16;
            startY = Math.random() * CONFIG.GAME_HEIGHT * 0.4 + 30;
        } else if (side === 'right') {
            startX = CONFIG.GAME_WIDTH + 16;
            startY = Math.random() * CONFIG.GAME_HEIGHT * 0.4 + 30;
        } else {
            // top
            startX = def.x !== undefined ? def.x : (Math.random() * (CONFIG.GAME_WIDTH - 40) + 20);
            startY = -20;
        }

        enemy.init({
            x: startX,
            y: startY,
            type: def.type,
            health: Math.ceil(type.health * difficulty),
            speed: type.speed * (0.8 + difficulty * 0.2),
            shootRate: type.shootRate,
            pattern: def.pattern || type.defaultPattern,
            reward: Math.ceil(type.reward * difficulty),
            width: type.width,
            height: type.height,
            colors: team ? team.colors : ['#FF4444', '#FFFFFF', '#FF4444'],
            damage: type.damage || 10
        });
    }

    function shouldSpawnBoss() {
        return allWavesComplete && !bossSpawned;
    }

    function markBossSpawned() {
        bossSpawned = true;
    }

    function isLevelComplete() {
        return allWavesComplete && bossSpawned;
    }

    function getWaveInfo() {
        if (!levelData) return { current: 0, total: 0 };
        return { current: currentWave + 1, total: levelData.waves.length };
    }

    return {
        startLevel, update, shouldSpawnBoss, markBossSpawned,
        isLevelComplete, getWaveInfo
    };
})();
