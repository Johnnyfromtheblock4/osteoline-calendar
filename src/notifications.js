import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Permesso notifiche negato");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey:
        "BOwUCzR_z__GxuEgovB6Aa0HsqsyY-NvkgeVsrLBa8stvEQsx0MweJ4EkvUQkVrRdfrYMAisFfNdzzKETWk2PU0",
    });

    if (!token) {
      console.warn("Impossibile ottenere il token FCM");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        fcmToken: token,
      });
    }

    console.log("Token FCM salvato su Firestore:", token);
  } catch (error) {
    console.error("Errore richiesta notifiche:", error);
  }
};
