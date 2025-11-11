import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Homepage from "./pages/Homepage";
import AddEvent from "./pages/AddEvent";
import HourCounter from "./pages/HourCounter";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { EventProvider } from "./context/EventContext";
import { DateProvider } from "./context/DateContext";
import RedRoom from "./pages/RedRoom"; // Nuova pagina segreta admin

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <EventProvider>
        <DateProvider>
          <div className="app-wrapper">
            <Routes>
              {/* Accesso controllato */}
              <Route
                path="/"
                element={user ? <Homepage /> : <Navigate to="/login" />}
              />
              <Route
                path="/AddEvent"
                element={user ? <AddEvent /> : <Navigate to="/login" />}
              />
              <Route
                path="/HourCounter"
                element={user ? <HourCounter /> : <Navigate to="/login" />}
              />
              {/* Pagina Admin */}
              <Route
                path="/redroom"
                element={user ? <RedRoom /> : <Navigate to="/login" />}
              />
              {/* Autenticazione */}
              <Route
                path="/login"
                element={!user ? <LoginPage /> : <Navigate to="/" />}
              />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>

            {user && <Footer />}
          </div>
        </DateProvider>
      </EventProvider>
    </BrowserRouter>
  );
};

export default App;
