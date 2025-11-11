import { createContext, useState, useContext } from "react";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Aggiungi evento
  const addEvent = (newEvent) => {
    // Se manca l'id (per sicurezza), generane uno
    const eventWithId = newEvent.id ? newEvent : { ...newEvent, id: crypto.randomUUID() };
    setEvents((prev) => [...prev, eventWithId]);
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

  return (
    <EventContext.Provider value={{ events, addEvent, removeEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
