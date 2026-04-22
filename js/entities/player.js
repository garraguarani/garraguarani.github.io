/* ============================================
   GARRA GUARANÍ — Player Entity
   The Paraguayan footballer
   ============================================ */

class Player {
    constructor() {
        this.x = CONFIG.GAME_WIDTH / 2;
        this.y = CONFIG.GAME_HEIGHT * 0.8;
        this.width = CONFIG.PLAYER_WIDTH;
        this.height = CONFIG.PLAYER_HEIGHT;
        this.health = CONFIG.PLAYER_MAX_HEALTH;
        this.maxHealth = CONFIG.PLAYER_MAX_HEALTH;
        this.alive = true;
        this.invulnerable = false;
        this.invulnTimer = 0;
        this.fireTimer = 0;
        this.score = 0;
        this.megaGols = 0;

        // Weapons
        this.weapons = {
            basic: { unlocked: true, level: 0 },
            fire: { unlocked: false, level: 0 },
            triple: { unlocked: false, level: 0 },
            guided: { unlocked: false, level: 0 },
            bomb: { unlocked: false, level: 0 }
        };
        this.selectedWeapons = ['fire']; // Start with something if unlocked, but default is empty array for specials

        // Garra mode
        this.garraCharge = 0;
        this.garraActive = false;
        this.garraTimer = 0;

        // Magnet
        this.hasMagnet = false;

        // Visual
        this.time = 0;
        this.thrustAnim = 0;
    }

    reset() {
        this.x = CONFIG.GAME_WIDTH / 2;
        this.y = CONFIG.GAME_HEIGHT * 0.8;
        this.health = this.maxHealth;
        this.alive = true;
        this.invulnerable = true;
        this.invulnTimer = CONFIG.PLAYER_INVULN_TIME;
        this.fireTimer = 0;
        this.garraActive = false;
        this.garraTimer = 0;
        this.time = 0;
        this.hasMagnet = false;
    }

    fullReset() {
        this.reset();
        this.score = 0;
        this.megaGols = 0;
        this.garraCharge = 0;
        this.weapons = {
            basic: { unlocked: true, level: 0 },
            fire: { unlocked: false, level: 0 },
            triple: { unlocked: false, level: 0 },
            guided: { unlocked: false, level: 0 },
            bomb: { unlocked: false, level: 0 }
        };
        this.selectedWeapons = [];
    }

    update(dt) {
        if (!this.alive) return;
        this.time += dt;
        this.thrustAnim += dt * 10;

        // Invulnerability
        if (this.invulnerable) {
            this.invulnTimer -= dt;
            if (this.invulnTimer <= 0) {
                this.invulnerable = false;
            }
        }

        // Garra mode
        if (this.garraActive) {
            this.garraTimer -= dt;
            if (this.garraTimer <= 0) {
                this.garraActive = false;
                this.garraCharge = 0;
            }
        }

        // Movement
        this._handleMovement(dt);

        // Auto-fire
        this.fireTimer -= dt;
        if (this.fireTimer <= 0) {
            this._fire();
            this.fireTimer = this.garraActive ? CONFIG.PLAYER_FIRE_RATE * 0.5 : CONFIG.PLAYER_FIRE_RATE;
        }
    }

    _handleMovement(dt) {
        // Touch input (priority)
        const touchDelta = Input.getTouchDelta();
        if (touchDelta) {
            this.x = touchDelta.startPlayerX + touchDelta.dx;
            this.y = touchDelta.startPlayerY + touchDelta.dy;
        } else {
            // Keyboard
            const dir = Input.getKeyboardDirection();
            if (dir.dx !== 0 || dir.dy !== 0) {
                this.x += dir.dx * CONFIG.PLAYER_SPEED * dt;
                this.y += dir.dy * CONFIG.PLAYER_SPEED * dt;
            }
        }

        // Clamp position
        const halfW = this.width / 2;
        const halfH = this.height / 2;
        this.x = Math.max(halfW, Math.min(CONFIG.GAME_WIDTH - halfW, this.x));
        this.y = Math.max(CONFIG.GAME_HEIGHT * 0.25, Math.min(CONFIG.GAME_HEIGHT - halfH - 50, this.y));
    }

    _fire() {
        if (!window.Game) return;

        const isGarra = this.garraActive;

        // 1. Always fire Basic (Level 0+)
        const basicW = this.weapons['basic'];
        if (basicW.unlocked) {
            const def = WEAPON_TYPES['basic'];
            const levelData = def.levels[Math.min(basicW.level, def.levels.length - 1)];
            this._fireWeapon(def, levelData, isGarra);
        }

        // 2. Fire All Selected Weapons (if unlocked)
        for (const selKey of this.selectedWeapons) {
            const selW = this.weapons[selKey];
            if (selW && selW.unlocked) {
                const def = WEAPON_TYPES[selKey];
                const levelData = def.levels[Math.min(selW.level, def.levels.length - 1)];
                this._fireWeapon(def, levelData, isGarra);
            }
        }

        Audio.shoot();
    }

