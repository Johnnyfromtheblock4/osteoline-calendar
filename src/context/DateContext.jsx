import { createContext, useContext, useState } from "react";

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <DateContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => useContext(DateContext);
