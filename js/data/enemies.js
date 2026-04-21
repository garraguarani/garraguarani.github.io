/* ============================================
   GARRA GUARANÍ — Enemy Types Data
   Balanced for v16 (Early game accessible, late game extreme)
   ============================================ */

const ENEMY_TYPES = {
    // --- Basic ---
    runner: {
        name: 'Corredor',
        health: 2,         // 2 shots to kill at L1 ( tutorial )
        speed: 120,
        shootRate: 1.4,
        reward: 100,
        width: 20,
        height: 22,
        damage: 12,
        defaultPattern: 'straight',
        bulletColor: '#007FFF' // Azul Eléctrico
    },
    dribbler: {
        name: 'Driblador',
        health: 2,         // 2 shots
        speed: 100,
        shootRate: 0,
        reward: 150,
        width: 20,
        height: 22,
        damage: 12,
        defaultPattern: 'zigzag'
    },
    lateral: {
        name: 'Lateral',
        health: 2,         // 2 shots
        speed: 140,
        shootRate: 1.8,
        reward: 120,
        width: 18,
        height: 20,
        damage: 12,
        defaultPattern: 'diagonal',
        bulletColor: '#FFFF00' // Amarillo Brillante
    },
    
    // --- Mid-Bosses (Appear in waves) ---
    hincha: {
        name: 'Hincha Loco',
        health: 4,         // 4 shots at L1
        speed: 110,
        shootRate: 1.5,
        reward: 250,
        width: 22,
        height: 26,
        damage: 15,
        defaultPattern: 'zigzag',
        bulletColor: '#FFD700' // Amarillo Brillante
    },
    arbitro: {
        name: 'Santi el Árbitro',
        health: 4,         // 4 shots at L1
        speed: 100,
        shootRate: 1.2,
        reward: 350,
        width: 22,
        height: 30,
        damage: 25,
        defaultPattern: 'straight',
        projectileType: 'card',
        bulletColor: '#FF0000' // Rojo (Tarjeta)
    },

    // --- Intermediate ---
    defender: {
        name: 'Defensor',
        health: 5,         // tanky at L1
        speed: 60,
        shootRate: 2.2,
        reward: 300,
        width: 24,
        height: 26,
        damage: 20,
        defaultPattern: 'straight',
        bulletColor: '#8D6E63' // Marrón Terracota
    },
    midfielder: {
        name: 'Mediocampista',
        health: 4,
        speed: 85,
        shootRate: 0.9,
        reward: 250,
        width: 20,
        height: 22,
        damage: 15,
        defaultPattern: 'weave',
        bulletColor: '#9C27B0' // Púrpura Profundo
    },
    goalkeeper: {
        name: 'Portero',
        health: 6,
        speed: 50,
        shootRate: 1.2,
        reward: 350,
        width: 26,
        height: 26,
        damage: 20,
        defaultPattern: 'horizontal',
        bulletColor: '#0000FF' // Azul Rey
    },

    // --- Advanced ---
    star: {
        name: '10 Rival',
        health: 5,
        speed: 130,
        shootRate: 0.5,
        reward: 500,
        width: 22,
        height: 24,
        damage: 20,
        defaultPattern: 'erratic',
        bulletColor: '#C2185B' // Fucsia Oscuro
    },
    coach: {
        name: 'Director Técnico',
        health: 8,
        speed: 70,
        shootRate: 1.5,
        reward: 600,
        width: 24,
        height: 28,
        damage: 15,
        defaultPattern: 'stay_top',
        buffNearby: true,
        bulletColor: '#4A148C' // Violeta Oscuro
    }
};
