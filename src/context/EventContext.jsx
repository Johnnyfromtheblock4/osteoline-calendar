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
    setEvents((prev) => prev.filter((ev) => ev.id !== eventToRemove.id));
  };

  // Aggiorna evento
  const updateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
  };

  // Svuota tutti gli eventi (funzione per admin)
  const clearAllEvents = () => {
    setEvents([]);
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, removeEvent, updateEvent, clearAllEvents }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
