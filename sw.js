/* ════════════════════════════════════════════════════════════════════
   Arcanum Stellaris — Service Worker
   Hace que la app sea PWA: instalable, funcional offline.
   Estrategias:
   - Shell de la app (HTML/CSS/JS): network-first → cache fallback
     (así nuevos despliegues llegan rápido, pero offline también funciona)
   - Imágenes Wikimedia y assets pesados: cache-first (rara vez cambian)
   - Assets locales (logo, iconos): cache-first
   ════════════════════════════════════════════════════════════════════ */

const VERSION = 'arcanum-v20260507k';
const CACHE_SHELL = `${VERSION}-shell`;
const CACHE_MEDIA = `${VERSION}-media`;

// Archivos críticos del shell — se precargan al instalar el SW
const SHELL_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './cards.js',
  './cards-art.js',
  './cards-images.js',
  './logo-arcanum.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // Instala y precarga el shell. skipWaiting() activa el nuevo SW inmediatamente.
  event.waitUntil(
    caches.open(CACHE_SHELL)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('SW install: precache failed', err);
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  // Limpia versiones antiguas del cache. clients.claim() toma control de la pestaña actual.
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo manejamos GET. POST/PUT pasan al network sin tocar.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // ── Imágenes Wikimedia: cache-first, larga duración ──
  // (Cellarius backgrounds + cartas Pamela Colman Smith — son inmutables)
  if (url.hostname === 'commons.wikimedia.org' || url.hostname === 'upload.wikimedia.org') {
    event.respondWith(
      caches.open(CACHE_MEDIA).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            // Solo cachea respuestas válidas (no errores 404/500)
            if (response.ok || response.type === 'opaque') {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => cached || new Response('', { status: 504 }));
        })
      )
    );
    return;
  }

  // ── Mismo origen: network-first con fallback a cache ──
  // Permite que nuevos despliegues lleguen rápido, pero offline funciona.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cachea si la respuesta es OK y es un asset que merece estar cacheado
          if (response.ok && (
            request.destination === 'document' ||
            request.destination === 'script' ||
            request.destination === 'style' ||
            request.destination === 'image' ||
            request.destination === 'font' ||
            request.destination === 'manifest'
          )) {
            const respClone = response.clone();
            caches.open(CACHE_SHELL).then((c) => c.put(request, respClone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) =>
          cached || caches.match('./index.html')
        ))
    );
    return;
  }

  // ── Otros hosts (terceros): pasa directo, sin caché ──
});

// Mensajes desde la app (por si queremos forzar update desde el cliente)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
