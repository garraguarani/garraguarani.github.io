/* ============================================
   GARRA GUARANÍ — Enemy Types Data
   ============================================ */

const ENEMY_TYPES = {
    // --- Basic ---
    runner: {
        name: 'Corredor',
        health: 6,
        speed: 120,
        shootRate: 2.0,
        reward: 30,
        width: 20,
        height: 22,
        damage: 30,
        defaultPattern: 'straight'
    },
    dribbler: {
        name: 'Driblador',
        health: 5,
        speed: 100,
        shootRate: 0,  // doesn't shoot
        reward: 30,
        width: 20,
        height: 22,
        damage: 25,
        defaultPattern: 'zigzag'
    },
    lateral: {
        name: 'Lateral',
        health: 6,
        speed: 140,
        shootRate: 2.5,
        reward: 20,
        width: 18,
        height: 20,
        damage: 25,
        defaultPattern: 'diagonal'
    },
    // --- Intermediate ---
    defender: {
        name: 'Defensor',
        health: 6,
        speed: 60,
        shootRate: 3.0,
        reward: 30,
        width: 24,
        height: 26,
        damage: 35,
        defaultPattern: 'straight'
    },
    midfielder: {
        name: 'Mediocampista',
        health: 6,
        speed: 85,
        shootRate: 1.2,
        reward: 50,
        width: 20,
        height: 22,
        damage: 35,
        defaultPattern: 'weave'
    },
    goalkeeper: {
        name: 'Portero',
        health: 6,
        speed: 50,
        shootRate: 1.5,
        reward: 30,
        width: 26,
        height: 26,
        damage: 25,
        defaultPattern: 'horizontal'
    },
    // --- Advanced ---
    star: {
        name: '10 Rival',
        health: 6,
        speed: 130,
        shootRate: 0.8,
        reward: 30,
        width: 22,
        height: 24,
        damage: 30,
        defaultPattern: 'erratic'
    },
    coach: {
        name: 'Director Técnico',
        health: 6,
        speed: 70,
        shootRate: 2.0,
        reward: 30,
        width: 24,
        height: 28,
        damage: 35,
        defaultPattern: 'stay_top',
        buffNearby: true
    }
};
