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

self.addEventListener('install', event => {
  const instalar = async () => {
    const cache = await caches.open(cacheName);
    const cacheAdd = await cache.addAll(urls);
    return cacheAdd;
  }
  event.waitUntil(instalar());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const noPost = request.method !== 'POST';
  const onLine = navigator.onLine;
  const cacheMatch = async () => {
    if (onLine) {
      const response = await fetch(request);
      const cache = await caches.open(cacheFetch);
      if (noPost) {
        await cache.put(request, response.clone());
      }
      return response;
    } else {
      const responseCaches = await caches.match(request);
      return responseCaches;
    }
  };
  event.respondWith(cacheMatch());
});

self.addEventListener("pushsubscriptionchange", async event => {
  const subscription = await swRegistration.pushManager
    .subscribe(event.oldSubscription.options);
  const header = {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
    })
  };
  const resFetch = await fetch('http://192.168.1.39:3001/notification/register', header);
  event.waitUntil(resFetch);
}, false)

self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.json() : 'no payload';
  const notificacion = () => self.registration.showNotification(payload.title, {
    body: payload.text,
    icon: '/iconComsistelco512.png',
    badge: '/iconComsistelco128.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: payload.url,
    },
    actions: [{ action: 'open', title: "Abrir en el navegador" }],
  })
  event.waitUntil(notificacion());
});

self.addEventListener('notificationclick', function (event) {
  if (!event.action) {
    return;
  }
  switch (event.action) {
    case 'open':
      clients.openWindow(event.notification.data.url);
      break;
  }
});