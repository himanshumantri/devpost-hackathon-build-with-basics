# CheckdIn

**CheckdIn is an airport networking web app.** You're through security with some free time. CheckdIn matches you with other travelers at the same airport who board around the same time as you and share your interests, so you can say hi in a chat and agree on a cafe or bar to meet at.

It's a proof of concept built for the Devpost *Build With AI: Basics* hackathon. It works on phones and desktops in the browser.

## Live demo

- **App (frontend, Vercel):** https://checkdin.vercel.app/
- **API (backend, Render):** https://checkdin-api.onrender.com (for example, [/api/airports](https://checkdin-api.onrender.com/api/airports))

The backend is on a free plan and goes to sleep when idle, so the first load after a quiet spell can take up to a minute.

> **Important:** the people you are matched with are **fictional sample people** stored in a data file, and they don't reply in chat. Real users finding each other live would need a shared backend, which is out of scope for this proof of concept.

## How it works

Two programs run side by side on your computer:

- **Frontend** (`frontend/`): the app you see in the browser. React + Vite.
- **Backend** (`backend/`): a small Python (FastAPI) program that holds the airport list and the sample people, and applies the matching rules.

They talk in only **two places**:

1. When the Welcome screen opens, the frontend asks the backend for the airport list (`GET /api/airports`).
2. When you reach Nearby People, the frontend sends your airport, boarding time, interests and venue choices, and the backend replies with up to five matching people (`POST /api/matches`).

Everything else stays in your browser: your name and picture are never sent anywhere, and chats are kept in session storage for up to 3 hours.

### The matching rules

A person is shown if they are **at your airport** and **boarding within one hour of you**, and they pass **either** an interest rule **or** a venue rule:

- **Interests:** a shared interest, or either of you is "Just open to talk", or you both like Startups / Technology / Markets.
- **Venues:** either of you is happy with "Any place is good", or you both like Bar/Restaurant, or you both like Cafe/Lounge.

Results are ordered by closest boarding time, then interest match, then venue match, and limited to five. The rules live in [`backend/app/matching.py`](backend/app/matching.py).

## Running it

You need **Python 3.11** and **Node.js 24** with npm. (It was built and tested with these versions.)

Open **two terminal windows**, each starting in this project's top folder. Each program has its own folder (`backend` and `frontend`), and its commands only work from inside that folder. That is why each block below begins with `cd`.

**Terminal 1: the backend**

```
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows PowerShell
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 2: the frontend**

```
cd frontend
npm install
npm run dev
```

When it starts, the terminal prints a line like `Local: http://localhost:5173/`. Open that address in your browser. (If a message says the port is already in use, another copy is still running; stop it first.) The frontend forwards anything starting with `/api` to the backend on port 8000, so you only open one address.

To try it on a phone on the same Wi-Fi, run `npm run dev -- --host` instead and open the network address it prints.

## Demo path

The sample people are at London Heathrow (LHR) between 4:40 PM and 9:30 PM, plus one person at New York JFK.

1. **Welcome:** pick **London Heathrow Airport**, set the boarding time to **6:00 PM**, and press **Start**.
2. **Basic Information:** add a picture (upload or camera), a name, a profession and a gender, then **Continue**. (Date of birth and native city are optional.)
3. **Interests:** open the dropdowns and choose **Startups** and **Cafe**, then **Continue**.
4. **Nearby people:** you should see **James Whitfield, Sofia Marino, Aisha Rahman and Daniel Okafor**, in that order.
5. **Chat:** press **Chat** on one of them, press **Hi**, type a message, use the **←** arrow to go back, and open someone else.
6. **No matches:** press **Start Over** after choosing, for example, JFK with Careers and Bar, to see the "No matches found" message.

## Running the tests

```
cd backend
pytest
```

The tests cover each matching rule, the one-hour window, the ordering, the five-person limit, the demo path above, and the API's handling of bad input.

## Project layout

