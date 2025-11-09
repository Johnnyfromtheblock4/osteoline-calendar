import { useState } from "react";
import { useEvents } from "../context/EventContext";
import "../styles/AddEvent.css";

const AddEvent = () => {
  const { addEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [room, setRoom] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !date) {
      alert("Inserisci almeno titolo e data!");
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

    addEvent(newEvent);
    alert("Evento aggiunto!");

    // Reset campi
    setTitle("");
    setAllDay(false);
    setRoom("");
    setStartHour("");
    setStartMinute("");
    setEndHour("");
    setEndMinute("");
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
              />
            </div>

            {/* SWITCH "Tutto il giorno" */}
            <div className="col-12 mb-3 d-flex align-items-center justify-content-between">
              <label className="form-check-label fw-bold">Tutto il giorno</label>
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
                          onChange={(e) => setStartHour(e.target.value)}
                        />
                        <input
                          type="number"
                          min={0}
                          max={59}
                          className="minutes"
                          value={startMinute}
                          onChange={(e) => setStartMinute(e.target.value)}
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
                          onChange={(e) => setEndHour(e.target.value)}
                        />
                        <input
                          type="number"
                          min={0}
                          max={59}
                          className="minutes"
                          value={endMinute}
                          onChange={(e) => setEndMinute(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DESCRIZIONE */}
            <div className="col-12 mb-4">
              <label className="form-label text-uppercase fw-bold text-warning">
                Descrizione
              </label>
              <textarea
                className="form-control custom-textarea"
                placeholder="Inserisci descrizione (Max 60 caratteri)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* BOTTONI */}
            <div className="col-12 d-flex justify-content-center align-items-center">
              <button className="event-popup-btn" type="submit">
                Aggiungi Evento
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEvent;
