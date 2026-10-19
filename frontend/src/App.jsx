import { useState } from "react";
import Welcome from "./screens/Welcome.jsx";
import { to24Hour } from "./time.js";

// Everything the person has entered lives here, in the browser tab's memory.
const EMPTY_TRIP = {
  airportCode: "",
  time: { hour: "", minute: "", period: "" },
  gate: "",
};

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [trip, setTrip] = useState(EMPTY_TRIP);

  if (screen === "welcome") {
    return <Welcome trip={trip} onTripChange={setTrip} onStart={() => setScreen("next")} />;
  }

  // Placeholder until the next slices add the remaining screens.
  return (
    <main className="screen">
      <h1>You're set</h1>
      <p>
        Airport {trip.airportCode}, boarding at {to24Hour(trip.time)}
        {trip.gate ? `, gate ${trip.gate}` : ""}.
      </p>
      <p className="hint">The next screens are coming in the following build steps.</p>
    </main>
  );
}
