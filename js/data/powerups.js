/* ============================================
   GARRA GUARANÍ — Power-Up Definitions
   ============================================ */

const POWERUP_TYPES = {
    asado: {
        name: 'Asado',
        emoji: '🥩',
        color: '#CC4400',
        weapon: 'fire',
        description: 'Pelota de Fuego — atraviesa enemigos'
    },
    chipa: {
        name: 'Chipa',
        emoji: '🫓',
        color: '#DDAA00',
        weapon: 'triple',
        description: 'Triple Pelota — disparo en abanico'
    },
    terere: {
        name: 'Tereré',
        emoji: '🧉',
        color: '#00AA55',
        weapon: 'guided',
        description: 'Pelota Guiada — busca al enemigo'
    },
    sopa: {
        name: 'Sopa Paraguaya',
        emoji: '🥧',
        color: '#EE6633',
        weapon: 'bomb',
        description: 'Pelota Bomba — explota en área'
    },
    vorivori: {
        name: 'Vori Vori',
        emoji: '🍜',
        color: '#FFD700',
        weapon: 'megagol',
        description: 'Mega Gol — limpia toda la pantalla'
    },
    health: {
        name: 'Vida',
        emoji: '❤',
        color: '#FF2222',
        effect: 'heal',
        healAmount: 25,
        description: 'Recupera 25 de vida'
    },
    coin: {
        name: 'Guaraníes',
        emoji: '₲',
        color: '#FFD700',
        effect: 'money',
        amount: 50,
        description: '+50₲ bonus'
    }
};

/** Drop table — what enemies can drop */
const DROP_TABLE = {
    weights: {
        none: 90,        // Mayor probabilidad de que no dropie nada
        coin: 6,        // Monedas (bonus de score)
        health: 4,      // Vida (más común que powerups)
        // Power-ups gateados por nivel
        asado: 0,        // Se desbloquea por nivel
        chipa: 0,        // Se desbloquea por nivel
        terere: 0,       // Se desbloquea por nivel
        sopa: 0,         // Se desbloquea por nivel
        vorivori: 0,     // Se desbloquea por nivel
    },

    /** Roll a random drop based on level progression. Returns null or a powerup type key */
    roll(levelIndex = 0) {
        // Construir pesos dinámicos según el nivel
        const dynamicWeights = {
            none: 90,
            coin: 5,
            health: 5,
            asado: 0,
            chipa: 0,
            terere: 0,
            sopa: 0,
            vorivori: 0,
        };

        // Nivel 1 y 2 (index 0, 1): solo 2 tipos de disparos (basic + asado/fire)
        if (levelIndex < 2) {
            dynamicWeights.asado = 12;
        }
        // Nivel 3 (index 2): recién agregar terere (guided) - 3er tipo
        else if (levelIndex === 2) {
            dynamicWeights.asado = 8;
            dynamicWeights.terere = 6;
        }
        // Nivel 4 (index 3): mantener asado y terere
        else if (levelIndex === 3) {
            dynamicWeights.asado = 6;
            dynamicWeights.terere = 6;
        }
        // Nivel 5 (index 4): recién agregar sopa (bomb)
        else if (levelIndex === 4) {
            dynamicWeights.asado = 5;
            dynamicWeights.terere = 5;
            dynamicWeights.sopa = 5;
        }
        // Nivel 6+ (index 5+): todos disponibles pero raros
        else {
            dynamicWeights.asado = 4;
            dynamicWeights.chipa = 3;
            dynamicWeights.terere = 4;
            dynamicWeights.sopa = 4;
            dynamicWeights.vorivori = 2;
        }

        const entries = Object.entries(dynamicWeights);
        const total = entries.reduce((sum, [, w]) => sum + w, 0);
        let r = Math.random() * total;

        let selectedType = null;
        for (const [type, weight] of entries) {
            r -= weight;
            if (r <= 0) {
                selectedType = type === 'none' ? null : type;
                break;
            }
        }

        return selectedType;
    }
};
