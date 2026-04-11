/* ============================================
   GARRA GUARANÍ — Input System
   Touch (mobile) + Keyboard (desktop)
   ============================================ */

const Input = (() => {
    let touchActive = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchCurrentY = 0;
    let playerStartX = 0;
    let playerStartY = 0;

    // Keyboard state
    const keys = {};

    // Canvas reference (set during init)
    let canvasEl = null;
    let scaleX = 1;
    let scaleY = 1;

    function init(canvas) {
        canvasEl = canvas;
        _bindTouch();
        _bindMouse();
        _bindKeyboard();
    }

    // --- Mouse (desktop) ---
    function _bindMouse() {
        canvasEl.addEventListener('mousedown', (e) => {
            // e.preventDefault(); // Don't prevent default on mousedown to allow focus
            touchActive = true;
            _updatePos(e.clientX, e.clientY);
            
            if (window.Game && window.Game.player) {
                playerStartX = window.Game.player.x;
                playerStartY = window.Game.player.y;
            }
        });
        window.addEventListener('mousemove', (e) => {
            if (!touchActive) return;
            _updatePos(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', (e) => {
            touchActive = false;
        });
    }

    function _updatePos(x, y) {
        touchCurrentX = x;
        touchCurrentY = y;
    }

    function updateScale(sx, sy) {
        scaleX = sx;
        scaleY = sy;
    }

    // --- Touch ---
    function _bindTouch() {
        // Prevent default to stop scroll/zoom
        canvasEl.addEventListener('touchstart', _onTouchStart, { passive: false });
        canvasEl.addEventListener('touchmove', _onTouchMove, { passive: false });
        canvasEl.addEventListener('touchend', _onTouchEnd, { passive: false });
        canvasEl.addEventListener('touchcancel', _onTouchEnd, { passive: false });
    }

    function _onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        touchActive = true;
        _updatePos(touch.clientX, touch.clientY);
        
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        if (window.Game && window.Game.player) {
            playerStartX = window.Game.player.x;
            playerStartY = window.Game.player.y;
        }
    }

    function _onTouchMove(e) {
        e.preventDefault();
        if (!touchActive) return;
        const touch = e.touches[0];
        _updatePos(touch.clientX, touch.clientY);
    }

    function _onTouchEnd(e) {
        // e.preventDefault();
        touchActive = false;
    }

    /** Returns the delta from touch start in game coords */
    function getTouchDelta() {
        if (!touchActive) return null;
        return {
            dx: (touchCurrentX - touchStartX) / scaleX,
            dy: (touchCurrentY - touchStartY) / scaleY,
            startPlayerX: playerStartX,
            startPlayerY: playerStartY
        };
    }

    function isTouching() {
        return touchActive;
    }

    /** Get the raw game coords of the current position (touch or mouse) */
    function getTouchGamePos() {
        if (!touchActive || !canvasEl) return null;
        const rect = canvasEl.getBoundingClientRect();
        
        // Calculate coordinates relative to canvas element
        const x = (touchCurrentX - rect.left);
        const y = (touchCurrentY - rect.top);
        
        // Scale to logical game resolution
        return {
            x: x / scaleX,
            y: y / scaleY
        };
    }

    // --- Keyboard ---
    function _bindKeyboard() {
        window.addEventListener('keydown', (e) => {
            keys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            keys[e.code] = false;
        });
    }

    function isKeyDown(code) {
        return !!keys[code];
    }

    /** Get normalized direction vector from keyboard input */
    function getKeyboardDirection() {
        let dx = 0;
        let dy = 0;
        if (keys['ArrowLeft'] || keys['KeyA']) dx -= 1;
        if (keys['ArrowRight'] || keys['KeyD']) dx += 1;
        if (keys['ArrowUp'] || keys['KeyW']) dy -= 1;
        if (keys['ArrowDown'] || keys['KeyS']) dy += 1;
        // Normalize diagonal
        if (dx !== 0 && dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
        }
        return { dx, dy };
    }

    return {
        init,
        updateScale,
        getTouchDelta,
        isTouching,
        getTouchGamePos,
        isKeyDown,
        getKeyboardDirection
    };
})();
