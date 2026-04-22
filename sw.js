const CACHE_NAME = 'garra-guarani-v25';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/config.js',
    '/js/main.js',
    '/js/input.js',
    '/js/renderer.js',
    '/js/entities/player.js',
    '/js/entities/enemy.js',
    '/js/entities/bullet.js',
    '/js/entities/boss.js',
    '/js/entities/powerup.js',
    '/js/systems/background.js',
    '/js/systems/audio.js',
    '/js/systems/collision.js',
    '/js/systems/pool.js',
    '/js/systems/spawner.js',
    '/js/systems/weather.js',
    '/js/systems/particle.js',
    '/js/screens/menu.js',
    '/js/screens/shop.js',
    '/js/screens/levelSelect.js',
    '/js/screens/gameOver.js',
    '/js/screens/victory.js',
    '/js/screens/hud.js',
    '/js/screens/controls.js',
    '/js/data/weapons.js',
    '/js/data/enemies.js',
    '/js/data/powerups.js',
    '/js/data/levels.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
