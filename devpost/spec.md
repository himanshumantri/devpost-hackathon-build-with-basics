---
doc: spec
status: approved
---

# CheckdIn — Technical Spec

## How This Works, In Plain Language
CheckdIn has two programs that run side by side on your computer.

- **The frontend** is what you see in the browser. It is built with React (a library for building screens out of small reusable pieces). It shows the five screens, keeps what you type, and handles the chat.
- **The backend** is a small Python program built with FastAPI (a tool for making a Python program answer requests from a browser). It has three jobs: keep the data (the list of airports and the pre-made sample people), apply your matching rules, and answer the frontend's requests. It is "always on, waiting to be asked."

They talk in only **two places**:
1. When the Welcome screen opens, the frontend asks the backend for the airport list.
2. When you arrive at Nearby People, the frontend sends what you entered (airport, boarding time, interests, venues) and the backend replies with up to five matching sample people, already sorted.

Everything else stays in the browser: the Basic Information screen, your picture (it never leaves the browser), and all chat. Chat is saved in the browser's session storage (a sticky note the browser keeps for one site), and anything older than 3 hours is dropped.

There is no database and no login. The sample people live in one data file. This is the smallest shape that still shows the real frontend/backend split used in production apps, and the matching rules sit in Python where they are easy to test.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **Open the app.** The browser loads the React app from the frontend dev server. It asks the backend `GET /api/airports` and fills the airport list. *(frontend + backend talk, 1 of 2)*
2. **Welcome.** You pick an airport and boarding time and optionally type a gate. These are held in the frontend's memory. Start enables when airport and time are set.
3. **Basic Information.** You add a picture, name, profession, gender and optional DOB and native city. Held in the frontend's memory only.
4. **Interests.** You tick interests and venue types and optionally type a favorite place. Held in the frontend's memory.
5. **Nearby People.** The frontend sends `POST /api/matches` with your airport, boarding time, interests and venues. *(frontend + backend talk, 2 of 2)* The backend filters the sample people (same airport, within one hour, interest rule or venue rule), sorts them, keeps five, and returns them. The frontend draws a two-row card for each, or the "No matches found" message with a Start Over button.
6. **Chat.** Tapping Chat opens the chat screen for that person. The frontend reads any earlier messages from session storage, shows the "Say Hi" prompt, and saves each message you send. The back arrow returns to the list; the list is held in the frontend's memory, so no new request is made.

## Stack
No lookups were done while writing this; versions below are the intended majors, and the build will pin the exact versions that install successfully.

| Piece | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite, plain JavaScript, plain CSS | You chose React. Vite is a fast starter tool with no config needed. Plain CSS keeps styling easy to read. Docs: https://react.dev/ · https://vite.dev/ |
| Backend | Python 3.11 + FastAPI + Uvicorn + Pydantic | You chose Python. FastAPI describes the requests and replies as Python types and also serves a free test page at `/docs`. Docs: https://fastapi.tiangolo.com/ · https://www.uvicorn.org/ · https://docs.pydantic.dev/ |
| Backend tests | pytest | Matching rules are the heart of the kernel; a few tests prove them. Docs: https://docs.pytest.org/ |
| Data | Two JSON files in the backend | No database needed for a fixed airport list and sample people. |

Installed on your machine: Python 3.11, Node 24, npm 11. To verify early in the build: that the chosen package versions install cleanly on Python 3.11 and Node 24.

## Where It Runs and How Someone Tries It
Everything runs locally. Submission needs a short demo video and a public GitHub repository; deployment is optional and is not planned.

