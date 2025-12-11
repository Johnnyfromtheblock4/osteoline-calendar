import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";
import { requestNotificationPermission } from "../notifications";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("🔥 Tentativo login...");
      await signInWithEmailAndPassword(auth, email, password);
      console.log("🔥 Login riuscito!");

      console.log("🔔 Ora richiedo permesso notifiche...");
      await requestNotificationPermission();
      console.log("🔔 Permesso notifiche richiesto!");

      navigate("/");
    } catch (err) {
      console.error("❌ Errore login:", err);
      setError("Credenziali non valide");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Accedi</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Accedi</button>
        </form>
        <p className="switch-auth">
          Non hai un account?{" "}
          <Link to="/register" className="link-text">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
