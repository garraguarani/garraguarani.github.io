/* ============================================
   GARRA GUARANÍ — Boss Entity
   ============================================ */

class Boss {
    constructor() {
        this.active = false;
        this.alive = false;
        this.x = 0;
        this.y = 0;
        this.width = CONFIG.BOSS_WIDTH;
        this.height = CONFIG.BOSS_HEIGHT;
        this.health = 100;
        this.maxHealth = 100;
        this.phase = 0;
        this.totalPhases = 3;
        this.patterns = [];
        this.name = 'Boss';
        this.colors = ['#FF0000', '#FFFFFF', '#0000FF'];
        this.time = 0;
        this.shootTimer = 0;
        this.phaseTimer = 0;
        this.flashTimer = 0;
        this.entering = true;
        this.targetY = 80;
    }

    init(cfg, team) {
        this.active = true;
        this.alive = true;
        this.x = CONFIG.GAME_WIDTH / 2;
        this.y = -80;
        
        // Progressive scaling based on level
        const levelIdx = window.Game ? window.Game.levelIndex : 0;
        const scalar = 1 + (levelIdx * 0.25); // 25% más grande por nivel (crecimiento más notorio)
        
        this.width = CONFIG.BOSS_WIDTH * scalar;
        this.height = CONFIG.BOSS_HEIGHT * scalar;
        this.health = cfg.health * (1 + levelIdx * 0.1); // 10% more HP per level scale factor
        this.maxHealth = this.health;
        
        this.phase = 0;
        this.totalPhases = cfg.phases || 3;
        this.patterns = cfg.patterns || ['spread'];
        this.name = cfg.name || `Capitán ${team.name}`;
        this.colors = team.colors;
        this.time = 0;
        this.shootTimer = 0.5;
        this.phaseTimer = 0;
        this.flashTimer = 0;
        this.entering = true;
        this.targetY = 80;
    }

    update(dt) {
        this.time += dt;
        this.flashTimer = Math.max(0, this.flashTimer - dt);

        // Entry animation
        if (this.entering) {
            this.y += 60 * dt;
            if (this.y >= this.targetY) {
                this.y = this.targetY;
                this.entering = false;
            }
            return;
        }

        // Phase transitions
        const healthPercent = this.health / this.maxHealth;
        const expectedPhase = Math.floor((1 - healthPercent) * this.totalPhases);
        if (expectedPhase > this.phase && expectedPhase < this.totalPhases) {
            this.phase = expectedPhase;
            this.phaseTimer = 0;
            // Flash effect on phase change
            this.flashTimer = 0.3;
            Particles.explode(this.x, this.y, 15, this.colors[0], 100, 3);
        }

        this.phaseTimer += dt;

        // Movement based on current phase pattern
        const pattern = this.patterns[Math.min(this.phase, this.patterns.length - 1)];
        this._applyMovement(pattern, dt);

        // Shooting
        this.shootTimer -= dt;
        if (this.shootTimer <= 0) {
            this._shoot(pattern);
            const baseRate = 1.2 - this.phase * 0.2;
            this.shootTimer = Math.max(0.3, baseRate);
        }
    }

    _applyMovement(pattern, dt) {
        const W = CONFIG.GAME_WIDTH;
        switch (pattern) {
            case 'spread':
                this.x = W/2 + Math.sin(this.time * 1.2) * (W * 0.35);
                this.y = this.targetY + Math.sin(this.time * 0.8) * 20;
                break;
            case 'charge':
                this.x = W/2 + Math.sin(this.time * 1.5) * (W * 0.3);
                // Occasionally charge downward
                if (Math.sin(this.phaseTimer * 0.5) > 0.7) {
                    this.y = this.targetY + 60;
                } else {
                    this.y += (this.targetY - this.y) * 2 * dt;
                }
                break;
            case 'circular':
                this.x = W/2 + Math.cos(this.time * 1.0) * (W * 0.3);
                this.y = this.targetY + Math.sin(this.time * 1.0) * 40;
                break;
            case 'shield':
                this.x = W/2 + Math.sin(this.time * 0.8) * (W * 0.25);
                this.y = this.targetY + Math.sin(this.time * 1.5) * 15;
                break;
            case 'spiral':
                this.x = W/2 + Math.cos(this.time * 2) * (W * 0.25);
                this.y = this.targetY + Math.sin(this.time * 2) * 30;
                break;
            case 'diagonal':
                this.x = W/2 + Math.sin(this.time * 1.8) * (W * 0.35);
                this.y = this.targetY + Math.cos(this.time * 1.3) * 35;
                break;
            case 'speed':
                this.x = W/2 + Math.sin(this.time * 2.5) * (W * 0.4);
                this.y = this.targetY + Math.sin(this.time * 1.8) * 25;
                break;
            case 'burst':
                this.x = W/2 + Math.sin(this.time * 1.0) * (W * 0.2);
                this.y = this.targetY;
                break;
            default:
                this.x = W/2 + Math.sin(this.time) * (W * 0.3);
        }
    }

