"""Tests for the matching rules. Run from the backend folder with: pytest"""
from fastapi.testclient import TestClient

from app.data import SAMPLE_PEOPLE
from app.main import app
from app.matching import find_matches, interests_match, venues_match


def person(pid, time="18:00", airport="LHR", interests=("Travel",), venues=("Cafe",)):
    return {
        "id": pid,
        "name": pid,
        "profession": "Tester",
        "airport_code": airport,
        "boarding_time": time,
        "interests": list(interests),
        "venues": list(venues),
        "favorite_place": "",
    }


def ids(matches):
    return [m["id"] for m in matches]


# --- Interest rule -----------------------------------------------------

def test_shared_interest_matches():
    assert interests_match(["Travel", "Careers"], ["Careers"])


def test_no_shared_interest_does_not_match():
    assert not interests_match(["Travel"], ["Careers"])


def test_open_to_talk_matches_anyone_from_either_side():
    assert interests_match(["Just open to talk"], ["Careers"])
    assert interests_match(["Careers"], ["Just open to talk"])


def test_startups_technology_markets_match_each_other():
    assert interests_match(["Startups"], ["Markets"])
    assert interests_match(["Technology"], ["Startups"])


def test_travel_and_startups_do_not_match():
    assert not interests_match(["Travel"], ["Startups"])


# --- Venue rule --------------------------------------------------------

def test_bar_and_restaurant_match():
    assert venues_match(["Bar"], ["Restaurant"])


def test_cafe_and_lounge_match():
    assert venues_match(["Cafe"], ["Lounge"])


def test_cafe_and_bar_do_not_match():
    assert not venues_match(["Cafe"], ["Bar"])


def test_any_place_matches_everything_from_either_side():
    assert venues_match(["Any place is good"], ["Bar"])
    assert venues_match(["Lounge"], ["Any place is good"])


# --- Filters: airport and one hour -------------------------------------

def test_other_airport_is_excluded():
    people = [person("far", airport="JFK", interests=("Travel",))]
    assert find_matches("LHR", "18:00", ["Travel"], ["Cafe"], people) == []


def test_exactly_sixty_minutes_apart_is_included_and_sixty_one_is_not():
    people = [person("edge", time="19:00"), person("outside", time="19:01")]
    result = find_matches("LHR", "18:00", ["Travel"], ["Cafe"], people)
    assert ids(result) == ["edge"]


def test_earlier_boarding_within_an_hour_is_included():
    people = [person("earlier", time="17:00")]
    assert ids(find_matches("LHR", "18:00", ["Travel"], ["Cafe"], people)) == ["earlier"]


def test_either_rule_is_enough():
    interest_only = person("interest-only", interests=("Travel",), venues=("Bar",))
    venue_only = person("venue-only", interests=("Careers",), venues=("Lounge",))
    neither = person("neither", interests=("Careers",), venues=("Bar",))
    result = find_matches("LHR", "18:00", ["Travel"], ["Cafe"], [interest_only, venue_only, neither])
    assert sorted(ids(result)) == ["interest-only", "venue-only"]


# --- Ordering and limit ------------------------------------------------

def test_closest_boarding_time_comes_first():
    people = [person("far", time="18:50"), person("near", time="18:10")]
    assert ids(find_matches("LHR", "18:00", ["Travel"], ["Cafe"], people)) == ["near", "far"]


def test_same_gap_interest_match_beats_venue_only():
    venue_only = person("venue-only", time="18:20", interests=("Careers",), venues=("Cafe",))
    interest_only = person("interest-only", time="17:40", interests=("Travel",), venues=("Bar",))
    both = person("both", time="18:20", interests=("Travel",), venues=("Cafe",))
    result = find_matches("LHR", "18:00", ["Travel"], ["Cafe"], [venue_only, interest_only, both])
    # all three are 20 minutes away: interest-and-venue, then interest-only, then venue-only
    assert ids(result) == ["both", "interest-only", "venue-only"]


def test_no_more_than_five_are_returned():
    people = [person(f"p{i}", time=f"18:{i:02d}") for i in range(8)]
    result = find_matches("LHR", "18:00", ["Travel"], ["Cafe"], people)
    assert ids(result) == ["p0", "p1", "p2", "p3", "p4"]


# --- The real sample people (the demo path) ----------------------------

def test_demo_path_lhr_6pm_startups_and_cafe():
    result = find_matches("LHR", "18:00", ["Startups"], ["Cafe"], SAMPLE_PEOPLE)
    assert ids(result) == ["james-whitfield", "sofia-marino", "aisha-rahman", "daniel-okafor"]


def test_demo_path_excludes_far_and_other_airport_people():
    result = ids(find_matches("LHR", "18:00", ["Startups"], ["Cafe"], SAMPLE_PEOPLE))
    assert "tom-hughes" not in result  # boards at 21:30, outside the hour
    assert "elena-rossi" not in result  # at JFK
    assert "priya-nair" not in result  # boards at 16:40, 80 minutes away


def test_jfk_returns_only_elena():
    result = find_matches("JFK", "18:00", ["Startups"], ["Cafe"], SAMPLE_PEOPLE)
    assert ids(result) == ["elena-rossi"]


def test_unknown_airport_returns_nobody():
    assert find_matches("XXX", "18:00", ["Startups"], ["Cafe"], SAMPLE_PEOPLE) == []


# --- The endpoint ------------------------------------------------------

client = TestClient(app)


def test_endpoint_returns_matches():
    reply = client.post(
        "/api/matches",
        json={"airport_code": "LHR", "boarding_time": "18:00", "interests": ["Startups"], "venues": ["Cafe"]},
    )
    assert reply.status_code == 200
    names = [m["name"] for m in reply.json()["matches"]]
    assert names == ["James Whitfield", "Sofia Marino", "Aisha Rahman", "Daniel Okafor"]


def test_endpoint_rejects_a_badly_formed_time():
    reply = client.post(
        "/api/matches",
        json={"airport_code": "LHR", "boarding_time": "6pm", "interests": ["Startups"], "venues": ["Cafe"]},
    )
    assert reply.status_code == 422


def test_endpoint_rejects_empty_interests_and_unknown_values():
    base = {"airport_code": "LHR", "boarding_time": "18:00", "interests": ["Startups"], "venues": ["Cafe"]}
    assert client.post("/api/matches", json={**base, "interests": []}).status_code == 422
    assert client.post("/api/matches", json={**base, "venues": ["Spa"]}).status_code == 422


def test_airports_endpoint_includes_heathrow():
    airports = client.get("/api/airports").json()
    assert any(a["code"] == "LHR" for a in airports)
