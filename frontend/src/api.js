// The only file that talks to the backend.

async function request(path, options) {
  const response = await fetch(path, options);
  if (!response.ok) {
    throw new Error(`The server answered with status ${response.status}`);
  }
  return response.json();
}

// Call 1 of 2: the Welcome screen asks for the airport list.
export function getAirports() {
  return request("/api/airports");
}
