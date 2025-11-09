import React from "react";
import "../styles/Popup.css";

const Popup = ({ show, title, message, onClose, color = "#ef9011" }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box text-center p-4" style={{ borderColor: color }}>
        {title && <h3 className="text-warning mb-3">{title}</h3>}
        {message && <p className="text-light mb-4">{message}</p>}
        <button className="btn btn-warning fw-bold px-4" onClick={onClose}>
          Chiudi
        </button>
      </div>
    </div>
  );
};

export default Popup;
