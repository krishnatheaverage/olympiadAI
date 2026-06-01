import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json({ byAccuracy: [], byStreak: [] });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Use service role client to access auth.users for emails
        const adminClient = supabaseServiceKey
            ? createClient(supabaseUrl, supabaseServiceKey, {
                auth: { autoRefreshToken: false, persistSession: false }
            })
            : null;

        // Cross-user reads must use the service role client to bypass RLS;
        // the anon key only sees the calling user's own rows under our
        // policies. Fall back to anon if the service role key is missing
        // (the leaderboard will be empty in that case — log a clear hint).
        const activityClient = adminClient || supabase;
        if (!adminClient) {
            console.warn(
                'Leaderboard: SUPABASE_SERVICE_ROLE_KEY not set; falling back to anon ' +
                'key, which will return no cross-user activity under RLS.'
            );
        }

        // Get all user activity. Try to include is_graded so we can exclude
        // engagement events (AI feedback clicks) from accuracy/streak math;
        // fall back to the older schema if the column hasn't been added yet.
        type ActivityRow = { user_id: string; is_correct: boolean; created_at: string; is_graded?: boolean };
        let activities: ActivityRow[] | null = null;
        {
            const withGraded = await activityClient
                .from('user_activity')
                .select('user_id, is_correct, created_at, is_graded')
                .order('created_at', { ascending: false });
            if (withGraded.error && withGraded.error.code === '42703') {
                const fallback = await activityClient
                    .from('user_activity')
                    .select('user_id, is_correct, created_at')
                    .order('created_at', { ascending: false });
                if (fallback.error) throw fallback.error;
                activities = fallback.data as ActivityRow[];
            } else if (withGraded.error) {
                throw withGraded.error;
            } else {
                activities = withGraded.data as ActivityRow[];
            }
        }

        // Keep ALL activity (including ungraded "Get AI Feedback" clicks)
        // for computing days-active. The graded-only subset is used for
        // solved/streak math so engagement events don't pollute those.
        const allActivities: ActivityRow[] = activities || [];
        activities = allActivities.filter(a => a.is_graded !== false);

        // Get all profiles for usernames
        const { data: profiles, error: profError } = await supabase
            .from('profiles')
            .select('id, username');

        if (profError) throw profError;

        // Try to get emails from auth.users using admin client
        const emailMap: Record<string, string> = {};
        if (adminClient) {
            try {
                const { data: authData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
                if (authData?.users) {
                    authData.users.forEach((u: { id: string; email?: string }) => {
                        if (u.email) {
                            // Use email prefix (before @) as display name
                            emailMap[u.id] = u.email.split('@')[0];
                        }
                    });
                }
            } catch (e) {
                console.error('Could not fetch auth users:', e);
            }
        }

        const profileMap: Record<string, string> = {};
        (profiles || []).forEach((p: { id: string; username: string | null }) => {
            profileMap[p.id] = p.username || '';
        });

        // Display name priority: profile username > email prefix > "Anonymous"
        const getDisplayName = (userId: string): string => {
            if (profileMap[userId]) return profileMap[userId];
            if (emailMap[userId]) return emailMap[userId];
            return 'Anonymous';
        };

        // Group GRADED activities by user (drives solved/streak math)
        const userActivities: Record<string, { is_correct: boolean; created_at: string }[]> = {};
        (activities || []).forEach((a: { user_id: string; is_correct: boolean; created_at: string }) => {
            if (!userActivities[a.user_id]) userActivities[a.user_id] = [];
            userActivities[a.user_id].push(a);
        });

        // Group ALL activities by user (drives days-active calculation —
        // any engagement on a calendar day counts toward the daily streak).
        //
        // Bucket by the US Eastern calendar day rather than UTC. Using UTC
        // pushed evening sessions into the next UTC date and let two sessions
        // on the same local day land on different UTC dates (or two local days
        // collapse onto one UTC date), which silently shortened "days in a
        // row" for anyone in a Western-hemisphere timezone. en-CA yields a
        // YYYY-MM-DD label and the timeZone option handles DST automatically.
        const dayFormatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const userDays: Record<string, Set<string>> = {};
        allActivities.forEach(a => {
            if (!a.created_at) return;
            const day = dayFormatter.format(new Date(a.created_at)); // YYYY-MM-DD in ET
            if (!userDays[a.user_id]) userDays[a.user_id] = new Set();
            userDays[a.user_id].add(day);
        });

        // Longest run of consecutive calendar days a user was active.
        function longestDaySpan(days: Set<string>): number {
            if (days.size === 0) return 0;
            const sorted = [...days].sort();
            let longest = 1;
            let run = 1;
            for (let i = 1; i < sorted.length; i++) {
                const prev = new Date(sorted[i - 1] + 'T00:00:00Z').getTime();
                const cur = new Date(sorted[i] + 'T00:00:00Z').getTime();
                const diffDays = Math.round((cur - prev) / 86400000);
                if (diffDays === 1) {
                    run++;
                    if (run > longest) longest = run;
                } else {
                    run = 1;
                }
            }
            return longest;
        }

        // Calculate stats for each user — combine the two groupings.
        const allUserIds = new Set([
            ...Object.keys(userActivities),
            ...Object.keys(userDays),
        ]);
        const allUsers = [...allUserIds].map(userId => {
            const acts = userActivities[userId] || [];
            const days = userDays[userId] || new Set<string>();
            const solved = acts.filter(a => a.is_correct).length;
            const attempted = acts.length;
            const accuracy = attempted > 0 ? Math.round((solved / attempted) * 100) : 0;

            // Streak = longest run of consecutive correct submissions ever.
            const chrono = [...acts].sort((a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            let streak = 0;
            let run = 0;
            for (const a of chrono) {
                if (a.is_correct) {
                    run++;
                    if (run > streak) streak = run;
                } else {
                    run = 0;
                }
            }

            const activeDays = longestDaySpan(days);

            return {
                user_id: userId,
                username: getDisplayName(userId),
                solved,
                attempted,
                accuracy,
                streak,
                activeDays,
            };
        });

        // Primary leaderboard: longest consecutive-days-active streak.
        // Previously sorted by accuracy %, which let a user with 1/1 correct
        // outrank someone with 30/30. Tiebreak by solved problems.
        let byAccuracy = [...allUsers]
            .filter(u => u.activeDays >= 1)
            .sort((a, b) => {
                if (b.activeDays !== a.activeDays) return b.activeDays - a.activeDays;
                return b.solved - a.solved;
            })
            .slice(0, 10);

        // Top 10 by streak (must have at least 1)
        let byStreak = [...allUsers]
            .filter(u => u.streak >= 1)
            .sort((a, b) => {
                if (b.streak !== a.streak) return b.streak - a.streak;
                return b.solved - a.solved;
            })
            .slice(0, 10);

        // Placeholder entries when leaderboard is empty
        if (byAccuracy.length === 0) {
            byAccuracy = [
                { user_id: 'p1', username: 'zhangxua', solved: 47, attempted: 52, accuracy: 90, streak: 5, activeDays: 12 },
                { user_id: 'p2', username: 'reyanshgupta', solved: 38, attempted: 45, accuracy: 84, streak: 3, activeDays: 9 },
                { user_id: 'p3', username: 'jonathankurian', solved: 29, attempted: 37, accuracy: 78, streak: 2, activeDays: 7 },
            ];
        }

        if (byStreak.length === 0) {
            byStreak = [
                { user_id: 'p4', username: 'faochen', solved: 34, attempted: 41, accuracy: 83, streak: 12, activeDays: 14 },
                { user_id: 'p2', username: 'reyanshgupta', solved: 38, attempted: 45, accuracy: 84, streak: 8, activeDays: 9 },
                { user_id: 'p5', username: 'chriszen', solved: 22, attempted: 30, accuracy: 73, streak: 6, activeDays: 7 },
            ];
        }

        return NextResponse.json({ byAccuracy, byStreak });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json({ byAccuracy: [], byStreak: [] });
    }
}
