/* ============================================
   GARRA GUARANÍ — Weapons Data
   ============================================ */

const WEAPON_TYPES = {
    basic: {
        name: 'Pelota Básica',
        emoji: '⚽',
        category: 'always',
        color: '#FFFFFF',
        damage: 1,
        speed: CONFIG.BULLET_SPEED,
        fireRate: 0.22,
        piercing: false,
        pattern: 'single',
        levels: [
            { damage: 1, count: 1, spread: 0 },
            { damage: 1, count: 2, spread: 10 },
            { damage: 2, count: 2, spread: 10 },
        ]
    },
    fire: {
        name: 'Pelota de Fuego',
        emoji: '🔥',
        powerup: 'asado',
        category: 'always',
        color: '#FF6600',
        damage: 1,
        speed: CONFIG.BULLET_SPEED * 0.9,
        fireRate: 0.35,
        piercing: true,
        pattern: 'fire',
        levels: [
            { damage: 1, count: 1, spread: 0 },
            { damage: 2, count: 1, spread: 0 },
            { damage: 2, count: 2, spread: 6 },
        ]
    },
    triple: {
        name: 'Triple Pelota',
        emoji: '🫓',
        powerup: 'chipa',
        category: 'always',
        color: '#FFD700',
        damage: 1,
        speed: CONFIG.BULLET_SPEED * 0.85,
        fireRate: 0.30,
        piercing: false,
        pattern: 'spread',
        levels: [
            { damage: 1, count: 3, spread: 12 },
            { damage: 1, count: 4, spread: 10 },
            { damage: 2, count: 4, spread: 10 },
        ]
    },
    guided: {
        name: 'Pelota Guiada',
        emoji: '🧉',
        powerup: 'terere',
        category: 'selectable',
        color: '#00CC66',
        damage: 2,
        speed: CONFIG.BULLET_SPEED * 0.65,
        fireRate: 0.5,
        piercing: false,
        pattern: 'guided',
        levels: [
            { damage: 2, count: 1, tracking: 0.03 },
            { damage: 2, count: 1, tracking: 0.04 },
            { damage: 3, count: 1, tracking: 0.05 },
        ]
    },
    bomb: {
        name: 'Pelota Bomba',
        emoji: '🥧',
        powerup: 'sopa',
        category: 'selectable',
        color: '#FF3366',
        damage: 3,
        speed: CONFIG.BULLET_SPEED * 0.55,
        fireRate: 0.8,
        piercing: false,
        pattern: 'bomb',
        levels: [
            { damage: 3, count: 1, explosionRadius: 25 },
            { damage: 4, count: 1, explosionRadius: 35 },
            { damage: 5, count: 1, explosionRadius: 45 },
        ]
    },
    megagol: {
        name: 'Mega Gol',
        emoji: '🍜',
        powerup: 'vorivori',
        category: 'special',
        color: '#FFD700',
        damage: 999,
    }
};
