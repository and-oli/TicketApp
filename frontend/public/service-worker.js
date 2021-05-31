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

// self.addEventListener('fetch', async (event) => {
//   const request = event.request;
//   event.respondWith(
//     caches.match(request)
//       .then(function (response) {
//         return response ||
//           fetch(request)
//             .then(function (res) {
//               return caches.open(cacheFetch)
//                 .then(function (cache) {
//                   if (request.method !== 'POST') {
//                     cache.put(request, res.clone())
//                   }
//                   return res;
//                 })
//             });
//       })
//   );
// });

self.addEventListener("pushsubscriptionchange", event => {
  event.waitUntil(swRegistration.pushManager.subscribe(event.oldSubscription.options)
    .then(subscription => {
      return fetch('http://192.168.1.39:3001/notification/register', {
        method: "post",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      });
    })
  );
}, false)

self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.text() : 'no payload';
  console.log(payload)
  event.waitUntil(
    self.registration.showNotification('TiketApp', {
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