Start the backend (terminal 1):
```
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Start the frontend (terminal 2):
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. The frontend forwards any request starting with `/api` to the backend on port 8000 (a Vite dev proxy), so the browser only talks to one address.

**To record the demo:** use London Heathrow (LHR) with a boarding time between about 5:00 PM and 7:00 PM, and choose interests such as Startups + Cafe to get matches. To show "no matches," pick a different airport or a time far from the sample times. To try it on a phone on the same Wi-Fi, run `npm run dev -- --host` and open the printed network address.

## Look and Feel
Carried forward from `prd.md > Look and Feel`; no new decisions.
- White background on every screen; dark body text; minimal layout with generous space, one column, centered on desktop, phone-first.
- Friendly type: a rounded, approachable sans-serif (system font stack to avoid network fonts; a Google font such as Nunito can be added later if wanted).
- Buttons (Start, Continue, Start Over) use white text on green (a green such as #198754 keeps white text readable); disabled buttons are visibly dimmed.
- LinkedIn-style cards for people: picture on the left, name, small gray profession, rounded tags for interests.
- The departures-board picture appears only on Welcome. It will be an openly licensed image (or an original SVG) in the same black, yellow and white theme as the one the learner attached.
- Sample people's pictures are generated initials in colored circles, so no real photos are used. The person's own picture is whatever they capture or upload.

## Components
Implements the PRD headings named on each one. The frontend uses one screen component per PRD screen and a few shared pieces.

### Backend: API entry (`backend/app/main.py`)
Creates the FastAPI app and the two endpoints below. Loads airports and sample people once at startup.
PRD ref: all screens (see `prd.md > Screens and Layout`).

### Backend: Matching rules (`backend/app/matching.py`)
Pure Python functions with no web code, so they are easy to test. Given a person's request and the list of sample people, returns up to five matches.
- Filter: same airport code and boarding time difference of 60 minutes or less (the same day; times are compared as minutes since midnight).
- Interest rule passes if any of: a shared interest; either side has "Just open to talk"; both have at least one of Startups, Technology, Markets.
- Venue rule passes if any of: either side has "Any place is good"; both have at least one of Bar, Restaurant; both have at least one of Cafe, Lounge.
- Keep a person if the interest rule or the venue rule passes.
- Sort by smallest time difference, then people who pass the interest rule before those who don't, then people who pass the venue rule before those who don't. Keep the first five.
PRD ref: `prd.md > Features and Behavior > Nearby People (flow 4)`.

### Backend: Data models (`backend/app/models.py`)
Pydantic descriptions of the request and the reply so FastAPI checks incoming data (for example, a bad time format) automatically.

### Backend: Data loading (`backend/app/data.py`)
Reads `airports.json` and `sample_people.json` from `backend/data/`.

### Frontend: App shell (`frontend/src/App.jsx`)
Holds which screen is showing and everything the person has entered (airport, time, gate, profile, interests, venues, favorite place, and the latest match list). Moves between screens. No router library; the five screens are chosen by a simple state value. Refreshing the page returns to Welcome.
PRD ref: `prd.md > Screens and Layout`.

### Frontend: Welcome screen (`frontend/src/screens/Welcome.jsx`)
Title, departures-board picture, searchable airport picker (choices only from the loaded list), hour/minute/AM-PM pickers, gate text box, Start button. Converts the 12-hour pickers to a 24-hour `HH:MM` string.
PRD ref: `prd.md > Features and Behavior > Welcome (flow 1)`.

### Frontend: Basic Information screen (`frontend/src/screens/BasicInfo.jsx`)
Picture frame with two buttons (Take photo, Upload), name, date/month/year pickers (1950–2020), profession, gender choices, native city, Continue. Picture is shown from a local browser URL and is never sent anywhere.
PRD ref: `prd.md > Features and Behavior > Basic Information (flow 2)`.

### Frontend: Interests screen (`frontend/src/screens/Interests.jsx`)
Two closed-by-default dropdown checklists, an italic placeholder text box for the favorite place, Continue.
PRD ref: `prd.md > Features and Behavior > Interests (flow 3)`.

### Frontend: Nearby People screen (`frontend/src/screens/NearbyPeople.jsx`)
Sends the matches request when the screen opens, then shows a loading line, the cards, the no-matches message with Start Over, or an error with Retry.
PRD ref: `prd.md > Features and Behavior > Nearby People (flow 4)` and `prd.md > States and Boundaries`.

### Frontend: Chat screen (`frontend/src/screens/Chat.jsx`)
Name at top, left-arrow back control, message list, "Say Hi" prompt, text box. Reads and writes messages through the chat store.
PRD ref: `prd.md > Features and Behavior > Chat`.

### Frontend: Chat store (`frontend/src/chatStore.js`)
Saves each conversation in session storage under that person's id with a timestamp per message, and drops messages older than 3 hours when reading.

### Frontend: API helper (`frontend/src/api.js`)
The only place that talks to the backend: `getAirports()` and `getMatches(request)`.

### Frontend: Shared pieces (`frontend/src/components/`)
`PersonCard`, `Avatar` (initials circle), `ChecklistDropdown`, `AirportPicker`, `PrimaryButton` (the green button).

## Data Model
**Backend files (read-only at runtime):**
- `airports.json`: a list of `{ code, name, city, country }`. A bundled list of major world airports; it must include LHR.
- `sample_people.json`: a list of `{ id, name, profession, airport_code, boarding_time ("HH:MM"), interests[], venues[], favorite_place or empty }`. All names are made up.

**Sample people for the demo (fictional; the Heathrow group is clustered between 4:40 PM and 9:30 PM):**

| Name | Profession | Airport | Boarding | Interests | Venues | Favorite place |
|---|---|---|---|---|---|---|
| Priya Nair | Startup founder | LHR | 16:40 | Startups, Technology | Cafe | Costa Coffee |
| Daniel Okafor | Equity investor | LHR | 17:10 | Markets | Bar, Restaurant | — |
| Sofia Marino | Management consultant | LHR | 17:35 | Careers, Travel | Lounge | A lounge near the gates |
| James Whitfield | CFO | LHR | 18:05 | Just open to talk | Any place is good | — |
| Aisha Rahman | Product manager | LHR | 18:40 | Technology, Careers | Cafe, Lounge | — |
| Lucas Becker | VC associate | LHR | 19:15 | Startups, Markets | Bar | — |
| Mei Tan | Travel writer | LHR | 19:50 | Travel | Restaurant | Wagamama |
| Tom Hughes | Sales director | LHR | 21:30 | Careers | Cafe | — |
| Elena Rossi | Designer | JFK | 18:00 | Startups, Technology | Cafe | — |

(Elena is at a different airport and Tom is far outside the one-hour window; they exist so the demo can show that the rules exclude people.)

**Request** sent to `POST /api/matches`: `{ airport_code: "LHR", boarding_time: "18:00", interests: ["Startups"], venues: ["Cafe"] }`.
**Reply**: `{ matches: [ { id, name, profession, interests, favorite_place, boarding_time, matched_on_interest, matched_on_venue } ] }`. At most five, already sorted.

**Browser data (frontend):**
| Data | Where it lives | Updated by | After leaving and coming back |
|---|---|---|---|
| Airport, time, gate, profile, picture, interests, venues, favorite place | React state in the browser tab | Typing and tapping | Lost on page refresh; the app returns to Welcome |
| Latest match list | React state | Reply from the backend | Kept while moving between list and chat; lost on refresh |
| Chats | Session storage, one entry per person | Sending a message | Kept for up to 3 hours in the same browser session; older messages are dropped |

## File Structure
```
checkdin/                         # this project folder
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app + the two endpoints
│   │   ├── matching.py           # the matching and ordering rules (pure Python)
│   │   ├── models.py             # request/reply shapes
│   │   └── data.py               # loads the JSON files
│   ├── data/
│   │   ├── airports.json         # the airport list for the Welcome picker
│   │   └── sample_people.json    # the pre-made sample people
│   ├── tests/
│   │   └── test_matching.py      # tests for each rule and for ordering
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js            # dev server + /api proxy to port 8000
│   └── src/
│       ├── main.jsx              # starts React
│       ├── App.jsx               # screen switching + shared state
│       ├── api.js                # the only code that calls the backend
│       ├── chatStore.js          # session-storage chat with 3-hour expiry
│       ├── dates.js              # valid-day rules for the date-of-birth pickers
│       ├── options.js            # the fixed lists (interests, venues, genders, months, years)
│       ├── time.js               # 12-hour pickers to 24-hour "HH:MM"
│       ├── styles.css            # colors, type, layout
│       ├── assets/
│       │   └── departures-board.*  # welcome picture
│       ├── screens/
│       │   ├── Welcome.jsx
│       │   ├── BasicInfo.jsx
│       │   ├── Interests.jsx
│       │   ├── NearbyPeople.jsx
│       │   └── Chat.jsx
│       └── components/
│           ├── PersonCard.jsx
│           ├── Avatar.jsx
│           ├── ChecklistDropdown.jsx
│           ├── AirportPicker.jsx
│           └── PrimaryButton.jsx
├── devpost/                      # Devpost learning workspace
├── .gitignore
└── README.md                     # how to run + demo script
```

## External Services and Dependencies
No external web services and no API keys. Everything runs on your machine. Libraries only:
- React, React DOM, Vite and the Vite React plugin: https://react.dev/ · https://vite.dev/
- FastAPI, Uvicorn, Pydantic: https://fastapi.tiangolo.com/ · https://www.uvicorn.org/ · https://docs.pydantic.dev/
- pytest: https://docs.pytest.org/
- Airport data: a bundled JSON file derived from an open dataset such as OurAirports (https://ourairports.com/data/). The licence and the exact subset (major airports with scheduled service) must be checked early in the build.

**Endpoints (both served by the backend):**
- `GET /api/airports` → `[ { "code": "LHR", "name": "London Heathrow Airport", "city": "London", "country": "United Kingdom" }, ... ]`
- `POST /api/matches` → body and reply as in Data Model. A badly formed body gets a 422 reply automatically.
- `GET /docs` (built into FastAPI) is a free page where you can try both endpoints by hand.

## Important Failure Modes
- **Backend isn't running or the request fails** → the airport picker shows "Can't reach the server. Is the backend running?" and Start stays disabled; on Nearby People the same message appears with a Retry button.
- **No matching people** → the PRD message "No matches found. Start over and try expanding your interests & choices" with the green Start Over button (`prd.md > States and Boundaries`).
- **Session storage unavailable** (some private windows) → chat still works for the current visit and just isn't remembered.
- **Camera capture on a desktop** → accepted as standard browser behavior (desktop browsers usually open the file picker; phones open the camera). No special handling, per the learner.

## What Was Simplified and Why
- **Pre-made sample people** instead of real users finding each other — real users need a shared database and live updates (`scope.md > Later`).
- **Fixed boarding times** in the data instead of times that move with the clock — so the demo is predictable; recording is planned for late afternoon or evening.
- **JSON files** instead of a database — the data is small and read-only.
- **No accounts or login** — not needed to prove matching and chat.
- **Session storage for chat** instead of a server — the PRD only needs 3 hours in the browser session.
- **Initials avatars for sample people** instead of photos — avoids real people's pictures and image files.
- **Screens chosen by a state value** instead of a routing library — five screens in a fixed order.

## Decisions and Open Issues
**Decisions (learner's choices):**
- React frontend and Python backend — their stated preference, and it supports their goal of learning how production apps are structured.
- FastAPI, Vite, plain CSS, no database, no login — recommended and accepted, in exchange for starting two programs instead of one.
- Demo on London Heathrow with fixed late-afternoon and evening sample times.

**Derived from those decisions (implementation details):** the exact endpoints, file layout, session-storage chat keys, avatar approach and the rule-by-rule code structure.

**Learner's question and how it will be checked:** "how, at what points frontend and backend will talk to each other." Clarified above (two calls). During the build, you will confirm it by opening the browser's developer tools Network tab and seeing exactly two `/api` requests in a normal run, and by trying both endpoints by hand on the `/docs` page.

**Open issues, to check early in the build:**
- Airport data source and licence for the bundled list (must include LHR).
- **Departures-board picture (decided):** the learner asked the agent to find one openly licensed image in the same color theme as the picture they attached (black board, yellow headings, white lettering). The build step that adds it records the source and licence in `README.md` and does not use the attached image unless its licence permits it. If no suitable image is found, the fallback is an original departures board drawn as an SVG in the same colors.
- How the "Say Hi" prompt works exactly: the chat opens with a "Say Hi" prompt that posts "Hi" as the first message, then the text box takes free typing. Adjust in the build if the learner wants a different feel.
- Boarding times are compared within the same day; a flight just after midnight is not handled.
- Exact package versions are unverified (no lookups yet).
