import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AddEvent from "./pages/AddEvent";
import HourCounter from "./pages/HourCounter";
import Footer from "./components/Footer";
import { EventProvider } from "./context/EventContext";
import { DateProvider } from "./context/DateContext"; 

const App = () => {
  return (
    <BrowserRouter>
      <EventProvider>
        <DateProvider>
          <div className="app-wrapper">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/AddEvent" element={<AddEvent />} />
              <Route path="/HourCounter" element={<HourCounter />} />
            </Routes>
            <Footer />
          </div>
        </DateProvider>
      </EventProvider>
    </BrowserRouter>
  );
};

export default App;
