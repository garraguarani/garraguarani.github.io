/* ============================================
   GARRA GUARANÍ — Enemy Types Data
   ============================================ */

const ENEMY_TYPES = {
    // --- Basic ---
    runner: {
        name: 'Corredor',
        health: 3,
        speed: 120,
        shootRate: 2.0,
        reward: 100,
        width: 20,
        height: 22,
        damage: 12,
        defaultPattern: 'straight'
    },
    dribbler: {
        name: 'Driblador',
        health: 3,
        speed: 100,
        shootRate: 0,  // doesn't shoot
        reward: 150,
        width: 20,
        height: 22,
        damage: 12,
        defaultPattern: 'zigzag'
    },
    lateral: {
        name: 'Lateral',
        health: 3,
        speed: 140,
        shootRate: 2.5,
        reward: 120,
        width: 18,
        height: 20,
        damage: 12,
        defaultPattern: 'diagonal'
    },
    // --- NUEVOS: Hincha, Hincha2 y Árbitro ---
    hincha: {
        name: 'Hincha Fanático',
        health: 3,
        speed: 100,        // Más lento para que se entienda su movimiento
        reward: 220,
        width: 48,         // Más grande
        height: 60,
        damage: 25,
        defaultPattern: 'charge_player',
        isSpecial: true
    },
    hincha2: {
        name: 'Hincha Ultras',
        health: 4,
        speed: 85,         // Aún más lento, más amenazador
        reward: 280,
        width: 48,
        height: 60,
        damage: 30,
        defaultPattern: 'charge_player',
        isSpecial: true
    },
    arbitro: {
        name: 'Árbitro',
        health: 6,
        speed: 80,
        shootRate: 1.5,
        reward: 450,
        width: 34,         // Más grande
        height: 44,
        damage: 18,
        defaultPattern: 'horizontal_top',
        isSpecial: true,
        projectileType: 'card'
    },
    // --- Intermediate ---
    defender: {
        name: 'Defensor',
        health: 3,
        speed: 60,
        shootRate: 3.0,
        reward: 300,
        width: 24,
        height: 26,
        damage: 20,
        defaultPattern: 'straight'
    },
    midfielder: {
        name: 'Mediocampista',
        health: 3,
        speed: 85,
        shootRate: 1.2,
        reward: 250,
        width: 20,
        height: 22,
        damage: 15,
        defaultPattern: 'weave'
    },
    goalkeeper: {
        name: 'Portero',
        health: 3,
        speed: 50,
        shootRate: 1.5,
        reward: 350,
        width: 26,
        height: 26,
        damage: 20,
        defaultPattern: 'horizontal'
    },
    // --- Advanced ---
    star: {
        name: '10 Rival',
        health: 3,
        speed: 130,
        shootRate: 0.8,
        reward: 500,
        width: 22,
        height: 24,
        damage: 20,
        defaultPattern: 'erratic'
    },
    coach: {
        name: 'Director Técnico',
        health: 3,
        speed: 70,
        shootRate: 2.0,
        reward: 600,
        width: 24,
        height: 28,
        damage: 15,
        defaultPattern: 'stay_top',
        buffNearby: true
    }
};
