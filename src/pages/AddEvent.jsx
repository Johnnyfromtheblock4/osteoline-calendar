import "../styles/AddEvent.css";

const AddEvent = () => {
  return (
    <div>
      <div className="events col-12 col-md-6">
        <div className="event-popup">
          <div className="time-input">
            <div className="event-popup-time">Ora</div>
            <input
              type="number"
              name="hours"
              min={0}
              max={24}
              className="hours"
            />
            <input
              type="number"
              name="minutes"
              min={0}
              max={60}
              className="minutes"
            />
          </div>
          <textarea placeholder="Inserisci la descrizione dell'evento (Max 60 caratteri"></textarea>
          <button className="event-popup-btn">Add Event</button>
          <button className="close-event-popup-btn">
            <i className="bx bx-x"></i>
          </button>
        </div>
        <div className="event">
          <div className="event-date-warapper">
            <div className="event-date">15 Maggio 2025</div>
            <div className="event-time">10:00</div>
          </div>
          <div className="event-text">Appuntamento Visconti</div>
          <div className="event-buttons">
            <i className="bx bxs-edit alt"></i>
            <i className="bx bxs-message-alt-x"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
