import { useState } from "react";
import "../styles/Header.css";

const Header = () => {
  const months = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Genera anni
  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);

  return (
    <div className="container-fluid header">
      <div className="row d-flex justify-content-between align-items-center">
        {/* LOGO */}
        <div className="col-5 logo">
          <img
            src="/osteoline-calendar-logo.png"
            width="50"
            height="44"
            alt="Logo Osteoline"
          />
        </div>

        {/* TITOLO */}
        <div className="col-6 col-sm-2 title d-none d-lg-block text-center">
          <h1 className="heading">Osteoline</h1>
        </div>

        {/* MENU CALENDARIO */}
        <div className="col-6 col-sm-5 calendar-dates text-end">
          <div className="d-flex justify-content-end gap-2 align-items-center">
            {/* Dropdown mese */}
            <select
              className="form-select form-select-sm custom-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>

            {/* Dropdown anno */}
            <select
              className="form-select form-select-sm custom-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
