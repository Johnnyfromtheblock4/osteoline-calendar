import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AddEvent from "./pages/AddEvent";
import HourCounter from "./pages/HourCounter";
import Footer from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/AddEvent" element={<AddEvent />} />
          <Route path="/HourCounter" element={<HourCounter />} />
        </Routes>
        <Footer /> {/* Footer sempre visibile come navbar */}
      </div>
    </BrowserRouter>
  );
};

export default App;
