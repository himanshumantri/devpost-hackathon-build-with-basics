import { useEffect, useState } from "react";
import { getAirports } from "../api.js";
import { isTimeComplete } from "../time.js";
import AirportPicker from "../components/AirportPicker.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import boardImage from "../assets/departures-board.jpg";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export default function Welcome({ trip, onTripChange, onStart }) {
  const [airports, setAirports] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadAirports() {
    setLoading(true);
    setLoadError(false);
    getAirports()
      .then(setAirports)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }

  useEffect(loadAirports, []);

  const canStart = Boolean(trip.airportCode) && isTimeComplete(trip.time);

  function setTime(part, value) {
    onTripChange({ ...trip, time: { ...trip.time, [part]: value } });
  }

  return (
    <main className="screen welcome">
      <h1>Welcome to CheckdIn</h1>
      <img className="welcome-image" src={boardImage} alt="An airport departures board" />
      <p className="credit">
        Photo: Marek Ślusarczyk (Tupungato), CC BY 3.0, via Wikimedia Commons
      </p>
      <p className="intro">Start by sharing your present airport, boarding gate &amp; time</p>

      <label htmlFor="airport">Airport</label>
      {loadError ? (
        <div className="error">
          <p>Can't reach the server. Is the backend running?</p>
          <button type="button" className="link-button" onClick={loadAirports}>
            Retry
          </button>
        </div>
      ) : loading ? (
        <p className="hint">Loading airports…</p>
      ) : (
        <AirportPicker
          airports={airports}
          value={trip.airportCode}
          onChange={(code) => onTripChange({ ...trip, airportCode: code })}
        />
      )}

      <fieldset className="time-row">
        <legend>Boarding time</legend>
        <select
          aria-label="Hour"
          value={trip.time.hour}
          onChange={(e) => setTime("hour", e.target.value)}
        >
          <option value="">Hour</option>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <select
          aria-label="Minutes"
          value={trip.time.minute}
          onChange={(e) => setTime("minute", e.target.value)}
        >
          <option value="">Min</option>
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          aria-label="AM or PM"
          value={trip.time.period}
          onChange={(e) => setTime("period", e.target.value)}
        >
          <option value="">AM/PM</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </fieldset>

      <label htmlFor="gate">Boarding gate (optional)</label>
      <input
        id="gate"
        type="text"
        value={trip.gate}
        onChange={(e) => onTripChange({ ...trip, gate: e.target.value })}
      />

      <PrimaryButton onClick={onStart} disabled={!canStart}>
        Start
      </PrimaryButton>
    </main>
  );
}
