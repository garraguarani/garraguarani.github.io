const CACHE_NAME = 'garra-guarani-v11';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/manifest.json'
];

// Install — cache ONLY critical skeleton, not JS (JS uses network-first)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).catch(() => {})
    );
    self.skipWaiting();
});

// Activate — clean ALL old caches
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

// Fetch — NETWORK FIRST for JS files to always get fresh code
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    // Always fetch fresh JS and assets from network
    if (url.pathname.endsWith('.js') || url.pathname.includes('/assets/')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }
    // Cache first for other assets
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
