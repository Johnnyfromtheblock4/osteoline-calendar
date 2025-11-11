import { useState } from "react";
import { useEvents } from "../context/EventContext";
import AddEvent from "../pages/AddEvent";
import EventDetailPopup from "../components/EventDetailPopup";
import "../styles/DetailEventHome.css";

const DetailEventHome = ({ selectedDate, onClose }) => {
  const { events, removeEvent, updateEvent } = useEvents();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Conversione data
  const dateObj = new Date(selectedDate);
  const dayOfWeek = dateObj.toLocaleDateString("it-IT", { weekday: "long" });
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString("it-IT", { month: "long" });

  // Filtra eventi del giorno
  const dayEvents = events
    .filter((ev) => ev.date === selectedDate)
    .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));

  // Funzioni di gestione evento
  const handleDeleteEvent = (eventToDelete) => {
    removeEvent(eventToDelete);
    setSelectedEvent(null);
  };

  const handleUpdateEvent = (updatedEvent) => {
    updateEvent(updatedEvent);
    setSelectedEvent(null);
  };

  // Raggruppa eventi per stanza
  const groupedEvents = {
    "Stanza Fede": dayEvents.filter((ev) => ev.room === "Stanza Fede"),
    "Stanza Trattamenti": dayEvents.filter(
      (ev) => ev.room === "Stanza Trattamenti"
    ),
    Palestra: dayEvents.filter((ev) => ev.room === "Palestra"),
  };

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
              className="btn btn-warning btn-add"
              onClick={() => setShowAddForm(true)}
              title="Aggiungi evento"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
            <button className="btn btn-danger btn-back" onClick={onClose}>
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
                <p className="text-center fs-5">
                  Nessun appuntamento per questo giorno.
                </p>
              ) : (
                Object.entries(groupedEvents).map(([roomName, roomEvents]) => (
                  <div key={roomName} className="room-section mb-5">
                    {/* Titolo stanza */}
                    <h4 className="text-uppercase fw-bold text-warning mb-3 text-center">
                      {roomName}
                    </h4>

                    {roomEvents.length === 0 ? (
                      <p className="text-center">
                        Nessun evento in questa stanza.
                      </p>
                    ) : (
                      roomEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="event-card p-3 mb-3 text-white"
                          onClick={() => setSelectedEvent(ev)}
                          style={{
                            backgroundColor: ev.color,
                            borderRadius: "10px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            cursor: "pointer",
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
                                <p className="small mt-1 mb-0">
                                  {ev.description}
                                </p>
                              )}
                            </div>

                            {/* Nome utente creatore */}
                            <div className="event-user text-end ms-3">
                              <span className="badge bg-dark px-2 py-1">
                                {ev.createdByName || "Utente"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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

      {/* Popup dettagli evento */}
      {selectedEvent && (
        <EventDetailPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
          onUpdate={handleUpdateEvent}
        />
      )}
    </div>
  );
};

export default DetailEventHome;
