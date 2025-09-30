
const CACHE_NAME = 'vin-check-v1.1'; // Add version number

self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/icon-192.png',
          '/icon-512.png',
          '/apple-touch-icon.png',
          '/favicon.ico',
          '/favicon.svg',
          '/favicon-96x96.png'
        ]);
      })
    );
    // Force the waiting service worker to become active
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    // Force clients to update to the new version
    e.waitUntil(clients.claim());
    
    // Clean up old caches
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});