    _shoot(pattern) {
        if (!window.Game) return;

        switch (pattern) {
            case 'spread':
                this._shootSpread(5, 0.3);
                break;
            case 'charge':
                this._shootAimed(2);
                break;
            case 'circular':
                this._shootCircular(8);
                break;
            case 'shield':
                this._shootSpread(3, 0.2);
                break;
            case 'spiral':
                this._shootSpiral(6);
                break;
            case 'diagonal':
                this._shootDiagonal();
                break;
            case 'speed':
                this._shootAimed(3);
                break;
            case 'burst':
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => this._shootSpread(7, 0.35), i * 100);
                }
                break;
            default:
                this._shootSpread(3, 0.25);
        }
    }

    _shootSpread(count, spreadAngle) {
        const startAngle = Math.PI / 2 - spreadAngle * (count - 1) / 2;
        for (let i = 0; i < count; i++) {
            const angle = startAngle + i * spreadAngle;
            const b = window.Game.enemyBullets.get();
            if (!b) return;
            b.init(
                this.x, this.y + this.height / 2,
                Math.cos(angle) * CONFIG.ENEMY_BULLET_SPEED,
                Math.sin(angle) * CONFIG.ENEMY_BULLET_SPEED,
                12, '#FFD700', { isEnemy: true, width: 6, height: 6 }
            );
        }
    }

    _shootAimed(count) {
        const player = window.Game.player;
        if (!player) return;
        for (let i = 0; i < count; i++) {
            const dx = player.x - this.x + (Math.random() - 0.5) * 40;
            const dy = player.y - this.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const b = window.Game.enemyBullets.get();
            if (!b) return;
            b.init(
                this.x + (Math.random() - 0.5) * 20, this.y + this.height / 2,
                (dx / len) * CONFIG.ENEMY_BULLET_SPEED * 1.2,
                (dy / len) * CONFIG.ENEMY_BULLET_SPEED * 1.2,
                15, '#FF0000', { isEnemy: true, width: 6, height: 6 }
            );
        }
    }

    _shootCircular(count) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + this.time * 0.5;
            const b = window.Game.enemyBullets.get();
            if (!b) return;
            b.init(
                this.x, this.y,
                Math.cos(angle) * CONFIG.ENEMY_BULLET_SPEED * 0.8,
                Math.sin(angle) * CONFIG.ENEMY_BULLET_SPEED * 0.8,
                10, '#FFD700', { isEnemy: true, width: 6, height: 6 }
            );
        }
    }

    _shootSpiral(count) {
        for (let i = 0; i < count; i++) {
            const angle = this.time * 3 + (i / count) * Math.PI * 2;
            const b = window.Game.enemyBullets.get();
            if (!b) return;
            b.init(
                this.x, this.y,
                Math.cos(angle) * CONFIG.ENEMY_BULLET_SPEED * 0.7,
                Math.sin(angle) * CONFIG.ENEMY_BULLET_SPEED * 0.7,
                10, '#FFD700', { isEnemy: true, width: 6, height: 6 }
            );
        }
    }

    _shootDiagonal() {
        const angles = [Math.PI / 4, Math.PI * 3/4, Math.PI / 2];
        for (const angle of angles) {
            const b = window.Game.enemyBullets.get();
            if (!b) return;
            b.init(
                this.x, this.y + this.height / 2,
                Math.cos(angle) * CONFIG.ENEMY_BULLET_SPEED,
                Math.sin(angle) * CONFIG.ENEMY_BULLET_SPEED,
                12, '#FF3D00', { isEnemy: true, width: 6, height: 6 }
            );
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.flashTimer = 0.08;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            this.active = false;
        }
    }

    draw(ctx) {
        const cx = Math.floor(this.x);
        const cy = Math.floor(this.y);
        const w = this.width;
        const h = this.height;

        // Seleccionar imagen según el nivel actual
        const levelIdx = window.Game ? window.Game.levelIndex : 0;
        const BOSS_KEYS = ['boss', 'boss2', 'boss3', 'boss4', 'boss5', 'boss6', 'boss7', 'bossFinal'];
        const imgKey = BOSS_KEYS[Math.min(levelIdx, BOSS_KEYS.length - 1)];
        const img = Renderer.getImage(imgKey) || Renderer.getImage('boss');

        if (img) {
            // Aura pulsante dorada
            ctx.save();
            ctx.globalAlpha = 0.22 + Math.sin(this.time * 8) * 0.10;
            ctx.fillStyle = CONFIG.COLORS.PY_GOLD;
            ctx.beginPath();
            ctx.ellipse(cx, cy, w * 0.65, h * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Sombra en el suelo
            ctx.fillStyle = 'rgba(0,0,0,0.28)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + h / 2 + 4, w / 2, h / 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Volteo vertical (scale) para que el jefe aparezca parado derecho
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(1, -1);
            if (this.flashTimer > 0) {
                ctx.globalAlpha = 0.5 + Math.sin(this.time * 30) * 0.5;
            }
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
            ctx.restore();
            ctx.globalAlpha = 1;
        } else {
            this._drawProcedural(ctx, cx, cy, w, h);
        }

        // Health bar
        const barW = w + 20;
        const barH = 5;
        const barX = cx - barW/2;
        const barY = cy - h/2 - 20;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(barX, barY, barW, barH);
        const fillW = (this.health / this.maxHealth) * barW;
        const healthColor = this.health / this.maxHealth > 0.3 ? CONFIG.COLORS.PY_RED : '#FF0000';
        ctx.fillStyle = healthColor;
        ctx.fillRect(barX, barY, fillW, barH);
    }

    _drawProcedural(ctx, cx, cy, w, h) {
        const [mainColor, accentColor, altColor] = this.colors;
        ctx.fillStyle = mainColor;
        ctx.fillRect(cx - w/2, cy - h/2, w, h);
    }
}
