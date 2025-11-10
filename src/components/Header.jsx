import { useDate } from "../context/DateContext";
import "../styles/Header.css";

const Header = () => {
  const { currentDate, setCurrentDate } = useDate();

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

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);

  const handleMonthChange = (e) => {
    const newMonth = Number(e.target.value);
    setCurrentDate(new Date(currentYear, newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    setCurrentDate(new Date(newYear, currentMonth, 1));
  };

  return (
    <>
      <div className="container header mt-4">
        <div className="row mb-4 align-items-center">
          {/* LOGO */}
          <div className="col-6 col-lg-5 logo">
            <img
              src="/osteoline-calendar-logo.png"
              width="50"
              height="44"
              alt="Logo Osteoline"
            />
          </div>

          {/* TITOLO */}
          <div className="d-none d-lg-block col-lg-2 title text-center">
            <h1 className="heading">Osteoline</h1>
          </div>

          {/* MENU CALENDARIO */}
          <div className="col-6 col-lg-5 calendar-dates text-end">
            <div className="d-flex justify-content-end gap-2 align-items-center flex-wrap">
              {/* Dropdown mese */}
              <select
                className="form-select form-select-sm custom-select"
                value={currentMonth}
                onChange={handleMonthChange}
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
                value={currentYear}
                onChange={handleYearChange}
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
      <div className="border-header full-width"></div>
    </>
  );
};

export default Header;
