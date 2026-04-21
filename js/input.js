/* ============================================
   GARRA GUARANÍ — Input System v3
   Touch drag (player) + Tap (menus) + Keyboard
   ============================================ */

const Input = (() => {
    // --- Estado de drag / movimiento ---
    let touchActive = false;
    let touchStartClientX = 0;
    let touchStartClientY = 0;
    let touchCurrentClientX = 0;
    let touchCurrentClientY = 0;
    let playerStartX = 0;
    let playerStartY = 0;

    // --- Estado de tap (menús) ---
    let tapOccurred = false;
    let tapGameX = 0;
    let tapGameY = 0;

    // --- Teclado ---
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

    function updateScale(sx, sy) {
        scaleX = sx;
        scaleY = sy;
    }

    function _toGameCoords(clientX, clientY) {
        if (!canvasEl) return { x: 0, y: 0 };
        const rect = canvasEl.getBoundingClientRect();
        return {
            x: (clientX - rect.left) / scaleX,
            y: (clientY - rect.top) / scaleY
        };
    }

    function _onStart(clientX, clientY) {
        touchActive = true;
        touchStartClientX = clientX;
        touchStartClientY = clientY;
        touchCurrentClientX = clientX;
        touchCurrentClientY = clientY;

        // Capturar posición del jugador al inicio del toque
        if (window.Game && window.Game.player) {
            playerStartX = window.Game.player.x;
            playerStartY = window.Game.player.y;
        }

        // Registrar tap para menús
        const gc = _toGameCoords(clientX, clientY);
        tapGameX = gc.x;
        tapGameY = gc.y;
        tapOccurred = true;
    }

    function _onMove(clientX, clientY) {
        touchCurrentClientX = clientX;
        touchCurrentClientY = clientY;
    }

    function _onEnd() {
        touchActive = false;
    }

    function _bindTouch() {
        canvasEl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            _onStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });

        canvasEl.addEventListener('touchmove', (e) => {
            e.preventDefault();
            _onMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });

        canvasEl.addEventListener('touchend', () => _onEnd(), { passive: false });
        canvasEl.addEventListener('touchcancel', () => _onEnd(), { passive: false });
    }

    function _bindMouse() {
        canvasEl.addEventListener('mousedown', (e) => {
            _onStart(e.clientX, e.clientY);
        });
        window.addEventListener('mousemove', (e) => {
            if (!touchActive) return;
            _onMove(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', () => _onEnd());
    }

    function _bindKeyboard() {
        window.addEventListener('keydown', (e) => { keys[e.code] = true; });
        window.addEventListener('keyup', (e) => { keys[e.code] = false; });
    }

    /** Para movimiento del jugador: delta desde donde empezó el drag */
    function getTouchDelta() {
        if (!touchActive) return null;
        return {
            dx: (touchCurrentClientX - touchStartClientX) / scaleX,
            dy: (touchCurrentClientY - touchStartClientY) / scaleY,
            startPlayerX: playerStartX,
            startPlayerY: playerStartY
        };
    }

    /** Para botones de menú: consume el tap una sola vez */
    function isTapActive() {
        if (tapOccurred) {
            tapOccurred = false;
            return true;
        }
        return false;
    }

    function getTapPosition() {
        return { x: tapGameX, y: tapGameY };
    }

    function isTouching() { return touchActive; }

    function getTouchGamePos() {
        if (!canvasEl) return null;
        return _toGameCoords(touchCurrentClientX, touchCurrentClientY);
    }

    function isKeyDown(code) { return !!keys[code]; }

    function getKeyboardDirection() {
        let dx = 0, dy = 0;
        if (keys['ArrowLeft'] || keys['KeyA']) dx -= 1;
        if (keys['ArrowRight'] || keys['KeyD']) dx += 1;
        if (keys['ArrowUp']   || keys['KeyW']) dy -= 1;
        if (keys['ArrowDown'] || keys['KeyS']) dy += 1;
        if (dx !== 0 && dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len; dy /= len;
        }
        return { dx, dy };
    }

    return {
        init, updateScale,
        getTouchDelta, isTapActive, getTapPosition,
        isTouching, getTouchGamePos,
        isKeyDown, getKeyboardDirection
    };
})();
