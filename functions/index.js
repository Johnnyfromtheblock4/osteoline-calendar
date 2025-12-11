const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

exports.sendEventNotification = onDocumentCreated(
  "events/{eventId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();

    const db = getFirestore();

    // Recupera tutti gli utenti con un fcmToken
    const usersSnap = await db.collection("users").get();
    const tokens = usersSnap.docs
      .map((doc) => doc.data().fcmToken)
      .filter((t) => !!t);

    if (tokens.length === 0) {
      console.log("Nessun token disponibile");
      return;
    }

    const messaging = getMessaging();

    await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: `Nuovo evento: ${data.title}`,
        body: `${data.createdByName} ha creato un evento in ${data.room} alle ${data.startTime}`,
      },
    });

    console.log("Notifiche inviate a:", tokens.length);
  }
);
