import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    // 1) Controllo supporto base
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("Questo browser non supporta le Notification API");
      alert("Questo browser non supporta le notifiche push.");
      return;
    }

    console.log("🔔 Stato permesso iniziale:", Notification.permission);

    // 2) Se è già DENIED, Safari/Chrome non mostrerà più il popup
    if (Notification.permission === "denied") {
      console.warn("Permesso notifiche già NEGATO.");
      alert(
        "Hai già negato le notifiche per questo sito.\n" +
          "Per riattivarle vai nelle impostazioni di Safari > Notifiche."
      );
      return;
    }

    // 3) Chiedo il permesso
    const permission = await Notification.requestPermission();
    console.log("🔔 Risultato richiesta permessi:", permission);
    alert("Risultato richiesta permessi: " + permission);

    if (permission !== "granted") {
      console.warn("Permesso notifiche NON concesso:", permission);
      return;
    }

    // 4) Ottengo il token da FCM
    const token = await getToken(messaging, {
      vapidKey:
        "BOwUCzR_z__GxuEgovB6Aa0HsqsyY-NvkgeVsrLBa8stvEQsx0MweJ4EkvUQkVrRdfrYMAisFfNdzzKETWk2PU0",
    });

    console.log("🔑 Token ricevuto da FCM:", token);

    if (!token) {
      console.warn("Impossibile ottenere il token FCM");
      alert("Impossibile ottenere il token FCM (token vuoto).");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.warn("Nessun utente loggato, non salvo il token.");
      alert("Nessun utente loggato, token NON salvato.");
      return;
    }

    await updateDoc(doc(db, "users", user.uid), {
      fcmToken: token,
    });

    console.log("✅ Token FCM salvato su Firestore:", token);
    alert("Token FCM salvato su Firestore!");
  } catch (error) {
    console.error("Errore richiesta notifiche:", error);
    alert("Errore durante la richiesta notifiche:\n" + error.message);
  }
};
