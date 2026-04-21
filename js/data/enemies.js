/* ============================================
   GARRA GUARANÍ — Enemy Types Data
   ============================================ */

const ENEMY_TYPES = {
    // --- Basic ---
    runner: {
        name: 'Corredor',
        health: 8,         // Antes 3
        speed: 120,
        shootRate: 1.4,    // Antes 2.0 (más disparos)
        reward: 100,
        width: 20,
        height: 22,
        damage: 12,
        defaultPattern: 'straight',
        bulletColor: '#007FFF' // Azul Eléctrico
    },
    dribbler: {
        name: 'Driblador',
        health: 12,        // Antes 3
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
        health: 8,         // Antes 3
        speed: 140,
        shootRate: 1.8,    // Antes 2.5
        reward: 120,
        width: 18,
        height: 20,
        damage: 12,
        defaultPattern: 'diagonal',
        bulletColor: '#FFFF00' // Amarillo Brillante
    },
    // --- NUEVOS: Hincha, Hincha2 y Árbitro ---
    hincha: {
        name: 'Hincha Fanático',
        health: 22,        // Mucho más resistente
        speed: 100,
        reward: 850,       // Recompensa acorde
        width: 48,
        height: 60,
        damage: 25,
        defaultPattern: 'charge_player',
        isSpecial: true
    },
    hincha2: {
        name: 'Hincha Ultras',
        health: 32,        // Un tanque
        speed: 85,
        reward: 1200,      // Gran recompensa
        width: 48,
        height: 60,
        damage: 30,
        defaultPattern: 'charge_player',
        isSpecial: true
    },
    arbitro: {
        name: 'Árbitro',
        health: 28,        // Mucho más resistente
        speed: 80,
        shootRate: 1.5,
        reward: 1000,      // Gran recompensa
        width: 34,
        height: 44,
        damage: 18,
        defaultPattern: 'horizontal_top',
        isSpecial: true,
        projectileType: 'card',
        bulletColor: '#FF0000' // ROJO PURO (Tarjetas Rojas)
    },
    // --- Intermediate ---
    defender: {
        name: 'Defensor',
        health: 15,        // Antes 3
        speed: 60,
        shootRate: 2.2,    // Antes 3.0
        reward: 300,
        width: 24,
        height: 26,
        damage: 20,
        defaultPattern: 'straight',
        bulletColor: '#8D6E63' // Marrón Terracota
    },
    midfielder: {
        name: 'Mediocampista',
        health: 12,        // Antes 3
        speed: 85,
        shootRate: 0.9,    // Antes 1.2
        reward: 250,
        width: 20,
        height: 22,
        damage: 15,
        defaultPattern: 'weave',
        bulletColor: '#9C27B0' // Púrpura Profundo
    },
    goalkeeper: {
        name: 'Portero',
        health: 20,        // Antes 3
        speed: 50,
        shootRate: 1.2,    // Antes 1.5
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
        health: 18,        // Antes 3
        speed: 130,
        shootRate: 0.5,    // Antes 0.8
        reward: 500,
        width: 22,
        height: 24,
        damage: 20,
        defaultPattern: 'erratic',
        bulletColor: '#C2185B' // Fucsia Oscuro
    },
    coach: {
        name: 'Director Técnico',
        health: 25,        // Antes 3
        speed: 70,
        shootRate: 1.5,    // Antes 2.0
        reward: 600,
        width: 24,
        height: 28,
        damage: 15,
        defaultPattern: 'stay_top',
        buffNearby: true,
        bulletColor: '#4A148C' // Violeta Oscuro
    }
};
