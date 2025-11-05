import CalendarApp from "../components/CalendarApp";
import Navbar from "../components/Navbar";
import "../styles/CalendarApp.css";

const Homepage = () => {
  return (
    <div className="container-fluid">
      <CalendarApp />
      <Navbar />
    </div>
  );
};

export default Homepage;
