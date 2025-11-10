import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setPopup(true); // mostra popup
    } catch (err) {
      setError("Errore nella registrazione. Prova con un'altra email.");
    }
  };

  const handleClosePopup = () => {
    setPopup(false);
    navigate("/login"); // vai al login dopo la chiusura del popup
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Registrati</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit">Crea Account</button>
        </form>
        <p className="switch-auth">
          Hai già un account?{" "}
          <Link to="/login" className="link-text">
            Accedi
          </Link>
        </p>
      </div>

      {/* POPUP DI SUCCESSO */}
      {popup && (
        <div className="popup-overlay">
          <div className="popup-box text-center">
            <h4 className="text-success">
              ✅ Registrazione avvenuta con successo!
            </h4>
            <p className="mt-2 mb-3">
              Ora puoi effettuare il login con le tue credenziali.
            </p>
            <button className="btn btn-warning" onClick={handleClosePopup}>
              Vai al Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
