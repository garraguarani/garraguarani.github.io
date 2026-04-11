/* ============================================
   GARRA GUARANÍ — Level Definitions
   7 levels following 2026 World Cup fixture
   ============================================ */

const LEVELS = [
    // === NIVEL 1: vs USA (Fase de Grupos) ===
    {
        index: 0,
        teamKey: 'USA',
        title: 'Fase de Grupos — Partido 1',
        subtitle: '12 de junio • Los Ángeles',
        waves: [
            {
                enemies: [
                    { type: 'runner', x: 90 },
                    { type: 'runner', x: 180 },
                    { type: 'runner', x: 270 },
                ],
                spawnInterval: 0.8,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'runner', x: 60 },
                    { type: 'runner', x: 150 },
                    { type: 'dribbler', x: 240 },
                    { type: 'runner', x: 300 },
                ],
                spawnInterval: 0.6,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'lateral', side: 'left' },
                    { type: 'runner', x: 180 },
                    { type: 'lateral', side: 'right' },
                    { type: 'dribbler', x: 120 },
                    { type: 'runner', x: 260 },
                ],
                spawnInterval: 0.5,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'runner', x: 80 },
                    { type: 'runner', x: 160 },
                    { type: 'runner', x: 240 },
                    { type: 'dribbler', x: 120 },
                    { type: 'dribbler', x: 200 },
                    { type: 'lateral', side: 'left' },
                ],
                spawnInterval: 0.5,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'defender', x: 180 },
                    { type: 'runner', x: 80 },
                    { type: 'runner', x: 280 },
                    { type: 'lateral', side: 'left' },
                    { type: 'lateral', side: 'right' },
                    { type: 'dribbler', x: 180 },
                ],
                spawnInterval: 0.45,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'defender', x: 140 }, { type: 'defender', x: 220 },
                    { type: 'runner', x: 90 }, { type: 'runner', x: 270 },
                    { type: 'lateral', side: 'right' },
                ],
                spawnInterval: 0.4,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'midfielder', x: 180 },
                    { type: 'runner', x: 80 }, { type: 'runner', x: 280 },
                    { type: 'lateral', side: 'left' }, { type: 'lateral', side: 'right' },
                    { type: 'dribbler', x: 120 }, { type: 'dribbler', x: 240 },
                ],
                spawnInterval: 0.4,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'goalkeeper', x: 180 },
                    { type: 'defender', x: 100 }, { type: 'defender', x: 260 },
                    { type: 'runner', x: 60 }, { type: 'runner', x: 300 },
                    { type: 'midfielder', x: 140 }, { type: 'midfielder', x: 220 },
                ],
                spawnInterval: 0.35,
                pauseAfter: 2.5
            }
        ],
        boss: {
            name: 'Capitán USA',
            health: 600,
            phases: 3,
            patterns: ['spread', 'charge', 'burst']
        }
    },

    // === NIVEL 2: vs Turquía ===
    {
        index: 1,
        teamKey: 'TUR',
        title: 'Fase de Grupos — Partido 2',
        subtitle: '19 de junio • San Francisco',
        waves: [
            {
                enemies: [
                    { type: 'runner', x: 90 },
                    { type: 'dribbler', x: 180 },
                    { type: 'runner', x: 270 },
                    { type: 'lateral', side: 'right' },
                ],
                spawnInterval: 0.6,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'midfielder', x: 120 },
                    { type: 'runner', x: 60 },
                    { type: 'runner', x: 240 },
                    { type: 'dribbler', x: 300 },
                    { type: 'lateral', side: 'left' },
                ],
                spawnInterval: 0.5,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'defender', x: 100 },
                    { type: 'defender', x: 260 },
                    { type: 'runner', x: 180 },
                    { type: 'dribbler', x: 150 },
                    { type: 'dribbler', x: 210 },
                ],
                spawnInterval: 0.5,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'midfielder', x: 90 },
                    { type: 'midfielder', x: 270 },
                    { type: 'runner', x: 180 },
                    { type: 'lateral', side: 'left' },
                    { type: 'lateral', side: 'right' },
                    { type: 'dribbler', x: 150 },
                    { type: 'runner', x: 210 },
                ],
                spawnInterval: 0.4,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'goalkeeper', x: 180 },
                    { type: 'midfielder', x: 100 },
                    { type: 'midfielder', x: 260 },
                    { type: 'runner', x: 60 },
                    { type: 'runner', x: 300 },
                    { type: 'dribbler', x: 180 },
                    { type: 'lateral', side: 'left' },
                ],
                spawnInterval: 0.4,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'goalkeeper', x: 120 }, { type: 'goalkeeper', x: 240 },
                    { type: 'midfielder', x: 180 },
                    { type: 'lateral', side: 'right' },
                    { type: 'runner', x: 80 }, { type: 'runner', x: 280 },
                ],
                spawnInterval: 0.35,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'star', x: 180 },
                    { type: 'defender', x: 100 }, { type: 'defender', x: 260 },
                    { type: 'lateral', side: 'left' }, { type: 'lateral', side: 'right' },
                    { type: 'dribbler', x: 140 }, { type: 'dribbler', x: 220 },
                ],
                spawnInterval: 0.35,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'coach', x: 180 },
                    { type: 'star', x: 80 }, { type: 'star', x: 280 },
                    { type: 'midfielder', x: 130 }, { type: 'midfielder', x: 230 },
                    { type: 'runner', x: 50 }, { type: 'runner', x: 310 },
                    { type: 'lateral', side: 'left' }, { type: 'lateral', side: 'right' },
                ],
                spawnInterval: 0.3,
                pauseAfter: 2.5
            }
        ],
        boss: {
            name: 'Capitán Turquía',
            health: 1000,
            phases: 3,
            patterns: ['circular', 'shield', 'spiral']
        }
    },

    // === NIVEL 3: vs Australia ===
    {
        index: 2,
        teamKey: 'AUS',
        title: 'Fase de Grupos — Partido 3',
        subtitle: '25 de junio • San Francisco',
        waves: [
            {
                enemies: [
                    { type: 'runner', x: 70 }, { type: 'runner', x: 140 },
                    { type: 'runner', x: 210 }, { type: 'runner', x: 280 },
                    { type: 'dribbler', x: 180 },
                ],
                spawnInterval: 0.4,
                pauseAfter: 1.5
            },
            {
                enemies: [
                    { type: 'lateral', side: 'left' }, { type: 'lateral', side: 'right' },
                    { type: 'midfielder', x: 120 }, { type: 'midfielder', x: 240 },
                    { type: 'defender', x: 180 },
                ],
                spawnInterval: 0.5,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'star', x: 180 },
                    { type: 'runner', x: 80 }, { type: 'runner', x: 280 },
                    { type: 'dribbler', x: 130 }, { type: 'dribbler', x: 230 },
                    { type: 'lateral', side: 'left' },
                ],
                spawnInterval: 0.4,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'goalkeeper', x: 100 }, { type: 'goalkeeper', x: 260 },
                    { type: 'midfielder', x: 180 },
                    { type: 'runner', x: 60 }, { type: 'runner', x: 300 },
                    { type: 'dribbler', x: 180 },
                    { type: 'star', x: 150 },
                ],
                spawnInterval: 0.35,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'coach', x: 180 },
                    { type: 'star', x: 100 }, { type: 'star', x: 260 },
                    { type: 'defender', x: 60 }, { type: 'defender', x: 300 },
                    { type: 'midfielder', x: 140 }, { type: 'midfielder', x: 220 },
                    { type: 'lateral', side: 'left' }, { type: 'lateral', side: 'right' },
                ],
                spawnInterval: 0.35,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'coach', x: 120 }, { type: 'coach', x: 240 },
                    { type: 'star', x: 180 },
                    { type: 'midfielder', x: 80 }, { type: 'midfielder', x: 280 },
                    { type: 'lateral', side: 'left' }, { type: 'lateral', side: 'right' },
                ],
                spawnInterval: 0.3,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'coach', x: 180 },
                    { type: 'goalkeeper', x: 100 }, { type: 'goalkeeper', x: 260 },
                    { type: 'defender', x: 140 }, { type: 'defender', x: 220 },
                    { type: 'dribbler', x: 60 }, { type: 'dribbler', x: 300 },
                    { type: 'lateral', side: 'left' }, { type: 'lateral', side: 'right' },
                ],
                spawnInterval: 0.3,
                pauseAfter: 2
            },
            {
                enemies: [
                    { type: 'coach', x: 180 },
                    { type: 'coach', x: 90 }, { type: 'coach', x: 270 },
                    { type: 'star', x: 140 }, { type: 'star', x: 220 },
                    { type: 'midfielder', x: 50 }, { type: 'midfielder', x: 310 },
                    { type: 'lateral', side: 'left' }, { type: 'lateral', side: 'right' },
                ],
                spawnInterval: 0.25,
                pauseAfter: 2.5
            }
        ],
        boss: {
            name: 'Capitán Australia',
            health: 1400,
            phases: 3,
            patterns: ['diagonal', 'speed', 'burst']
        }
    },

    // === NIVEL 4: Dieciseisavos de Final ===
    {
        index: 3,
        teamKey: null,  // random from KNOCKOUT_POOL
        title: 'Dieciseisavos de Final',
        subtitle: 'El primer salto eliminatorio',
        waves: _generateKnockoutWaves(6, 1.4),
        boss: { name: null, health: 1800, phases: 3, patterns: ['spread', 'circular', 'charge'] }
    },

    // === NIVEL 5: Octavos de Final ===
    {
        index: 4,
        teamKey: null,  // random from KNOCKOUT_POOL
        title: 'Octavos de Final',
        subtitle: 'Fase eliminatoria',
        waves: _generateKnockoutWaves(8, 1.6),
        boss: { name: null, health: 2400, phases: 3, patterns: ['spread', 'circular', 'charge'] }
    },

    // === NIVEL 6: Cuartos de Final ===
    {
        index: 5,
        teamKey: null,
        title: 'Cuartos de Final',
        subtitle: 'A pura garra',
        waves: _generateKnockoutWaves(9, 1.8),
        boss: { name: null, health: 3200, phases: 3, patterns: ['spiral', 'shield', 'burst'] }
    },

    // === NIVEL 7: Semifinal ===
    {
        index: 6,
        teamKey: null,
        title: 'Semifinal',
        subtitle: '¡A un paso de la gloria!',
        waves: _generateKnockoutWaves(11, 2.0),
        boss: { name: null, health: 4000, phases: 3, patterns: ['diagonal', 'circular', 'speed'] }
    },

    // === NIVEL 8: Final ===
    {
        index: 7,
        teamKey: null,  // random from FINAL_POOL
        title: '¡LA GRAN FINAL!',
        subtitle: '19 de julio • Nueva Jersey',
        waves: _generateKnockoutWaves(13, 2.5),
        boss: { name: null, health: 6000, phases: 4, patterns: ['spread', 'spiral', 'charge', 'burst'] }
    }
];

/** Generate procedural waves for knockout rounds */
function _generateKnockoutWaves(waveCount, difficultyMult) {
    const waves = [];
    const types = ['runner', 'dribbler', 'lateral', 'midfielder', 'defender', 'goalkeeper', 'star', 'coach'];

    for (let w = 0; w < waveCount; w++) {
        const enemyCount = Math.floor(4 + w * 1.2 * difficultyMult);
        const enemies = [];

        for (let e = 0; e < enemyCount; e++) {
            // Later waves use harder enemy types
            const maxType = Math.min(types.length - 1, Math.floor(1 + w * 0.8 + Math.random() * 2));
            const typeIdx = Math.floor(Math.random() * (maxType + 1));
            const type = types[typeIdx];

            const enemy = { type };
            if (type === 'lateral') {
                enemy.side = Math.random() > 0.5 ? 'left' : 'right';
            } else {
                enemy.x = Math.floor(Math.random() * (CONFIG.GAME_WIDTH - 60) + 30);
            }
            enemies.push(enemy);
        }

        waves.push({
            enemies,
            spawnInterval: Math.max(0.25, 0.6 - w * 0.04),
            pauseAfter: w < waveCount - 1 ? 1.5 : 2.5
        });
    }
    return waves;
}
