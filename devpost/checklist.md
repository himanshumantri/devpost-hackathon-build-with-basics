---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. The Welcome screen opens and its airport list comes from the backend**
  Becomes usable: Both programs run side by side. The Welcome screen shows "Welcome to CheckdIn," an openly licensed departures-board picture, an airport picker filled from the backend, hour/minute/AM-PM pickers, an optional gate box, and a green Start button that stays disabled until airport and boarding time are set.
  Why now: Proves the riskiest plumbing first (React frontend, Python backend and the proxy between them) and delivers the first of the two frontend/backend calls, so every later slice has somewhere to land.
  PRD ref: `prd.md > Features and Behavior > Welcome (flow 1)`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > File Structure`, `spec.md > Components > Frontend: Welcome screen (frontend/src/screens/Welcome.jsx)`, `spec.md > Components > Backend: API entry (backend/app/main.py)`, `spec.md > External Services and Dependencies`
  Build: Scaffold `backend/` (FastAPI, `requirements.txt`, `app/main.py`, `app/data.py`, `data/airports.json` including LHR) and `frontend/` (Vite + React, `vite.config.js` with the `/api` proxy, `api.js`, `App.jsx`, `Welcome.jsx`, `AirportPicker.jsx`, `PrimaryButton.jsx`, `styles.css` with the white/green look). Find one openly licensed departures-board image in the black, yellow and white theme (fallback: an original SVG), save it in `frontend/src/assets/`, and record its source and licence in `README.md`. Add `GET /api/airports`.
  Verify (mechanical): Install dependencies; start the backend and confirm `GET /api/airports` returns a list that includes LHR; start the frontend and confirm the page loads with no console errors and the airport picker is filled; confirm Start is disabled with an empty airport or time and enabled once both are set (gate empty).
  Learner check: Open http://localhost:5173, pick London Heathrow, set a boarding time, and watch the green Start button turn on. Say whether the screen looks the way you pictured it.
  Commit: `Add Welcome screen with airport list from the backend`

- [x] **2. The backend matches sample people to a traveler (the kernel)**
  Becomes usable: `POST /api/matches` takes an airport, boarding time, interests and venues and returns up to five sample people, sorted by your rules. You can try it by hand on the backend's `/docs` page.
  Why now: This is `scope.md > The Unique Kernel` (matching on airport, time, interests and venue). It is the one slice that is backend-only; it is justified because the rules carry the whole idea, the tests and the `/docs` page leave runnable evidence, and it shows you the backend working before any screen depends on it.
  PRD ref: `prd.md > Features and Behavior > Nearby People (flow 4)`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Backend: Matching rules (backend/app/matching.py)`, `spec.md > Components > Backend: Data models (backend/app/models.py)`, `spec.md > Data Model`
  Build: Add `models.py`, `matching.py` (airport and 60-minute filter, interest rule, venue rule, ordering, limit of five), `data/sample_people.json` with the nine fictional people from the spec, the endpoint in `main.py`, and `tests/test_matching.py` covering each rule and the ordering.
  Verify (mechanical): Run pytest and confirm every test passes; call `POST /api/matches` for LHR at 18:00 with Startups + Cafe and confirm the expected people come back in order; confirm a JFK request returns only Elena Rossi and an unknown airport returns an empty list.
  Learner check: Open http://localhost:8000/docs, try `POST /api/matches` with LHR, 18:00, Startups and Cafe, and read the reply. Check that Tom Hughes and Elena Rossi are not in it and that James Whitfield (open to talk) is.
  Commit: `Add matching rules and sample people to the backend`

