---
doc: scope
status: approved
---

# CheckdIn

An airport networking web app (mobile and desktop) that matches travelers at the same airport, with similar boarding times and shared interests, and lets them chat to agree on a cafe or bar to meet at.

## The Unique Kernel
Matching is built around airport time and place, not just interests. Two people are matched when they are at the same airport, board within an hour of each other, and share interests plus a cafe/bar or food preference. That adds the "where, and do we have time" layer that WhatsApp-status posts and chat groups don't.

## Who It's For
A busy professional: a consultant, startup founder, VC or PE investor, or senior CXO at a startup or corporate. They are through security with free time, today sitting alone at a coffee shop, bar or lounge, or reading a book or magazine. They'd like to meet someone new to open up an idea, learn about user trends, deepen an existing idea, or validate a thesis with a like-minded person. Some already post on WhatsApp status or chat groups hoping to meet others at their airport.

## The Core Loop
Open CheckdIn at the airport. Enter who you are, which airport you're at, your boarding time, your cafe/bar preference and your interests. See a ranked list of nearby people worth meeting, then open a chat with one, decide on a common place, and go back to the list to chat with others.

## Inspiration & Identity
Not stated yet. The only reference so far is the way people post on WhatsApp status and chat groups to find others at their airport. `3-prd` will ask about look and feel.

## Why This Matters to the Learner
They're excited by "connecting people at the airport for leisure/networking." Their learning goal is "how to build production app with coding agent," so the plan-first habits (scoping, requirements, testable behavior, verifying each step) matter as much as the app itself.

## What "Working" Looks Like
A demo video on two phone screens, running the same four flows one after another:
1. **Welcome:** "Welcome to CheckdIn," a departures-board picture, current airport, boarding time and optional gate, and a START button.
2. **Basic information:** picture, name, profession, gender, and optional DOB and native city.
3. **Interests:** interests and venue preferences (plus an optional favorite place at the airport). This is the matching step.
4. **Nearby people:** up to five matched people, ordered by closest boarding time, each with a chat option and, if given, a favorite place. From chat you can go back to the list and open chat with the same or another person.

The "oh, that's cool" beat: the list appears with matched people, each with a favorite place to meet if they gave one, and tapping chat opens a conversation that starts with "Hi."

(Updated during `3-prd`: airport, boarding time and gate moved to the Welcome screen, and the suggested place became each person's own favorite place instead of a computed recommendation. See `prd.md` for the full definition.)

## The POC Boundary
- The four flows above, working in a browser on phone-sized and desktop screens.
- Matching on same airport, boarding time within one hour, and interest overlap, with results ranked by shared interest.
- The matched people are pre-made sample people, and their chat replies are simulated.
- Contact details such as phone numbers and social profiles are never collected or shown, so they can't be exposed before meeting.

## Later
- Real people finding each other and chatting live across two or more phones (needs a shared backend).
- A mutual request-and-accept step before chat opens.
- Meetups of three or more people.
- Safety features such as blocking and reporting.
- Real flight and boarding verification, and real airport and venue data.

## Explicitly Cut
- Live two-phone chat between real users: a bigger build than fits a 2–4 hour proof of concept.
- Accounts and login: not needed to prove the matching and chat.
- Push notifications: not needed for the demo.
