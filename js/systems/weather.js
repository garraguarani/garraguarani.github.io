/* ============================================
   GARRA GUARANÍ — Weather System
   Particles and lightning effects
   ============================================ */

const Weather = (() => {
    let currentType = 'none';
    let particles = [];
    let flashAlpha = 0;
    const MAX_PARTICLES = 100;

    function init() {
        // Lazy init - nothing to load
    }

    function setType(type) {
        currentType = type;
        particles = [];
        if (type !== 'none') {
            for (let i = 0; i < MAX_PARTICLES; i++) {
                particles.push(_createParticle());
            }
        }
    }

    function _createParticle() {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            speed: 200 + Math.random() * 300,
            size: 1 + Math.random() * 2,
            opp: Math.random() * 0.5 + 0.2
        };
    }

    function update(dt) {
        if (flashAlpha > 0) flashAlpha -= dt * 5;

        // Lightning random chance if storm
        if (currentType === 'storm' && Math.random() < 0.005) {
            flashAlpha = 0.8;
            Audio.cardToss(); // Reuse high-freq noise for thunder hint
        }

        if (currentType === 'none') return;

        for (let p of particles) {
            if (currentType === 'rain' || currentType === 'storm') {
                p.y += p.speed * dt;
                if (p.y > CONFIG.GAME_HEIGHT) p.y = -10;
            } else if (currentType === 'snow') {
                p.y += (p.speed * 0.3) * dt;
                p.x += Math.sin(p.y * 0.05) * 20 * dt;
                if (p.y > CONFIG.GAME_HEIGHT) p.y = -10;
            } else if (currentType === 'wind') {
                p.x += p.speed * dt;
                if (p.x > CONFIG.GAME_WIDTH) p.x = -10;
            }
        }
    }

    function draw(ctx) {
        if (currentType !== 'none') {
            ctx.save();
            ctx.lineWidth = 1;
            for (let p of particles) {
                ctx.globalAlpha = p.opp;
                if (currentType === 'rain' || currentType === 'storm') {
                    ctx.strokeStyle = '#AAF';
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + 10);
                    ctx.stroke();
                } else if (currentType === 'snow') {
                    ctx.fillStyle = '#FFF';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (currentType === 'wind') {
                    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + 20, p.y);
                    ctx.stroke();
                }
            }
            ctx.restore();
        }

        // Lightning/Sun Glare
        if (flashAlpha > 0) {
            ctx.fillStyle = currentType === 'storm' ? '#FFF' : 'rgba(255,255,200,0.4)';
            ctx.globalAlpha = flashAlpha;
            ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
            ctx.globalAlpha = 1;
        }

        // Night / Fog Overlay
        if (currentType === 'night') {
            ctx.fillStyle = 'rgba(0, 0, 40, 0.4)';
            ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        } else if (currentType === 'fog') {
            ctx.fillStyle = 'rgba(200, 200, 220, 0.3)';
            ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        }
    }

    return { init, setType, update, draw };
})();
