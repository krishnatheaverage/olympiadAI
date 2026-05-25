'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback, useMemo } from 'react';
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
    activeDays: number;
}

const TRACKS_PALETTE = {
  AMC:    { color: 'oklch(0.78 0.155 62)',   label: 'AMC'    },
  AIME:   { color: 'oklch(0.80 0.115 155)',  label: 'AIME'   },
  USAMO:  { color: 'oklch(0.86 0.075 175)',  label: 'USAMO'  },
  USAPhO: { color: 'oklch(0.72 0.105 30)',   label: 'USAPhO' },
  USNCO:  { color: 'oklch(0.68 0.090 305)',  label: 'USNCO'  },
  Fma:    { color: 'oklch(0.74 0.110 210)',  label: 'F=ma'   },
};

export default function DashboardPage() {
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [lbByAccuracy, setLbByAccuracy] = useState<LeaderboardEntry[]>([]);
    const [lbByStreak, setLbByStreak] = useState<LeaderboardEntry[]>([]);
    // 'accuracy' tab is now sorted by consecutive-days-active; renamed
    // in the UI to 'ACTIVE'. Key kept as 'accuracy' for state continuity.
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

    // Format relative time
    const formatTimeAgo = (dateStr: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20 px-5 z-10 text-center">
                <div className="surface rounded-2xl p-8 border border-[color:var(--cream)]/10 max-w-md w-full">
                    <h2 className="italic-serif text-3xl mb-3 text-[color:var(--cream)] font-normal">Welcome to OlympiadAI</h2>
                    <p className="text-sm text-[color:var(--cream-dim)] mb-6 font-light">Please log in to track your personal performance roadmap and compete on leaderboards.</p>
                    <Link href="/login" className="btn-amber inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14px] font-semibold">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 z-10 text-[color:var(--cream-dim)]">
                <div className="w-6 h-6 border-2 border-[color:var(--amber)] border-t-transparent rounded-full animate-spin" />
                <span className="mono text-[10px] tracking-wider uppercase">Loading Dashboard Analytics...</span>
            </div>
        );
    }

    // Calculations based on real user actions
    const totalSolved = activities.filter(a => a.is_correct).length;
    const totalAttempted = activities.length;
    const accuracy = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;
    const streak = calculateStreak(activities);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSolved = activities.filter(a => a.is_correct && a.created_at && new Date(a.created_at) > sevenDaysAgo).length;

    // Track categorizations
    const contestBreakdown = {
      AMC:    0,
      AIME:   0,
      USAMO:  0,
      USAPhO: 0,
      USNCO:  0,
      Fma:    0,
    };

    activities.forEach(a => {
        const contestUpper = a.contest.toUpperCase();
        if (a.is_correct) {
            if (contestUpper.includes('AMC')) contestBreakdown.AMC++;
            else if (contestUpper.includes('AIME')) contestBreakdown.AIME++;
            else if (contestUpper.includes('USAMO')) contestBreakdown.USAMO++;
            else if (contestUpper.includes('USAPHO')) contestBreakdown.USAPhO++;
            else if (contestUpper.includes('USNCO')) contestBreakdown.USNCO++;
            else if (contestUpper.includes('F=MA') || contestUpper.includes('F=MA')) contestBreakdown.Fma++;
            else {
                // fallback categorizations based on track
                if (a.track === 'math') contestBreakdown.AMC++;
                else if (a.track === 'chemistry') contestBreakdown.USNCO++;
                else if (a.track === 'physics') contestBreakdown.Fma++;
            }
        }
    });

    const activeLeaderboard = lbTab === 'accuracy' ? lbByAccuracy : lbByStreak;
    const myRank = lbTab === 'accuracy' 
        ? lbByAccuracy.findIndex(e => e.user_id === currentUserId) + 1 
        : lbByStreak.findIndex(e => e.user_id === currentUserId) + 1;

    // Accuracy Circle calculations
    const R = 56;
    const C = 2 * Math.PI * R;
    const accuracyDash = (accuracy / 100) * C * 0.75; // 3/4 arc

    // Today's formatted calendar cycle
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });

    // Grid details for Github style heatmap (35 blocks = 5 weeks * 7 days)
    const heatmapCells = Array.from({ length: 35 }).map((_, idx) => {
        const d = new Date();
        d.setDate(d.getDate() - (34 - idx));
        // count how many solves on this day
        const solvesCount = activities.filter(a => {
            if (!a.created_at || !a.is_correct) return false;
            const itemDate = new Date(a.created_at);
            return itemDate.toDateString() === d.toDateString();
        }).length;
        // returns density level 0 to 3
        if (solvesCount === 0) return 0;
        if (solvesCount === 1) return 1;
        if (solvesCount === 2) return 2;
        return 3;
    });

    const shadeHeatmap = (v: number) => [
        'oklch(0.95 0.02 80 / 0.06)',
        'oklch(0.78 0.155 62 / 0.30)',
        'oklch(0.78 0.155 62 / 0.55)',
        'oklch(0.78 0.155 62 / 0.95)',
    ][v];

    // Status SVGs
    const statusIcon = {
        correct: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="var(--good)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
        partial: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="var(--warn)" strokeWidth="1.4"/><path d="M7 4v3l2 1" stroke="var(--warn)" strokeWidth="1.4" strokeLinecap="round"/></svg>,
        wrong:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="var(--bad)" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    };

    return (
        <div className="w-full max-w-[1320px] mx-auto px-6 z-10 relative">
            
            {/* 1. Welcome Header Section */}
            <header className="rise mt-8 mb-8" style={{ '--d': '280ms' } as React.CSSProperties}>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <div className="chip mb-2.5">{dateFormatted} · Cycle Active</div>
                        <h1 className="text-[clamp(40px,5.2vw,72px)] leading-[0.96] tracking-[-0.02em] text-[color:var(--cream)] font-normal">
                            Welcome back<span className="text-[color:var(--amber)]">,</span>
                            <br />
                            <span className="italic-serif font-light">{profile?.username || 'khaooooo'}.</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 pb-1">
                        <Link href="/trainer" className="btn-amber inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[15px] font-semibold text-[color:var(--ink-900)]">
                            <span>Resume training</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </Link>
                        <Link href="/roadmap" className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-[14.5px] font-medium text-[color:var(--cream)]">
                            View roadmap
                        </Link>
                    </div>
                </div>
            </header>

            {/* 3. Three Stat Widgets row */}
            <section className="rise grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ '--d': '550ms' } as React.CSSProperties}>
                
                {/* Solved Problems Breakdown Widget */}
                <div className="surface rounded-2xl p-7 border border-[color:var(--cream)]/10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-baseline justify-between mb-2">
                            <span className="chip">Problems Solved</span>
                            <span className="mono text-[9px] text-[color:var(--cream-mt)] font-semibold">ALL TIME</span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-3">
                            <span className="italic-serif text-[76px] leading-none text-[color:var(--cream)] font-light">{totalSolved}</span>
                            <span className="mono text-[10.5px] text-[color:var(--chalk)] font-medium">▲ {recentSolved} this week</span>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[color:var(--ink-900)]/60">
                            {Object.entries(contestBreakdown).map(([key, count]) => {
                                const palette = TRACKS_PALETTE[key as keyof typeof TRACKS_PALETTE] || { color: 'var(--cream)', label: key };
                                const widthPct = totalSolved > 0 ? (count / totalSolved) * 100 : 0;
                                return (
                                    <span 
                                        key={key} 
                                        title={`${palette.label} · ${count}`}
                                        style={{ width: `${widthPct}%`, background: palette.color }} 
                                    />
                                );
                            })}
                        </div>
                        <div className="mt-5 grid grid-cols-3 gap-y-2 gap-x-2">
                            {Object.entries(contestBreakdown).map(([key, count]) => {
                                const palette = TRACKS_PALETTE[key as keyof typeof TRACKS_PALETTE] || { color: 'var(--cream)', label: key };
                                return (
                                    <div key={key} className="flex items-center gap-1.5 min-w-0">
                                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: palette.color }} />
                                        <span className="mono text-[9.5px] text-[color:var(--cream-dim)] font-semibold truncate">{palette.label}</span>
                                        <span className="ml-auto mono text-[9.5px] text-[color:var(--cream)] font-bold">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 7-Day Circular Accuracy Widget */}
                <div className="surface rounded-2xl p-7 border border-[color:var(--cream)]/10">
                    <div className="flex items-baseline justify-between mb-2">
                        <span className="chip">Training Accuracy</span>
                        <span className="mono text-[10px] text-[color:var(--chalk)] font-semibold">▲ {(accuracy > 50 ? '+5.2' : '-1.5')}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-[auto_1fr] items-center gap-5">
                        <div className="relative h-[130px] w-[130px]">
                            <svg viewBox="0 0 150 150" className="h-full w-full -rotate-[135deg]">
                                <circle cx="75" cy="75" r={R} fill="none" stroke="oklch(0.95 0.02 80 / 0.08)" strokeWidth="6"
                                        strokeDasharray={`${C*0.75} ${C}`} strokeLinecap="round" />
                                <circle cx="75" cy="75" r={R} fill="none" stroke="var(--amber)" strokeWidth="6"
                                        strokeDasharray={`${accuracyDash} ${C}`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="italic-serif text-[42px] leading-none text-[color:var(--cream)] font-light">{accuracy}<span className="text-[20px] text-[color:var(--amber)]">%</span></div>
                                <div className="mono text-[8px] tracking-[0.18em] text-[color:var(--cream-mt)] font-bold mt-0.5">GRADE</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="mono text-[10px] text-[color:var(--cream-mt)] font-semibold uppercase mb-1">ACCURACY INDEX</div>
                            <div className="text-[13px] text-[color:var(--cream-dim)] font-light leading-relaxed">
                                Mastered {totalSolved} out of {totalAttempted} recorded Olympiad problem sets.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flame Streak Grid Heatmap Widget */}
                <div className="surface rounded-2xl p-7 border border-[color:var(--cream)]/10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-baseline justify-between mb-2">
                            <span className="chip">Solve Streak</span>
                            <span className="mono text-[9px] text-[color:var(--cream-mt)] font-semibold uppercase">MAX · 34D</span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2.5">
                            <svg width="34" height="34" viewBox="0 0 38 38" className="flicker">
                                <path d="M19 3c2 6 8 8 8 16a8 8 0 11-16 0c0-4 2-6 4-8-2 6 2 8 4 8 0-4-2-8 0-16z"
                                      fill="var(--amber)" stroke="var(--amber-dim)" strokeWidth="0.6" />
                            </svg>
                            <div className="italic-serif text-[68px] leading-none text-[color:var(--cream)] font-light">
                                {streak}
                                <span className="text-[22px] text-[color:var(--cream-dim)] italic font-light ml-0.5">d</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="mono text-[9px] tracking-[0.18em] text-[color:var(--cream-mt)] font-bold uppercase">5-WEEK GRID</span>
                            <div className="flex items-center gap-1">
                                <span className="mono text-[8px] text-[color:var(--cream-mt)]">less</span>
                                {[0,1,2,3].map(v => (
                                    <span key={v} className="h-2 w-2 rounded-[2px]" style={{ background: shadeHeatmap(v) }} />
                                ))}
                                <span className="mono text-[8px] text-[color:var(--cream-mt)]">more</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {heatmapCells.map((v, i) => (
                                <span key={i} className="aspect-square rounded-[3px]" style={{ background: shadeHeatmap(v) }} />
                            ))}
                        </div>
                    </div>
                </div>

            </section>

            {/* 4. Bottom Main Grid: Recent Activity + Leaderboards */}
            <section className="mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] pb-16">
                
                {/* Left Side: Recent Activity */}
                <div className="rise" style={{ '--d': '700ms' } as React.CSSProperties}>
                    <div className="mb-4 flex items-end justify-between border-b hairline pb-2">
                        <h2 className="italic-serif text-[34px] leading-none text-[color:var(--cream)] font-normal">Recent activity</h2>
                        <Link href="/trainer" className="mono text-[10px] tracking-[0.16em] text-[color:var(--cream-dim)] hover:text-[color:var(--amber)] font-semibold uppercase">PRACTICE MORE →</Link>
                    </div>

                    <div className="surface overflow-hidden rounded-2xl border border-[color:var(--cream)]/10">
                        {activities.length === 0 ? (
                            <div className="text-center py-10 px-5">
                                <p className="text-[14px] text-[color:var(--cream-dim)] mb-4 font-light">No recorded training attempts in database.</p>
                                <Link href="/trainer" className="btn-amber rounded-full px-5 py-2 text-xs font-semibold text-[color:var(--ink-900)]">
                                    Start solving problems
                                </Link>
                            </div>
                        ) : (
                            activities.slice(0, 7).map((it, i) => {
                                const hasMedal = it.is_correct;
                                const status = hasMedal ? 'correct' : 'wrong';
                                
                                return (
                                    <div 
                                        key={it.id || i} 
                                        className={`relative grid grid-cols-[64px_28px_1fr_auto] items-center gap-4 px-5 py-3.5 ${
                                            i ? 'border-t border-[color:var(--cream)]/5' : ''
                                        }`}
                                    >
                                        <span className="mono text-[10px] text-[color:var(--cream-mt)] font-semibold">
                                            {it.created_at ? formatTimeAgo(it.created_at) : 'recently'}
                                        </span>
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full shrink-0 bg-white/[0.03]">
                                            {statusIcon[status]}
                                        </span>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="mono text-[9px] tracking-[0.16em] font-semibold text-[color:var(--amber)]">
                                                    {it.contest.toUpperCase()} #{it.number}
                                                </span>
                                                <span className="text-[12px] text-[color:var(--cream-mt)]">·</span>
                                                <span className="text-[12px] text-[color:var(--cream-dim)] truncate font-light">
                                                    {it.topic}
                                                </span>
                                            </div>
                                            <div className="mt-0.5 truncate text-[13.5px] text-[color:var(--cream)] font-light">
                                                {it.is_correct ? 'Correct answer submitted.' : 'Attempt submitted for analysis.'}
                                            </div>
                                        </div>
                                        <span className="mono text-[10px] text-[color:var(--cream-mt)] font-semibold uppercase">{it.difficulty}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Side: Leaderboard panel */}
                <aside className="rise" style={{ '--d': '850ms' } as React.CSSProperties}>
                    <div className="mb-4 flex items-end justify-between border-b hairline pb-2">
                        <h2 className="italic-serif text-[34px] leading-none text-[color:var(--cream)] font-normal">Leaderboard</h2>
                        <span className="mono text-[10px] tracking-[0.14em] text-[color:var(--cream-mt)] font-semibold uppercase">7-DAY ACTIVE BOARD</span>
                    </div>

                    {/* Toggle tabs */}
                    <div className="flex rounded-lg bg-[color:var(--ink-850)]/60 border border-[color:var(--cream)]/10 p-0.5 mb-4">
                        <button
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                                lbTab === 'accuracy' ? 'bg-[color:var(--cream)] text-[color:var(--ink-900)]' : 'text-[color:var(--cream-dim)] hover:text-white'
                            }`}
                            onClick={() => setLbTab('accuracy')}
                        >
                            ACTIVE
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                                lbTab === 'streak' ? 'bg-[color:var(--cream)] text-[color:var(--ink-900)]' : 'text-[color:var(--cream-dim)] hover:text-white'
                            }`}
                            onClick={() => setLbTab('streak')}
                        >
                            STREAK
                        </button>
                    </div>

                    <div className="surface overflow-hidden rounded-2xl border border-[color:var(--cream)]/10">
                        {activeLeaderboard.length === 0 ? (
                            <div className="text-center py-8 text-xs text-[color:var(--cream-mt)] italic">Loading leaderboard data...</div>
                        ) : (
                            activeLeaderboard.slice(0, 8).map((r, i) => {
                                const isMe = r.user_id === currentUserId;
                                // Active tab: longest streak of consecutive days with any
                                // engagement on the site (catches consistency rather than
                                // letting a user with 1/1 correct rank above 30/30).
                                // Streak tab: longest run of consecutive correct submissions.
                                const mainValue = lbTab === 'accuracy'
                                    ? `${r.activeDays ?? 0}`
                                    : `${r.streak}`;
                                const subValue = lbTab === 'accuracy'
                                    ? (r.activeDays === 1 ? 'day in a row' : 'days in a row')
                                    : 'in a row';

                                return (
                                    <div
                                        key={r.user_id}
                                        className={`relative grid grid-cols-[28px_1fr_auto] items-center gap-3 px-5 py-3 ${
                                            i ? 'border-t border-[color:var(--cream)]/5' : ''
                                        } ${isMe ? 'bg-[color:var(--amber)]/[0.08]' : ''}`}
                                    >
                                        {isMe && <span className="absolute inset-y-0 left-0 w-[3px] bg-[color:var(--amber)]" />}
                                        <span className={`mono text-[11px] font-bold ${i < 3 ? 'text-[color:var(--amber)]' : 'text-[color:var(--cream-mt)]'}`}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span
                                                className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-[10px] text-white font-bold"
                                                style={{ background: isMe
                                                    ? 'linear-gradient(135deg, var(--amber), oklch(0.55 0.12 50))'
                                                    : `linear-gradient(135deg, oklch(0.7 0.06 ${(i*52)%360}), var(--ink-800))`
                                                }}
                                            >
                                                {r.username.charAt(0).toUpperCase()}
                                            </span>
                                            <span className={`text-[13.5px] truncate font-light ${isMe ? 'text-[color:var(--cream)] font-medium' : 'text-[color:var(--cream-dim)]'}`}>
                                                {r.username}
                                                {isMe && <span className="ml-1.5 mono text-[8.5px] text-[color:var(--amber)] font-bold tracking-wider uppercase">YOU</span>}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5 text-right">
                                            <span className="italic-serif text-[18px] leading-none text-[color:var(--cream)] font-normal">
                                                {mainValue}
                                            </span>
                                            <span className="mono text-[9px] tracking-[0.12em] text-[color:var(--cream-mt)] uppercase">
                                                {subValue}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                </aside>

            </section>

        </div>
    );
}
