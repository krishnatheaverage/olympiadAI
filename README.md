# OlympiadAI

OlympiadAI is a Next.js training platform for students preparing for olympiad-style STEM competitions. It combines a premium dashboard UI with real contest problem archives, AI-generated roadmaps, Socratic tutoring, worked hints, and progress tracking across math, chemistry, and physics tracks.

The current app is built around AMC, AIME, USAMO, USNCO, F=ma, and USAPhO-style preparation, with data tooling in the repo for ingesting and cleaning public problem archives.

## Highlights

- Personalized roadmap generation based on track, goal, and current level
- Trainer interface with contest filters, topic filters, scratchpad, and answer checking
- Socratic AI tutor that reacts to the student's messages and scratch work
- Progressive hint flow with Hint 1, Hint 2, and full solution generation
- Student dashboard with accuracy, streaks, heatmaps, recent activity, and leaderboard data
- Supabase-backed auth, profile state, activity logging, and problem storage
- Problem ingestion and cleanup scripts for AMC, AIME, F=ma, USAPhO, and USNCO datasets

## Product Surfaces

- `/` - marketing landing page
- `/login` - sign in, sign up, password reset
- `/roadmap` - goal intake and roadmap generation
- `/dashboard` - analytics, streaks, recent activity, and leaderboard
- `/trainer` - main problem-solving workspace
- `/tutor` - separate tutor experience
- `/settings` - account preferences

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase for auth and database access
- Anthropic for tutoring, hints, and difficulty rating
- OpenAI for roadmap generation
- KaTeX for math rendering

## How It Works

### Frontend

The UI lives in the App Router under `app/` and is built as a polished single-product experience with a landing page, auth flow, roadmap generation, dashboard analytics, and a trainer workspace.

### Data Layer

Problem content is fetched from Supabase through `lib/supabase.ts` and normalized in `lib/problems.ts`. The trainer filters problems by contest, topic, and difficulty, then records graded attempts back to Supabase.

### AI Layer

- `app/api/roadmap/route.ts` uses OpenAI to generate a 4-phase study plan
- `app/api/solve/route.ts` uses Anthropic to generate two hints plus a full solution
- `app/api/tutor/route.ts` uses Anthropic to run a Socratic chat tutor, including image-aware tutoring when a problem has an attached diagram
- `app/api/rate-difficulty/route.ts` uses Anthropic to batch-label problems as `easy`, `medium`, or `hard`

### Data Ingestion

The `scripts/` directory contains one-off and batch utilities for seeding problems, cleaning dumps, patching latex formatting, wiring images, and importing public contest archives into Supabase.

## Repository Tour

```text
app/
  api/                  API routes for roadmap, tutor, solve, leaderboard, and rating
  auth/                 Supabase auth callback and reset flow
  dashboard/            Logged-in analytics experience
  roadmap/              Goal onboarding and study-plan generation
  trainer/              Problem solving workspace
components/             Shared UI pieces like navbar, footer, background, and latex renderer
lib/                    Auth, Supabase access, problem utilities, and sample roadmap data
public/                 Static assets and problem images
scripts/                Problem import, cleanup, and dataset maintenance tools
supabase_setup.sql      Profiles table, RLS policies, and user_activity migration
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

Add the following variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client-side Supabase access |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Cross-user leaderboard reads and email-based display names |
| `ANTHROPIC_API_KEY` | Recommended | `/api/tutor`, `/api/solve`, `/api/rate-difficulty`, and several data cleanup scripts |
| `OPENAI_API_KEY` | Optional but recommended | `/api/roadmap` personalized roadmap generation |
| `SCRAPINGBEE_API_KEY` | Optional | Certain scraping and repair scripts in `scripts/` |

Behavior when keys are missing:

- Without `ANTHROPIC_API_KEY`, the tutor is disabled and `/api/solve` falls back to demo hints
- Without `OPENAI_API_KEY`, roadmap generation falls back to demo phases
- Without `SUPABASE_SERVICE_ROLE_KEY`, the global leaderboard cannot reliably read cross-user activity under RLS

### 3. Set up Supabase

Run `supabase_setup.sql` in the Supabase SQL editor.

Important: this SQL file creates and configures `profiles` and updates `user_activity`, but it assumes these core tables already exist:

- `olympiad_problems`
- `user_activity`

The application expects those tables to hold the problem bank and submission history.

### 4. Start the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### 5. Lint

```bash
npm run lint
```

## Problem Data

This repo includes dataset artifacts and import scripts for public olympiad problem archives, including math, chemistry, and physics sources. The current codebase primarily surfaces:

- AMC / AIME style math practice
- USNCO local and national chemistry practice
- F=ma and USAPhO style physics practice

## Deployment

The project is structured for Vercel deployment:

1. Push the repo to GitHub
2. Import it into Vercel
3. Add the environment variables above
4. Redeploy after Supabase and API keys are configured

## Notes For Contributors

- `lib/problems.ts` is the main normalization layer for problem filtering and answer checking
- `lib/supabase.ts` contains the shared client plus profile and activity helpers
- The dashboard depends on real `user_activity` rows to produce meaningful analytics
- The ingestion scripts are practical data-maintenance tools, not a polished ETL pipeline yet

## Vision

OlympiadAI is aiming to feel less like a static problem bank and more like a serious training operating system for olympiad students: roadmap, daily practice, guided tutoring, analytics, and a growing archive of structured contest material in one place.
