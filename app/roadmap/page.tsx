'use client';

import { useState, useEffect } from 'react';
import { sampleRoadmaps, RoadmapPhase } from '@/lib/roadmap';
import { updateProfile, fetchProfile } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const trackOptions = [
    { value: 'math', label: '🧮 Math Olympiad' },
    { value: 'chemistry', label: '⚗️ Chemistry Olympiad' },
    { value: 'physics', label: '⚛️ Physics Olympiad' },
];

const levelsByTrack: Record<string, string[]> = {
    math: [
        'Just starting out',
        'Comfortable with AMC 10',
        'Scoring 100+ on AMC 10/12',
        'Qualified for AIME before',
        'Scoring 5+ on AIME',
        'Qualified for USAMO/USAJMO before',
    ],
    chemistry: [
        'Just starting out',
        'Taken AP/Honors Chemistry',
        'Comfortable with USNCO Local',
        'Qualified for USNCO Nationals before',
        'Achieved Honors on Nationals before',
        'Qualified for Study Camp before',
    ],
    physics: [
        'Just starting out',
        'Taken AP Physics',
        'Passed F=ma before',
        'Qualified for USAPhO before',
        'Earned a medal on USAPhO before',
    ],
};

const goalsByTrack: Record<string, string[]> = {
    math: [
        'Qualify for AIME',
        'Score 8+ on AIME',
        'Qualify for USAJMO',
        'Qualify for USAMO',
        'Qualify for MOP',
        'Represent USA at IMO',
    ],
    chemistry: [
        'Qualify for USNCO National Exam',
        'Achieve Honors (Top 150) on Nationals',
        'Achieve High Honors (Top 50) on Nationals',
        'Qualify for USNCO Study Camp',
        'Represent USA at IChO',
    ],
    physics: [
        'Qualify for USAPhO from F=ma',
        'Earn Medal on USAPhO',
        'Qualify for Physics Team training camp',
        'Represent USA at IPhO',
    ],
};

