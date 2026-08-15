const CACHE_NAME = 'hdl-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
