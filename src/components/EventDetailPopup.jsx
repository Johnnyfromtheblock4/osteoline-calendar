import { useState } from "react";
import "../styles/EventDetailPopup.css";

const EventDetailPopup = ({ event, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editedEvent, setEditedEvent] = useState({ ...event });

  // Genera le opzioni per ore e minuti
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  // Aggiorna orario fine (+1h automatico)
  const handleStartChange = (hour, minute) => {
    const newStart = `${hour}:${minute}`;
    let endHour = (parseInt(hour) + 1) % 24;
    const newEnd = `${String(endHour).padStart(2, "0")}:${minute}`;

    setEditedEvent({
      ...editedEvent,
      startTime: newStart,
      endTime: newEnd,
    });
  };

  // Salva modifiche → aggiorna e torna alla schermata principale
  const handleSave = () => {
    if (!editedEvent.title.trim())
      return alert("Il titolo non può essere vuoto.");

    let newColor = editedEvent.color;
    if (editedEvent.room === "Stanza Fede") newColor = "#f39c12";
    else if (editedEvent.room === "Stanza Trattamenti") newColor = "#3498db";
    else if (editedEvent.room === "Palestra") newColor = "#27ae60";

    const updated = { ...editedEvent, color: newColor };
    onUpdate(updated); // aggiorna nel context
    setIsEditing(false);
    onClose(); // chiude il popup esattamente come "Torna indietro"
  };

  return (
    <div className="event-detail-popup-overlay">
      <div className="event-detail-popup">
        {/* HEADER */}
        <div className="popup-header d-flex justify-content-between align-items-center">
          <button className="btn back-btn" onClick={onClose}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <div className="popup-center-icon">
            <i className="fa-solid fa-user fa-lg"></i>
          </div>

          <div className="dropdown">
            <button className="btn options-btn" data-bs-toggle="dropdown">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setIsEditing(true)}
                >
                  Modifica
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => setShowConfirmDelete(true)}
                >
                  Elimina
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* CORPO */}
        <div className="popup-body text-center mt-4">
          {isEditing ? (
            <>
              {/* Titolo */}
              <input
                type="text"
                className="form-control mb-3"
                value={editedEvent.title}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, title: e.target.value })
                }
              />

              {/* Orari */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="small text-warning">Inizio</label>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select"
                      value={editedEvent.startTime.split(":")[0]}
                      onChange={(e) =>
                        handleStartChange(
                          e.target.value,
                          editedEvent.startTime.split(":")[1]
                        )
                      }
                    >
                      {hours.map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      className="form-select"
                      value={editedEvent.startTime.split(":")[1]}
                      onChange={(e) =>
                        handleStartChange(
                          editedEvent.startTime.split(":")[0],
                          e.target.value
                        )
                      }
                    >
                      {minutes.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-6">
                  <label className="small text-warning">Fine</label>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select"
                      value={editedEvent.endTime.split(":")[0]}
                      onChange={(e) =>
                        setEditedEvent({
                          ...editedEvent,
                          endTime: `${e.target.value}:${
                            editedEvent.endTime.split(":")[1]
                          }`,
                        })
                      }
                    >
                      {hours.map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      className="form-select"
                      value={editedEvent.endTime.split(":")[1]}
                      onChange={(e) =>
                        setEditedEvent({
                          ...editedEvent,
                          endTime: `${editedEvent.endTime.split(":")[0]}:${
                            e.target.value
                          }`,
                        })
                      }
                    >
                      {minutes.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Stanza */}
              <select
                className="form-select mb-3"
                value={editedEvent.room}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, room: e.target.value })
                }
              >
                <option value="Stanza Fede">Stanza Fede</option>
                <option value="Stanza Trattamenti">Stanza Trattamenti</option>
                <option value="Palestra">Palestra</option>
              </select>

              {/* Descrizione */}
              <textarea
                className="form-control mb-3"
                value={editedEvent.description}
                onChange={(e) =>
                  setEditedEvent({
                    ...editedEvent,
                    description: e.target.value,
                  })
                }
              ></textarea>

              <div className="d-flex justify-content-center gap-3 mt-3">
                <button
                  className="btn btn-warning px-4 fw-bold"
                  onClick={handleSave}
                >
                  Salva
                </button>
                <button
                  className="btn btn-secondary px-4 fw-bold"
                  onClick={() => setIsEditing(false)}
                >
                  Annulla
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="fw-bold mb-3">{event.title}</h3>
              <p className="mb-2">
                {event.startTime} - {event.endTime}
              </p>
              <p className="badge bg-warning text-dark">{event.room}</p>
              <p className="mt-3">{event.description || "Nessuna nota"}</p>
            </>
          )}
        </div>

        {/* Conferma eliminazione */}
        {showConfirmDelete && (
          <div className="confirm-delete-overlay">
            <div className="confirm-delete-box text-center">
              <h5>Sei sicuro di voler eliminare l’evento?</h5>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <button
                  className="btn btn-danger px-4 fw-bold"
                  onClick={() => {
                    onDelete(event);
                    onClose();
                  }}
                >
                  Conferma
                </button>
                <button
                  className="btn btn-secondary px-4 fw-bold"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPopup;
