import { useRef } from "react";
import { DAYS, GENDERS, MONTHS, YEARS } from "../options.js";
import { daysInMonth, dobStatus } from "../dates.js";
import PrimaryButton from "../components/PrimaryButton.jsx";

export default function BasicInfo({ profile, onProfileChange, onContinue }) {
  const cameraInput = useRef(null);
  const uploadInput = useRef(null);

  function set(field, value) {
    onProfileChange({ ...profile, [field]: value });
  }

  // Changing the month or year can make the chosen date impossible (31 April, 29 February
  // in a non-leap year), so in that case the date is cleared and has to be picked again.
  function setDobPart(field, value) {
    const next = { ...profile, [field]: value };
    if (next.dobDay && Number(next.dobDay) > daysInMonth(next.dobMonth, next.dobYear)) {
      next.dobDay = "";
    }
    onProfileChange(next);
  }

  // The picture stays in this browser tab: it is shown from a local URL and never sent anywhere.
  function handlePicture(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (profile.photoUrl) URL.revokeObjectURL(profile.photoUrl);
    set("photoUrl", URL.createObjectURL(file));
    event.target.value = ""; // lets the same file be picked again
  }

  const dayOptions = DAYS.slice(0, daysInMonth(profile.dobMonth, profile.dobYear));
  const dobIsPartial = dobStatus(profile) === "partial";

  const canContinue =
    !dobIsPartial &&
    Boolean(profile.photoUrl) &&
    profile.name.trim() !== "" &&
    profile.profession.trim() !== "" &&
    profile.gender !== "";

  return (
    <main className="screen">
      <h1>Tell us about you</h1>

      <div className="photo-frame">
        {profile.photoUrl ? (
          <img src={profile.photoUrl} alt="Your picture" />
        ) : (
          <span className="photo-empty">Your picture</span>
        )}
      </div>
      <div className="photo-actions">
        <button type="button" className="secondary-button" onClick={() => cameraInput.current.click()}>
          Take photo
        </button>
        <button type="button" className="secondary-button" onClick={() => uploadInput.current.click()}>
          Upload
        </button>
      </div>
      <input ref={cameraInput} type="file" accept="image/*" capture="user" hidden onChange={handlePicture} />
      <input ref={uploadInput} type="file" accept="image/*" hidden onChange={handlePicture} />

      <label htmlFor="name">Name</label>
      <input id="name" type="text" value={profile.name} onChange={(e) => set("name", e.target.value)} />

      <fieldset className="dob-row">
        <legend>Date of birth (optional)</legend>
        <select aria-label="Date" value={profile.dobDay} onChange={(e) => setDobPart("dobDay", e.target.value)}>
          <option value="">Date</option>
          {dayOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select aria-label="Month" value={profile.dobMonth} onChange={(e) => setDobPart("dobMonth", e.target.value)}>
          <option value="">Month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select aria-label="Year" value={profile.dobYear} onChange={(e) => setDobPart("dobYear", e.target.value)}>
          <option value="">Year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {dobIsPartial && <p className="hint dob-hint">Pick date, month and year, or leave all three empty.</p>}
      </fieldset>

      <label htmlFor="profession">Profession</label>
      <input id="profession" type="text" value={profile.profession} onChange={(e) => set("profession", e.target.value)} />

      <fieldset className="gender-group">
        <legend>Gender</legend>
        {GENDERS.map((option) => (
          <label key={option} className="radio">
            <input
              type="radio"
              name="gender"
              value={option}
              checked={profile.gender === option}
              onChange={() => set("gender", option)}
            />
            {option}
          </label>
        ))}
      </fieldset>

      <label htmlFor="native-city">Native city (optional)</label>
      <input id="native-city" type="text" value={profile.nativeCity} onChange={(e) => set("nativeCity", e.target.value)} />

      <PrimaryButton onClick={onContinue} disabled={!canContinue}>
        Continue
      </PrimaryButton>
    </main>
  );
}
