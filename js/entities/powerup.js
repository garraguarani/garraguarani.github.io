/* ============================================
   GARRA GUARANÍ — Power-Up Entity
   Drops from enemies
   ============================================ */

class PowerUp {
    constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.type = 'coin';
        this.width = 16;
        this.height = 16;
        this.time = 0;
        this.vy = 40;
    }

    init(x, y, type) {
        this.active = true;
        this.x = x;
        this.y = y;
        this.type = type;
        this.time = 0;
        this.vy = 40 + Math.random() * 20;
    }

    update(dt) {
        this.time += dt;
        this.y += this.vy * dt;

        // Offscreen
        if (this.y > CONFIG.GAME_HEIGHT + 20) {
            this.active = false;
        }
    }

    draw(ctx) {
        const def = POWERUP_TYPES[this.type];
        if (!def) return;

        const cx = Math.floor(this.x);
        const cy = Math.floor(this.y);
        const bob = Math.sin(this.time * 5) * 2;

        // Glow effect
        ctx.globalAlpha = 0.3 + Math.sin(this.time * 4) * 0.15;
        ctx.fillStyle = def.color;
        ctx.fillRect(cx - 10, cy + bob - 10, 20, 20);
        ctx.globalAlpha = 1;

        // Background box
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(cx - 8, cy + bob - 8, 16, 16);

        // Border
        ctx.strokeStyle = def.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 8, cy + bob - 8, 16, 16);

        // Emoji text
        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(def.emoji, cx, cy + bob);
    }
}
