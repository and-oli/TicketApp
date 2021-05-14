const express = require('express');
const router = express.Router();
const webPush = require('web-push');

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token'
  );
  next();
});

router.get('/vapidPublicKey', function (req, res) {
  let vapid = {};
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    vapid = webPush.generateVAPIDKeys();
    process.env.VAPID_PUBLIC_KEY = vapid.publicKey
    process.env.VAPID_PRIVATE_KEY = vapid.privateKey
    console.log(vapid)
  }
  // Set the keys used for encrypting the push messages.
  webPush.setVapidDetails(
    'https://serviceworke.rs/',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  res.json({ vapidKey: process.env.VAPID_PUBLIC_KEY, ok: true });

});

router.post('/register', function (req, res) {
  res.sendStatus(201);
});

router.post('/sendNotification', function (req, res) {
  const subscription = req.body.subscription;
  const payload = req.body.payload;
  const options = {
    ...req.body.options,
    TTL: req.body.ttl
  };
  setTimeout(async function () {
    try {
      await webPush.sendNotification(subscription, payload, options);
      res.json({ ok: true });
    } catch (err) {
      console.error(err)
      res.json({ ok: false });
    };
  },
    req.body.delay);
});

module.exports = router