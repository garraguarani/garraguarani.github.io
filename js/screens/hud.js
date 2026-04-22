/* ============================================
   GARRA GUARANÍ — HUD Controller
   Connects HTML HUD to game state
   Balanced for v18 (Weapon Selector)
   ============================================ */

const HUD = (() => {
    let healthFill = null;
    let scoreEl = null;
    let garraFill = null;
    let btnGarra = null;
    let hudEl = null;
    let weaponBtns = {};

    function init() {
        hudEl = document.getElementById('hud');
        healthFill = document.getElementById('hud-health-fill');
        scoreEl = document.getElementById('hud-score');
        garraFill = document.getElementById('hud-garra-fill');
        btnGarra = document.getElementById('btn-garra');

        const btnPause = document.getElementById('btn-pause');
        const btnRestart = document.getElementById('btn-restart');

        // Weapon buttons initialization
        const wTypes = ['basic', 'fire', 'triple', 'guided', 'bomb', 'megagol'];
        wTypes.forEach(type => {
            const btn = document.getElementById(`wbtn-${type}`);
            if (btn) {
                weaponBtns[type] = btn;
                const select = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.Game && window.Game.player) {
                        window.Game.player.selectWeapon(type);
                    }
                };
                btn.addEventListener('touchstart', select);
                btn.addEventListener('click', select);
            }
        });

        // Other buttons
        if (btnGarra) {
            const actGarra = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.Game && window.Game.player) {
                    window.Game.player.activateGarra();
                }
            };
            btnGarra.addEventListener('touchstart', actGarra);
            btnGarra.addEventListener('click', actGarra);
        }

        if (btnPause) {
            const togglePause = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.Game && window.Game.togglePause) {
                    window.Game.togglePause();
                }
            };
            btnPause.addEventListener('touchstart', togglePause);
            btnPause.addEventListener('click', togglePause);
        }

        if (btnRestart) {
            const reqRestart = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.Game && window.Game.restartCurrentLevel) {
                    window.Game.restartCurrentLevel();
                }
            };
            btnRestart.addEventListener('touchstart', reqRestart);
            btnRestart.addEventListener('click', reqRestart);
        }
    }

    function show() {
        if (hudEl) hudEl.classList.remove('hidden');
    }

    function hide() {
        if (hudEl) hudEl.classList.add('hidden');
    }

    function update(player) {
        if (!player) return;

        // Health
        if (healthFill) {
            const pct = Math.max(0, player.health / player.maxHealth * 100);
            healthFill.style.width = pct + '%';
            healthFill.style.background = pct < 30 ? '#FF0000' : '';
        }

        // Score & Meta
        if (scoreEl) scoreEl.textContent = `₲${player.score.toLocaleString()}`;

        // Garra bar
        if (garraFill) {
            const pct = Math.max(0, player.garraCharge / CONFIG.GARRA_MAX_CHARGE * 100);
            garraFill.style.width = pct + '%';
        }

        if (btnGarra) {
            btnGarra.disabled = player.garraCharge < CONFIG.GARRA_MAX_CHARGE || player.garraActive;
        }

        // --- Weapon Selector Update ---
        for (const [type, btn] of Object.entries(weaponBtns)) {
            if (type === 'megagol') {
                const hasMega = player.megaGols > 0;
                btn.classList.toggle('locked', !hasMega);
                btn.classList.toggle('mega-glow', hasMega);
                btn.disabled = !hasMega;
            } else {
                const w = player.weapons[type];
                const unlocked = w && w.unlocked;
                const active = player.selectedWeapons.includes(type);
                
                btn.classList.toggle('locked', !unlocked);
                btn.classList.toggle('active', active);
                btn.disabled = !unlocked;
            }
        }
    }

    return { init, show, hide, update };
})();