```
backend/
  app/            main.py (the two endpoints), matching.py (the rules), models.py, data.py
  data/           airports.json, sample_people.json
  tests/          test_matching.py
frontend/
  src/            App.jsx, api.js, chatStore.js, dates.js, time.js, options.js, styles.css
  src/screens/    Welcome, BasicInfo, Interests, NearbyPeople, Chat
  src/components/ AirportPicker, ChecklistDropdown, PersonCard, Avatar, PrimaryButton
devpost/          the planning documents (scope, PRD, spec, build checklist)
```

## Credits and licences

- **Airport list** (`backend/data/airports.json`): derived from [OurAirports](https://ourairports.com/data/) open data (public domain), keeping large and medium airports with scheduled service and an IATA code.
- **Sample people** are entirely fictional.
- **Sample-people portraits** (`frontend/public/people/`): free CC0 (public domain) photos from Wikimedia Commons, cropped to the face and resized. The people are fictional, so these photos are only illustrations and do not show the people named. Photographers:
  - James Whitfield: [Gray-haired man portrait (Unsplash).jpg](https://commons.wikimedia.org/wiki/File%3AGray-haired_man_portrait_%28Unsplash%29.jpg) by Foto  Sushi fotosushi, CC0
  - Daniel Okafor: [Scott James Reeves Portrait – Professional Headshot of Scott James Reeves in Blue Blazer.jpg](https://commons.wikimedia.org/wiki/File%3AScott_James_Reeves_Portrait_%E2%80%93_Professional_Headshot_of_Scott_James_Reeves_in_Blue_Blazer.jpg) by Scott James Reeves, CC0
  - Lucas Becker: [Always smile (Unsplash).jpg](https://commons.wikimedia.org/wiki/File%3AAlways_smile_%28Unsplash%29.jpg) by michael m_minimal, CC0
  - Tom Hughes: [Portrait of a smiling person with reddish-brown hair, 2026.jpg](https://commons.wikimedia.org/wiki/File%3APortrait_of_a_smiling_person_with_reddish-brown_hair%2C_2026.jpg) by Matt Southy, CC0
  - Priya Nair: [Smiling woman (Unsplash).jpg](https://commons.wikimedia.org/wiki/File%3ASmiling_woman_%28Unsplash%29.jpg) by Allef Vinicius seteales, CC0
  - Sofia Marino: [Brunette woman portrait (Unsplash).jpg](https://commons.wikimedia.org/wiki/File%3ABrunette_woman_portrait_%28Unsplash%29.jpg) by Christopher Campbell chrisjoelcampbell, CC0
  - Aisha Rahman: [Smiling woman pink shirt.jpg](https://commons.wikimedia.org/wiki/File%3ASmiling_woman_pink_shirt.jpg) by Joshua McKnight, CC0
  - Mei Tan: [Woman in red t-shirt smiling and looking down.jpg](https://commons.wikimedia.org/wiki/File%3AWoman_in_red_t-shirt_smiling_and_looking_down.jpg) by Chu Chup Hinh, CC0
  - Elena Rossi: [Smiling woman by a window (Unsplash NoRsyXmHGpI).jpg](https://commons.wikimedia.org/wiki/File%3ASmiling_woman_by_a_window_%28Unsplash_NoRsyXmHGpI%29.jpg) by Brooke Cagle brookecagle, CC0
- **Departures-board photo** on the Welcome screen: "Airport departures board free photo - Melbourne Airport timetable" by Marek Ślusarczyk (Tupungato), licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Source: https://commons.wikimedia.org/wiki/File:47_Airport_departures_board_free_photo_-_Melbourne_Airport_timetable_-_Creative_Commons_Attribution.jpg. The image was resized to 1000 px wide.
- **Page background** (airport terminal window): [Airport terminal window sun (Unsplash).jpg](https://commons.wikimedia.org/wiki/File%3AAirport_terminal_window_sun_%28Unsplash%29.jpg) by Matthew Smith, CC0, via Wikimedia Commons. Cropped, resized and compressed.
