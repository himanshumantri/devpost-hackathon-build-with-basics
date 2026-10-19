"""Loads the JSON data files once, when the backend starts."""
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def load_json(filename):
    with open(DATA_DIR / filename, encoding="utf-8") as f:
        return json.load(f)


AIRPORTS = load_json("airports.json")
SAMPLE_PEOPLE = load_json("sample_people.json")  # fictional people, for the demo
