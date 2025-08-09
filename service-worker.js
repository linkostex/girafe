// Simple cache-first SW for Giraffe Dash
const CACHE_NAME = 'giraffe-dash-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE_NAME && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      // Optionally: cache new GET responses
      try{
        const copy = res.clone();
        if (req.method === 'GET' && copy.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
      }catch(e){}
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
