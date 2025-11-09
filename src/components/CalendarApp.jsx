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

  const getEventsForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return events.filter(
      (ev) => ev.date === new Date(year, month, day).toISOString().split("T")[0]
    );
  };

  return (
    <>
      <Header />
      <div className="calendar-app container-fluid my-5">
        <div className="container calendar">
          <div className="row mt-4">
            <div className="navigate-date d-flex col-6 align-items-center">
              <h2 className="month me-2">
                {monthsOfYear[currentDate.getMonth()]},
              </h2>
              <h2 className="year">{currentDate.getFullYear()}</h2>
            </div>
            <div className="buttons col-6 text-end">
              <i className="bx bx-chevron-left me-3" onClick={prevMonth}></i>
              <i className="bx bx-chevron-right" onClick={nextMonth}></i>
            </div>

            <div className="col-12 mt-5">
              <div className="weekdays">
                {daysOfWeek.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="days">
                {daysInMonth.map((day, index) => {
                  if (day === null) return <span key={index}></span>;

                  const isToday =
                    day === today.getDate() &&
                    currentDate.getMonth() === today.getMonth() &&
                    currentDate.getFullYear() === today.getFullYear();

                  const dayEvents = getEventsForDay(day);

                  return (
                    <span key={index} className={isToday ? "current-day" : ""}>
                      {day}
                      {dayEvents.length > 0 && (
                        <div
                          className="event-title mt-1 text-truncate small fw-bold text-white px-1 py-0"
                          style={{
                            backgroundColor: dayEvents[0].color,
                            borderRadius: "6px",
                          }}
                        >
                          {dayEvents[0].title}
                        </div>
                      )}
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