- [x] **3. Interests screen and the Nearby People list work end to end**
  Becomes usable: Start on Welcome opens the Interests screen (two closed dropdown checklists and an optional favorite-place box); Continue opens Nearby People, which calls the backend and shows up to five two-row cards, or the "No matches found" message with a green Start Over button, or a "Can't reach the server" message with Retry. (Basic Information is added in the next slice, so for now Welcome goes straight to Interests.)
  Why now: Connects the kernel to the screen, the second of the two frontend/backend calls. After this slice the core "see who I could meet" loop works.
  PRD ref: `prd.md > Features and Behavior > Interests (flow 3)`, `prd.md > Features and Behavior > Nearby People (flow 4)`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Frontend: Interests screen (frontend/src/screens/Interests.jsx)`, `spec.md > Components > Frontend: Nearby People screen (frontend/src/screens/NearbyPeople.jsx)`, `spec.md > Components > Frontend: Shared pieces (frontend/src/components/)`, `spec.md > Important Failure Modes`
  Build: Add `Interests.jsx`, `ChecklistDropdown.jsx`, `NearbyPeople.jsx`, `PersonCard.jsx`, `Avatar.jsx`, `getMatches()` in `api.js`, and the screen switching and shared state in `App.jsx`. Continue stays disabled until at least one interest and one venue are chosen. Both dropdowns start closed. The favorite-place hint is italic and clears when focused.
  Verify (mechanical): With both programs running, walk Welcome → Interests → Nearby People for LHR at 6:00 PM with Startups + Cafe and confirm the cards match the earlier `/docs` result; confirm Continue is disabled until the required choices are made; confirm a different airport shows the no-matches message and Start Over returns to Welcome; stop the backend and confirm the error message with Retry; confirm the browser's Network tab shows only the airports request and one matches request.
  Learner check: Run the demo path (LHR, 6:00 PM, Startups + Cafe) and look at the cards. Then try JFK or a very different time to see the no-matches message. Say whether the cards and messages look and feel the way you pictured.
  Commit: `Add Interests screen and Nearby People list`

- [ ] **4. Basic Information screen joins the journey**
  Becomes usable: After Start, you fill in Basic Information (picture by camera or upload, name, date/month/year pickers from 1950 to 2020, profession, gender, native city), then Continue goes to Interests. Picture, name, profession and gender are required.
  Why now: Completes the first half of the core journey. It is placed after the kernel because matching does not depend on it, and your profile data never goes to the backend.
  PRD ref: `prd.md > Features and Behavior > Basic Information (flow 2)`, `prd.md > The Core Journey`
  Spec ref: `spec.md > Components > Frontend: Basic Information screen (frontend/src/screens/BasicInfo.jsx)`, `spec.md > Data Model`
  Build: Add `BasicInfo.jsx` and route Welcome → Basic Information → Interests in `App.jsx`. Picture uses two file inputs (Take photo with `capture`, and Upload) and shows a preview in a frame; it is held only in browser memory.
  Verify (mechanical): Confirm Continue is disabled until picture, name, profession and gender are filled and enabled with DOB and native city empty; confirm the DOB year picker runs from 1950 to 2020; confirm the chosen picture appears in the frame; confirm the Network tab shows no request carrying the picture or profile.
  Learner check: Go from Welcome through Basic Information to Interests. Add a picture from a file (on your phone, try the camera too) and see it fill the frame. Say what you'd change about the layout.
  Commit: `Add Basic Information screen`

- [ ] **5. You can chat with a matched person**
  Becomes usable: Tapping Chat on a card opens a screen with that person's name, a left-arrow back control, a "Say Hi" prompt that posts "Hi" as the first message, and free typing after that. The back arrow returns to the list. Chats are remembered for up to 3 hours in the browser session.
  Why now: Finishes the core journey end to end and is the last behavior in `prd.md > What We're Building`.
  PRD ref: `prd.md > Features and Behavior > Chat`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Frontend: Chat screen (frontend/src/screens/Chat.jsx)`, `spec.md > Components > Frontend: Chat store (frontend/src/chatStore.js)`, `spec.md > Data Model`
  Build: Add `Chat.jsx` and `chatStore.js` (session storage per person id with timestamps; messages older than 3 hours are dropped when reading), and wire the Chat button and the back arrow in `App.jsx`. If session storage is unavailable, chat works for the current visit only.
  Verify (mechanical): Open a chat, say Hi, send two messages, go back, open the same person and confirm the messages are there; open a different person and confirm a separate empty conversation; confirm in the browser's storage view that messages are saved per person; simulate an old timestamp and confirm it is dropped on read.
  Learner check: Chat with one person, go back with the arrow, open someone else, then return to the first person and see your messages still there.
  Commit: `Add chat with matched people`

- [ ] **6. Ready to record: README, responsive check and demo path**
  Becomes usable: A reviewer can read the README, start both programs, and follow the demo script to see the whole flow. The screens look right on a phone-sized window and on desktop.
  Why now: The submission needs a short demo video and a public repo; this makes the project runnable and recordable by someone else.
  PRD ref: `prd.md > What We're Building`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Look and Feel`, `spec.md > Decisions and Open Issues`
  Build: Write `README.md` (what CheckdIn is, how to run backend and frontend, demo script for LHR, image source and licence, note that the people are fictional samples), tidy styling at phone and desktop widths, and make sure `.gitignore` covers `.venv`, `node_modules` and build output.
  Verify (mechanical): Following only the README on a clean clone-like state (fresh venv and fresh `npm install`), both programs start and the full journey works; run pytest again; check the page at a phone width and a desktop width for layout problems.
  Learner check: Follow the README yourself from a fresh terminal and record a quick practice run of the demo. Say what felt confusing.
  Commit: `Add README and polish for the demo`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 3 (the kernel working end to end)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
