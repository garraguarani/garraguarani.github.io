/* ============================================
   GARRA GUARANÍ — Parallax Background
   Scrolling football field with lines
   ============================================ */

const Background = (() => {
    let offsetY = 0;
    let starField = [];
    const STAR_COUNT = 40;

    // Field line pattern
    const LINE_SPACING = 120;

    function init() {
        // Create some "star" decorations (simplified field markings)
        starField = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            starField.push({
                x: Math.random() * CONFIG.GAME_WIDTH,
                y: Math.random() * CONFIG.GAME_HEIGHT,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 20 + 10,
                alpha: Math.random() * 0.4 + 0.1
            });
        }
    }

    function update(dt) {
        offsetY += CONFIG.BG_SCROLL_SPEED * dt;
        // Keep offsetY within a safe range for the 80px stripes (total pattern cycle is 160px)
        if (offsetY >= 160) {
            offsetY -= 160;
        }

        // Move stars/grass dots
        for (let i = 0; i < starField.length; i++) {
            const s = starField[i];
            s.y += s.speed * dt;
            if (s.y > CONFIG.GAME_HEIGHT + 10) {
                s.y = -10;
                s.x = Math.random() * CONFIG.GAME_WIDTH;
            }
        }
    }

    function draw(ctx) {
        const W = CONFIG.GAME_WIDTH;
        const H = CONFIG.GAME_HEIGHT;

        // Base Grass
        ctx.fillStyle = '#1e5a1e';
        ctx.fillRect(0, 0, W, H);

        // Scrolling Stripes
        const stripeH = 80;
        const totalCycle = stripeH * 2;
        
        // Render patches to cover visible area
        for (let y = -totalCycle; y < H + totalCycle; y += stripeH) {
            const drawY = y + (offsetY % totalCycle);
            const isDark = Math.floor((y + offsetY) / stripeH) % 2 === 0;
            ctx.fillStyle = isDark ? '#1a541a' : '#226622';
            ctx.fillRect(0, drawY, W, stripeH);
        }

        // Pitch Markings (scrolling)
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2;

        // Draw a center circle every X pixels
        const pitchCycle = 1200;
        const pY = (offsetY * 2 + 300) % pitchCycle;
        
        // Lines
        ctx.beginPath();
        // Left side line
        ctx.moveTo(15, 0);
        ctx.lineTo(15, H);
        // Right side line
        ctx.moveTo(W - 15, 0);
        ctx.lineTo(W - 15, H);
        ctx.stroke();

        // Horizontal line + Circle (periodically)
        const lineY = (offsetY * 1.5) % 600;
        ctx.beginPath();
        ctx.moveTo(15, lineY);
        ctx.lineTo(W - 15, lineY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(W / 2, lineY, 40, 0, Math.PI * 2);
        ctx.stroke();

        // Grass texture (fixed particles)
        for (let i = 0; i < starField.length; i++) {
            const s = starField[i];
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = '#88cc88';
            ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
        }
        ctx.globalAlpha = 1;
    }

    return { init, update, draw };
})();
