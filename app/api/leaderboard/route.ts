import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json({ byAccuracy: [], byStreak: [] });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Get all user activity
        const { data: activities, error: actError } = await supabase
            .from('user_activity')
            .select('user_id, is_correct, created_at')
            .order('created_at', { ascending: false });

        if (actError) throw actError;

        // Get all profiles for usernames
        const { data: profiles, error: profError } = await supabase
            .from('profiles')
            .select('id, username');

        if (profError) throw profError;

        const profileMap: Record<string, string> = {};
        (profiles || []).forEach((p: { id: string; username: string | null }) => {
            profileMap[p.id] = p.username || 'Anonymous';
        });

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
            const accuracy = attempted >= 3 ? Math.round((solved / attempted) * 100) : 0;
            // minimum 3 attempts to qualify for accuracy ranking

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
                username: profileMap[userId] || 'Anonymous',
                solved,
                attempted,
                accuracy,
                streak,
            };
        });

        // Top 10 by accuracy (min 3 attempts to qualify)
        const byAccuracy = [...allUsers]
            .filter(u => u.attempted >= 3)
            .sort((a, b) => {
                if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
                return b.solved - a.solved; // tiebreak by problems solved
            })
            .slice(0, 10);

        // Top 10 by streak
        const byStreak = [...allUsers]
            .sort((a, b) => {
                if (b.streak !== a.streak) return b.streak - a.streak;
                return b.solved - a.solved; // tiebreak by problems solved
            })
            .slice(0, 10);

        return NextResponse.json({ byAccuracy, byStreak });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json({ byAccuracy: [], byStreak: [] });
    }
}
