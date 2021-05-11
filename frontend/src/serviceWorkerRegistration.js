async function displayNotification() {
  if (Notification.permission === 'granted') {
    const registration = await navigator.serviceWorker.getRegistration();
    const options = {
      body: 'Here is a notification body!',
      icon: '/iconComsistelco512.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    return registration.showNotification('Desea recibir notificaciones', options);
  }
}

async function subscribeUser() {
  if ('serviceWorker' in navigator) {
    try {
      const ready = await navigator.serviceWorker.ready;
      await ready.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BIm6BvFNq5AxS4O3pUrrQjr2t3U8yKVOIvPvXd_NFhZv1ZQcT-nltoSBJ0PbOh6NR4QVc2Dd69Nl6mxgYAJaOzA'
      });
    } catch (err) {
      if (Notification.permission === 'denied') {
        console.warn('Permission for notifications was denied')
      } else {
        console.error('Unable to subscribe to push', err);
      }
    }
  }

}

export default async function registerW() {
  if ('serviceWorker' in navigator) {
    try {
      const register = await navigator.serviceWorker.register('/service-worker.js');
      const subscription = await register.pushManager.getSubscription();
      if (subscription === null) {
        console.log('Not subscribed to push service!');
      }

      displayNotification();
      subscribeUser()
    } catch (err) {
      console.log('Service Worker registration failed: ', err)
    }
  }
}