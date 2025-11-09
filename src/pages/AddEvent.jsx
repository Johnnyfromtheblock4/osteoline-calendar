import { useState } from "react";
import { useEvents } from "../context/EventContext";
import Popup from "../components/Popup";
import "../styles/AddEvent.css";

const AddEvent = () => {
  const { addEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [room, setRoom] = useState("");
  const [startHour, setStartHour] = useState("00");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("00");
  const [endMinute, setEndMinute] = useState("00");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Funzione per aggiornare automaticamente l'orario di fine
  const updateEndTime = (newStartHour, newStartMinute) => {
    let endH = parseInt(newStartHour, 10);
    let endM = parseInt(newStartMinute, 10);

    // Aggiungi 1 ora
    endH += 1;
    if (endH >= 24) endH = 0; // reset se va oltre le 23

    // Mantieni i minuti uguali
    setEndHour(endH.toString().padStart(2, "0"));
    setEndMinute(endM.toString().padStart(2, "0"));
  };

  const handleStartHourChange = (value) => {
    const formatted = value.padStart(2, "0");
    setStartHour(formatted);
    updateEndTime(formatted, startMinute);
  };

  const handleStartMinuteChange = (value) => {
    const formatted = value.padStart(2, "0");
    setStartMinute(formatted);
    updateEndTime(startHour, formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      title,
      date,
      room,
      color:
        room === "Stanza Fede"
          ? "#f39c12"
          : room === "Stanza Trattamenti"
          ? "#3498db"
          : room === "Palestra"
          ? "#27ae60"
          : "#aaa",
      allDay,
      startTime: `${startHour}:${startMinute}`,
      endTime: `${endHour}:${endMinute}`,
      description,
    };

    addEvent(newEvent);
    setShowPopup(true);

    // Reset campi
    setTitle("");
    setAllDay(false);
    setRoom("");
    setStartHour("00");
    setStartMinute("00");
    setEndHour("00");
    setEndMinute("00");
    setDescription("");
    setDate("");
  };

  return (
    <>
      <h1 className="add-event-title my-4 text-center">Aggiungi Evento</h1>
      <div className="add-event-container container d-flex justify-content-center align-items-center mt-4">
        <div className="add-event-box row">
          <form onSubmit={handleSubmit}>
            {/* TITOLO */}
            <div className="col-12 mb-3">
              <label className="form-label text-uppercase fw-bold text-warning">
                Titolo
              </label>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Inserisci titolo evento"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* DATA */}
            <div className="col-12 mb-3">
              <label className="form-label text-uppercase fw-bold text-warning">
                Data
              </label>
              <input
                type="date"
                className="form-control custom-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* SWITCH "Tutto il giorno" */}
            <div className="col-12 mb-3 d-flex align-items-center justify-content-between">
              <label className="form-check-label fw-bold">
                Tutto il giorno
              </label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input custom-switch"
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                />
              </div>
            </div>

            {/* STANZA */}
            <div className="col-12 mb-3">
              <label className="form-label text-uppercase fw-bold text-warning">
                Stanza
              </label>
              <select
                className="form-select"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
              >
                <option value="">Seleziona la stanza</option>
                <option value="Stanza Fede">Stanza Fede</option>
                <option value="Stanza Trattamenti">Stanza Trattamenti</option>
                <option value="Palestra">Palestra</option>
              </select>
            </div>

            {/* ORARI */}
            {!allDay && (
              <div className="col-12 mb-3">
                <label className="form-label text-uppercase fw-bold text-warning">
                  Orario
                </label>
                <div className="row">
                  <div className="col-6">
                    <div className="time-input">
                      <span>Inizio</span>
                      <div>
                        <input
                          type="number"
                          min={0}
                          max={23}
                          className="hours"
                          value={startHour}
                          onChange={(e) =>
                            handleStartHourChange(e.target.value)
                          }
                          required
                        />
                        <input
                          type="number"
                          min={0}
                          max={59}
                          className="minutes"
                          value={startMinute}
                          onChange={(e) =>
                            handleStartMinuteChange(e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="time-input text-end">
                      <span>Fine</span>
                      <div>
                        <input
                          type="number"
                          min={0}
                          max={23}
                          className="hours"
                          value={endHour}
                          onChange={(e) =>
                            setEndHour(e.target.value.padStart(2, "0"))
                          }
                          required
                        />
                        <input
                          type="number"
                          min={0}
                          max={59}
                          className="minutes"
                          value={endMinute}
                          onChange={(e) =>
                            setEndMinute(e.target.value.padStart(2, "0"))
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DESCRIZIONE (facoltativa) */}
            <div className="col-12 mb-4">
              <label className="form-label fw-bold text-warning">
                DESCRIZIONE (Facoltativa)
              </label>
              <textarea
                className="form-control custom-textarea"
                placeholder="Inserisci descrizione (Max 60 caratteri)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={60}
              ></textarea>
            </div>

            {/* BOTTONI */}
            <div className="col-12 d-flex justify-content-center align-items-center">
              <button className="event-popup-btn" type="submit">
                Aggiungi Evento
              </button>
            </div>

            {/* Popup di conferma riutilizzabile */}
            <Popup
              show={showPopup}
              title="Evento creato!"
              message="Il tuo evento è stato aggiunto correttamente al calendario."
              onClose={() => setShowPopup(false)}
              color="#ef9011"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEvent;
