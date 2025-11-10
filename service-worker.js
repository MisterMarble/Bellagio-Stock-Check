const CACHE_NAME = 'bellagio-cache-v4'; // bump when you deploy
const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for same-origin so updates appear immediately
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // For cross-origin, just try network, fall back to cache
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
