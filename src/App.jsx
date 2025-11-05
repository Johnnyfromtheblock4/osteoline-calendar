import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AddEvent from "./pages/AddEvent";
import HourCounter from "./pages/HourCounter";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="AddEvent" element={<AddEvent />} />
          <Route path="HourCounter" element={<HourCounter />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
