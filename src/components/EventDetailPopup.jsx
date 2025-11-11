import { useState } from "react";
import { auth } from "../firebase";
import "../styles/EventDetailPopup.css";

const EventDetailPopup = ({ event, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showRestrictionPopup, setShowRestrictionPopup] = useState(false);
  const [restrictionMessage, setRestrictionMessage] = useState("");
  const [editedEvent, setEditedEvent] = useState({ ...event });

  // Utente loggato e controllo proprietà
  const currentUser = auth.currentUser;
  const isOwner = currentUser && currentUser.uid === event.ownerId;

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  // Calcola differenza ore tra ora e evento
  const getHoursDiff = (date, time) => {
    const eventDateTime = new Date(`${date}T${time}:00`);
    const now = new Date();
    return (eventDateTime - now) / (1000 * 60 * 60);
  };

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

  // Salvataggio modifiche con blocco 24h
  const handleSave = () => {
    const hoursDiff = getHoursDiff(editedEvent.date, editedEvent.startTime);

    if (hoursDiff < 24) {
      setRestrictionMessage(
        hoursDiff < 0
          ? "Non puoi modificare un evento già passato."
          : "Non puoi modificare un evento che inizia tra meno di 24 ore."
      );
      setShowRestrictionPopup(true);
      return;
    }

    // Aggiorna il colore in base alla stanza
    let newColor = editedEvent.color;
    if (editedEvent.room === "Stanza Fede") newColor = "#f39c12";
    else if (editedEvent.room === "Stanza Trattamenti") newColor = "#3498db";
    else if (editedEvent.room === "Palestra") newColor = "#27ae60";

    const updated = { ...editedEvent, id: event.id, color: newColor };

    // Aggiorna evento e chiudi modalità modifica
    onUpdate(updated);
    setIsEditing(false);
  };

  // Eliminazione con blocco 24h
  const handleDelete = () => {
    const hoursDiff = getHoursDiff(event.date, event.startTime);

    if (hoursDiff < 24) {
      setShowConfirmDelete(false);
      setRestrictionMessage(
        hoursDiff < 0
          ? "Non puoi eliminare un evento già passato."
          : "Non puoi eliminare un evento che inizia tra meno di 24 ore."
      );
      setShowRestrictionPopup(true);
      return;
    }

    onDelete(event);
    onClose();
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

          {/* Mostra il menu solo se l'utente è il proprietario */}
          {isOwner && (
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
          )}
        </div>

        {/* CORPO */}
        <div className="popup-body text-center mt-4">
          {isEditing ? (
            <>
              <input
                type="text"
                className="form-control mb-3"
                value={editedEvent.title}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, title: e.target.value })
                }
              />

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
              <h3 className="fw-bold mb-3">{editedEvent.title}</h3>
              <p className="mb-2">
                {editedEvent.startTime} - {editedEvent.endTime}
              </p>
              <p className="badge bg-warning text-dark">{editedEvent.room}</p>
              <p className="mt-3">
                {editedEvent.description || "Nessuna nota"}
              </p>

              <p className="text-muted mt-3">
                Creato da: <strong>{event.createdByName || "Utente"}</strong>
              </p>
            </>
          )}
        </div>

        {/* POPUP conferma eliminazione */}
        {showConfirmDelete && (
          <div className="confirm-delete-overlay">
            <div className="confirm-delete-box text-center">
              <h5>Sei sicuro di voler eliminare l’evento?</h5>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <button
                  className="btn btn-danger px-4 fw-bold"
                  onClick={handleDelete}
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

        {/* POPUP RESTRIZIONE MODIFICA/ELIMINAZIONE */}
        {showRestrictionPopup && (
          <div className="confirm-delete-overlay">
            <div className="confirm-delete-box text-center">
              <h5 className="text-warning">{restrictionMessage}</h5>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-warning fw-bold px-4"
                  onClick={() => setShowRestrictionPopup(false)}
                >
                  Chiudi
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
