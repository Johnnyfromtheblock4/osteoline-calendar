import "../styles/AddEvent.css";

const AddEvent = () => {
  return (
    <>
      <h1 className="add-event-title my-4 text-center">Aggiungi Evento</h1>
      <div className="add-event-container container d-flex justify-content-center align-items-center mt-4">
        <div className="add-event-box row">
          {/* TITOLO */}
          <div className="col-12 mb-3">
            <label
              htmlFor="eventTitle"
              className="form-label text-uppercase fw-bold text-warning"
            >
              Titolo
            </label>
            <input
              id="eventTitle"
              type="text"
              className="form-control custom-input"
              placeholder="Inserisci titolo evento"
            />
          </div>

          {/* SWITCH "Tutto il giorno" */}
          <div className="col-12 mb-3 d-flex align-items-center justify-content-between">
            <label
              className="form-check-label fw-bold"
              htmlFor="switchCheckDefault"
            >
              Tutto il giorno
            </label>
            <div className="form-check form-switch">
              <input
                className="form-check-input custom-switch"
                type="checkbox"
                role="switch"
                id="switchCheckDefault"
              />
            </div>
          </div>

          {/* STANZA A SCELTA */}
          <div className="col-12 mb-3">
            <label className="form-label text-uppercase fw-bold text-warning">
              Stanza
            </label>
            <select class="form-select" aria-label="Default select example">
              <option selected>Seleziona la stanza</option>
              <option value="1">Stanza Fede</option>
              <option value="2">Stanza Trattamenti</option>
              <option value="3">Palestra</option>
            </select>
          </div>

          {/* ORARI */}
          <div className="col-12 mb-3">
            <label className="form-label text-uppercase fw-bold text-warning">
              Orario
            </label>
            <div className="row">
              <div className="col-6">
                <div className="time-input">
                  <span>Inizio</span>
                  <div>
                    <input type="number" min={0} max={24} className="hours" />
                    <input type="number" min={0} max={60} className="minutes" />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="time-input text-end">
                  <span>Fine</span>
                  <div>
                    <input type="number" min={0} max={24} className="hours" />
                    <input type="number" min={0} max={60} className="minutes" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIZIONE */}
          <div className="col-12 mb-4">
            <label className="form-label text-uppercase fw-bold text-warning">
              Descrizione
            </label>
            <textarea
              className="form-control custom-textarea"
              placeholder="Inserisci descrizione (Max 60 caratteri)"
            ></textarea>
          </div>

          {/* BOTTONI */}
          <div className="col-12 d-flex justify-content-center align-items-center">
            <button className="event-popup-btn">Aggiungi Evento</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEvent;
