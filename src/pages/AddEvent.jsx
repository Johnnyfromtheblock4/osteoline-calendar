import { useState } from "react";
import { useEvents } from "../context/EventContext";
import Popup from "../components/Popup";
import "../styles/AddEvent.css";

const AddEvent = ({ defaultDate = "", onCancel }) => {
  const { events, addEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [room, setRoom] = useState("");
  const [startHour, setStartHour] = useState("00");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("01");
  const [endMinute, setEndMinute] = useState("00");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(defaultDate);

  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    title: "",
    message: "",
    color: "#ef9011",
  });

  // Aggiorna automaticamente orario di fine
  const updateEndTime = (newStartHour, newStartMinute) => {
    let endH = parseInt(newStartHour, 10);
    let endM = parseInt(newStartMinute, 10);
    endH += 1;
    if (endH >= 24) endH = 0;
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

  // Controllo conflitti
  const hasConflict = (newEvent) => {
    return events.some((ev) => {
      if (ev.date !== newEvent.date || ev.room !== newEvent.room) return false;
      if (ev.allDay || newEvent.allDay) return true;
      return ev.startTime < newEvent.endTime && newEvent.startTime < ev.endTime;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calcola data e ora dell'evento
    const eventDateTime = new Date(`${date}T${startHour}:${startMinute}:00`);
    const now = new Date();
    const hoursDiff = (eventDateTime - now) / (1000 * 60 * 60); // differenza in ore

    // Blocco se meno di 24 ore o già passato
    if (hoursDiff < 24) {
      setPopupData({
        title: "Attenzione!",
        message:
          hoursDiff < 0
            ? "Non puoi aggiungere un evento in una data o orario già passato."
            : "Non puoi aggiungere un evento che inizia tra meno di 24 ore.",
        color: "#dc3545",
      });
      setShowPopup(true);
      return;
    }

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

    if (hasConflict(newEvent)) {
      setPopupData({
        title: "Attenzione!",
        message: "La stanza è già occupata per questo orario.",
        color: "#dc3545",
      });
      setShowPopup(true);
      return;
    }

    addEvent(newEvent);

    setPopupData({
      title: "Evento creato!",
      message: "Il tuo evento è stato aggiunto correttamente al calendario.",
      color: "#ef9011",
    });
    setShowPopup(true);

    // Reset form
    setTitle("");
    setAllDay(false);
    setRoom("");
    setStartHour("00");
    setStartMinute("00");
    setEndHour("01");
    setEndMinute("00");
    setDescription("");
    setDate(defaultDate);
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

            {/* DESCRIZIONE */}
            <div className="col-12 mb-4">
              <label className="form-label fw-bold text-warning">
                Descrizione (facoltativa)
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
            <div className="col-12 d-flex justify-content-center align-items-center gap-3 mt-3">
              <button className="event-popup-btn" type="submit">
                Aggiungi Evento
              </button>

              {onCancel && (
                <button
                  type="button"
                  className="btn btn-danger px-4 btn-cancel"
                  onClick={onCancel}
                >
                  Torna Indietro
                </button>
              )}
            </div>

            {/* Popup riutilizzabile */}
            <Popup
              show={showPopup}
              title={popupData.title}
              message={popupData.message}
              onClose={() => {
                setShowPopup(false);

                // Se il popup è di successo → chiudi anche il form
                if (popupData.color === "#ef9011" && onCancel) {
                  onCancel();
                }
              }}
              color={popupData.color}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEvent;