export default function RoadmapPage() {
    const [track, setTrack] = useState('math');
    const [currentLevel, setCurrentLevel] = useState('');
    const [goal, setGoal] = useState('');
    const [phases, setPhases] = useState<RoadmapPhase[] | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            if (!supabase) {
                setIsLoggedIn(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsLoggedIn(false);
                return;
            }

            setIsLoggedIn(true);

            const profile = await fetchProfile();
            if (profile) {
                if (profile.target_track) setTrack(profile.target_track);
                if (profile.target_goal) setGoal(profile.target_goal);
                if (profile.roadmap_completed) setAlreadyCompleted(true);
            }
        }
        checkAuth();
    }, []);

    // Reset level and goal when track changes
    useEffect(() => {
        setCurrentLevel('');
        setGoal('');
    }, [track]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim() || !currentLevel.trim()) return;

        setIsGenerating(true);
        setPhases(null);

        try {
            const response = await fetch('/api/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ track, goal, currentLevel }),
            });

            if (response.ok) {
                const data = await response.json();
                setPhases(data.phases);
            } else {
                loadSampleRoadmap();
            }

            // Save to profile AFTER successful generation
            await updateProfile({
                target_track: track as 'math' | 'chemistry' | 'physics',
                target_goal: goal,
                roadmap_completed: true
            });
            setAlreadyCompleted(true);
        } catch {
            loadSampleRoadmap();
        } finally {
            setIsGenerating(false);
        }
    };

    const loadSampleRoadmap = () => {
        const key = Object.keys(sampleRoadmaps).find((k) => k.startsWith(track));
        if (key) {
            setPhases(sampleRoadmaps[key].phases);
        } else {
            setPhases([
                {
                    phase: 1,
                    title: 'Foundation',
                    duration: '4 weeks',
                    topics: ['Core Concepts', 'Basic Problem Solving', 'Fundamentals Review'],
                    description: 'Build a strong foundation in the fundamental principles.',
                },
                {
                    phase: 2,
                    title: 'Skill Development',
                    duration: '6 weeks',
                    topics: ['Intermediate Techniques', 'Pattern Recognition', 'Timed Practice'],
                    description: 'Develop problem-solving skills and speed.',
                },
                {
                    phase: 3,
                    title: 'Advanced Training',
                    duration: '4 weeks',
                    topics: ['Advanced Topics', 'Competition Strategy', 'Complex Problems'],
                    description: 'Master advanced techniques and strategies.',
                },
                {
                    phase: 4,
                    title: 'Competition Prep',
                    duration: '3 weeks',
                    topics: ['Mock Competitions', 'Time Management', 'Review & Refine'],
                    description: 'Final preparation with simulated contest conditions.',
                },
            ]);
        }
    };

    // Build trainer URL based on user's level and goal selections
    const getTrainerUrl = () => {
        const params = new URLSearchParams();
        params.set('track', track);

        // Map level to difficulty
        const levelIndex = (levelsByTrack[track] || []).indexOf(currentLevel);
        if (levelIndex <= 1) {
            params.set('difficulty', 'easy');
        } else if (levelIndex <= 3) {
            params.set('difficulty', 'medium');
        } else {
            params.set('difficulty', 'hard');
        }

        // Map goal to suggested contest
        if (track === 'math') {
            if (goal === 'Qualify for AIME') {
                params.set('contest', 'AMC 10A');
            } else if (goal === 'Score 8+ on AIME') {
                params.set('contest', 'AIME I');
            } else if (goal === 'Qualify for USAJMO' || goal === 'Qualify for USAMO') {
                params.set('contest', 'AIME I');
                params.set('difficulty', 'hard');
            }
        } else if (track === 'chemistry') {
            if (goal === 'Qualify for USNCO National Exam') {
                params.set('contest', 'USNCO Local');
            } else {
                params.set('contest', 'USNCO National');
            }
        } else if (track === 'physics') {
            if (goal === 'Qualify for USAPhO from F=ma') {
                params.set('contest', 'F=ma');
            } else {
                params.set('contest', 'USAPhO Part A');
            }
        }

        return `/trainer?${params.toString()}`;
    };

    if (isLoggedIn === false) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
                <div className="login-card" style={{ textAlign: 'center' }}>
                    <h1 className="section-header__title" style={{ marginBottom: '0.75rem' }}>Welcome to OlympiadAI</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Sign in to set your goals and start your personalized training journey.
                    </p>
                    <a href="/login" className="btn btn--primary btn--lg" style={{ width: '100%' }}>
                        Sign In to Get Started
                    </a>
                </div>
            </div>
        );
    }

    if (isLoggedIn === null) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="section-header" style={{ textAlign: 'center' }}>
                <h1 className="section-header__title">
                    {alreadyCompleted ? 'Your Roadmap' : 'Set Your Goal'}
                </h1>
                <p className="section-header__subtitle">
                    {alreadyCompleted
                        ? 'Update your goals or generate a new training plan'
                        : 'Tell us where you are and where you want to go'}
                </p>
            </div>

            {/* Form */}
            <div className="roadmap-form">
                <form onSubmit={handleGenerate}>
                    <div className="roadmap-form__fields">
                        <div className="input-group">
                            <label className="input-group__label">Competition Track</label>
                            <select
                                className="select-field"
                                value={track}
                                onChange={(e) => setTrack(e.target.value)}
                            >
                                {trackOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-group__label">Where are you right now?</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {(levelsByTrack[track] || []).map((lvl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentLevel(lvl)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            background: currentLevel === lvl
                                                ? 'rgba(16, 185, 129, 0.15)'
                                                : 'var(--bg-glass)',
                                            border: `1px solid ${currentLevel === lvl
                                                ? 'var(--accent-emerald)'
                                                : 'var(--border-subtle)'
                                                }`,
                                            borderRadius: 'var(--radius-md)',
                                            color: currentLevel === lvl ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'all var(--transition-fast)',
                                            textAlign: 'left',
                                            fontFamily: 'inherit',
                                        }}
                                    >
                                        <span style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: currentLevel === lvl ? 'var(--accent-emerald)' : 'var(--bg-tertiary)',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            color: currentLevel === lvl ? 'white' : 'var(--text-muted)',
                                            flexShrink: 0,
                                        }}>
                                            {idx + 1}
                                        </span>
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-group__label">Where do you want to be?</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {(goalsByTrack[track] || []).map((g, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setGoal(g)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            background: goal === g
                                                ? 'rgba(59, 130, 246, 0.15)'
                                                : 'var(--bg-glass)',
                                            border: `1px solid ${goal === g
                                                ? 'var(--accent-primary)'
                                                : 'var(--border-subtle)'
                                                }`,
                                            borderRadius: 'var(--radius-md)',
                                            color: goal === g ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'all var(--transition-fast)',
                                            textAlign: 'left',
                                            fontFamily: 'inherit',
                                        }}
                                    >
                                        <span style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: goal === g ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            color: goal === g ? 'white' : 'var(--text-muted)',
                                            flexShrink: 0,
                                        }}>
                                            {idx + 1}
                                        </span>
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary btn--lg"
                        style={{ width: '100%' }}
                        disabled={isGenerating || !goal.trim() || !currentLevel.trim()}
                    >
                        {isGenerating ? (
                            <>
                                <div className="loading-spinner" /> Generating Roadmap...
                            </>
                        ) : (
                            '🗺️ Generate My Roadmap'
                        )}
                    </button>
                </form>
            </div>

            {/* Roadmap Result */}
            {phases && (
                <div className="roadmap-result">
                    <div
                        className="section-header"
                        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
                    >
                        <h2 className="section-header__title">
                            Your Training Roadmap
                        </h2>
                        <p className="section-header__subtitle">
                            {trackOptions.find((t) => t.value === track)?.label} → {goal}
                        </p>
                    </div>

                    <div className="roadmap-timeline">
                        {phases.map((phase, idx) => (
                            <div
                                className="roadmap-phase"
                                key={idx}
                                style={{ animationDelay: `${idx * 0.15}s` }}
                            >
                                <div
                                    className="roadmap-phase__dot"
                                    style={{
                                        background:
                                            idx === 0
                                                ? 'var(--accent-primary)'
                                                : idx === 1
                                                    ? 'var(--accent-secondary)'
                                                    : idx === 2
                                                        ? 'var(--accent-pink)'
                                                        : 'var(--accent-emerald)',
                                        boxShadow: `0 0 0 2px ${idx === 0
                                            ? 'var(--accent-primary)'
                                            : idx === 1
                                                ? 'var(--accent-secondary)'
                                                : idx === 2
                                                    ? 'var(--accent-pink)'
                                                    : 'var(--accent-emerald)'
                                            }`,
                                    }}
                                />
                                <div className="card" style={{ marginLeft: '0.5rem' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        <h3 className="roadmap-phase__title">
                                            Phase {phase.phase}: {phase.title}
                                        </h3>
                                        <span className="roadmap-phase__duration">
                                            {phase.duration}
                                        </span>
                                    </div>
                                    <p
                                        style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--text-secondary)',
                                            marginBottom: '0.75rem',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {phase.description}
                                    </p>
                                    <div className="roadmap-phase__topics">
                                        {phase.topics.map((topic, tIdx) => (
                                            <span key={tIdx} className="roadmap-phase__topic">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Continue to Trainer */}
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <a href={getTrainerUrl()} className="btn btn--primary btn--lg">
                            Start Training →
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
