## ISTRUZIONI CALENDARIO OSTEOLINE

📜 Introduzione
Osteoline Calendario è un’applicazione web per la gestione degli appuntamenti del centro Osteoline.
Consente a più utenti di:
creare, modificare e visualizzare eventi in base alla data e alla stanza;
calcolare automaticamente le ore di lavoro per mese e per stanza;
esportare i riepiloghi in formato PDF;
gestire le operazioni di amministrazione tramite un pannello riservato (RedRoom).

🔑 Accesso e Registrazione
Gli utenti possono registrarsi tramite la pagina di registrazione (/register).
Al momento della registrazione, viene creato automaticamente un profilo:
email: indirizzo dell’utente;
username: nome scelto;
isAdmin: impostato di default su false.
Dopo la registrazione o il login (/login), si accede alla Homepage del calendario.

☰ Menù in basso
In basso nella Homepage e in tutte le altre pagine si trova un menu che permette di navigare in questo modo:
Prima icona a sinistra (calendario 📆) permette di andare al calendario principale;
Seconda icona centrale (tasto più ╋) permette di andare alla sezione Aggiungi un Evento;
Terza icona a destra (profilo 👤) permette di accedere all propria area riservata;

🏠 Homepage – Calendario principale
Funzioni principali
Mostra il calendario giornaliero con le stanze:
Stanza Fede (arancio 🟠)
Stanza Trattamenti (blu 🔵)
Palestra (verde 🟢)
Ogni giorno mostra gli appuntamenti ordinati per orario.
Pulsante “+” in alto a destra → apre il modulo per aggiungere un nuovo evento.
Pulsante Chiudi → torna alla schermata principale.

🗓 Visualizzazione giornaliera
Quando si clicca su un giorno nel calendario:
Appare il pannello dettagli giornaliero;
Vengono mostrati tutti gli appuntamenti divisi per stanza;
Se non ci sono appuntamenti, appare la frase “Nessun appuntamento per questo giorno”.

➕ Aggiunta Evento
Modulo “Aggiungi Evento”
Contiene i seguenti campi:
Campo	Descrizione
Titolo	Nome o scopo dell’appuntamento
Data	Giorno dell’appuntamento
Tutto il giorno	Opzione per eventi senza orario preciso
Stanza	"Selezione tra “Stanza Fede”, “Stanza Trattamenti”, “Palestra”"
Orario Inizio / Fine	Ora e minuti dell’evento
Descrizione	Campo opzionale (max 60 caratteri)

🤖 Logiche automatiche
Quando si imposta l’orario d’inizio, l’orario di fine viene automaticamente impostato a +1 ora.
Se l’utente cerca di creare un evento in un orario già passato, riceverà un messaggio di errore.
È possibile creare eventi anche entro 24 ore, ma non modificarli o eliminarli nelle 24 ore precedenti all’inizio.

⚔️ Conflitti
Il sistema controlla che non ci siano sovrapposizioni tra orari nella stessa stanza.
 Se esiste un conflitto, appare un messaggio d’errore:
“La stanza è già occupata per questo orario.”

🕓 Gestione degli eventi
Visualizzazione Dettagli
Cliccando su un evento:
Si apre una finestra con tutte le informazioni (titolo, orario, descrizione, utente creatore).
Se l’utente è il proprietario e mancano più di 24 ore, può:
Modificare l’evento;
Eliminare l’evento.

🚫 Restrizioni
Non si possono modificare o cancellare eventi che iniziano tra meno di 24 ore.
Non si possono aggiungere eventi nel passato.

📊 Profilo – Conteggio Ore
Ogni utente può accedere alla sezione Profilo (/HourCounter) per:
visualizzare il conteggio totale delle ore lavorate nel mese corrente;
vedere il dettaglio per stanza;
esportare un riepilogo personale in formato PDF.

