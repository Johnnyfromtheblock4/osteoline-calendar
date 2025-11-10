import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // vai alla homepage se login riuscito
    } catch (err) {
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
