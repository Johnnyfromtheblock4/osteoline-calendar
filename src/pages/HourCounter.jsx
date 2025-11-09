import "../styles/HourCounter.css";

const HourCounter = () => {
  return (
    <>
      <h1 className="hour-counter-title my-4 text-center">Profilo</h1>
      <div className="hour-counter-container container d-flex justify-content-center align-items-center mt-4">
        <div className="hour-counter-box row">
          <div className="col-12">
            <h2 className="hour-counter-subtitle text-warning">
              Conteggio ore mese corrente
            </h2>
            <p>Qui andra il conteggio delle ore del mese corrente</p>
            <h2 className="hour-counter-subtitle text-warning">
              Note
            </h2>
            <p>Qui andra textarea con realtivo aggiungi nelle note che va sotto a creare un card con data, titolo e nota con relativi tasti di modifica eliminazione e copia</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HourCounter;