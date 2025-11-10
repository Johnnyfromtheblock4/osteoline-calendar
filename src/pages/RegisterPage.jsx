import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setPopupVisible(true); // mostra popup di successo
    } catch (err) {
      console.error("Errore registrazione:", err);
      setError("Errore nella registrazione. Prova con un'altra email.");
    }
  };

  const handleGoToLogin = async () => {
    try {
      await signOut(auth); // esegui logout
    } catch (err) {
      console.error("Errore nel logout:", err);
    }
    setPopupVisible(false);
    navigate("/login");
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
      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-box text-center">
            <h4 className="text-success">
              ✅ Registrazione avvenuta con successo!
            </h4>
            <p className="mt-2 mb-4">
              Ora puoi accedere con le tue credenziali.
            </p>
            <button className="btn btn-warning" onClick={handleGoToLogin}>
              Torna al Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
