// The only file that talks to the backend.

// Empty while developing (the Vite proxy forwards /api to the backend).
// On Vercel, set VITE_API_URL to the hosted backend address, e.g. https://checkdin-api.onrender.com
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, options) {
  const response = await fetch(API_URL + path, options);
  if (!response.ok) {
    throw new Error(`The server answered with status ${response.status}`);
  }
  return response.json();
}

// Call 1 of 2: the Welcome screen asks for the airport list.
export function getAirports() {
  return request("/api/airports");
}

// Call 2 of 2: send what the traveler entered, get back up to five matching people.
export function getMatches({ airportCode, boardingTime, interests, venues }) {
  return request("/api/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      airport_code: airportCode,
      boarding_time: boardingTime,
      interests,
      venues,
    }),
  });
}
