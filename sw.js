const CACHE_NAME = 'garra-guarani-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/config.js',
    '/js/input.js',
    '/js/main.js',
    '/js/renderer.js',
    '/js/systems/pool.js',
    '/js/systems/background.js',
    '/js/systems/audio.js',
    '/js/systems/particle.js',
    '/js/systems/collision.js',
    '/js/systems/spawner.js',
    '/js/data/weapons.js',
    '/js/data/enemies.js',
    '/js/data/powerups.js',
    '/js/data/levels.js',
    '/js/entities/bullet.js',
    '/js/entities/enemy.js',
    '/js/entities/boss.js',
    '/js/entities/powerup.js',
    '/js/entities/player.js',
    '/js/screens/menu.js',
    '/js/screens/shop.js',
    '/js/screens/levelSelect.js',
    '/js/screens/gameOver.js',
    '/js/screens/victory.js',
    '/js/screens/hud.js',
    '/manifest.json'
];

// Install — cache all assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch — cache first, network fallback
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
