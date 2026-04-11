/* ============================================
   GARRA GUARANÍ — Particle System
   Visual effects (explosions, sparks, etc.)
   ============================================ */

class Particle {
    constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.life = 0;
        this.maxLife = 0;
        this.size = 2;
        this.color = '#FFFFFF';
        this.decay = true;
        this.gravity = 0;
    }

    init(x, y, vx, vy, life, size, color, gravity = 0) {
        this.active = true;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.size = size;
        this.color = color;
        this.gravity = gravity;
    }

    update(dt) {
        this.life -= dt;
        if (this.life <= 0) {
            this.active = false;
            return;
        }
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += this.gravity * dt;
    }

    draw(ctx) {
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        const s = this.size * (0.5 + 0.5 * alpha);
        ctx.fillRect(Math.floor(this.x - s / 2), Math.floor(this.y - s / 2), Math.ceil(s), Math.ceil(s));
        ctx.globalAlpha = 1;
    }
}

const Particles = (() => {
    let pool = null;

    function init() {
        pool = new Pool(() => new Particle(), CONFIG.MAX_PARTICLES);
    }

    /** Spawn an explosion effect */
    function explode(x, y, count, color, speed = 100, size = 3) {
        for (let i = 0; i < count; i++) {
            const p = pool.get();
            if (!p) break;
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * speed + speed * 0.3;
            p.init(
                x, y,
                Math.cos(angle) * spd,
                Math.sin(angle) * spd,
                Math.random() * 0.4 + 0.2,  // life
                Math.random() * size + 1,
                color,
                50 // gravity
            );
        }
    }

    /** Spawn enemy destruction effect */
    function enemyExplode(x, y, colors) {
        const mainColor = colors[0] || '#FF4444';
        explode(x, y, 12, mainColor, 120, 3);
        explode(x, y, 6, '#FFFFFF', 80, 2);
        // Guaraní sparkle
        explode(x, y, 4, CONFIG.COLORS.PY_GOLD, 60, 2);
    }

    /** Boss explosion — MORE particles */
    function bossExplode(x, y) {
        explode(x, y, 30, CONFIG.COLORS.PY_RED, 200, 5);
        explode(x, y, 20, CONFIG.COLORS.PY_GOLD, 150, 4);
        explode(x, y, 15, '#FFFFFF', 100, 3);
    }

    /** Garra Guaraní activation burst */
    function garraBurst(x, y) {
        explode(x, y, 25, CONFIG.COLORS.PY_RED, 250, 4);
        explode(x, y, 25, '#FFFFFF', 200, 3);
    }

    /** Small spark when player is hit */
    function playerHitSpark(x, y) {
        explode(x, y, 8, '#FF6666', 100, 2);
    }

    /** Power-up pickup glow */
    function powerupCollect(x, y, color) {
        explode(x, y, 10, color || CONFIG.COLORS.PY_GOLD, 80, 3);
    }

    function update(dt) {
        pool.updateAll(dt);
    }

    function draw(ctx) {
        pool.drawAll(ctx);
    }

    function clear() {
        pool.releaseAll();
    }

    return { init, explode, enemyExplode, bossExplode, garraBurst, playerHitSpark, powerupCollect, update, draw, clear };
})();
