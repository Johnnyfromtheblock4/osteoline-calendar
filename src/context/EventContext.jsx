import { createContext, useState, useContext } from "react";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const addEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