💻 Funzionalità della pagina Profilo
Mostra un riepilogo delle ore per stanza:
Stanza Fede: 5h 30m
Stanza Trattamenti: 3h 15m
Totale mese: 8h 45m
Pulsante “Mostra/Nascondi Lista Appuntamenti” → apre la lista dettagliata per stanza.
Pulsante “Esporta in PDF” → genera un file PDF personale con:
ore totali per stanza;
lista appuntamenti del mese;
totale generale.

➜] Logout
Il pulsante Logout termina la sessione e riporta alla schermata di accesso.

🔐 Accesso Amministratore – RedRoom
La RedRoom è un’area segreta riservata solo agli amministratori.
Accesso
Dalla pagina Profilo, in basso sotto il pulsante Logout, si trova l’icona:
<i class="fa-solid fa-user-secret"></i>
Cliccandola, appare un popup che chiede di inserire la chiave segreta:
tommasozucchinalire
Se la chiave è corretta, si accede alla pagina RedRoom.

🧠 Funzionalità RedRoom
Contenuto
Titolo: RedRoom
Descrizione: “Clicca sul pulsante per esportare ed eliminare tutto il contenuto del calendario.”
Selezione mese
L’amministratore può:
selezionare un mese disponibile dal menu a tendina;
vedere tutti i mesi in cui ci sono eventi (es. novembre 2025, dicembre 2025);
cliccare “Esporta e Pulisci Mese” per agire solo sul mese scelto.

📥 Esportazione
Viene generato un PDF completo con:
eventi ordinati per data e orario;
autore di ogni evento;
riepilogo finale delle ore totali per ogni utente in formato tabella.

Esempio:
Totale ore per utente
-----------------------------------
Utente          Totale Ore
Simone          12h 45m
Marco           8h 15m

🗑️ Eliminazione
Dopo l’esportazione:
vengono eliminati solo gli eventi del mese selezionato;
tutti gli altri (futuri o di altri mesi) vengono mantenuti.
Popup di conferma
Dopo la cancellazione appare un messaggio:
“Ogni prova del mese selezionato è stata eliminata, ben fatto soldato!”

🧑‍💻 Gestione Amministratori (Firestore)
Per rendere un utente amministratore:
Vai in Firestore Database → collezione users.
Trova o crea il documento con l’UID dell’utente (lo trovi in Authentication).
Aggiungi o modifica il campo:
isAdmin: true
Salva.
L’utente diventa ora amministratore e può accedere alla RedRoom.

🔥 Sicurezza e regole Firestore
Regole attuali del database:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Collezione "users"
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Collezione "events"
    match /events/{eventId} {
      allow read: if true; // tutti possono leggere
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }
  }
}

📦 Struttura del Progetto
src/
├── components/
│   ├── Footer.jsx
│   ├── EventDetailPopup.jsx
│   ├── Popup.jsx
│   └── RedRoom.jsx        ← Pannello amministratore
│
├── context/
│   ├── EventContext.jsx   ← Gestione eventi
│   ├── DateContext.jsx    ← Gestione date selezionate
│
├── pages/
│   ├── Homepage.jsx       ← Calendario principale
│   ├── AddEvent.jsx       ← Aggiunta evento
│   ├── HourCounter.jsx    ← Profilo e conteggio ore
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
│
├── styles/
│   ├── DetailEventHome.css
│   ├── AddEvent.css
│   └── HourCounter.css
│
└── firebase.js            ← Configurazione Firebase

📁 File PDF generati
Utente singolo:
 Riepilogo_[NomeUtente]_[Mese]_[Anno].pdf
Admin (RedRoom):
 Calendario_[Mese]_[Anno]_[timestamp].pdf
Tutti i file PDF includono intestazione, tabelle colorate e totali in formato xh ym.

✅ Suggerimenti finali
Ogni utente può gestire solo i propri eventi.
Gli amministratori possono esportare e pulire i dati mensili.
È consigliato esportare ogni mese prima di cancellarlo, per mantenere uno storico.
Per aggiungere un nuovo admin, basta impostare isAdmin: true nel documento utente.
© Osteoline - Manuale d’uso
Versione: 1.0.0 – Novembre 2025
Sviluppato con ❤️ e React.js + Firebase.
