"""The shapes of what the frontend sends and what the backend replies.

FastAPI checks incoming data against these automatically: a request that
doesn't fit (a bad time, an unknown interest) gets a 422 reply.
"""
from typing import Literal

from pydantic import BaseModel, Field

Interest = Literal[
    "Startups", "Technology", "Markets", "Travel", "Careers", "Just open to talk"
]
Venue = Literal["Any place is good", "Cafe", "Bar", "Lounge", "Restaurant"]


class MatchRequest(BaseModel):
    airport_code: str = Field(min_length=3, max_length=4)
    boarding_time: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")  # "HH:MM", 24-hour
    interests: list[Interest] = Field(min_length=1)
    venues: list[Venue] = Field(min_length=1)


class Match(BaseModel):
    id: str
    name: str
    profession: str
    interests: list[str]
    favorite_place: str
    boarding_time: str
    gate: str
    age: int | None
    photo_url: str
    matched_on_interest: bool
    matched_on_venue: bool


class MatchResponse(BaseModel):
    matches: list[Match]
