import { useState } from "react";

const MAX_SUGGESTIONS = 8;

function label(airport) {
  return `${airport.name} (${airport.code})`;
}

// Type to search the list; the airport only counts once one is picked from it.
export default function AirportPicker({ airports, value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const text = query.trim().toLowerCase();
  const suggestions =
    text && !value
      ? airports
          .filter(
            (a) =>
              a.code.toLowerCase().includes(text) ||
              a.name.toLowerCase().includes(text) ||
              (a.city || "").toLowerCase().includes(text)
          )
          .slice(0, MAX_SUGGESTIONS)
      : [];

  function pick(airport) {
    setQuery(label(airport));
    setOpen(false);
    onChange(airport.code);
  }

  function handleType(event) {
    setQuery(event.target.value);
    setOpen(true);
    onChange(""); // typing again un-picks the airport
  }

  return (
    <div className="airport-picker">
      <input
        id="airport"
        type="text"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls="airport-options"
        autoComplete="off"
        placeholder="Search city, airport or code"
        value={query}
        onChange={handleType}
        onFocus={() => setOpen(true)}
      />
      {open && suggestions.length > 0 && (
        <ul id="airport-options" role="listbox" className="airport-options">
          {suggestions.map((airport) => (
            <li
              key={airport.code}
              role="option"
              aria-selected={airport.code === value}
              onMouseDown={() => pick(airport)}
            >
              <strong>{airport.code}</strong> {airport.name}
              <span className="airport-city">
                {airport.city}
                {airport.country ? `, ${airport.country}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
      {query && !value && suggestions.length === 0 && (
        <p className="hint">Pick an airport from the list.</p>
      )}
    </div>
  );
}
