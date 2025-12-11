importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDkA0_ITGKyYaSNdIGANiNjAMkYUoK5Ecc",
  authDomain: "osteoline-calendario-7bb84.firebaseapp.com",
  projectId: "osteoline-calendario-7bb84",
  messagingSenderId: "1051384173267",
  appId: "1:1051384173267:web:774da087e18b7653c2ba26",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/osteoline-calendar-logo.png",
  });
});
