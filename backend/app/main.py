"""The CheckdIn backend: a small program that answers requests from the frontend."""
from fastapi import FastAPI

from .data import AIRPORTS

app = FastAPI(title="CheckdIn API")


@app.get("/api/airports")
def get_airports():
    """Call 1 of 2: the Welcome screen asks for the list of airports."""
    return AIRPORTS
