import "../styles/CalendarApp.css";
import Footer from "./Footer";
import Header from "./Header";

const CalendarApp = () => {
  return (
    <div className="calendar-app container-fluid my-5">
      <Header />
      <div className="container calendar">
        <div className="row mt-4">
          <div className="navigate-date d-flex col-6">
            <h2 className="month me-3">Maggio,</h2>
            <h2 className="year">2025</h2>
          </div>
          <div className="buttons col-6 text-end">
            <i className="bx bx-chevron-left me-3"></i>
            <i className="bx bx-chevron-right"></i>
          </div>
          <div className="col-12 mt-5">
            <div className="weekdays">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mer</span>
              <span>Gio</span>
              <span>Ven</span>
              <span>Sab</span>
              <span>Dom</span>
            </div>
            <div className="days">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
              <span>11</span>
              <span>12</span>
              <span>13</span>
              <span>14</span>
              <span>15</span>
              <span>16</span>
              <span>17</span>
              <span>18</span>
              <span>19</span>
              <span>20</span>
              <span>21</span>
              <span>22</span>
              <span>23</span>
              <span>24</span>
              <span>25</span>
              <span>26</span>
              <span>27</span>
              <span>28</span>
              <span>29</span>
              <span>30</span>
              <span>31</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
