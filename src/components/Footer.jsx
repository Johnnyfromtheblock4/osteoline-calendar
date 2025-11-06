import "../styles/Footer.css";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  return (
    <div className="container-fluid footer-nav fixed-bottom">
      <div className="d-flex justify-content-around py-2">
        {/* Calendario */}
        <Link
          to="/"
          className={`nav-icon ${location.pathname === "/" ? "active" : ""}`}
        >
          <i className="fa-solid fa-calendar-days"></i>
        </Link>

        {/* Aggiungi evento */}
        <Link
          to="/AddEvent"
          className={`nav-icon ${
            location.pathname === "/AddEvent" ? "active" : ""
          }`}
        >
          <i className="fa-solid fa-plus"></i>
        </Link>

        {/* Profilo / Ore */}
        <Link
          to="/HourCounter"
          className={`nav-icon ${
            location.pathname === "/HourCounter" ? "active" : ""
          }`}
        >
          <i className="fa-solid fa-user"></i>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
