// Helpers so the date-of-birth pickers can't produce impossible dates.
import { MONTHS } from "./options.js";

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// How many days the chosen month has. Until a month is chosen, any of 31 is fine.
// February allows 29 until a non-leap year is chosen.
export function daysInMonth(monthName, yearText) {
  const month = MONTHS.indexOf(monthName);
  if (month === -1) return 31;
  if (month === 1) return yearText && !isLeapYear(Number(yearText)) ? 28 : 29;
  return [3, 5, 8, 10].includes(month) ? 30 : 31; // April, June, September, November
}

// A date of birth is either fully empty or fully chosen.
export function dobStatus({ dobDay, dobMonth, dobYear }) {
  const filled = [dobDay, dobMonth, dobYear].filter(Boolean).length;
  if (filled === 0) return "empty";
  return filled === 3 ? "complete" : "partial";
}
