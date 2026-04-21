/* ============================================
   GARRA GUARANÍ — Enemy Entity
   ============================================ */

class Enemy {
    constructor() {
        this.active = false;
        this.alive = false;
        this.x = 0;
        this.y = 0;
        this.width = 20;
        this.height = 22;
        this.health = 1;
        this.maxHealth = 1;
        this.speed = 100;
        this.type = 'runner';
        this.pattern = 'straight';
        this.shootRate = 2;
        this.shootTimer = 0;
        this.reward = 100;
        this.colors = ['#FF4444', '#FFFFFF', '#FF4444'];
        this.damage = 3;
        this.time = 0;
        this.startX = 0;
        this.flashTimer = 0;
        this.charging = false;
        this.projectileType = 'ball';
    }

    init(cfg) {
        this.active = true;
        this.alive = true;
        this.x = cfg.x;
        this.y = cfg.y;
        this.width = cfg.width || 20;
        this.height = cfg.height || 22;
        this.health = cfg.health;
        this.maxHealth = cfg.health;
        this.speed = cfg.speed;
        this.type = cfg.type;
        this.pattern = cfg.pattern || 'straight';
        this.shootRate = cfg.shootRate || 0;
        this.shootTimer = Math.random() * 1.5 + 0.5; // Stagger first shot
        this.reward = cfg.reward;
        this.colors = cfg.colors || ['#FF4444', '#FFFFFF', '#FF4444'];
        this.damage = cfg.damage || 3;
        this.time = 0;
        this.startX = cfg.x;
        this.flashTimer = 0;
        this.charging = false;
        this.projectileType = cfg.projectileType || 'ball';
    }

    update(dt) {
        this.time += dt;
        this.flashTimer = Math.max(0, this.flashTimer - dt);

        // Apply movement pattern
        this._applyPattern(dt);

        // Out of bounds (below screen)
        if (this.y > CONFIG.GAME_HEIGHT + 40 || this.x < -60 || this.x > CONFIG.GAME_WIDTH + 60) {
            this.active = false;
            return;
        }

        // Shooting
        if (this.shootRate > 0) {
            this.shootTimer -= dt;
            if (this.shootTimer <= 0 && this.y > 10 && this.y < CONFIG.GAME_HEIGHT * 0.7) {
                this._shoot();
                this.shootTimer = this.shootRate * (0.8 + Math.random() * 0.4);
            }
        }
    }

    _applyPattern(dt) {
        switch (this.pattern) {
            case 'straight':
                this.y += this.speed * dt;
                break;
            case 'zigzag':
                this.y += this.speed * dt;
                this.x = this.startX + Math.sin(this.time * 3) * 50;
                break;
            case 'diagonal':
                this.y += this.speed * 0.7 * dt;
                if (this.startX < CONFIG.GAME_WIDTH / 2) {
                    this.x += this.speed * 0.5 * dt;
                } else {
                    this.x -= this.speed * 0.5 * dt;
                }
                break;
            case 'weave':
                this.y += this.speed * 0.8 * dt;
                this.x = this.startX + Math.sin(this.time * 2.5) * 60;
                break;
            case 'horizontal':
                this.y += this.speed * 0.3 * dt;
                this.x = this.startX + Math.sin(this.time * 1.5) * 80;
                break;
            case 'erratic':
                this.y += this.speed * 0.6 * dt;
                this.x += Math.sin(this.time * 5) * this.speed * 0.8 * dt;
                break;
            case 'stay_top':
                if (this.y < 60) {
                    this.y += this.speed * dt;
                }
                this.x = this.startX + Math.sin(this.time * 1.2) * 70;
                break;
            case 'charge_player':
                if (this.y < 80) {
                    this.y += this.speed * 0.6 * dt;
                } else {
                    if (!this.charging) {
                        this.charging = true;
                        Audio.hinchaCharge();
                    }
                    this.y += this.speed * 1.5 * dt;
                    if (window.Game && window.Game.player) {
                        this.x += (window.Game.player.x - this.x) * 2 * dt;
                    }
                }
                break;
            case 'horizontal_top':
                if (this.y < 40) {
                    this.y += this.speed * dt;
                } else {
                    this.y = 40 + Math.sin(this.time * 2) * 10;
                    this.x = this.startX + Math.sin(this.time * 1.5) * 100;
                }
                break;
            default:
                this.y += this.speed * dt;
        }
        this.x = Math.max(10, Math.min(CONFIG.GAME_WIDTH - 10, this.x));
    }

    _shoot() {
        if (!window.Game) return;
        const b = window.Game.enemyBullets.get();
        if (!b) return;

        if (this.type === 'arbitro') {
            Audio.arbitroWhistle();
            Audio.cardToss();
        }

        const bulletColor = this.projectileType === 'card' ? '#FFD700' : '#FF6644';
        const bWidth = this.projectileType === 'card' ? 8 : 4;
        const bHeight = this.projectileType === 'card' ? 12 : 4;

        b.init(
            this.x, this.y + this.height / 2,
            0, CONFIG.ENEMY_BULLET_SPEED,
            this.damage,
            bulletColor,
            { isEnemy: true, width: bWidth, height: bHeight }
        );
    }

    takeDamage(amount) {
        this.health -= amount;
        this.flashTimer = 0.1;
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

        if (this.flashTimer > 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
            return;
        }

        // --- Dibujado de Sprite ---
        let img = null;
        if (this.type === 'arbitro') {
            img = Renderer.getImage('arbitro');
        } else {
            img = Renderer.getImage('enemy_base');
        }

        if (img) {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + h / 2, w / 3, h / 6, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(Math.PI);
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
            ctx.restore();
        } else {
            this._drawProcedural(ctx, cx, cy, w, h);
        }
    }

    _drawProcedural(ctx, cx, cy, w, h) {
        const [mainColor, accentColor, altColor] = this.colors;
        ctx.fillStyle = mainColor;
        if (this.type === 'arbitro') {
            for(let i=0; i<w; i+=4) {
                ctx.fillStyle = (i/4)%2 === 0 ? '#000' : '#FFF';
                ctx.fillRect(cx - w/2 + i, cy - h/2, 4, h);
            }
        } else if (this.type === 'hincha') {
            ctx.fillStyle = '#FFDD00';
            ctx.fillRect(cx - w/2, cy - h/2, w, h);
            ctx.fillStyle = '#000';
            ctx.fillRect(cx - w/4, cy - h/4, w/2, h/2);
        } else {
            ctx.fillRect(cx - w/2, cy - h/2, w, h);
        }
    }
}
