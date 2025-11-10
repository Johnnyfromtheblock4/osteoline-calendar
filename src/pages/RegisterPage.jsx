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
      setPopup(true);
      setTimeout(() => {
        setPopup(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Errore nella registrazione. Prova con un'altra email.");
    }
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

      {popup && (
        <div className="popup-success">
          Registrazione avvenuta con successo!
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
