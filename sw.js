const CACHE_NAME = 'arp-inspecciones-v1';
const ASSETS = [
  '/arp-inspecciones/',
  '/arp-inspecciones/index.html',
  '/arp-inspecciones/manifest.json',
  '/arp-inspecciones/css/app.css',
  '/arp-inspecciones/js/app.js'
];

// Instalar y cachear
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// Activar y limpiar caches viejas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    )
  );
});

// Interceptar peticiones - offline first
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
  );
});
