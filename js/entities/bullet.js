/* ============================================
   GARRA GUARANÍ — Bullet Entity
   Projectiles for player and enemies
   ============================================ */

class Bullet {
    constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.width = CONFIG.BULLET_WIDTH;
        this.height = CONFIG.BULLET_HEIGHT;
        this.damage = 1;
        this.color = '#FFFFFF';
        this.piercing = false;
        this.isEnemy = false;
        this.tracking = 0;
        this.targetEntity = null;
        this.explosionRadius = 0;
        this.trail = [];
    }

    init(x, y, vx, vy, damage, color, options = {}) {
        this.active = true;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.color = color;
        this.piercing = options.piercing || false;
        this.isEnemy = options.isEnemy || false;
        this.tracking = options.tracking || 0;
        this.targetEntity = null;
        this.explosionRadius = options.explosionRadius || 0;
        this.width = options.width || CONFIG.BULLET_WIDTH;
        this.height = options.height || CONFIG.BULLET_HEIGHT;
        this.trail = [];
    }

    update(dt) {
        // Tracking logic (guided bullets)
        if (this.tracking > 0 && !this.isEnemy) {
            this._seekTarget(dt);
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Trail effect
        if (!this.isEnemy && this.trail.length < 4) {
            this.trail.push({ x: this.x, y: this.y });
        } else if (this.trail.length > 0) {
            this.trail.shift();
            this.trail.push({ x: this.x, y: this.y });
        }

        // Out of bounds
        if (this.y < -20 || this.y > CONFIG.GAME_HEIGHT + 20 ||
            this.x < -20 || this.x > CONFIG.GAME_WIDTH + 20) {
            this.active = false;
        }
    }

    _seekTarget(dt) {
        // Find nearest enemy
        if (!window.Game) return;
        const enemies = window.Game.enemies.active;
        let nearest = null;
        let nearestDist = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (!e.active) continue;
            const dx = e.x - this.x;
            const dy = e.y - this.y;
            const d = dx * dx + dy * dy;
            if (d < nearestDist) {
                nearestDist = d;
                nearest = e;
            }
        }

        // Also check boss
        const boss = window.Game.currentBoss;
        if (boss && boss.active && boss.alive) {
            const dx = boss.x - this.x;
            const dy = boss.y - this.y;
            const d = dx * dx + dy * dy;
            if (d < nearestDist) {
                nearest = boss;
            }
        }

        if (nearest) {
            const dx = nearest.x - this.x;
            const dy = nearest.y - this.y;
            const angle = Math.atan2(dy, dx);
            const currentAngle = Math.atan2(this.vy, this.vx);
            const diff = angle - currentAngle;
            const newAngle = currentAngle + diff * this.tracking;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.vx = Math.cos(newAngle) * speed;
            this.vy = Math.sin(newAngle) * speed;
        }
    }

    draw(ctx) {
        // Trail
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i + 1) / (this.trail.length + 1) * 0.3;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            const s = this.width * 0.6;
            ctx.fillRect(
                Math.floor(this.trail[i].x - s / 2),
                Math.floor(this.trail[i].y - s / 2),
                Math.ceil(s), Math.ceil(s)
            );
        }
        ctx.globalAlpha = 1;

        // Main bullet
        if (this.isEnemy) {
            // Enemy bullet: small red/orange dot
            ctx.fillStyle = this.color;
            ctx.fillRect(
                Math.floor(this.x - this.width / 2),
                Math.floor(this.y - this.height / 2),
                this.width, this.height
            );
        } else {
            // Player bullet: soccer ball pixel art
            this._drawBall(ctx);
        }
    }

    _drawBall(ctx) {
        const cx = Math.floor(this.x);
        const cy = Math.floor(this.y);
        const s = Math.max(this.width, 5);

        // Check if color indicates special weapon type
        const isFireball = this.color === '#FF6600';      // Pelota de Fuego
        const isTriple = this.color === '#FFD700';        // Triple Pelota / Chipa
        const isGuided = this.color === '#00CC66';        // Tereré teledirigido
        const isBomb = this.color === '#FF3366';          // Pelota Bomba

        if (isFireball) {
            this._drawFireball(ctx, cx, cy, s);
        } else if (isTriple) {
            this._drawChipa(ctx, cx, cy, s);
        } else if (isGuided) {
            this._drawTere(ctx, cx, cy, s);
        } else if (isBomb) {
            this._drawBomba(ctx, cx, cy, s);
        } else {
            // Default: soccer ball
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(cx, cy, s/2, 0, Math.PI * 2);
            ctx.fill();

            // Dark polygons for "pentagon" effect
            ctx.fillStyle = '#000000';
            ctx.fillRect(cx - 1, cy - 1, 3, 3);
            ctx.fillRect(cx - s/3, cy - s/4, 2, 2);
            ctx.fillRect(cx + s/4, cy + s/4, 2, 2);
            ctx.fillRect(cx - s/4, cy + s/4 - 1, 2, 2);
        }
    }

    _drawFireball(ctx, cx, cy, s) {
        // Pelota de Fuego - naranja con efecto de llama
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, s/2);
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(0.5, '#FF6600');
        gradient.addColorStop(1, '#CC3300');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, s/2, 0, Math.PI * 2);
        ctx.fill();

        // Fire particles around
        ctx.fillStyle = '#FF4500';
        for (let i = 0; i < 3; i++) {
            const angle = (Date.now() / 100 + i * 2) % (Math.PI * 2);
            const px = cx + Math.cos(angle) * (s/2 + 2);
            const py = cy + Math.sin(angle) * (s/2 + 2);
            ctx.fillRect(px - 1, py - 1, 2, 2);
        }
    }

    _drawChipa(ctx, cx, cy, s) {
        // Triple Pelota / Chipa - amarillo dorado
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(cx, cy, s/2, 0, Math.PI * 2);
        ctx.fill();

        // Chipa pattern - small circles
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(cx - 2, cy - 1, 1.5, 0, Math.PI * 2);
        ctx.arc(cx + 2, cy - 1, 1.5, 0, Math.PI * 2);
        ctx.arc(cx, cy + 2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Shine
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(cx - 1, cy - 1, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    _drawTere(ctx, cx, cy, s) {
        // Tereré teledirigido - verde
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, s/2);
        gradient.addColorStop(0, '#66FF99');
        gradient.addColorStop(0.7, '#00CC66');
        gradient.addColorStop(1, '#006633');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, s/2, 0, Math.PI * 2);
        ctx.fill();

        // Guided indicator - small trail
        ctx.fillStyle = 'rgba(0, 255, 100, 0.5)';
        ctx.fillRect(cx - s/4, cy - s/4, s/2, s/2);

        // Target lock indicator (pulsing)
        const pulse = Math.sin(Date.now() / 100) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(100, 255, 150, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, s/2 + 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    _drawBomba(ctx, cx, cy, s) {
        // Pelota Bomba - rojo/rosado explosivo
        ctx.fillStyle = '#FF3366';
        ctx.beginPath();
        ctx.arc(cx, cy, s/2, 0, Math.PI * 2);
        ctx.fill();

        // Bomb fuse/spark
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(cx - 1, cy - s/2 - 2, 2, 3);

        // Explosive pattern - X mark
        ctx.strokeStyle = '#660033';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy - 3);
        ctx.lineTo(cx + 3, cy + 3);
        ctx.moveTo(cx + 3, cy - 3);
        ctx.lineTo(cx - 3, cy + 3);
        ctx.stroke();

        // Outer glow
        ctx.strokeStyle = 'rgba(255, 50, 100, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, s/2 + 3, 0, Math.PI * 2);
        ctx.stroke();
    }
}
