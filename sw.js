// ── ARP Inspecciones Service Worker v2026-08-04c ──
const CACHE_NAME = 'arp-v5.52';

const PRECACHE = [
  '/arp-inspecciones/',
  '/arp-inspecciones/styles.css',
  '/arp-inspecciones/index.html',
  '/arp-inspecciones/inspecciones.html',
  '/arp-inspecciones/inspeccion.html',
  '/arp-inspecciones/nueva-inspeccion.html',
  '/arp-inspecciones/resultado.html',
  '/arp-inspecciones/admin.html',
  '/arp-inspecciones/admin-cambios.html',
  '/arp-inspecciones/admin-equipos.html',
  '/arp-inspecciones/admin-tipos-equipo.html',
  '/arp-inspecciones/admin-instalaciones.html',
  '/arp-inspecciones/admin-clientes.html',
  '/arp-inspecciones/admin-config.html',
  '/arp-inspecciones/admin-empresa.html',
  '/arp-inspecciones/admin-historial.html',
  '/arp-inspecciones/ofertas.html',
  '/arp-inspecciones/oficina.html',
  '/arp-inspecciones/admin-usuarios.html',
  '/arp-inspecciones/utils.js',
  '/arp-inspecciones/manifest.json',
];

const FIREBASE_SCRIPTS = [
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js',
];

const JSPDF_SCRIPT  = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
const AUTOTABLE     = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
const SORTABLEJS    = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js';

// ── INSTALL: cachear assets propios + Firebase scripts ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Cachear páginas propias
      await cache.addAll(PRECACHE).catch(e => console.log('Precache error:', e));
      // Cachear Firebase scripts con no-cors
      for (const url of [...FIREBASE_SCRIPTS, JSPDF_SCRIPT, AUTOTABLE, SORTABLEJS]) {
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

// ── FETCH ──
self.addEventListener('fetch', event => {
  // POST y métodos no-GET nunca se cachean
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Google APIs (Firebase Auth, Firestore, Storage, etc.): siempre network
  if (url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firebaseapp.com')) {
    return;
  }

  // Páginas HTML propias: network-first → siempre obtiene la versión actual
  // Si hay fallo de red (offline), cae a caché
  if (event.request.mode === 'navigate') {
    // cache:'reload' fuerza bypass de la caché HTTP del navegador (CDN GitHub Pages)
    event.respondWith(
      fetch(event.request, { cache: 'reload' }).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() =>
        caches.match(event.request).then(cached =>
          cached || caches.match('/arp-inspecciones/index.html')
        )
      )
    );
    return;
  }

  // Scripts y assets externos: cache-first (Firebase, jsPDF nunca cambian)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request, { mode: 'no-cors' }).then(response => {
        if (response && (response.status === 200 || response.type === 'opaque')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => null);
    })
  );
});
