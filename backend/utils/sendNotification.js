const webPush = require('web-push');
module.exports = {
  notification: (subscription, payload, options) => {
    setTimeout(async function () {
      try {
        await webPush.sendNotification(subscription, payload, options);
      } catch (err) {
        console.error(err)
      };
    }, 2000);
  }
}
