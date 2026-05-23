# OlympiadAI

AI-powered training platform for olympiad-bound students — practice real
contest problems across Math (AMC, AIME), Chemistry (USNCO), and Physics
(F=ma, USAPhO) with a Socratic AI tutor, personalized roadmaps, and
progress tracking.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in the repo root (it's gitignored). All of the
following are read at runtime:

| Variable | Required? | Used for |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **yes** | Connect to Supabase (auth + problems + activity) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **yes** | Client-side Supabase calls |
| `SUPABASE_SERVICE_ROLE_KEY` | strongly recommended | Leaderboard display names — without this every leaderboard entry shows as "Anonymous" |
| `ANTHROPIC_API_KEY` | required for AI Tutor | `/api/tutor` (Claude Sonnet, vision-enabled) |
| `OPENAI_API_KEY` | required for `/api/solve` and `/api/rate-difficulty` | Progressive hints + auto-difficulty rating |
| `SCRAPINGBEE_API_KEY` | optional | Scraping problem sources in `scripts/` |

### Why `SUPABASE_SERVICE_ROLE_KEY` matters

The leaderboard route (`app/api/leaderboard/route.ts`) needs to map user
IDs back to display names. Profile usernames are read with the anon key,
but most users never set a username, so the route falls back to the
email prefix (e.g. `student@gmail.com` → `student`). Reading
`auth.users.email` requires the **service role** key. Without it, the
leaderboard query still runs but every entry shows as `Anonymous`.

Get the key from your Supabase project: **Settings → API → `service_role`
(secret)**. Treat it like a database password — it bypasses RLS.

### Setting env vars on Vercel

1. Project → **Settings → Environment Variables**
2. Add each variable above. For `SUPABASE_SERVICE_ROLE_KEY`, scope it to
   **Production + Preview** only (not local dev unless you need it).
3. Redeploy.

## Supabase setup

Run [`supabase_setup.sql`](./supabase_setup.sql) against your Supabase
project's SQL editor to create the `profiles` table, policies, and the
`is_graded` column on `user_activity`. The `olympiad_problems` and
`user_activity` tables themselves are assumed to already exist (created
when the project was first set up).

## Deploy on Vercel

Pushing to `main` on GitHub auto-deploys to Vercel. Make sure the env
vars above are configured in the Vercel project first.
