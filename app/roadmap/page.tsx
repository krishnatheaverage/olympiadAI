'use client';

import { useState, useEffect } from 'react';
import { sampleRoadmaps, RoadmapPhase } from '@/lib/roadmap';
import { updateProfile, fetchProfile } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const trackOptions = [
    { value: 'math', label: 'Math Olympiad' },
    { value: 'chemistry', label: 'Chemistry Olympiad' },
    { value: 'physics', label: 'Physics Olympiad' },
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

const phaseColors = [
    { bg: 'bg-indigo-500', ring: 'ring-indigo-500/50' },
    { bg: 'bg-purple-500', ring: 'ring-purple-500/50' },
    { bg: 'bg-pink-500', ring: 'ring-pink-500/50' },
    { bg: 'bg-emerald-500', ring: 'ring-emerald-500/50' },
];

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
            <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center px-4 pt-16">
                <h2 className="text-2xl font-bold text-gray-100 mb-3">Please Log In</h2>
                <p className="text-gray-400 mb-6">You need to be logged in to set your roadmap.</p>
                <a
                    href="/login"
                    className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-6 py-3 font-medium transition-colors"
                >
                    Go to Login
                </a>
            </div>
        );
    }

    if (isLoggedIn === null) {
        return (
            <div className="min-h-screen bg-[#050507] flex justify-center pt-16">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050507] px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">
                        {alreadyCompleted ? 'Your Roadmap' : 'Set Your Goal'}
                    </h1>
                    <p className="text-gray-400">
                        {alreadyCompleted
                            ? 'Update your goals or generate a new training plan'
                            : 'Tell us where you are and where you want to go'}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-6 mb-8">
                    <form onSubmit={handleGenerate}>
                        <div className="space-y-6">
                            {/* Track Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Competition Track
                                </label>
                                <select
                                    className="bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-gray-100 w-full focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
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

                            {/* Level Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Where are you right now?
                                </label>
                                <div className="flex flex-col gap-2">
                                    {(levelsByTrack[track] || []).map((lvl, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setCurrentLevel(lvl)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left transition-all cursor-pointer border ${
                                                currentLevel === lvl
                                                    ? 'bg-emerald-500/15 border-emerald-500/60 text-gray-100'
                                                    : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:text-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold shrink-0 ${
                                                    currentLevel === lvl
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-[#16161f] text-gray-500'
                                                }`}
                                            >
                                                {idx + 1}
                                            </span>
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Goal Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Where do you want to be?
                                </label>
                                <div className="flex flex-col gap-2">
                                    {(goalsByTrack[track] || []).map((g, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setGoal(g)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left transition-all cursor-pointer border ${
                                                goal === g
                                                    ? 'bg-indigo-500/15 border-indigo-500/60 text-gray-100'
                                                    : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:text-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold shrink-0 ${
                                                    goal === g
                                                        ? 'bg-indigo-500 text-white'
                                                        : 'bg-[#16161f] text-gray-500'
                                                }`}
                                            >
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
                            className="w-full mt-8 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2"
                            disabled={isGenerating || !goal.trim() || !currentLevel.trim()}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating Roadmap...
                                </>
                            ) : (
                                'Generate My Roadmap'
                            )}
                        </button>
                    </form>
                </div>

                {/* Roadmap Result */}
                {phases && (
                    <div className="mt-12">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-100 mb-2">
                                Your Training Roadmap
                            </h2>
                            <p className="text-gray-400">
                                {trackOptions.find((t) => t.value === track)?.label} &rarr; {goal}
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-8 border-l border-white/[0.08]">
                            {phases.map((phase, idx) => {
                                const color = phaseColors[idx % phaseColors.length];
                                return (
                                    <div
                                        className="relative mb-8 last:mb-0"
                                        key={idx}
                                        style={{ animationDelay: `${idx * 0.15}s` }}
                                    >
                                        {/* Dot */}
                                        <div
                                            className={`absolute -left-[calc(1rem+4.5px)] top-5 w-[10px] h-[10px] rounded-full ${color.bg} ring-2 ${color.ring}`}
                                        />

                                        {/* Phase Card */}
                                        <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5 ml-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-base font-semibold text-gray-100">
                                                    Phase {phase.phase}: {phase.title}
                                                </h3>
                                                <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 rounded-full px-2.5 py-1">
                                                    {phase.duration}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                                                {phase.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {phase.topics.map((topic, tIdx) => (
                                                    <span
                                                        key={tIdx}
                                                        className="text-xs text-gray-300 bg-white/[0.04] border border-white/[0.06] rounded-md px-2.5 py-1"
                                                    >
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Continue to Trainer */}
                        <div className="text-center mt-10">
                            <a
                                href={getTrainerUrl()}
                                className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-8 py-3 font-medium transition-colors"
                            >
                                Start Training &rarr;
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
