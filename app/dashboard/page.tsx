'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchUserActivity, UserActivity, fetchProfile, Profile } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            if (!supabase) return;

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            try {
                const [activityData, profileData] = await Promise.all([
                    fetchUserActivity(),
                    fetchProfile()
                ]);

                setActivities(activityData);
                setProfile(profileData);
                // Redirect to roadmap only if profile exists but roadmap not completed
                if (profileData && !profileData.roadmap_completed) {
                    router.push('/roadmap');
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
                <h2>Please Log In</h2>
                <p>You need to be logged in to view your dashboard.</p>
                <Link href="/login" className="btn btn--primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Go to Login
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const totalSolved = activities.filter(a => a.is_correct).length;
    const totalAttempted = activities.length;
    const accuracy = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;

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

    const stats = [
        { label: 'Problems Solved', value: totalSolved.toString(), change: `+${recentSolved} this week` },
        { label: 'Total Attempts', value: totalAttempted.toString(), change: 'all time' },
        { label: 'Accuracy', value: `${accuracy}%`, change: 'overall' },
        { label: 'Streak', value: totalSolved > 10 ? '🔥' : (totalSolved > 0 ? '📈' : '—'), change: `${totalSolved} problems solved` },
    ];

    const getIconForTrack = (track: string) => {
        switch (track) {
            case 'math': return '🧮';
            case 'chemistry': return '⚗️';
            case 'physics': return '⚛️';
            default: return '📝';
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getRecommendations = () => {
        if (!profile) return [
            { topic: 'Number Theory', reason: 'Weak area detected', difficulty: 'medium' },
            { topic: 'Geometry', reason: 'Continue momentum', difficulty: 'hard' },
            { topic: 'Graph Theory', reason: 'New topic to explore', difficulty: 'easy' },
        ];

        const track = profile.target_track || 'math';
        const goal = profile.target_goal || '';

        if (track === 'chemistry') {
            if (goal.includes('Nationals')) {
                return [
                    { topic: 'Organic Chemistry', reason: 'Common in Nationals', difficulty: 'hard' },
                    { topic: 'Thermodynamics', reason: 'Core concept', difficulty: 'medium' },
                    { topic: 'Coordination Chemistry', reason: 'High yield', difficulty: 'hard' },
                ];
            }
            return [
                { topic: 'Stoichiometry', reason: 'Foundation for Locals', difficulty: 'easy' },
                { topic: 'Gas Laws', reason: 'Common in Locals', difficulty: 'medium' },
                { topic: 'Equilibrium', reason: 'Continue momentum', difficulty: 'medium' },
            ];
        }

        if (track === 'physics') {
            return [
                { topic: 'Kinematics', reason: 'Core of F=ma', difficulty: 'medium' },
                { topic: 'Work & Energy', reason: 'High yield for F=ma', difficulty: 'medium' },
                { topic: 'Momentum', reason: 'Essential for Gold', difficulty: 'hard' },
            ];
        }

        return [
            { topic: 'Number Theory', reason: 'Weak area detected', difficulty: 'medium' },
            { topic: 'Geometry', reason: 'Continue momentum', difficulty: 'hard' },
            { topic: 'Logarithms', reason: 'Improve at Algebra', difficulty: 'easy' },
        ];
    };

    const recommendations = getRecommendations();

    return (
        <div className="page-container">
            <div className="section-header">
                <h1 className="section-header__title">Dashboard</h1>
                <p className="section-header__subtitle">
                    Track your progress and keep the momentum going
                </p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, idx) => (
                    <div className="stat-card" key={idx}>
                        <div className="stat-card__label">{stat.label}</div>
                        <div
                            className="stat-card__value"
                            style={{
                                color:
                                    idx === 0
                                        ? 'var(--accent-primary)'
                                        : idx === 1
                                            ? 'var(--accent-amber)'
                                            : idx === 2
                                                ? 'var(--accent-emerald)'
                                                : 'var(--accent-cyan)',
                            }}
                        >
                            {stat.value}
                        </div>
                        <div className="stat-card__change">{stat.change}</div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Recent Activity
                    </h3>
                    <div className="activity-list">
                        {activities.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No activity yet. Go solve some problems!</p>
                        ) : (
                            activities.slice(0, 5).map((item, idx) => (
                                <div className="activity-item" key={idx}>
                                    <div className="activity-item__icon">
                                        {item.is_correct ? '✅' : '❌'}
                                    </div>
                                    <div className="activity-item__text">
                                        <p>
                                            {item.is_correct ? 'Solved' : 'Attempted'} <strong>{item.contest} {item.year} #{item.number}</strong>
                                        </p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {getIconForTrack(item.track)} {item.topic}
                                        </span>
                                    </div>
                                    <span className="activity-item__time">{item.created_at ? formatTimeAgo(item.created_at) : ''}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                        Recommended Next
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {recommendations.map((rec, idx) => (
                            <Link href="/trainer" key={idx}>
                                <div className="card card--interactive" style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rec.topic}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                                {rec.reason}
                                            </div>
                                        </div>
                                        <span className={`badge badge--${rec.difficulty}`}>{rec.difficulty}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                        Accuracy by Track
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { label: 'Math', pct: trackStats.math.total ? Math.round((trackStats.math.correct / trackStats.math.total) * 100) : 0, color: 'var(--accent-primary)' },
                            { label: 'Chemistry', pct: trackStats.chemistry.total ? Math.round((trackStats.chemistry.correct / trackStats.chemistry.total) * 100) : 0, color: 'var(--accent-secondary)' },
                            { label: 'Physics', pct: trackStats.physics.total ? Math.round((trackStats.physics.correct / trackStats.physics.total) * 100) : 0, color: 'var(--accent-pink)' },
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                                    <span style={{ fontWeight: 600 }}>{item.pct}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar__fill"
                                        style={{ width: `${item.pct}%`, background: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
