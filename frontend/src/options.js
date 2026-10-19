// The fixed choices on the Interests screen. They must match the backend's models.py.

export const INTERESTS = [
  "Startups",
  "Technology",
  "Markets",
  "Travel",
  "Careers",
  "Just open to talk",
];

export const VENUES = ["Any place is good", "Cafe", "Bar", "Lounge", "Restaurant"];

// Basic Information screen
export const GENDERS = ["Male", "Female", "Bisexual", "Transgender", "Prefer not to say"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

// 2020 down to 1950, newest first so recent years are near the top.
export const YEARS = Array.from({ length: 71 }, (_, i) => String(2020 - i));
