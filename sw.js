// ── ARP Inspecciones Service Worker ──
// VERSIÓN: 2.5 — actualizar este número en cada deploy
const CACHE_NAME = 'arp-v4.2';

const PRECACHE = [
  '/arp-inspecciones/',
  '/arp-inspecciones/index.html',
  '/arp-inspecciones/inspecciones.html',
  '/arp-inspecciones/inspeccion.html',
  '/arp-inspecciones/nueva-inspeccion.html',
  '/arp-inspecciones/resultado.html',
  '/arp-inspecciones/admin.html',
  '/arp-inspecciones/manifest.json',
];

const FIREBASE_SCRIPTS = [
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js',
];

const JSPDF_SCRIPT = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

// ── INSTALL: cachear assets propios + Firebase scripts ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Cachear páginas propias
      await cache.addAll(PRECACHE).catch(e => console.log('Precache error:', e));
      // Cachear Firebase scripts con no-cors
      for (const url of [...FIREBASE_SCRIPTS, JSPDF_SCRIPT]) {
        try {
          const response = await fetch(url, { mode: 'no-cors' });
          await cache.put(url, response);
        } catch(e) { console.log('Script cache error:', url, e.message); }
      }
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: limpiar caches antiguas ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: cache-first para assets, network-first para Firestore ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Firestore y Storage: siempre network (tienen su propio offline handling)
  if (url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('firebasestorage.googleapis.com') ||
      url.hostname.includes('identitytoolkit.googleapis.com') ||
      url.hostname.includes('securetoken.googleapis.com')) {
    return; // dejar pasar sin interceptar
  }

  // Cache-first para todo lo demás
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request, { mode: 'no-cors' }).then(response => {
        // Cachear respuestas válidas
        if (response && (response.status === 200 || response.type === 'opaque')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback a index.html para navegación
        if (event.request.mode === 'navigate') {
          return caches.match('/arp-inspecciones/index.html');
        }
      });
    })
  );
});
