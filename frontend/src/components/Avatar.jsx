// A colored circle with initials, used instead of photos for the sample people.
const COLORS = ["#0a66c2", "#7a3e9d", "#b4501e", "#2b7a78", "#a23b72", "#5c6b1f"];

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function colorFor(name) {
  let total = 0;
  for (const char of name) total += char.charCodeAt(0);
  return COLORS[total % COLORS.length];
}

export default function Avatar({ name }) {
  return (
    <span className="avatar" style={{ background: colorFor(name) }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
