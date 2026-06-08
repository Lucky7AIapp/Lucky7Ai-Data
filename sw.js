const CACHE = 'lucky7ai-v1';
const ASSETS = [
  '/Lucky7Ai-Data/number-generator.html',
  '/Lucky7Ai-Data/manifest.json',
  '/Lucky7Ai-Data/icon-192.png',
  '/Lucky7Ai-Data/icon-512.png',
  '/Lucky7Ai-Data/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
