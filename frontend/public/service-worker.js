const cacheName = 'cache-v1';
const cacheFetch = 'fetchCach';
const urls = [
  '/',
  '/index.html',
  '/iconComsistelco64.png',
  '/iconComsistelco144.png',
  '/iconComsistelco512.png',
  '/listaIcon.png',
  '/logoComsistelco.png',
  '/ticketIcon.png',
];

self.addEventListener('install', async event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(function (cache) {
        return cache.addAll(urls);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  event.respondWith(
    caches.open(cacheFetch).then(function (cache) {
      return cache.match(request).then(function (response) {
        return response || fetch(request).then(function (res) {
          if (request.method !== 'POST') {
            cache.put(request, res.clone())
          }
          return res;
        });
      });

    })
  );
});

self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.text() : 'no payload';
  event.waitUntil(
    self.registration.showNotification('Notificacion', {
      body: payload,
      icon: '/iconComsistelco512.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    })
  );
});