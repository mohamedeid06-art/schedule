const CACHE_NAME = 'cufe-me1-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => {
        if (k !== CACHE_NAME) {
          return caches.delete(k);
        }
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // تجاهل أي طلب مش GET أو أي رابط خارجي مش تابع لنفس النطاق (زي Google Drive)
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(e.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
