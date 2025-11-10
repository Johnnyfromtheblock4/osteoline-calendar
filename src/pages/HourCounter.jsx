import "../styles/HourCounter.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import { useState } from "react";

const HourCounter = () => {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [showAppointments, setShowAppointments] = useState(false);

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

  // 🔹 Filtra eventi del mese corrente
  const currentMonthEvents = events.filter((ev) => {
    const eventDate = new Date(ev.date);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  });

  // Calcola ore totali per stanza
  const roomHours = currentMonthEvents.reduce((acc, ev) => {
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
  const groupedEvents = currentMonthEvents.reduce((acc, ev) => {
    if (!acc[ev.room]) acc[ev.room] = [];
    acc[ev.room].push(ev);
    return acc;
  }, {});

  // Funzione per formattare le ore senza .0
  const formatHours = (num) => {
    return Number.isInteger(num) ? num : num.toFixed(2).replace(/\.00$/, "");
  };

  return (
    <>
      <h1 className="hour-counter-title my-4 text-center">Profilo</h1>

      <div className="hour-counter-container container d-flex justify-content-center align-items-center mt-4">
        <div className="hour-counter-box row text-center">
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
                Nessun evento registrato questo mese.
              </p>
            )}

            {/* Bottone toggle lista */}
            {currentMonthEvents.length > 0 && (
              <div className="mt-4">
                <button
                  className="btn btn-warning fw-bold"
                  onClick={() => setShowAppointments(!showAppointments)}
                >
                  {showAppointments ? "Nascondi" : "Mostra"} Lista Appuntamenti
                </button>
              </div>
            )}

            {/* Lista Appuntamenti */}
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

            <h2 className="hour-counter-subtitle text-warning mt-4">Note</h2>
            <p>
              Qui andrà una textarea con relativo pulsante “Aggiungi” che crea
              una card con data, titolo e nota, con tasti di modifica,
              eliminazione e copia.
            </p>
          </div>

          <div className="col-12 mb-4">
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
