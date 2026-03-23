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

                // Fetch leaderboard
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
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2 className="section-header__title">Please Log In</h2>
                <p className="section-header__subtitle" style={{ marginBottom: '1rem' }}>You need to be logged in to view your dashboard.</p>
                <Link href="/login" className="btn btn--primary">Go to Login</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
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

    // Find current user's rank in each list
    const myAccRank = lbByAccuracy.findIndex(e => e.user_id === currentUserId) + 1;
    const myStreakRank = lbByStreak.findIndex(e => e.user_id === currentUserId) + 1;
    const currentLb = lbTab === 'accuracy' ? lbByAccuracy : lbByStreak;
    const myRank = lbTab === 'accuracy' ? myAccRank : myStreakRank;

    const stats = [
        {
            label: 'Problems Solved',
            value: totalSolved.toString(),
            change: `+${recentSolved} this week`,
            icon: 'solved',
            gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
        },
        {
            label: 'Total Attempts',
            value: totalAttempted.toString(),
            change: 'all time',
            icon: 'attempts',
            gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        },
        {
            label: 'Accuracy',
            value: `${accuracy}%`,
            change: `${totalSolved}/${totalAttempted} correct`,
            icon: 'accuracy',
            gradient: 'linear-gradient(135deg, #22c55e, #14b8a6)',
        },
        {
            label: 'Streak',
            value: streak.toString(),
            change: streak > 0 ? 'correct in a row' : 'solve to start',
            icon: 'streak',
            gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
        },
    ];

    const trackData = [
        { label: 'Math', pct: trackStats.math.total ? Math.round((trackStats.math.correct / trackStats.math.total) * 100) : 0, solved: trackStats.math.correct, total: trackStats.math.total, gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
        { label: 'Chemistry', pct: trackStats.chemistry.total ? Math.round((trackStats.chemistry.correct / trackStats.chemistry.total) * 100) : 0, solved: trackStats.chemistry.correct, total: trackStats.chemistry.total, gradient: 'linear-gradient(135deg, #22c55e, #14b8a6)' },
        { label: 'Physics', pct: trackStats.physics.total ? Math.round((trackStats.physics.correct / trackStats.physics.total) * 100) : 0, solved: trackStats.physics.correct, total: trackStats.physics.total, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
    ];

    return (
        <div className="page-container dashboard-page">
            {/* Header */}
            <div className="dash-header">
                <div>
                    <h1 className="dash-header__title">
                        {profile?.username ? `Welcome back, ${profile.username}` : 'Dashboard'}
                    </h1>
                    <p className="dash-header__subtitle">
                        Track your progress and climb the leaderboard
                    </p>
                </div>
                <Link href="/trainer" className="btn btn--primary btn--glow">
                    Practice Now
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="dash-stats">
                {stats.map((stat, idx) => (
                    <div className="dash-stat-card" key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="dash-stat-card__icon" style={{ background: stat.gradient }}>
                            {stat.icon === 'solved' && (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            )}
                            {stat.icon === 'attempts' && (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            )}
                            {stat.icon === 'accuracy' && (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                            )}
                            {stat.icon === 'streak' && (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            )}
                        </div>
                        <div className="dash-stat-card__content">
                            <span className="dash-stat-card__label">{stat.label}</span>
                            <span className="dash-stat-card__value">{stat.value}</span>
                            <span className="dash-stat-card__change">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid: Activity + Leaderboard */}
            <div className="dash-main-grid">
                {/* Recent Activity */}
                <div className="dash-card dash-card--glass">
                    <div className="dash-card__header">
                        <h2 className="dash-card__title">Recent Activity</h2>
                        <Link href="/trainer" className="dash-card__link">View all</Link>
                    </div>
                    <div className="dash-activity-list">
                        {activities.length === 0 ? (
                            <div className="dash-empty">
                                <p>No activity yet. Start solving problems!</p>
                                <Link href="/trainer" className="btn btn--primary btn--sm" style={{ marginTop: '0.75rem' }}>
                                    Go to Trainer
                                </Link>
                            </div>
                        ) : (
                            activities.slice(0, 8).map((item, idx) => (
                                <div className="dash-activity-item" key={idx} style={{ animationDelay: `${idx * 0.03}s` }}>
                                    <div className={`dash-activity-item__icon ${item.is_correct ? 'dash-activity-item__icon--correct' : 'dash-activity-item__icon--wrong'}`}>
                                        {item.is_correct ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        )}
                                    </div>
                                    <div className="dash-activity-item__content">
                                        <span className="dash-activity-item__title">
                                            {item.contest} {item.year} #{item.number}
                                        </span>
                                        <span className="dash-activity-item__meta">
                                            {item.topic} · {item.is_correct ? 'Correct' : 'Incorrect'}
                                        </span>
                                    </div>
                                    <span className="dash-activity-item__time">
                                        {item.created_at ? formatTimeAgo(item.created_at) : ''}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Leaderboard with Tabs */}
                <div className="dash-card dash-card--glass">
                    <div className="dash-card__header">
                        <h2 className="dash-card__title">Leaderboard</h2>
                        {myRank > 0 && (
                            <span className="dash-rank-badge">Your rank: #{myRank}</span>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="dash-lb-tabs">
                        <button
                            className={`dash-lb-tab ${lbTab === 'accuracy' ? 'dash-lb-tab--active' : ''}`}
                            onClick={() => setLbTab('accuracy')}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                            Top Accuracy
                        </button>
                        <button
                            className={`dash-lb-tab ${lbTab === 'streak' ? 'dash-lb-tab--active' : ''}`}
                            onClick={() => setLbTab('streak')}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            Top Streaks
                        </button>
                    </div>

                    <div className="dash-leaderboard">
                        {currentLb.length === 0 ? (
                            <div style={{ minHeight: '120px' }} />
                        ) : (
                            currentLb.map((entry, idx) => {
                                const isMe = entry.user_id === currentUserId;
                                const displayValue = lbTab === 'accuracy'
                                    ? `${entry.accuracy}%`
                                    : entry.streak.toString();
                                const subText = lbTab === 'accuracy'
                                    ? `${entry.solved} solved · ${entry.attempted} attempted`
                                    : `${entry.solved} solved · ${entry.accuracy}% accuracy`;

                                return (
                                    <div
                                        className={`dash-lb-row ${isMe ? 'dash-lb-row--me' : ''}`}
                                        key={entry.user_id}
                                        style={{ animationDelay: `${idx * 0.04}s` }}
                                    >
                                        <div className="dash-lb-row__rank">
                                            {idx === 0 && <span className="dash-lb-medal dash-lb-medal--gold">1</span>}
                                            {idx === 1 && <span className="dash-lb-medal dash-lb-medal--silver">2</span>}
                                            {idx === 2 && <span className="dash-lb-medal dash-lb-medal--bronze">3</span>}
                                            {idx > 2 && <span className="dash-lb-num">{idx + 1}</span>}
                                        </div>
                                        <div className="dash-lb-row__info">
                                            <span className="dash-lb-row__name">
                                                {entry.username}
                                                {isMe && <span className="dash-lb-you">you</span>}
                                            </span>
                                            <span className="dash-lb-row__stats">
                                                {subText}
                                            </span>
                                        </div>
                                        <div className="dash-lb-row__score">
                                            {displayValue}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Track Accuracy */}
            <div className="dash-card dash-card--glass dash-tracks-card">
                <div className="dash-card__header">
                    <h2 className="dash-card__title">Performance by Track</h2>
                </div>
                <div className="dash-tracks-grid">
                    {trackData.map((item, idx) => (
                        <div className="dash-track-item" key={idx}>
                            <div className="dash-track-item__header">
                                <span className="dash-track-item__label">{item.label}</span>
                                <span className="dash-track-item__pct">{item.pct}%</span>
                            </div>
                            <div className="dash-track-bar">
                                <div
                                    className="dash-track-bar__fill"
                                    style={{ width: `${item.pct}%`, background: item.gradient }}
                                />
                            </div>
                            <span className="dash-track-item__detail">
                                {item.solved} / {item.total} solved
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
