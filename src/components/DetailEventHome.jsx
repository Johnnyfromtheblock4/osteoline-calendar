import { useState } from "react";
import { useEvents } from "../context/EventContext";
import AddEvent from "../pages/AddEvent";
import "../styles/DetailEventHome.css";

const DetailEventHome = ({ selectedDate, onClose }) => {
  const { events } = useEvents();
  const [showAddForm, setShowAddForm] = useState(false);

  // Conversione data
  const dateObj = new Date(selectedDate);
  const dayOfWeek = dateObj.toLocaleDateString("it-IT", { weekday: "long" });
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString("it-IT", { month: "long" });

  // Filtra eventi del giorno
  const dayEvents = events
    .filter((ev) => ev.date === selectedDate)
    .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));

  return (
    <div className="detail-event-overlay">
      <div className="detail-event-container container-fluid">
        {/* Header */}
        <div className="detail-header d-flex justify-content-between align-items-center p-3">
          <div className="date-info">
            <h2 className="text-uppercase m-0 fw-bold">
              {dayOfWeek} {dayNum} {monthName}
            </h2>
          </div>
          <div className="actions d-flex align-items-center gap-3">
            <button
              className="btn btn-warning rounded-circle"
              onClick={() => setShowAddForm(true)}
              title="Aggiungi evento"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
            <button className="btn btn-danger" onClick={onClose}>
              Chiudi
            </button>
          </div>
        </div>

        {/* Se è aperto il form, mostralo */}
        {showAddForm ? (
          <div className="add-event-section mt-4">
            <AddEvent
              defaultDate={selectedDate}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        ) : (
          <>
            {/* Elenco Eventi */}
            <div className="events-list mt-4 px-3 mb-5">
              {dayEvents.length === 0 ? (
                <p className="text-center text-muted">
                  Nessun evento per questo giorno.
                </p>
              ) : (
                dayEvents.map((ev, index) => (
                  <div
                    key={index}
                    className="event-card p-3 mb-3 text-white"
                    style={{
                      backgroundColor: ev.color,
                      borderRadius: "10px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      {/* Orari */}
                      <div className="event-time text-center me-3">
                        <div className="fw-bold">{ev.startTime}</div>
                        <div className="small">{ev.endTime}</div>
                      </div>

                      {/* Separatore verticale */}
                      <div className="separator-vertical mx-3"></div>

                      {/* Info evento */}
                      <div className="event-info flex-grow-1">
                        <h5 className="m-0">{ev.title}</h5>
                        {ev.description && (
                          <p className="small mt-1 mb-0">{ev.description}</p>
                        )}
                      </div>

                      {/* Icona utente a destra */}
                      <i className="fa-solid fa-user fa-lg ms-3"></i>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottone Chiudi in fondo */}
            <div className="text-center mb-4">
              <button className="btn btn-danger px-4" onClick={onClose}>
                Chiudi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailEventHome;
