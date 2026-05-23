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
