"""The matching rules: CheckdIn's kernel.

Pure Python with no web code, so the rules are easy to read and to test.
A traveler is matched with sample people who are at the same airport, boarding
within an hour of them, and who pass an interest rule or a venue rule.
"""

from datetime import date

MAX_MATCHES = 5
MAX_GAP_MINUTES = 60

OPEN_TO_TALK = "Just open to talk"
ANY_PLACE = "Any place is good"

# People interested in any of these three match each other.
BUSINESS_INTERESTS = {"Startups", "Technology", "Markets"}

# People who like places in the same group match each other.
VENUE_GROUPS = [
    {"Bar", "Restaurant"},
    {"Cafe", "Lounge"},
]


def minutes_since_midnight(hhmm):
    """'18:05' -> 1085. Boarding times are compared within the same day."""
    hours, minutes = hhmm.split(":")
    return int(hours) * 60 + int(minutes)


def age_in_years(date_of_birth, today=None):
    """'1991-03-14' -> age in whole years today. Empty or missing -> None (they didn't share it).
    Only the age leaves the backend, never the date of birth itself."""
    if not date_of_birth:
        return None
    today = today or date.today()
    born = date.fromisoformat(date_of_birth)
    had_birthday = (today.month, today.day) >= (born.month, born.day)
    return today.year - born.year - (0 if had_birthday else 1)


def interests_match(mine, theirs):
    """Interest rule: a shared interest, or either is open to talk,
    or both like Startups / Technology / Markets."""
    mine, theirs = set(mine), set(theirs)
    if mine & theirs:
        return True
    if OPEN_TO_TALK in mine or OPEN_TO_TALK in theirs:
        return True
    return bool(mine & BUSINESS_INTERESTS) and bool(theirs & BUSINESS_INTERESTS)


def venues_match(mine, theirs):
    """Venue rule: either is happy with any place, or both like places in
    the same group (Bar/Restaurant, or Cafe/Lounge)."""
    mine, theirs = set(mine), set(theirs)
    if ANY_PLACE in mine or ANY_PLACE in theirs:
        return True
    return any(mine & group and theirs & group for group in VENUE_GROUPS)


def find_matches(airport_code, boarding_time, interests, venues, people, today=None):
    """Return up to five people who match this traveler, best first.

    Required: same airport and boarding times within MAX_GAP_MINUTES.
    Then the interest rule OR the venue rule must pass.
    Order: closest boarding time, then interest match, then venue match.
    """
    my_minutes = minutes_since_midnight(boarding_time)
    found = []

    for person in people:
        if person["airport_code"] != airport_code:
            continue
        gap = abs(minutes_since_midnight(person["boarding_time"]) - my_minutes)
        if gap > MAX_GAP_MINUTES:
            continue

        on_interest = interests_match(interests, person["interests"])
        on_venue = venues_match(venues, person["venues"])
        if not (on_interest or on_venue):
            continue

        found.append((gap, on_interest, on_venue, person))

    # Smallest gap first; at the same gap, people who match on interest, then on venue.
    found.sort(key=lambda item: (item[0], not item[1], not item[2]))

    return [
        {
            "id": person["id"],
            "name": person["name"],
            "profession": person["profession"],
            "interests": person["interests"],
            "venues": person["venues"],
            "native_city": person.get("native_city", ""),
            "favorite_place": person["favorite_place"],
            "boarding_time": person["boarding_time"],
            "gate": person.get("gate", ""),
            "age": age_in_years(person.get("date_of_birth"), today),
            "photo_url": person.get("photo_url", ""),
            "matched_on_interest": on_interest,
            "matched_on_venue": on_venue,
        }
        for _, on_interest, on_venue, person in found[:MAX_MATCHES]
    ]
