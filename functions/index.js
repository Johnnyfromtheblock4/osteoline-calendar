const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendEventNotification = functions.firestore
    .document("events/{eventId}")
    .onCreate(async (snap, context) => {

        const event = snap.data();

        // fetch all users with token
        const usersSnap = await admin.firestore().collection("users").get();
        const tokens = usersSnap.docs
            .map(doc => doc.data().fcmToken)
            .filter(t => !!t);

        if (tokens.length === 0) return null;

        const payload = {
            notification: {
                title: `Nuovo evento: ${event.title}`,
                body: `${event.createdByName} ha creato un evento in ${event.room} alle ${event.startTime}`,
                icon: "/osteoline-calendar-logo.png",
            },
        };

        return admin.messaging().sendToDevice(tokens, payload);
    });
