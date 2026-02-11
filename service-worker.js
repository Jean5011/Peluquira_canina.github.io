const CACHE_NAME = 'petgrooming-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './Imagenes/Ico.png',
  './Imagenes/perros/perro3.avif'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  // For navigation requests, try network first then cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // For other requests, respond with cache first, then network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Put a copy in the cache for future
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // fallback could be added here
      });
    })
  );
});
