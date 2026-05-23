-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  username text,
  target_track text check (target_track in ('math', 'chemistry', 'physics', 'usaco')),
  target_goal text,
  roadmap_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policy: Everyone can view profiles (optional, could be restricted to owner)
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

-- Policy: Users can insert their own profile
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

-- Policy: Users can update own profile
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Add is_graded flag to user_activity so AI-feedback engagement events
-- can be recorded without polluting accuracy/streak stats. Defaults to
-- true so all existing rows continue to count toward the leaderboard.
alter table public.user_activity
  add column if not exists is_graded boolean not null default true;

-- Row Level Security for user_activity. Previously RLS was enabled with
-- no policies, which silently blocked every insert from the trainer —
-- the table sat empty even though users were submitting answers.
alter table public.user_activity enable row level security;

-- Authenticated users can insert rows tied to their own user_id.
drop policy if exists "Users can insert their own activity." on public.user_activity;
create policy "Users can insert their own activity."
  on public.user_activity
  for insert
  with check (auth.uid() = user_id);

-- Authenticated users can read their own history (drives the dashboard).
drop policy if exists "Users can view their own activity." on public.user_activity;
create policy "Users can view their own activity."
  on public.user_activity
  for select
  using (auth.uid() = user_id);

-- NOTE: the global leaderboard query in app/api/leaderboard/route.ts uses
-- the SUPABASE_SERVICE_ROLE_KEY to read across users (bypassing RLS).
-- Make sure that env var is set in Vercel — without it the leaderboard
-- only sees the calling user's own rows.
