/* ============================================
   GARRA GUARANÍ — Config & Constants
   ============================================ */

const CONFIG = {
    // Canvas
    GAME_WIDTH: 360,
    GAME_HEIGHT: 640,

    // Physics
    FPS: 60,
    DELTA_FIXED: 1 / 60,

    // Player
    PLAYER_SPEED: 280,
    PLAYER_MAX_HEALTH: 100,
    PLAYER_FIRE_RATE: 0.18,       // seconds between shots
    PLAYER_HITBOX_RADIUS: 8,
    PLAYER_INVULN_TIME: 1.5,      // seconds of invulnerability after hit
    PLAYER_WIDTH: 28,
    PLAYER_HEIGHT: 32,

    // Bullets
    BULLET_SPEED: 450,
    BULLET_WIDTH: 6,
    BULLET_HEIGHT: 8,
    ENEMY_BULLET_SPEED: 200,

    // Enemies
    ENEMY_BASE_SPEED: 80,

    // Boss
    BOSS_WIDTH: 56,
    BOSS_HEIGHT: 64,

    // Garra Guaraní mode
    GARRA_MAX_CHARGE: 100,
    GARRA_DURATION: 5,            // seconds
    GARRA_CHARGE_PER_KILL: 5,
    GARRA_CHARGE_PER_POWERUP: 10,

    // Background scrolling
    BG_SCROLL_SPEED: 40,

    // Pools
    MAX_PLAYER_BULLETS: 80,
    MAX_ENEMY_BULLETS: 60,
    MAX_ENEMIES: 30,
    MAX_POWERUPS: 10,
    MAX_PARTICLES: 150,

    // Screen states
    STATES: {
        LOADING: 'loading',
        INTRO: 'intro',
        MENU: 'menu',
        LEVEL_SELECT: 'level_select',
        PLAYING: 'playing',
        PAUSED: 'paused',
        SHOP: 'shop',
        GAME_OVER: 'game_over',
        VICTORY: 'victory',
        BOSS_INTRO: 'boss_intro'
    },

    // Colors
    COLORS: {
        PY_RED: '#CE1126',
        PY_RED_DARK: '#9B0D1D',
        PY_RED_GLOW: '#FF1A35',
        PY_WHITE: '#FFFFFF',
        PY_BLUE: '#0038A8',
        PY_BLUE_DARK: '#002266',
        PY_GOLD: '#FFD700',
        BG_DARK: '#0a0a1a',
        BG_FIELD: '#1B5E20',
        BG_FIELD_LIGHT: '#2E7D32',
        BG_FIELD_LINE: 'rgba(255,255,255,0.15)',
        HEALTH_BAR: '#CE1126',
        HEALTH_BAR_BG: 'rgba(255,255,255,0.15)',
    },

    // Teams data for the World Cup
    TEAMS: {
        USA: { name: 'USA', flag: '🇺🇸', colors: ['#002868', '#BF0A30', '#FFFFFF'], difficulty: 1 },
        TUR: { name: 'Turquia', flag: '🇹🇷', colors: ['#E30A17', '#FFFFFF', '#E30A17'], difficulty: 1.3 },
        AUS: { name: 'Austr.', flag: '🇦🇺', colors: ['#FFD700', '#008751', '#002868'], difficulty: 1.5 },
        // Knockout round random pool
        MEX: { name: 'Mexico', flag: '🇲🇽', colors: ['#006847', '#FFFFFF', '#CE1126'], difficulty: 1.7 },
        GER: { name: 'Alemania', flag: '🇩🇪', colors: ['#000000', '#DD0000', '#FFCC00'], difficulty: 1.9 },
        POR: { name: 'Portugal', flag: '🇵🇹', colors: ['#006600', '#FF0000', '#FFCC00'], difficulty: 1.8 },
        NED: { name: 'Paises Bajos', flag: '🇳🇱', colors: ['#FF6600', '#FFFFFF', '#003DA5'], difficulty: 1.7 },
        URU: { name: 'Uruguay', flag: '🇺🇾', colors: ['#5DADE2', '#FFFFFF', '#5DADE2'], difficulty: 1.8 },
        COL: { name: 'Colombia', flag: '🇨🇴', colors: ['#FCD116', '#003893', '#CE1126'], difficulty: 1.6 },
        JPN: { name: 'Japon', flag: '🇯🇵', colors: ['#000080', '#FFFFFF', '#BC002D'], difficulty: 1.6 },
        // Final bosses (top 5 favorites)
        ESP: { name: 'Espana', flag: '🇪🇸', colors: ['#AA151B', '#F1BF00', '#AA151B'], difficulty: 2.5 },
        FRA: { name: 'Francia', flag: '🇫🇷', colors: ['#002395', '#FFFFFF', '#ED2939'], difficulty: 2.4 },
        ENG: { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', colors: ['#FFFFFF', '#CF081F', '#002395'], difficulty: 2.3 },
        ARG: { name: 'Argentina', flag: '🇦🇷', colors: ['#74ACDF', '#FFFFFF', '#74ACDF'], difficulty: 2.3 },
        BRA: { name: 'Brasil', flag: '🇧🇷', colors: ['#FFDF00', '#009C3B', '#002776'], difficulty: 2.5 },
    },

    // Group stage fixture
    GROUP_MATCHES: ['USA', 'TUR', 'AUS'],
    KNOCKOUT_POOL: ['MEX', 'GER', 'POR', 'NED', 'URU', 'COL', 'JPN'],
    FINAL_POOL: ['ESP', 'FRA', 'ENG', 'ARG', 'BRA'],
};
