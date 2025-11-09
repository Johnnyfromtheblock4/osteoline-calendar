import { useState, useEffect } from "react";
import { useEvents } from "../context/EventContext";
import "../styles/CalendarApp.css";
import Header from "./Header";

const CalendarApp = () => {
  const { events } = useEvents();

  const daysOfWeek = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  const monthsOfYear = [
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

  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysArray = Array(offset).fill(null);

    for (let i = 1; i <= totalDays; i++) daysArray.push(i);
    setDaysInMonth(daysArray);
  }, [currentDate]);

  const today = new Date();

  const prevMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  // Ordina e filtra gli eventi per giorno
  const getEventsForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];

    return events
      .filter((ev) => ev.date === dateStr)
      .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
  };

  return (
    <>
      <Header />
      <div className="calendar-app container-fluid my-5">
        <div className="container calendar">
          <div className="row mt-4 align-items-center">
            <div className="navigate-date d-flex col-6 align-items-center">
              <h2 className="month me-2">
                {monthsOfYear[currentDate.getMonth()]},
              </h2>
              <h2 className="year">{currentDate.getFullYear()}</h2>
            </div>
            <div className="buttons col-6 text-end">
              <i
                className="bx bx-chevron-left me-3"
                onClick={prevMonth}
                role="button"
                aria-label="Mese precedente"
              ></i>
              <i
                className="bx bx-chevron-right"
                onClick={nextMonth}
                role="button"
                aria-label="Mese successivo"
              ></i>
            </div>

            {/* Giorni della settimana */}
            <div className="col-12 mt-5">
              <div className="weekdays">
                {daysOfWeek.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              {/* Giorni del mese */}
              <div className="days">
                {daysInMonth.map((day, index) => {
                  if (day === null) return <span key={`empty-${index}`}></span>;

                  const isToday =
                    day === today.getDate() &&
                    currentDate.getMonth() === today.getMonth() &&
                    currentDate.getFullYear() === today.getFullYear();

                  const dayEvents = getEventsForDay(day);

                  return (
                    <span
                      key={index}
                      className={`day-cell ${isToday ? "current-day" : ""}`}
                    >
                      <div className="day-number">{day}</div>

                      {/* Eventi multipli con scroll */}
                      <div className="events-container">
                        {dayEvents.map((ev, i) => (
                          <div
                            key={i}
                            className="event-title text-white px-1 py-0 mt-1"
                            style={{
                              backgroundColor: ev.color,
                              borderRadius: "6px",
                              fontSize: "0.7rem",
                              fontWeight: "600",
                            }}
                            title={`${ev.startTime} - ${ev.title}`}
                          >
                            {ev.startTime !== "00:00" &&
                              ev.startTime !== "" &&
                              `${ev.startTime} - `}
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarApp;
