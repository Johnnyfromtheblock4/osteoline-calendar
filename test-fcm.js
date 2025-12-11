// test-fcm.js

import admin from "firebase-admin";
import fs from "fs";

// Carica la chiave privata del service account
const serviceAccount = JSON.parse(
  fs.readFileSync("./osteoline-calendario-7bb84-firebase-adminsdk-fbsvc-fbac2c6ec1.json", "utf8")
);

// Inizializza Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔥 Token FCM di Simone
const targetToken = "cI0Frf9mRG46cgdd4ETprA:APA91bHJ37i-EG1BJQHfAo7m-WVfhBzOmEwfaeAEKeMaez1KSBTGr5vahqrqrP5fJ2s-4vJTWxZxghB04xcsCOkYtV3uDxXRrYiGzaZesuagfskFq6-z8Js";

// 🔥 Notifica di test
const message = {
  token: targetToken,
  notification: {
    title: "📢 Test Notifica FCM",
    body: "Se vedi questa notifica sul tuo iPhone, tutto funziona!",
  },
  webpush: {
    fcmOptions: {
      link: "https://osteoline-calendar.netlify.app/",
    },
    notification: {
      icon: "/osteoline-calendar-logo.png",
    },
  },
};

// Invia la notifica
admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log("Notifica inviata con successo:", response);
  })
  .catch((error) => {
    console.error("Errore nell'invio della notifica:", error);
  });
