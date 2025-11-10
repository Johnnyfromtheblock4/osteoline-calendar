import { useState, useEffect } from "react";
import { useEvents } from "../context/EventContext";
import { useDate } from "../context/DateContext";
import "../styles/CalendarApp.css";
import Header from "./Header";
import DetailEventHome from "./DetailEventHome";

const CalendarApp = () => {
  const { events } = useEvents();
  const { currentDate, setCurrentDate } = useDate(); 
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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

  // genera i giorni del mese corrente
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

  // Navigazione mesi
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  // Eventi per giorno
  const getEventsForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

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
              <div className="days mt-3">
                {daysInMonth.map((day, index) => {
                  if (day === null) return <span key={`empty-${index}`}></span>;

                  const isToday =
                    day === today.getDate() &&
                    currentDate.getMonth() === today.getMonth() &&
                    currentDate.getFullYear() === today.getFullYear();

                  const dayEvents = getEventsForDay(day);
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth();

                  return (
                    <span
                      key={index}
                      className={`day-cell ${isToday ? "current-day" : ""}`}
                      onClick={() => {
                        const dateStr = `${year}-${String(
                          month + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        setSelectedDate(dateStr);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="day-number">{day}</div>

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
                            {!ev.allDay ? (
                              <>
                                {ev.startTime} - {ev.endTime} -{" "}
                                <strong>{ev.title}</strong>
                              </>
                            ) : (
                              <strong>{ev.title} (Tutto il giorno)</strong>
                            )}
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

      {/* Popup dettagli giorno */}
      {selectedDate && (
        <DetailEventHome
          selectedDate={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </>
  );
};

export default CalendarApp;
