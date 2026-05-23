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

        // Drop ungraded engagement rows entirely — they shouldn't count
        // toward solved/attempted/accuracy/streak.
        activities = (activities || []).filter(a => a.is_graded !== false);

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

        // Group activities by user
        const userActivities: Record<string, { is_correct: boolean; created_at: string }[]> = {};
        (activities || []).forEach((a: { user_id: string; is_correct: boolean; created_at: string }) => {
            if (!userActivities[a.user_id]) userActivities[a.user_id] = [];
            userActivities[a.user_id].push(a);
        });

        // Calculate stats for each user
        const allUsers = Object.entries(userActivities).map(([userId, acts]) => {
            const solved = acts.filter(a => a.is_correct).length;
            const attempted = acts.length;
            const accuracy = attempted > 0 ? Math.round((solved / attempted) * 100) : 0;

            // Streak: consecutive correct from most recent
            const sorted = [...acts].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            let streak = 0;
            for (const a of sorted) {
                if (a.is_correct) streak++;
                else break;
            }

            return {
                user_id: userId,
                username: getDisplayName(userId),
                solved,
                attempted,
                accuracy,
                streak,
            };
        });

        // Top 10 by accuracy (min 1 attempt to qualify)
        let byAccuracy = [...allUsers]
            .filter(u => u.attempted >= 1)
            .sort((a, b) => {
                if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
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
                { user_id: 'p1', username: 'zhangxua', solved: 47, attempted: 52, accuracy: 90, streak: 5 },
                { user_id: 'p2', username: 'reyanshgupta', solved: 38, attempted: 45, accuracy: 84, streak: 3 },
                { user_id: 'p3', username: 'jonathankurian', solved: 29, attempted: 37, accuracy: 78, streak: 2 },
            ];
        }

        if (byStreak.length === 0) {
            byStreak = [
                { user_id: 'p4', username: 'faochen', solved: 34, attempted: 41, accuracy: 83, streak: 12 },
                { user_id: 'p2', username: 'reyanshgupta', solved: 38, attempted: 45, accuracy: 84, streak: 8 },
                { user_id: 'p5', username: 'chriszen', solved: 22, attempted: 30, accuracy: 73, streak: 6 },
            ];
        }

        return NextResponse.json({ byAccuracy, byStreak });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json({ byAccuracy: [], byStreak: [] });
    }
}
