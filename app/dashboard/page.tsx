'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { fetchUserActivity, UserActivity, fetchProfile, Profile } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface LeaderboardEntry {
    username: string;
    solved: number;
    accuracy: number;
    streak: number;
    attempted: number;
    user_id: string;
}

export default function DashboardPage() {
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [lbByAccuracy, setLbByAccuracy] = useState<LeaderboardEntry[]>([]);
    const [lbByStreak, setLbByStreak] = useState<LeaderboardEntry[]>([]);
    const [lbTab, setLbTab] = useState<'accuracy' | 'streak'>('accuracy');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const router = useRouter();

    const calculateStreak = useCallback((acts: UserActivity[]) => {
        const sorted = [...acts].sort((a, b) =>
            new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
        let streak = 0;
        for (const a of sorted) {
            if (a.is_correct) streak++;
            else break;
        }
        return streak;
    }, []);

    useEffect(() => {
        async function loadData() {
            if (!supabase) return;

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            setCurrentUserId(session.user.id);

            try {
                const [activityData, profileData] = await Promise.all([
                    fetchUserActivity(),
                    fetchProfile()
                ]);

                setActivities(activityData);
                setProfile(profileData);
                if (profileData && !profileData.roadmap_completed) {
                    router.push('/roadmap');
                }

                const lbRes = await fetch('/api/leaderboard');
                if (lbRes.ok) {
                    const lbData = await lbRes.json();
                    setLbByAccuracy(lbData.byAccuracy || []);
                    setLbByStreak(lbData.byStreak || []);
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [router]);

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center pt-20 px-5">
                <h2 className="text-2xl font-bold text-white mb-2">Please Log In</h2>
                <p className="text-gray-400 mb-4">You need to be logged in to view your dashboard.</p>
                <Link href="/login" className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-colors">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center pt-20">
                <div className="loading-spinner" />
            </div>
        );
    }

    const totalSolved = activities.filter(a => a.is_correct).length;
    const totalAttempted = activities.length;
    const accuracy = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;
    const streak = calculateStreak(activities);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSolved = activities.filter(a => a.is_correct && a.created_at && new Date(a.created_at) > sevenDaysAgo).length;

    const trackStats = {
        math: { correct: 0, total: 0 },
        chemistry: { correct: 0, total: 0 },
        physics: { correct: 0, total: 0 },
    };

    activities.forEach(a => {
        if (trackStats[a.track]) {
            trackStats[a.track].total++;
            if (a.is_correct) trackStats[a.track].correct++;
        }
    });

    const formatTimeAgo = (dateStr: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const myAccRank = lbByAccuracy.findIndex(e => e.user_id === currentUserId) + 1;
    const myStreakRank = lbByStreak.findIndex(e => e.user_id === currentUserId) + 1;
    const currentLb = lbTab === 'accuracy' ? lbByAccuracy : lbByStreak;
    const myRank = lbTab === 'accuracy' ? myAccRank : myStreakRank;

    const statCards = [
        { label: 'Problems Solved', value: totalSolved.toString(), sub: `+${recentSolved} this week`, gradient: 'from-blue-500 to-indigo-500', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
        { label: 'Total Attempts', value: totalAttempted.toString(), sub: 'all time', gradient: 'from-amber-500 to-red-500', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
        { label: 'Accuracy', value: `${accuracy}%`, sub: `${totalSolved}/${totalAttempted} correct`, gradient: 'from-green-500 to-teal-500', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
        { label: 'Streak', value: streak.toString(), sub: streak > 0 ? 'correct in a row' : 'solve to start', gradient: 'from-purple-500 to-pink-500', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    ];

    const trackData = [
        { label: 'Math Olympiad', pct: trackStats.math.total ? Math.round((trackStats.math.correct / trackStats.math.total) * 100) : 0, solved: trackStats.math.correct, total: trackStats.math.total, color: 'bg-indigo-500' },
        { label: 'Chemistry Olympiad', pct: trackStats.chemistry.total ? Math.round((trackStats.chemistry.correct / trackStats.chemistry.total) * 100) : 0, solved: trackStats.chemistry.correct, total: trackStats.chemistry.total, color: 'bg-green-500' },
        { label: 'Physics Olympiad', pct: trackStats.physics.total ? Math.round((trackStats.physics.correct / trackStats.physics.total) * 100) : 0, solved: trackStats.physics.correct, total: trackStats.physics.total, color: 'bg-amber-500' },
    ];

    return (
        <div className="max-w-5xl mx-auto px-5 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {profile?.username ? `Welcome back, ${profile.username}` : 'Dashboard'}
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Track your progress and climb the leaderboard</p>
                </div>
                <Link href="/trainer" className="hidden sm:inline-flex px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25">
                    Practice Now
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-[#111118] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shrink-0`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs text-gray-400">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-4 mb-6">
                {/* Recent Activity */}
                <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-white">Recent Activity</h2>
                        <Link href="/trainer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all</Link>
                    </div>
                    <div className="flex flex-col gap-1">
                        {activities.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500 mb-3">No activity yet. Start solving problems!</p>
                                <Link href="/trainer" className="inline-flex px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors">
                                    Go to Trainer
                                </Link>
                            </div>
                        ) : (
                            activities.slice(0, 8).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.is_correct ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                                        {item.is_correct ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white truncate">{item.contest} {item.year} #{item.number}</div>
                                        <div className="text-xs text-gray-500">{item.topic} &middot; {item.is_correct ? 'Correct' : 'Incorrect'}</div>
                                    </div>
                                    <span className="text-xs text-gray-600 shrink-0">
                                        {item.created_at ? formatTimeAgo(item.created_at) : ''}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-white">Leaderboard</h2>
                        {myRank > 0 && (
                            <span className="text-xs px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 font-medium">
                                Your rank: #{myRank}
                            </span>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex rounded-lg bg-[#0a0a0f] p-0.5 mb-4">
                        <button
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors ${lbTab === 'accuracy' ? 'bg-white/[0.08] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            onClick={() => setLbTab('accuracy')}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                            Top Accuracy
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors ${lbTab === 'streak' ? 'bg-white/[0.08] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            onClick={() => setLbTab('streak')}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            Top Streaks
                        </button>
                    </div>

                    <div className="flex flex-col gap-0.5">
                        {currentLb.length === 0 ? (
                            <div className="min-h-[120px]" />
                        ) : (
                            currentLb.map((entry, idx) => {
                                const isMe = entry.user_id === currentUserId;
                                const displayValue = lbTab === 'accuracy' ? `${entry.accuracy}%` : entry.streak.toString();
                                const subText = lbTab === 'accuracy'
                                    ? `${entry.solved} solved \u00b7 ${entry.attempted} attempted`
                                    : `${entry.solved} solved \u00b7 ${entry.accuracy}% accuracy`;

                                const medalColors = ['text-yellow-400 bg-yellow-400/10', 'text-gray-300 bg-gray-300/10', 'text-amber-600 bg-amber-600/10'];

                                return (
                                    <div
                                        key={entry.user_id}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isMe ? 'bg-indigo-500/8 border border-indigo-500/15' : 'hover:bg-white/[0.02]'}`}
                                    >
                                        <div className="w-7 shrink-0 text-center">
                                            {idx < 3 ? (
                                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${medalColors[idx]}`}>
                                                    {idx + 1}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500 font-medium">{idx + 1}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-white truncate">
                                                {entry.username}
                                                {isMe && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-medium">you</span>}
                                            </div>
                                            <div className="text-xs text-gray-500">{subText}</div>
                                        </div>
                                        <div className="text-sm font-semibold text-white shrink-0">{displayValue}</div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Track Performance */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5">
                <h2 className="text-base font-semibold text-white mb-4">Performance by Track</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                    {trackData.map((item, idx) => (
                        <div key={idx}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm text-gray-300">{item.label}</span>
                                <span className="text-sm font-semibold text-white">{item.pct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.pct}%` }} />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{item.solved} / {item.total} solved</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
