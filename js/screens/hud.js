/* ============================================
   GARRA GUARANÍ — HUD Controller
   Connects HTML HUD to game state
   ============================================ */

const HUD = (() => {
    let healthFill = null;
    let scoreEl = null;
    let megaEl = null;
    let garraFill = null;
    let btnGarra = null;
    let btnWeapon = null;
    let hudEl = null;

    function init() {
        hudEl = document.getElementById('hud');
        healthFill = document.getElementById('hud-health-fill');
        scoreEl = document.getElementById('hud-score');
        megaEl = document.getElementById('hud-mega');
        garraFill = document.getElementById('hud-garra-fill');
        btnGarra = document.getElementById('btn-garra');
        btnWeapon = document.getElementById('btn-weapon');

        let btnPause = document.getElementById('btn-pause');
        let btnRestart = document.getElementById('btn-restart');

        // Button events
        if (btnGarra) {
            btnGarra.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.Game && window.Game.player) {
                    window.Game.player.activateGarra();
                }
            });
        }

        if (btnWeapon) {
            btnWeapon.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.Game && window.Game.player) {
                    window.Game.player.cycleSelectableWeapon();
                    _updateWeaponBtn(window.Game.player);
                }
            });
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
            if (pct < 30) {
                healthFill.style.background = '#FF0000';
            } else {
                healthFill.style.background = '';
            }
        }

        // Score
        if (scoreEl) {
            scoreEl.textContent = `₲${player.score.toLocaleString()}`;
        }

        // Mega Gols
        if (megaEl) {
            megaEl.textContent = `🏆×${player.megaGols}`;
        }

        // Garra bar
        if (garraFill) {
            const pct = Math.max(0, player.garraCharge / CONFIG.GARRA_MAX_CHARGE * 100);
            garraFill.style.width = pct + '%';
        }

        // Garra button enabled
        if (btnGarra) {
            btnGarra.disabled = player.garraCharge < CONFIG.GARRA_MAX_CHARGE || player.garraActive;
        }

        // Weapon button
        _updateWeaponBtn(player);
    }

    function _updateWeaponBtn(player) {
        if (!btnWeapon) return;
        const selW = WEAPON_TYPES[player.selectedWeapon];
        if (selW) {
            btnWeapon.textContent = selW.emoji;
        }
    }

    return { init, show, hide, update };
})();
