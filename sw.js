const CACHE = 'lucky7ai-v2';
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
  // Skip cross-origin requests (e.g. lucky7ai.com API calls)
  if (!e.request.url.startsWith(self.location.origin)) return;
  // Network-first so edits to cached assets (e.g. this HTML file) show up
  // immediately instead of being masked by a stale cache indefinitely.
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
