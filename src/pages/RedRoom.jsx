import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/RedRoom.css";

const RedRoom = () => {
  const navigate = useNavigate();
  const { events, clearAllEvents } = useEvents();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);

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

  // Estrae i mesi disponibili dagli eventi
  useEffect(() => {
    if (events.length > 0) {
      const months = new Set();
      events.forEach((ev) => {
        const date = new Date(ev.date);
        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        months.add(key);
      });
      setAvailableMonths([...months]);
    }
  }, [events]);

  // Raggruppa eventi per data (solo mese selezionato)
  const filteredEvents = useMemo(() => {
    if (!selectedMonth) return [];
    return events.filter((ev) => {
      const d = new Date(ev.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      return key === selectedMonth;
    });
  }, [selectedMonth, events]);

  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    Object.keys(map).forEach((d) => {
      map[d].sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    });
    return map;
  }, [filteredEvents]);

  // Esporta e cancella solo il mese selezionato
  const exportAndClearMonth = () => {
    if (!selectedMonth || filteredEvents.length === 0) {
      alert("Seleziona un mese valido con eventi.");
      return;
    }

    const docPdf = new jsPDF();
    const [year, month] = selectedMonth.split("-");
    const monthName = new Date(`${year}-${month}-01`).toLocaleString("it-IT", {
      month: "long",
    });
    docPdf.setFontSize(18);
    docPdf.text(
      `Esportazione Calendario - ${monthName.toUpperCase()} ${year}`,
      14,
      20
    );

    let yCursor = 30;

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

    // Calcolo ore totali per utente (solo mese selezionato)
    const totalsByUser = {};
    filteredEvents.forEach((ev) => {
      const start = new Date(`${ev.date}T${ev.startTime}:00`);
      const end = new Date(`${ev.date}T${ev.endTime}:00`);
      let diff = end - start;
      if (diff < 0) diff += 24 * 60 * 60 * 1000;
      const mins = Math.floor(diff / (1000 * 60));
      const user = ev.createdByName || "Utente";
      totalsByUser[user] = (totalsByUser[user] || 0) + mins;
    });

    // Tabella riepilogo finale
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

    // Esporta PDF
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    docPdf.save(`Calendario_${monthName}_${year}_${ts}.pdf`);

    // Mantiene solo eventi non del mese selezionato
    const remaining = events.filter((ev) => {
      const d = new Date(ev.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      return key !== selectedMonth;
    });
    // Pulisce e reimposta quelli rimanenti
    clearAllEvents();
    remaining.forEach((e) => events.push(e));

    setShowPopup(true);
  };

  if (checking) return null;

  if (!isAdmin) {
    return (
      <div className="container py-5 text-center">
        <h2>Accesso negato</h2>
        <p>Non hai i permessi per accedere a questa pagina.</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Torna indietro
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5 text-center">
      <h1 className="text-uppercase fw-bold mb-4">RedRoom</h1>
      <p className="mb-4">
        Seleziona un mese da esportare e cancellare. Gli altri eventi rimarranno
        intatti.
      </p>

      {/* Selezione mese */}
      <div className="mb-4">
        <select
          className="form-select w-auto mx-auto"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">-- Seleziona mese --</option>
          {availableMonths.sort().map((m) => {
            const [year, month] = m.split("-");
            const label = new Date(`${year}-${month}-01`).toLocaleString(
              "it-IT",
              {
                month: "long",
                year: "numeric",
              }
            );
            return (
              <option key={m} value={m}>
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mb-4">
        <button
          className="btn btn-danger fw-bold"
          onClick={exportAndClearMonth}
          disabled={!selectedMonth}
        >
          Esporta e Pulisci Mese
        </button>
      </div>

      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
      >
        Annulla
      </button>

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
              Ogni prova del mese selezionato è stata eliminata,
              <br />
              ben fatto soldato!
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
