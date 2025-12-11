import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const requestNotificationPermission = async () => {
  console.log("🔔 requestNotificationPermission() CALLED");

  try {
    // Chiede il permesso notifica
    const permission = await Notification.requestPermission();
    console.log("🔔 Permission result:", permission);

    if (permission !== "granted") {
      console.warn("❌ Permesso notifiche NEGATO");
      return;
    }

    // Ottiene il token FCM
    console.log("🔔 Richiedo token FCM...");
    const token = await getToken(messaging, {
      vapidKey:
        "BOwUCzR_z__GxuEgovB6Aa0HsqsyY-NvkgeVsrLBa8stvEQsx0MweJ4EkvUQkVrRdfrYMAisFfNdzzKETWk2PU0",
    });

    console.log("🔔 Token ricevuto:", token);

    if (!token) {
      console.warn("❌ Impossibile ottenere il token FCM");
      return;
    }

    // Salva il token su Firestore
    const user = auth.currentUser;
    if (user) {
      console.log("🔔 Salvo token FCM su Firestore...");
      await updateDoc(doc(db, "users", user.uid), {
        fcmToken: token,
      });
    } else {
      console.warn("❌ Nessun utente loggato, impossibile salvare token");
    }

    console.log("✅ Token FCM salvato con successo:", token);
  } catch (error) {
    console.error("❌ Errore richiesta notifiche:", error);
  }
};
