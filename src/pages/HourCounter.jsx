import "../styles/HourCounter.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HourCounter = () => {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [showAppointments, setShowAppointments] = useState(false);

  // Utente loggato
  const currentUser = auth.currentUser;

  // LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  // Data e mese corrente
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtra eventi del mese corrente e dell'utente loggato
  const userMonthEvents = events.filter((ev) => {
    const eventDate = new Date(ev.date);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear &&
      ev.ownerId === currentUser?.uid
    );
  });

  // Calcola ore totali per stanza (solo per l'utente)
  const roomHours = userMonthEvents.reduce((acc, ev) => {
    const start = new Date(`${ev.date}T${ev.startTime}:00`);
    const end = new Date(`${ev.date}T${ev.endTime}:00`);
    let diffHours = (end - start) / (1000 * 60 * 60);
    if (diffHours < 0) diffHours += 24;
    acc[ev.room] = (acc[ev.room] || 0) + diffHours;
    return acc;
  }, {});

  // Calcola totale generale
  const totalHours = Object.values(roomHours).reduce((sum, h) => sum + h, 0);

  // Raggruppa appuntamenti per stanza
  const groupedEvents = userMonthEvents.reduce((acc, ev) => {
    if (!acc[ev.room]) acc[ev.room] = [];
    acc[ev.room].push(ev);
    return acc;
  }, {});

  // Formatta ore senza ".0"
  const formatHours = (num) => {
    return Number.isInteger(num) ? num : num.toFixed(2).replace(/\.00$/, "");
  };

  // Funzione per esportare PDF (solo eventi dell'utente loggato)
  const handleExportPDF = () => {
    if (Object.keys(roomHours).length === 0) return;

    const doc = new jsPDF();
    const monthName = now
      .toLocaleString("it-IT", { month: "long" })
      .toUpperCase();

    const username = userMonthEvents[0]?.createdByName || "Utente";

    // Titolo
    doc.setFontSize(18);
    doc.text(`Riepilogo Ore - ${username}`, 14, 20);
    doc.setFontSize(14);
    doc.text(`${monthName} ${currentYear}`, 14, 28);

    // Ore per stanza
    doc.setFontSize(14);
    doc.text("Ore per Stanza:", 14, 40);

    const roomTable = Object.entries(roomHours).map(([room, hours]) => [
      room,
      `${formatHours(hours)} ore`,
    ]);
    roomTable.push(["Totale", `${formatHours(totalHours)} ore`]);

    autoTable(doc, {
      startY: 45,
      head: [["Stanza", "Ore Totali"]],
      body: roomTable,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [239, 144, 17] },
    });

    // Lista appuntamenti
    let y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Lista Appuntamenti", 14, y);
    y += 5;

    Object.entries(groupedEvents).forEach(([room, roomEvents]) => {
      // Colore stanza
      doc.setFontSize(12);
      doc.setTextColor(
        room === "Stanza Fede" ? 243 : room === "Stanza Trattamenti" ? 52 : 39,
        room === "Stanza Fede"
          ? 156
          : room === "Stanza Trattamenti"
          ? 152
          : 174,
        room === "Stanza Fede" ? 18 : room === "Stanza Trattamenti" ? 219 : 96
      );

      doc.text(room, 14, y + 8);

      autoTable(doc, {
        startY: y + 10,
        head: [["Data", "Titolo", "Orario"]],
        body: roomEvents.map((ev) => [
          ev.date,
          ev.title,
          `${ev.startTime} - ${ev.endTime}`,
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [239, 144, 17] },
        margin: { left: 14 },
      });

      y = doc.lastAutoTable.finalY + 10;
    });

    doc.save(`Riepilogo_${username}_${monthName}_${currentYear}.pdf`);
  };

  // Rendering
  return (
    <>
      <h1 className="hour-counter-title my-4 text-center">Profilo</h1>

      <div className="hour-counter-container container d-flex justify-content-center align-items-center mt-4">
        <div className="hour-counter-box row text-center">
          {/* CONTEGGIO ORE */}
          <div className="col-12">
            <h2 className="hour-counter-subtitle text-warning">
              Conteggio ore mese corrente
            </h2>

            {Object.keys(roomHours).length > 0 ? (
              <div className="mt-3">
                {Object.entries(roomHours).map(([room, hours]) => (
                  <p key={room} className="text-light fw-semibold">
                    {room === "Stanza Fede" && "🟠 "}
                    {room === "Stanza Trattamenti" && "🔵 "}
                    {room === "Palestra" && "🟢 "}
                    {room}:{" "}
                    <span className="text-warning">
                      {formatHours(hours)} ore
                    </span>
                  </p>
                ))}

                <hr className="my-3" />
                <p className="fw-bold text-light fs-5">
                  Totale mese:{" "}
                  <span className="text-warning">
                    {formatHours(totalHours)} ore
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-secondary">
                Nessun evento registrato da te questo mese.
              </p>
            )}

            {/* BOTTONE MOSTRA/NASCONDI LISTA */}
            {userMonthEvents.length > 0 && (
              <div className="mt-4">
                <button
                  className="btn btn-warning fw-bold"
                  onClick={() => setShowAppointments(!showAppointments)}
                >
                  {showAppointments ? "Nascondi" : "Mostra"} Lista Appuntamenti
                </button>
              </div>
            )}

            {/* LISTA APPUNTAMENTI */}
            {showAppointments && (
              <div className="appointments-list mt-4 text-start">
                {Object.entries(groupedEvents).map(([room, roomEvents]) => (
                  <div key={room} className="mb-4">
                    <h5
                      className="fw-bold text-uppercase mb-3"
                      style={{
                        color:
                          room === "Stanza Fede"
                            ? "#f39c12"
                            : room === "Stanza Trattamenti"
                            ? "#3498db"
                            : "#27ae60",
                      }}
                    >
                      {room}
                    </h5>

                    <div className="d-flex flex-column gap-2">
                      {roomEvents.map((ev, idx) => (
                        <div
                          key={idx}
                          className="appointment-card p-3 rounded"
                          style={{
                            backgroundColor:
                              room === "Stanza Fede"
                                ? "rgba(243, 156, 18, 0.15)"
                                : room === "Stanza Trattamenti"
                                ? "rgba(52, 152, 219, 0.15)"
                                : "rgba(39, 174, 96, 0.15)",
                            borderLeft: `5px solid ${
                              room === "Stanza Fede"
                                ? "#f39c12"
                                : room === "Stanza Trattamenti"
                                ? "#3498db"
                                : "#27ae60"
                            }`,
                          }}
                        >
                          <p className="mb-1 fw-bold text-light">{ev.title}</p>
                          <p className="mb-0 text-secondary small">
                            {ev.date} — {ev.startTime} / {ev.endTime}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BOTTONE ESPORTA PDF */}
            {userMonthEvents.length > 0 && (
              <div className="col-12 mt-4">
                <button
                  className="btn btn-outline-light fw-bold"
                  onClick={handleExportPDF}
                >
                  <i className="fa-solid fa-file-pdf me-2 text-danger"></i>
                  Esporta in PDF
                </button>
              </div>
            )}
          </div>

          {/* LOGOUT */}
          <div className="col-12 my-4">
            <button
              className="btn btn-danger logout-btn"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HourCounter;
