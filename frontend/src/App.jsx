import { useState } from "react";
import { getMatches } from "./api.js";
import { to24Hour } from "./time.js";
import Welcome from "./screens/Welcome.jsx";
import BasicInfo from "./screens/BasicInfo.jsx";
import Interests from "./screens/Interests.jsx";
import NearbyPeople from "./screens/NearbyPeople.jsx";

// Everything the person has entered lives here, in the browser tab's memory.
const EMPTY_TRIP = {
  airportCode: "",
  time: { hour: "", minute: "", period: "" },
  gate: "",
};
const EMPTY_PROFILE = {
  photoUrl: "",
  name: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  profession: "",
  gender: "",
  nativeCity: "",
};
const EMPTY_PREFS = { interests: [], venues: [], favoritePlace: "" };
const NO_MATCHES_YET = { status: "loading", matches: [] };

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [trip, setTrip] = useState(EMPTY_TRIP);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [prefs, setPrefs] = useState(EMPTY_PREFS);
  const [matchState, setMatchState] = useState(NO_MATCHES_YET);

  // Call 2 of 2: ask the backend who matches. Runs when Continue or Retry is pressed.
  function findMatches() {
    setMatchState(NO_MATCHES_YET);
    getMatches({
      airportCode: trip.airportCode,
      boardingTime: to24Hour(trip.time),
      interests: prefs.interests,
      venues: prefs.venues,
    })
      .then((reply) => setMatchState({ status: "done", matches: reply.matches }))
      .catch(() => setMatchState({ status: "error", matches: [] }));
  }

  function startOver() {
    if (profile.photoUrl) URL.revokeObjectURL(profile.photoUrl);
    setTrip(EMPTY_TRIP);
    setProfile(EMPTY_PROFILE);
    setPrefs(EMPTY_PREFS);
    setMatchState(NO_MATCHES_YET);
    setScreen("welcome");
  }

  if (screen === "welcome") {
    return <Welcome trip={trip} onTripChange={setTrip} onStart={() => setScreen("basic")} />;
  }

  if (screen === "basic") {
    return (
      <BasicInfo
        profile={profile}
        onProfileChange={setProfile}
        onContinue={() => setScreen("interests")}
      />
    );
  }

  if (screen === "interests") {
    return (
      <Interests
        prefs={prefs}
        onPrefsChange={setPrefs}
        onContinue={() => {
          setScreen("nearby");
          findMatches();
        }}
      />
    );
  }

  return <NearbyPeople matchState={matchState} onRetry={findMatches} onStartOver={startOver} />;
}
