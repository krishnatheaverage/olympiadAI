import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json({ leaderboard: [] });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Get all user activity grouped by user
        const { data: activities, error: actError } = await supabase
            .from('user_activity')
            .select('user_id, is_correct, created_at');

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

        // Aggregate stats per user
        const userStats: Record<string, { solved: number; attempted: number; streak: number }> = {};

        // Group activities by user
        const userActivities: Record<string, { is_correct: boolean; created_at: string }[]> = {};
        (activities || []).forEach((a: { user_id: string; is_correct: boolean; created_at: string }) => {
            if (!userActivities[a.user_id]) userActivities[a.user_id] = [];
            userActivities[a.user_id].push(a);
        });

        // Calculate stats for each user
        Object.entries(userActivities).forEach(([userId, acts]) => {
            const solved = acts.filter(a => a.is_correct).length;
            const attempted = acts.length;

            // Calculate streak: consecutive correct answers from most recent
            const sorted = [...acts].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            let streak = 0;
            for (const a of sorted) {
                if (a.is_correct) streak++;
                else break;
            }

            userStats[userId] = { solved, attempted, streak };
        });

        // Build leaderboard sorted by problems solved
        const leaderboard = Object.entries(userStats)
            .map(([userId, stats]) => ({
                username: profileMap[userId] || 'Anonymous',
                solved: stats.solved,
                accuracy: stats.attempted > 0 ? Math.round((stats.solved / stats.attempted) * 100) : 0,
                streak: stats.streak,
                user_id: userId,
            }))
            .sort((a, b) => b.solved - a.solved)
            .slice(0, 20); // Top 20

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json({ leaderboard: [] });
    }
}
