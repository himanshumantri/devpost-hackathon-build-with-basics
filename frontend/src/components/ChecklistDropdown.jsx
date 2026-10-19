import { useState } from "react";

// A dropdown that holds a checklist. It starts closed and allows several ticks.
export default function ChecklistDropdown({ id, label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);

  function toggle(option) {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]
    );
  }

  return (
    <div className="checklist">
      <label id={`${id}-label`} htmlFor={`${id}-button`}>
        {label}
      </label>
      <button
        id={`${id}-button`}
        type="button"
        className="checklist-button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(!open)}
      >
        <span className={selected.length ? "" : "placeholder"}>
          {selected.length ? selected.join(", ") : "Choose one or more"}
        </span>
        <span aria-hidden="true">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul id={`${id}-panel`} className="checklist-panel">
          {options.map((option) => (
            <li key={option}>
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggle(option)}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
