const CACHE_NAME = 'arp-inspecciones-v4';

// Ficheros propios de la app
const APP_ASSETS = [
  '/arp-inspecciones/',
  '/arp-inspecciones/index.html',
  '/arp-inspecciones/inspecciones.html',
  '/arp-inspecciones/nueva-inspeccion.html',
  '/arp-inspecciones/inspeccion.html',
  '/arp-inspecciones/resultado.html',
  '/arp-inspecciones/manifest.json',
  '/arp-inspecciones/sw.js'
];

// Scripts externos — se cachean con modo 'no-cors' (tipo opaque)
// CRÍTICO: sin esto, Firebase no está disponible offline
const EXTERNAL_ASSETS = [
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'
];

// Instalar: cachear todo, incluyendo Firebase
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Cachear assets propios
      await cache.addAll(APP_ASSETS);

      // Cachear scripts externos con no-cors (devuelven respuesta opaque pero sirven offline)
      await Promise.all(
        EXTERNAL_ASSETS.map(url =>
          fetch(new Request(url, { mode: 'no-cors' }))
            .then(response => cache.put(url, response))
            .catch(() => console.log('[SW] No se pudo precargar:', url))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activar: limpiar caches viejas
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

// Fetch: cache primero, luego red
self.addEventListener('fetch', e => {
  // Ignorar peticiones que no sean GET
  if (e.request.method !== 'GET') return;

  // Ignorar peticiones a Firestore/Auth en tiempo real (no cachear datos, solo scripts)
  const url = e.request.url;
  if (url.includes('firestore.googleapis.com') ||
      url.includes('identitytoolkit.googleapis.com') ||
      url.includes('securetoken.googleapis.com')) {
    return; // Dejar pasar sin interceptar
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        if (!response || response.status !== 200) return response;

        // Cachear dinámicamente assets propios (type basic) y externos (type opaque/cors)
        const type = response.type;
        if (type === 'basic' || type === 'cors' || type === 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Sin conexión y sin caché — devolver index como fallback
        return caches.match('/arp-inspecciones/index.html');
      });
    })
  );
});
