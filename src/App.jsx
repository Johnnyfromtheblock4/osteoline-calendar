import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AddEvent from "./pages/AddEvent";
import HourCounter from "./pages/HourCounter";
import Footer from "./components/Footer";
import { EventProvider } from "./context/EventContext";

const App = () => {
  return (
    <BrowserRouter>
      <EventProvider>
        <div className="app-wrapper">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/AddEvent" element={<AddEvent />} />
            <Route path="/HourCounter" element={<HourCounter />} />
          </Routes>
          <Footer />
        </div>
      </EventProvider>
    </BrowserRouter>
  );
};

export default App;
