import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RedRoom = () => {
  const navigate = useNavigate();
  const { events, clearAllEvents } = useEvents();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Verifica ruolo admin
  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        setChecking(false);
        return;
      }
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().isAdmin === true) {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Errore verifica admin:", e);
      } finally {
        setChecking(false);
      }
    };
    checkAdmin();
  }, []);

  // Raggruppa eventi per data
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    Object.keys(map).forEach((d) => {
      map[d].sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    });
    return map;
  }, [events]);

  // Esporta tutti gli eventi e poi cancella
  const exportAllAndClear = () => {
    if (events.length === 0) {
      navigate(-1);
      return;
    }

    const docPdf = new jsPDF();
    docPdf.setFontSize(18);
    docPdf.text("Esportazione Calendario - Completo", 14, 20);

    let yCursor = 28;

    Object.entries(eventsByDate).forEach(([date, evs], idx) => {
      if (idx > 0) yCursor += 8;
      docPdf.setFontSize(14);
      docPdf.text(`Data: ${date}`, 14, yCursor);

      autoTable(docPdf, {
        startY: yCursor + 4,
        head: [["Ora Inizio", "Ora Fine", "Titolo", "Stanza", "Creato da"]],
        body: evs.map((e) => [
          e.startTime,
          e.endTime,
          e.title,
          e.room,
          e.createdByName || "Utente",
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [239, 144, 17] },
        margin: { left: 14, right: 14 },
      });

      yCursor = docPdf.lastAutoTable.finalY + 2;
    });

    // Calcolo ore totali per utente
    const totalsByUser = {};
    events.forEach((ev) => {
      const start = new Date(`${ev.date}T${ev.startTime}:00`);
      const end = new Date(`${ev.date}T${ev.endTime}:00`);
      let diff = end - start;
      if (diff < 0) diff += 24 * 60 * 60 * 1000;
      const mins = Math.floor(diff / (1000 * 60));
      const user = ev.createdByName || "Utente";
      totalsByUser[user] = (totalsByUser[user] || 0) + mins;
    });

    // Riepilogo finale (tabella per utente)
    yCursor += 10;
    docPdf.setFontSize(14);
    docPdf.text("Totale ore per utente", 14, yCursor);

    const userSummary = Object.entries(totalsByUser).map(
      ([user, totalMins]) => {
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        return [user, `${h}h ${m.toString().padStart(2, "0")}m`];
      }
    );

    autoTable(docPdf, {
      startY: yCursor + 5,
      head: [["Utente", "Totale Ore"]],
      body: userSummary,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [239, 144, 17] },
      margin: { left: 14, right: 14 },
    });

    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    docPdf.save(`Calendario_Completo_${ts}.pdf`);

    clearAllEvents();
    setShowPopup(true);
  };

  if (checking) return null;

  if (!isAdmin) {
    return (
      <div className="container py-5">
        <h2 className="text-center">Accesso negato</h2>
        <p className="text-center">
          Non hai i permessi per accedere a questa pagina.
        </p>
        <div className="text-center">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Torna indietro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-uppercase fw-bold text-center mb-4">RedRoom</h1>
      <p className="text-center mb-4">
        Clicca sul pulsante per esportare ed eliminare tutto il contenuto del
        calendario.
      </p>

      <div className="text-center mb-4">
        <button className="btn btn-danger fw-bold" onClick={exportAllAndClear}>
          Esporta tutto in PDF e pulisci
        </button>
      </div>

      <div className="text-center">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          Annulla
        </button>
      </div>

      {/* Popup statico di conferma */}
      {showPopup && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 9999,
          }}
        >
          <div
            className="bg-dark text-center p-4 rounded"
            style={{
              border: "2px solid #ef9011",
              boxShadow: "0 0 20px rgba(239,144,17,0.5)",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h4 className="text-warning mb-3">
              Ogni prova è stata eliminata, ben fatto soldato! <br /> NON MI
              AVRETE MAI!
            </h4>
            <button
              className="btn btn-warning fw-bold"
              onClick={() => navigate(-1)}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedRoom;
