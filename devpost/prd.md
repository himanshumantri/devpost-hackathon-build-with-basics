---
doc: prd
status: approved
---

# CheckdIn — Product Requirements

CheckdIn is a mobile and desktop web app that matches travelers at the same airport, with similar boarding times and shared interests, so they can chat and agree on a place to meet. It is for busy professionals (consultants, founders, VC/PE investors, senior CXOs) with free time before a flight.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`, `scope.md > The Core Loop`.

## The Core Journey
1. The person opens CheckdIn and sees the welcome screen. They pick their airport, enter their boarding time and optionally their boarding gate, then press **Start**.
2. On the Basic Information screen they add a picture, name, profession and gender (plus optional DOB and native city), then press **Continue**.
3. On the Interests screen they choose interests and venue types, optionally name a favorite place at the airport, then press **Continue**.
4. On the Nearby People screen they see up to five matched people, ordered by closest boarding time.
5. They press **Chat** on a person, say "Hi," and talk. They use the back arrow to return to the list and can open a chat with the same or another person.
6. Success: the person has a chat open with a matched stranger who is at their airport and boarding around the same time.

Source: `scope.md > What "Working" Looks Like`, `scope.md > The Core Loop`.

## Screens and Layout
Four screens in a fixed order, plus a chat screen reached from the fourth. One column on phones and the same layout, centered, on desktop.

1. **Welcome** (flow 1).
2. **Basic Information** (flow 2).
3. **Interests** (flow 3).
4. **Nearby People** (flow 4).
5. **Chat** (opened from Nearby People; the back arrow returns to it).

## Look and Feel
- Friendly type, minimal screens, inspired by LinkedIn's clean single-background look.
- The single background color is **white**. Ordinary text is therefore dark (assumption: the learner said white text on a single-colored background for LinkedIn's style, and chose a white background).
- Buttons (**Start**, **Continue**, **Start Over**) are white text on a green background.
- The departures-board picture appears only on the Welcome screen; it is not the style for the other screens.

## Features and Behavior

### Welcome (flow 1)
Top to bottom: "Welcome to CheckdIn," the departures-board picture, three fields, and the green **Start** button.
- **Airport:** picked from a global list. Required.
- **Boarding time:** three pickers: hour (1–12), minutes (00–59), AM/PM. Required. The time means today.
- **Boarding gate:** typed manually. Optional.
- **Start** is disabled until airport and boarding time are filled in.
  - [ ] With airport or boarding time empty, Start is disabled.
  - [ ] With both filled and gate empty, Start is enabled and moves to Basic Information.
  - [ ] The airport can only be chosen from the list, not typed freely.

### Basic Information (flow 2)
Fields in this order:
1. **Picture** in a frame, captured with the camera or uploaded from the phone. Required.
2. **Name**, typed. Required.
3. **DOB**, three pickers: date, month, year (1950–2020). Optional, but tight: the date choices follow the chosen month and year (no 31 April; 29 February only in leap years), changing the month or year to one that makes the chosen date impossible clears the date, and DOB is either all three chosen or all three empty.
4. **Profession**, typed. Required.
5. **Gender**, one choice from: Male, Female, Bisexual, Transgender, Prefer not to say. Required.
6. **Native city**, typed. Optional.

A green **Continue** button (same design as Start) moves to Interests.
  - [ ] Continue is disabled until picture, name, profession and gender are filled in.
  - [ ] Leaving DOB and native city empty does not block Continue.
  - [ ] The date picker offers only valid days for the chosen month and year, and switching to a month or year that makes the chosen date impossible clears the date.
  - [ ] With only some of date, month and year chosen, a hint appears and Continue is disabled; with all three or none, Continue is not blocked by DOB.
  - [ ] Both camera capture and upload put the chosen picture in the frame.

### Interests (flow 3)
Two dropdowns, each holding a checklist; both are closed when the person arrives from Basic Information.
- **Interests** (multi-select): Startups, Technology, Markets, Travel, Careers, "Just open to talk." Required (at least one).
- **Venue preference** (multi-select): "Any place is good," Cafe, Bar, Lounge, Restaurant. Required (at least one).
- **Favorite place:** a text box with the faint italic hint "Enter one of your favorite ones on this airport," which clears when the cursor enters it. Optional.

A green **Continue** button moves to Nearby People (assumed same button as flow 2).
  - [ ] Both dropdowns start closed.
  - [ ] More than one option can be ticked in each.
  - [ ] Continue is disabled until at least one interest and at least one venue preference are chosen.
  - [ ] The hint text disappears when the person clicks into the favorite-place box.

### Nearby People (flow 4)
A list of up to five matched people. Each person has two rows:
- **Row 1:** picture (left-most), name, **Chat** button.
- **Row 2:** profession, interests as tags, and the person's favorite place if they entered one.

**Who is shown.** A person is shown if both are true:
1. Same airport and boarding times within one hour of each other.
2. They pass an interest rule or a venue rule (either is enough):
   - Interest rules: a shared interest; "Just open to talk" matches anyone at that airport; Startups, Technology and Markets match each other.
   - Venue rules: Bar and Restaurant match each other; Cafe and Lounge match each other; "Any place is good" matches anyone.

**Order.** Closest boarding time first, then interest match, then venue match. Show at most five.
  - [ ] People at a different airport, or more than one hour apart, never appear.
  - [ ] Someone who is "Just open to talk" appears for anyone at their airport and time window.
  - [ ] A Startups person matches a Markets person.
  - [ ] A Bar person matches a Restaurant person, but not a Cafe-only person (unless another rule passes).
  - [ ] No more than five people are shown, with the closest boarding time at the top.
  - [ ] Tapping Chat opens the chat with that person.

### Chat
- The other person's name is at the top; a left-arrow back control is at the top left and returns to the list.
- The person is prompted to say "Hi." Their "Hi" appears as a preset first message; after that they type freely.
- Chats are remembered for up to 3 hours in the browser session; returning to the same person shows the earlier conversation.
  - [ ] The other person's name appears at the top.
  - [ ] Pressing the back arrow returns to the list.
  - [ ] Opening a chat with the same person again within 3 hours shows the earlier messages.
  - [ ] Opening a chat with a different person starts a separate conversation.

## States and Boundaries
- **First use:** the Welcome screen with Start disabled until the required fields are filled.
- **No matches:** the Nearby People screen shows the message "No matches found. Start over and try expanding your interests & choices," followed by a green **Start Over** button (same design as Start) that returns to Welcome.
  - [ ] With no matching people, the message and the Start Over button appear instead of a list.
  - [ ] Start Over returns to the Welcome screen.
- **Persistence:** chats are kept for up to 3 hours in the browser session only. Nothing is stored beyond that.
- **Privacy boundary:** phone numbers and social profiles are never asked for or shown.
- **People shown:** pre-made sample people (see Product Decisions).

## Product Decisions
- Airport, boarding time and gate sit on the Welcome screen, not on Basic Information, because that is how the learner restructured the flows.
- Departures-board picture is only for the Welcome screen; other screens are minimal and LinkedIn-inspired, because the learner wants a friendly, professional feel.
- Matches pass on either an interest rule or a venue rule, to show more people.
- Order is closest boarding time, then interest, then venue, to put the people most likely to be reachable in the airport time window first.
- Maximum five people, to keep the list short and demo-friendly.
- Matched people are pre-made samples, not real users, to keep the build inside the proof-of-concept size (`scope.md > Explicitly Cut`).
- Chat starts with a preset "Hi," then free typing, and is remembered for up to 3 hours in the browser session.

- Background is white, with green buttons and white button text, to keep every screen minimal and LinkedIn-like.
- Minutes picker offers 00–59 and sample people send no automatic replies after the first "Hi" (confirmed by the learner).
- No-matches message and the green "Start Over" button as written under States and Boundaries (confirmed by the learner).

### Assumptions (not yet confirmed by the learner)
- Boarding time means today.
- The Interests screen's button is the same green "Continue."
- Ordinary text is dark on the white background.
- Sample people's data is prepared so the demo shows several matches and can also show the no-match case.

## What We're Building
- The five screens above with their required fields, disabled buttons and rules.
- Matching and ordering as defined under Nearby People, over pre-made sample people.
- The chat screen with the back arrow, preset "Hi," typed messages and 3-hour memory in the browser session.
- The no-matches message.
- The look: friendly type, minimal screens, green buttons with white text, departures picture on Welcome.

## Deferred From the POC
- Real people finding each other and chatting live across phones: needs a shared backend (`scope.md > Later`).
- Mutual request-and-accept before chat: not needed to prove matching and chat.
- Accounts and login: not needed for the demo.
- Chat memory beyond the browser session.

## Possible Later Enhancements
- Meetups of three or more people.
- Blocking and reporting.
- Real flight and boarding verification, and real airport and venue data.
- Suggested meeting places taken from real airport venues.

## Non-Goals
- No phone numbers or social profiles: protecting privacy before meeting is the point.
- No push notifications: not needed for the demo.
- No automatic matching on anything outside the rules above.

## Open Questions
- None blocking `4-spec`. The remaining assumptions above can be corrected at any time.
