// Boarding time is picked as hour (1-12), minute (00-59) and AM/PM.
// The backend wants a 24-hour "HH:MM" string.

export function to24Hour({ hour, minute, period }) {
  let h = Number(hour) % 12;
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

export function isTimeComplete({ hour, minute, period }) {
  return Boolean(hour && minute && period);
}
