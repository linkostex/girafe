// Cache-first SW for Giraffe Dash (music build)
const CACHE = 'giraffe-dash-music-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      try{
        const copy = res.clone();
        if (e.request.method==='GET' && copy.ok) caches.open(CACHE).then(c => c.put(e.request, copy));
      }catch(_){}
      return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
