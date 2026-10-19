"""The CheckdIn backend: a small program that answers requests from the frontend."""
from fastapi import FastAPI

from .data import AIRPORTS, SAMPLE_PEOPLE
from .matching import find_matches
from .models import MatchRequest, MatchResponse

app = FastAPI(title="CheckdIn API")


@app.get("/api/airports")
def get_airports():
    """Call 1 of 2: the Welcome screen asks for the list of airports."""
    return AIRPORTS


@app.post("/api/matches", response_model=MatchResponse)
def post_matches(request: MatchRequest):
    """Call 2 of 2: the Nearby People screen sends what the traveler entered
    and gets back up to five matching sample people, best first."""
    matches = find_matches(
        request.airport_code,
        request.boarding_time,
        request.interests,
        request.venues,
        SAMPLE_PEOPLE,
    )
    return {"matches": matches}
