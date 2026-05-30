import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Only create a real client if valid credentials are provided
export const supabase: SupabaseClient | null =
  isValidUrl(supabaseUrl) && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface OlympiadProblem {
  id?: number;
  contest: string;
  year: number;
  number: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  problem: string;
  choices: string[] | null;
  correct_answer: string;
  correct_value: string;
  solution: string;
  track: 'math' | 'chemistry' | 'physics';
  source_link: string;
  created_at?: string;
}

/**
 * Fetch all problems from the olympiad_problems table.
 */
export async function fetchAllProblems(): Promise<OlympiadProblem[]> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
    );
  }

  // Supabase defaults to 1000 rows max, fetch in pages to get all
  let allData: OlympiadProblem[] = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('olympiad_problems')
      .select('*')
      .range(from, from + pageSize - 1)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) break;
    allData = allData.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return allData;
}

/**
 * Fetch problems filtered by track.
 */
export async function fetchProblemsByTrack(
  track: OlympiadProblem['track']
): Promise<OlympiadProblem[]> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('olympiad_problems')
    .select('*')
    .eq('track', track)
    .order('year', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Insert a new problem into the olympiad_problems table.
 * Called after the AI parser returns structured data.
 */
export async function insertProblem(
  problem: Omit<OlympiadProblem, 'id' | 'created_at'>
): Promise<OlympiadProblem> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
    );
  }

  const { data, error } = await supabase
    .from('olympiad_problems')
    .insert([problem])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export interface UserActivity {
  id?: string;
  user_id: string;
  contest: string;
  year: number;
  number: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  track: 'math' | 'chemistry' | 'physics';
  is_correct: boolean;
  // True for Submit-based attempts that contribute to accuracy/streak.
  // False for engagement events (e.g. "Get AI Feedback" on multi-part
  // problems) that should be logged but excluded from leaderboard math.
  // Defaults to true on the DB side; only sent when explicitly false so
  // installs that haven't applied the is_graded migration keep working.
  is_graded?: boolean;
  created_at?: string;
}

/**
 * Record a user's attempt on a problem.
 */
export async function recordUserActivity(
  activity: Omit<UserActivity, 'id' | 'created_at' | 'user_id'>
): Promise<UserActivity | null> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping activity recording');
    return null;
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Silently fail if user is not logged in
    return null;
  }

  // Only forward is_graded when the caller explicitly set it to false; this
  // keeps inserts compatible with Supabase projects where the migration
  // hasn't been applied yet (the column simply uses its DB default).
  const row: Record<string, unknown> = { ...activity, user_id: user.id };
  if (activity.is_graded !== false) delete row.is_graded;

  let { data, error } = await supabase
    .from('user_activity')
    .insert([row])
    .select()
    .single();

  // If the is_graded column hasn't been added yet, retry without it so the
  // attempt is still recorded (just counted as graded).
  if (error && error.code === '42703' && 'is_graded' in row) {
    delete row.is_graded;
    ({ data, error } = await supabase
      .from('user_activity')
      .insert([row])
      .select()
      .single());
  }

  if (error) {
    console.error('Error recording activity:', error);
    return null;
  }

  return data;
}

/**
 * Fetch all activity for the currently logged-in user.
 */
export async function fetchUserActivity(): Promise<UserActivity[]> {
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('user_activity')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching activity:', error);
    return [];
  }

  return data || [];
}

export interface Profile {
  id: string;
  username: string | null;
  target_track: 'math' | 'chemistry' | 'physics' | null;
  target_goal: string | null;
  roadmap_completed: boolean;
  created_at?: string;
}

/**
 * Fetch the current user's profile.
 */
export async function fetchProfile(): Promise<Profile | null> {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }

  return data;
}

/**
 * Update the current user's profile.
 */
export async function updateProfile(profile: Partial<Profile>): Promise<Profile | null> {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ ...profile, id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error.message);
    return null;
  }

  return data;
}

export interface MockResult {
  id?: string;
  user_id?: string;
  contest: string;
  track: 'math' | 'chemistry' | 'physics';
  num_questions: number;
  num_correct: number;
  score: number;
  duration_seconds: number;
  time_limit_seconds: number;
  created_at?: string;
}

/**
 * Record a completed (or auto-submitted) mock test result.
 */
export async function recordMockResult(
  input: Omit<MockResult, 'id' | 'user_id' | 'created_at'>
): Promise<MockResult | null> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping mock result recording');
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('mock_test_results')
    .insert([{ ...input, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error recording mock result:', error.message);
    return null;
  }
  return data;
}

/**
 * Fetch all mock test results for the current user (newest first).
 */
export async function fetchMockResults(): Promise<MockResult[]> {
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('mock_test_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching mock results:', error.message);
    return [];
  }
  return data || [];
}

/**
 * Insert multiple problems into the olympiad_problems table.
 */
export async function insertProblems(
  problems: Omit<OlympiadProblem, 'id' | 'created_at'>[]
): Promise<OlympiadProblem[]> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('olympiad_problems')
    .insert(problems)
    .select();

  if (error) throw error;
  return data || [];
}

