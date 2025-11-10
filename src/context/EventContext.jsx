import { createContext, useState, useContext } from "react";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Aggiungi evento
  const addEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  // Elimina evento
  const removeEvent = (eventToRemove) => {
    setEvents((prev) =>
      prev.filter(
        (ev) =>
          !(
            ev.title === eventToRemove.title &&
            ev.date === eventToRemove.date &&
            ev.startTime === eventToRemove.startTime
          )
      )
    );
  };

  // Aggiorna evento
  const updateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.date === updatedEvent.date &&
        ev.startTime === updatedEvent.startTime &&
        ev.title === updatedEvent.title
          ? updatedEvent
          : ev
      )
    );
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, removeEvent, updateEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
