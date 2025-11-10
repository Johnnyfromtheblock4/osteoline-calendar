import "../styles/HourCounter.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const HourCounter = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Torna alla login page dopo logout
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  return (
    <>
      <h1 className="hour-counter-title my-4 text-center">Profilo</h1>
      <div className="hour-counter-container container d-flex justify-content-center align-items-center mt-4">
        <div className="hour-counter-box row text-center">
          <div className="col-12">
            <h2 className="hour-counter-subtitle text-warning">
              Conteggio ore mese corrente
            </h2>
            <p>Qui andrà il conteggio delle ore del mese corrente</p>

            <h2 className="hour-counter-subtitle text-warning mt-4">Note</h2>
            <p>
              Qui andrà una textarea con relativo pulsante “Aggiungi” che crea
              una card con data, titolo e nota, con tasti di modifica,
              eliminazione e copia.
            </p>
          </div>
          <div className="col-12 mb-4">
            <button
              className="btn btn-danger logout-btn"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-right-from-bracket me-2"></i> Esci
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HourCounter;