    _fireWeapon(weaponDef, levelData, isGarra) {
        const count = levelData.count || 1;
        const spread = levelData.spread || 0;
        const damage = (levelData.damage || 1) * (isGarra ? 3 : 1);
        const speed = weaponDef.speed;

        for (let i = 0; i < count; i++) {
            const b = window.Game.playerBullets.get();
            if (!b) return;

            let angle = -Math.PI / 2; // straight up
            if (count > 1 && spread > 0) {
                const spreadRad = (spread * Math.PI / 180);
                angle += -spreadRad * (count - 1) / 2 + spreadRad * i;
            }

            b.init(
                this.x, this.y - this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                damage,
                weaponDef.color,
                {
                    piercing: weaponDef.piercing,
                    tracking: levelData.tracking || 0,
                    explosionRadius: levelData.explosionRadius || 0
                }
            );
        }
    }

    takeDamage(amount) {
        if (this.invulnerable || this.garraActive || !this.alive) return;
        this.health -= amount;
        this.invulnerable = true;
        this.invulnTimer = CONFIG.PLAYER_INVULN_TIME;
        Audio.playerHit();
        Particles.playerHitSpark(this.x, this.y);

        // Screen shake
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.classList.add('shake');
            setTimeout(() => canvas.classList.remove('shake'), 150);
        }

        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            Particles.bossExplode(this.x, this.y);
        }
    }

    addGarraCharge(amount) {
        if (this.garraActive) return;
        this.garraCharge = Math.min(CONFIG.GARRA_MAX_CHARGE, this.garraCharge + amount);
    }

    activateGarra() {
        if (this.garraCharge < CONFIG.GARRA_MAX_CHARGE || this.garraActive) return false;
        this.garraActive = true;
        this.garraTimer = CONFIG.GARRA_DURATION;
        this.invulnerable = true;
        this.invulnTimer = CONFIG.GARRA_DURATION;
        Audio.garraActivate();
        Particles.garraBurst(this.x, this.y);
        return true;
    }

    useMegaGol() {
        if (this.megaGols <= 0) return false;
        this.megaGols--;
        Audio.megaGol();
        return true;
    }

    selectWeapon(type) {
        if (type === 'megagol') {
            this.useMegaGol();
            return;
        }

        if (type === 'basic') {
            // Basic is always on, clicking it could clear others or just do nothing
            // For now, let's say it makes you use ONLY basic
            this.selectedWeapons = [];
            Audio.menuSelect();
            return;
        }

        if (this.weapons[type] && this.weapons[type].unlocked) {
            const idx = this.selectedWeapons.indexOf(type);
            if (idx !== -1) {
                // Deselect
                this.selectedWeapons.splice(idx, 1);
            } else {
                // Select (limit 2)
                if (this.selectedWeapons.length >= 2) {
                    this.selectedWeapons.shift(); // Remove oldest
                }
                this.selectedWeapons.push(type);
            }
            Audio.menuSelect();
        }
    }

    cycleSelectableWeapon() {
        // Obsolete but kept for safety if called elsewhere
        const s = ['basic', 'fire', 'triple', 'guided', 'bomb'];
        const unlocked = s.filter(k => this.weapons[k].unlocked);
        const idx = unlocked.indexOf(this.selectedWeapon);
        this.selectedWeapon = unlocked[(idx + 1) % unlocked.length];
        Audio.menuSelect();
    }

    draw(ctx) {
        if (!this.alive) return;

        const cx = Math.floor(this.x);
        const cy = Math.floor(this.y);

        // Invulnerability blink
        if (this.invulnerable && !this.garraActive && Math.floor(this.time * 10) % 2 === 0) {
            return; // blink off
        }

        // Garra mode glow
        if (this.garraActive) {
            ctx.globalAlpha = 0.3 + Math.sin(this.time * 8) * 0.2;
            ctx.fillStyle = CONFIG.COLORS.PY_RED_GLOW;
            ctx.beginPath();
            ctx.arc(cx, cy, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // --- Sprite Rendering ---
        const img = Renderer.getImage('player');
        if (img) {
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + this.height/2 + 2, 12, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw Sprite (centered)
            // Assuming 32x32 sprite, but we match player width/height
            ctx.drawImage(
                img,
                cx - this.width / 2,
                cy - this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback to procedural if image not loaded
            this._drawProcedural(ctx, cx, cy);
        }
    }

    _drawProcedural(ctx, cx, cy) {
        const w = this.width;
        const h = this.height;
        // ... (preserving some of the old logic for fallback)
        ctx.fillStyle = CONFIG.COLORS.PY_RED;
        ctx.fillRect(cx - w/2, cy - h/2, w, h);
    }
}
