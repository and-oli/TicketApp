export async function notificationWorker() {
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    const urlBase64ToUint8Array = (base64String) => {
      var padding = '='.repeat((4 - base64String.length % 4) % 4);
      var base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      var rawData = window.atob(base64);
      var outputArray = new Uint8Array(rawData.length);

      for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    const renderSubscription = async () => {
      const ready = await navigator.serviceWorker.ready;
      const subscription = await ready.pushManager.getSubscription();
      const response = await fetch('http://192.168.1.39:3001/notification/vapidPublicKey');
      const vapidPublicKey = await response.json();
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey.vapidKey);
      if (subscription) {
        return subscription
      }
      const subs = await ready.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
      return subs
    };

    const subscriptionVerify = await renderSubscription();

    fetch('http://192.168.1.39:3001/notification/register', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        subscription: subscriptionVerify
      }),
    }).catch(err => console.log(err))
  };
};



export default function registerW() {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
  }
};