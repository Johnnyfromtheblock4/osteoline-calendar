import "../styles/Header.css";

const Header = () => {
  return (
    <div className="container-fluid header">
      <div className="row d-flex justify-content-between">
        <div className="col-5 logo">
          <img src="/osteoline-calendar-logo.png" width="50" height="44" />
        </div>
        <div className="col-2 title">
          <h1 className="heading text-center">Osteoline</h1>
        </div>
        <div className="col-5 calendar-dates text-end">
          <p>Menu scorrimento</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
