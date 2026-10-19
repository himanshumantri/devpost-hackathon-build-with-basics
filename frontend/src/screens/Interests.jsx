import { useState } from "react";
import { INTERESTS, VENUES } from "../options.js";
import ChecklistDropdown from "../components/ChecklistDropdown.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

const HINT = "Enter one of your favorite ones on this airport";

export default function Interests({ prefs, onPrefsChange, onContinue }) {
  // The hint clears as soon as the cursor goes into the box.
  const [focused, setFocused] = useState(false);

  const canContinue = prefs.interests.length > 0 && prefs.venues.length > 0;

  return (
    <main className="screen">
      <h1>What would you like to talk about?</h1>

      <ChecklistDropdown
        id="interests"
        label="Interests"
        options={INTERESTS}
        selected={prefs.interests}
        onChange={(interests) => onPrefsChange({ ...prefs, interests })}
      />

      <ChecklistDropdown
        id="venues"
        label="Where would you like to meet?"
        options={VENUES}
        selected={prefs.venues}
        onChange={(venues) => onPrefsChange({ ...prefs, venues })}
      />

      <label htmlFor="favorite-place">Favorite place (optional)</label>
      <input
        id="favorite-place"
        type="text"
        className="favorite-place"
        placeholder={focused ? "" : HINT}
        value={prefs.favoritePlace}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onPrefsChange({ ...prefs, favoritePlace: e.target.value })}
      />

      <PrimaryButton onClick={onContinue} disabled={!canContinue}>
        Continue
      </PrimaryButton>
    </main>
  );
}
