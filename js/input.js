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
    
    // Tap management
    let tapOccurred = false;
    let tapX = 0;
    let tapY = 0;

    // Keyboard state
    const keys = {};

    let canvasEl = null;
    let scaleX = 1;
    let scaleY = 1;

    function init(canvas) {
        canvasEl = canvas;
        _bindTouch();
        _bindMouse();
        _bindKeyboard();
    }

    function _bindMouse() {
        canvasEl.addEventListener('mousedown', (e) => {
            touchActive = true;
            _updatePos(e.clientX, e.clientY);
            tapOccurred = true;
            _setTapPos(e.clientX, e.clientY);
        });
        window.addEventListener('mousemove', (e) => {
            if (!touchActive) return;
            _updatePos(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', () => {
            touchActive = false;
        });
    }

    function _updatePos(x, y) {
        touchCurrentX = x;
        touchCurrentY = y;
    }

    function _setTapPos(x, y) {
        const rect = canvasEl.getBoundingClientRect();
        tapX = (x - rect.left) / scaleX;
        tapY = (y - rect.top) / scaleY;
    }

    function updateScale(sx, sy) {
        scaleX = sx;
        scaleY = sy;
    }

    function _bindTouch() {
        canvasEl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchActive = true;
            _updatePos(touch.clientX, touch.clientY);
            tapOccurred = true;
            _setTapPos(touch.clientX, touch.clientY);
        }, { passive: false });

        canvasEl.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!touchActive) return;
            const touch = e.touches[0];
            _updatePos(touch.clientX, touch.clientY);
        }, { passive: false });

        canvasEl.addEventListener('touchend', (e) => {
            touchActive = false;
        }, { passive: false });
    }

    function isTapActive() {
        const result = tapOccurred;
        tapOccurred = false; // Consume tap
        return result;
    }

    function getTapPosition() {
        return { x: tapX, y: tapY };
    }

    function isTouching() {
        return touchActive;
    }

    function getTouchGamePos() {
        if (!canvasEl) return null;
        const rect = canvasEl.getBoundingClientRect();
        return {
            x: (touchCurrentX - rect.left) / scaleX,
            y: (touchCurrentY - rect.top) / scaleY
        };
    }

    function _bindKeyboard() {
        window.addEventListener('keydown', (e) => { keys[e.code] = true; });
        window.addEventListener('keyup', (e) => { keys[e.code] = false; });
    }

    function isKeyDown(code) { return !!keys[code]; }

    function getKeyboardDirection() {
        let dx = 0, dy = 0;
        if (keys['ArrowLeft'] || keys['KeyA']) dx -= 1;
        if (keys['ArrowRight'] || keys['KeyD']) dx += 1;
        if (keys['ArrowUp'] || keys['KeyW']) dy -= 1;
        if (keys['ArrowDown'] || keys['KeyS']) dy += 1;
        if (dx !== 0 && dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len; dy /= len;
        }
        return { dx, dy };
    }

    return {
        init, updateScale, isTouching, getTouchGamePos,
        isKeyDown, getKeyboardDirection, isTapActive, getTapPosition
    };
})();
