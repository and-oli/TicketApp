const cacheName = 'cache-v1';
const cacheFetch = 'fetchCach'
const urls = [
  '/',
  '/index.html',
  '/iconComsistelco64.png',
  '/iconComsistelco144.png',
  '/iconComsistelco512.png',
  '/listaIcon.png',
  '/logoComsistelco.png',
  '/ticketIcon.png',
]
self.addEventListener('install', async event => {
  const evento = event.waitUntil(
    caches.open(cacheName)
      .then(function (cache) {
        return cache.addAll(urls);
      })
  );
  console.log(evento)
  return evento
});

self.addEventListener('activate', event => {
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  event.respondWith(
    caches.open(cacheFetch).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('notificationclick', function (e) {
  var notification = e.notification;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('http://localhost:3000');
    notification.close();
  }
});