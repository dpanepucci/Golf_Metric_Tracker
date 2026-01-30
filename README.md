# Golf Metrics Tracker

## What the application does
Golf Metrics Tracker is a full‑stack web app for logging golf rounds and turning them into easy‑to‑read performance insights. It captures hole‑by‑hole data, calculates core stats (FIR, GIR, putts, scoring), and adds a gamified achievements system with player levels and unlockable themes.

## Features
- Secure user accounts with JWT‑based authentication.
- Guided round logging (9 or 18 holes) with hole‑by‑hole entry and a review step before saving.
- Automatic round totals: score, fairways hit, greens in regulation, and total putts.
- Year‑to‑date stats dashboard (FIR%, GIR%, average putts, rounds played).
- Previous rounds list with search by course name or score.
- Achievements system with medals, progress tracking, and special challenges.
- Player level system based on achievements unlocked.
- Theme unlocks tied to player level with saved preferences.

## Ease of use
- Simple onboarding: register, log in, and start tracking in minutes.
- Step‑by‑step round entry with back/next controls and progress feedback.
- Clear summaries before submission and straightforward navigation across pages.
- Stats and achievements update automatically after each round.

## Tech stack
### Frontend
- React with TypeScript
- Vite for development and builds
- React Router for navigation
- Local storage for session token and theme preference

### Backend
- FastAPI for the REST API
- Supabase DB
- JWT authentication with password hashing
- Pydantic for request/response schemas

