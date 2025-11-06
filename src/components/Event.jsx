import React from "react";

const Event = () => {
  return (
    <div>
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
  );
};

export default Event;
