# CheckdIn

An airport networking web app. Travelers at the same airport, boarding around the same time and sharing interests, get matched and can chat to agree on a place to meet.

This README is a work in progress; the full run instructions and demo script are added in the final build step.

## Running it (so far)

Backend (terminal 1):

```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend (terminal 2):

```
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

## Credits and licences

- **Departures-board photo** on the Welcome screen: "Airport departures board free photo - Melbourne Airport timetable" by Marek Ślusarczyk (Tupungato), licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Source: https://commons.wikimedia.org/wiki/File:47_Airport_departures_board_free_photo_-_Melbourne_Airport_timetable_-_Creative_Commons_Attribution.jpg. The image was resized to 1000 px wide.
- **Airport list** (`backend/data/airports.json`): derived from [OurAirports](https://ourairports.com/data/) open data (public domain), keeping large and medium airports with scheduled service and an IATA code.
