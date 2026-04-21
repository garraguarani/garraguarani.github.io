/* ============================================
   GARRA GUARANÍ — Level Definitions
   8 levels following 2026 World Cup fixture
   ============================================ */

const LEVELS = [
    // === NIVEL 1: vs USA (Fase de Grupos) ===
    {
        index: 0,
        teamKey: 'USA',
        weather: 'sun',
        title: 'Fase de Grupos — Partido 1',
        subtitle: '12 de junio • Los Ángeles',
        waves: [
            { enemies: [{ type: 'runner', x: 90 }, { type: 'hincha', x: 180 }, { type: 'runner', x: 270 }], spawnInterval: 0.8, pauseAfter: 2 },
            { enemies: [{ type: 'runner', x: 60 }, { type: 'arbitro', x: 180 }, { type: 'dribbler', x: 240 }], spawnInterval: 0.6, pauseAfter: 2 },
            { enemies: [{ type: 'lateral', side: 'left' }, { type: 'hincha', x: 180 }, { type: 'lateral', side: 'right' }], spawnInterval: 0.5, pauseAfter: 2 },
            { enemies: [{ type: 'runner', x: 50 }, { type: 'runner', x: 150 }, { type: 'runner', x: 250 }, { type: 'runner', x: 310 }], spawnInterval: 0.4, pauseAfter: 2 },
            { enemies: [{ type: 'arbitro', x: 120 }, { type: 'arbitro', x: 240 }], spawnInterval: 0.5, pauseAfter: 3 },
            { enemies: [{ type: 'dribbler', x: 40 }, { type: 'dribbler', x: 140 }, { type: 'dribbler', x: 240 }], spawnInterval: 0.6, pauseAfter: 2 },
            { enemies: [{ type: 'hincha', x: 100 }, { type: 'hincha', x: 260 }, { type: 'runner', x: 180 }], spawnInterval: 0.5, pauseAfter: 3 }
        ],
        boss: { name: 'Capitán USA', health: 150, phases: 3, patterns: ['spread', 'charge', 'burst'], weapon: 'basic' }
    },

    // === NIVEL 2: vs Turquía ===
    {
        index: 1,
        teamKey: 'TUR',
        weather: 'wind',
        title: 'Fase de Grupos — Partido 2',
        subtitle: '19 de junio • San Francisco',
        waves: [
            { enemies: [{ type: 'runner', x: 100 }, { type: 'hincha', x: 200 }, { type: 'arbitro', x: 50 }], spawnInterval: 0.6, pauseAfter: 2 },
            { enemies: [{ type: 'midfielder', x: 120 }, { type: 'hincha', x: 240 }, { type: 'lateral', side: 'left' }], spawnInterval: 0.5, pauseAfter: 2 },
            { enemies: [{ type: 'runner', x: 60 }, { type: 'midfielder', x: 180 }, { type: 'runner', x: 300 }], spawnInterval: 0.4, pauseAfter: 2 },
            { enemies: [{ type: 'arbitro', x: 100 }, { type: 'arbitro', x: 260 }], spawnInterval: 0.3, pauseAfter: 3 },
            { enemies: [{ type: 'dribbler', x: 50 }, { type: 'dribbler', x: 150 }, { type: 'dribbler', x: 250 }], spawnInterval: 0.5, pauseAfter: 2 },
            { enemies: [{ type: 'hincha', x: 180 }, { type: 'runner', x: 80 }, { type: 'runner', x: 280 }], spawnInterval: 0.4, pauseAfter: 3 },
            { enemies: [{ type: 'midfielder', x: 100 }, { type: 'midfielder', x: 200 }, { type: 'midfielder', x: 300 }], spawnInterval: 0.3, pauseAfter: 3 }
        ],
        boss: { name: 'Capitán Turquía', health: 1000, phases: 3, patterns: ['circular', 'shield', 'spiral'], weapon: 'curved' }
    },

    // === NIVEL 3: vs Australia ===
    {
        index: 2,
        teamKey: 'AUS',
        weather: 'rain',
        title: 'Fase de Grupos — Partido 3',
        subtitle: '25 de junio • San Francisco',
        waves: [
            { enemies: [{ type: 'runner', x: 70 }, { type: 'arbitro', x: 280 }, { type: 'hincha', x: 180 }], spawnInterval: 0.4, pauseAfter: 1.5 },
            { enemies: [{ type: 'defender', x: 100 }, { type: 'hincha', x: 180 }, { type: 'defender', x: 260 }], spawnInterval: 0.5, pauseAfter: 2 },
            { enemies: [{ type: 'midfielder', x: 50 }, { type: 'midfielder', x: 150 }, { type: 'midfielder', x: 250 }], spawnInterval: 0.4, pauseAfter: 2 },
            { enemies: [{ type: 'arbitro', x: 120 }, { type: 'arbitro', x: 240 }], spawnInterval: 0.2, pauseAfter: 3 },
            { enemies: [{ type: 'defender', x: 180 }, { type: 'runner', x: 80 }, { type: 'runner', x: 280 }], spawnInterval: 0.3, pauseAfter: 2 },
            { enemies: [{ type: 'hincha', x: 100 }, { type: 'hincha', x: 260 }], spawnInterval: 0.5, pauseAfter: 3 },
            { enemies: [{ type: 'goalkeeper', x: 180 }, { type: 'runner', x: 100 }, { type: 'runner', x: 260 }], spawnInterval: 0.4, pauseAfter: 3 },
            { enemies: [{ type: 'midfielder', x: 120 }, { type: 'midfielder', x: 240 }, { type: 'arbitro', x: 180 }], spawnInterval: 0.4, pauseAfter: 3 }
        ],
        boss: { name: 'Capitán Australia', health: 1400, phases: 3, patterns: ['diagonal', 'speed', 'burst'], weapon: 'water' }
    },

    // === NIVEL 4: Dieciseisavos de Final ===
    {
        index: 3,
        teamKey: null,
        weather: 'fog',
        title: 'Dieciseisavos de Final',
        subtitle: 'El primer salto eliminatorio',
        waves: _generateKnockoutWaves(6, 1.4),
        boss: { name: null, health: 1800, phases: 3, patterns: ['spread', 'circular', 'charge'], weapon: 'explosive' }
    },

    // === NIVEL 5: Octavos de Final ===
    {
        index: 4,
        teamKey: null,
        weather: 'night',
        title: 'Octavos de Final',
        subtitle: 'Fase eliminatoria',
        waves: _generateKnockoutWaves(8, 1.6),
        boss: { name: null, health: 2400, phases: 3, patterns: ['spread', 'circular', 'charge'], weapon: 'multi' }
    },

    // === NIVEL 6: Cuartos de Final ===
    {
        index: 5,
        teamKey: null,
        weather: 'heat',
        title: 'Cuartos de Final',
        subtitle: 'A pura garra',
        waves: _generateKnockoutWaves(9, 1.8),
        boss: { name: null, health: 3200, phases: 3, patterns: ['spiral', 'shield', 'burst'], weapon: 'fire' }
    },

    // === NIVEL 7: Semifinal ===
    {
        index: 6,
        teamKey: null,
        weather: 'storm',
        title: 'Semifinal',
        subtitle: '¡A un paso de la gloria!',
        waves: _generateKnockoutWaves(11, 2.0),
        boss: { name: null, health: 4000, phases: 3, patterns: ['diagonal', 'circular', 'speed'], weapon: 'electric' }
    },

    // === NIVEL 8: Final ===
    {
        index: 7,
        teamKey: null,
        weather: 'snow',
        title: '¡LA GRAN FINAL!',
        subtitle: '19 de julio • Nueva Jersey',
        waves: _generateKnockoutWaves(13, 2.5),
        boss: { name: null, health: 10000, phases: 5, patterns: ['spread', 'spiral', 'charge', 'burst'], weapon: 'ice' }
    }
];

/** Generate procedural waves for knockout rounds */
function _generateKnockoutWaves(waveCount, difficultyMult) {
    const waves = [];
    const types = ['runner', 'dribbler', 'lateral', 'midfielder', 'defender', 'goalkeeper', 'star', 'coach', 'hincha', 'arbitro'];

    for (let w = 0; w < waveCount * 1.5; w++) {
        const enemyCount = Math.floor(4 + w * 1.5 * difficultyMult);
        const enemies = [];

        for (let e = 0; e < enemyCount; e++) {
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
