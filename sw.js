const CACHE_NAME = 'arp-inspecciones-v3';
const ASSETS = [
  '/arp-inspecciones/',
  '/arp-inspecciones/index.html',
  '/arp-inspecciones/inspecciones.html',
  '/arp-inspecciones/nueva-inspeccion.html',
  '/arp-inspecciones/inspeccion.html',
  '/arp-inspecciones/resultado.html',
  '/arp-inspecciones/manifest.json',
  '/arp-inspecciones/sw.js'
];

// Instalar y precachear todos los ficheros
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activar y limpiar caches viejas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Offline first — cache luego red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Cachear dinamicamente lo que se va visitando
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Sin conexion y sin cache — devolver index
        return caches.match('/arp-inspecciones/index.html');
      });
    })
  );
});
