"""The CheckdIn backend: a small program that answers requests from the frontend."""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .data import AIRPORTS, SAMPLE_PEOPLE
from .matching import find_matches
from .models import MatchRequest, MatchResponse

app = FastAPI(title="CheckdIn API")

# Websites allowed to call this API from a browser, set as a comma-separated list,
# e.g. CORS_ORIGINS=https://checkdin.vercel.app. Not needed locally (the Vite proxy is used).
allowed_origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


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
