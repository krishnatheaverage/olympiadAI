'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { sampleRoadmaps, RoadmapPhase } from '@/lib/roadmap';
import { updateProfile, fetchProfile } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const trackOptions = [
    { value: 'math', label: 'Math Olympiad', num: '01' },
    { value: 'chemistry', label: 'Chemistry Olympiad', num: '02' },
    { value: 'physics', label: 'Physics Olympiad', num: '03' },
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

    // Selected Journey Node state
    const [selectedNode, setSelectedNode] = useState('aime');

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
                if (profile.roadmap_completed) {
                    setAlreadyCompleted(true);
                    loadSampleRoadmap(profile.target_track || 'math');
                }
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
                loadSampleRoadmap(track);
            }

            // Save to profile AFTER successful generation
            await updateProfile({
                target_track: track as 'math' | 'chemistry' | 'physics',
                target_goal: goal,
                roadmap_completed: true
            });
            setAlreadyCompleted(true);
        } catch {
            loadSampleRoadmap(track);
        } finally {
            setIsGenerating(false);
        }
    };

    const loadSampleRoadmap = (activeTrack: string) => {
        const key = Object.keys(sampleRoadmaps).find((k) => k.startsWith(activeTrack));
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

    const getTrainerUrl = () => {
        const params = new URLSearchParams();
        params.set('track', track === 'math' ? 'AMC' : track === 'chemistry' ? 'USNCO' : 'F=ma');
        return `/trainer?${params.toString()}`;
    };

    // Nodes for dynamic journey graph based on track
    const journeyNodes = useMemo(() => {
        if (track === 'chemistry') {
            return [
                { id: 'ap_chem', label: 'AP Chem',   state: 'done',    sub: 'Score 5 · ✓',   x: 100,  y: 160 },
                { id: 'local',   label: 'Local Exam', state: 'done',    sub: 'Qual · ✓',      x: 320,  y: 90  },
                { id: 'national',label: 'Nationals',  state: 'active',  sub: 'Now · Prep',    x: 560,  y: 150 },
                { id: 'honors',  label: 'Honors',    state: 'next',    sub: 'Top 150',       x: 800,  y: 70  },
                { id: 'camp',    label: 'Camp',      state: 'goal',    sub: 'Top 20',        x: 1040, y: 150 },
            ];
        } else if (track === 'physics') {
            return [
                { id: 'ap_phys', label: 'AP Phys',   state: 'done',    sub: 'Completed · ✓', x: 100,  y: 160 },
                { id: 'fma',     label: 'F = ma',    state: 'done',    sub: 'Score 18 · ✓',  x: 320,  y: 90  },
                { id: 'usapho',  label: 'USAPhO',    state: 'active',  sub: 'Now · Prep',    x: 560,  y: 150 },
                { id: 'medal',   label: 'Medal',     state: 'next',    sub: 'Silver Target', x: 800,  y: 70  },
                { id: 'team',    label: 'Team Camp', state: 'goal',    sub: 'Top 24',        x: 1040, y: 150 },
            ];
        }
        // default math track
        return [
            { id: 'amc10', label: 'AMC 10/12', state: 'done',    sub: 'Score 126 · ✓', x: 100,  y: 160 },
            { id: 'aime_q', label: 'AIME Qual', state: 'done',    sub: 'Qualified · ✓', x: 320,  y: 90  },
            { id: 'aime',  label: 'AIME Score', state: 'active',  sub: 'Now · 9/15',    x: 560,  y: 150 },
            { id: 'usamo', label: 'USAMO',      state: 'next',    sub: 'Target Apr',    x: 800,  y: 70  },
            { id: 'mop',   label: 'MOP',        state: 'goal',    sub: 'Target Jun',    x: 1040, y: 150 },
        ];
    }, [track]);

    // Path curve calculator
    const smoothD = useMemo(() => {
        return `M ${journeyNodes[0].x},${journeyNodes[0].y} ` + journeyNodes.slice(1).map((n, i) => {
            const prev = journeyNodes[i];
            const cx1 = prev.x + 120, cy1 = prev.y;
            const cx2 = n.x - 120,    cy2 = n.y;
            return `C ${cx1},${cy1} ${cx2},${cy2} ${n.x},${n.y}`;
        }).join(' ');
    }, [journeyNodes]);

    const completedD = useMemo(() => {
        return `M ${journeyNodes[0].x},${journeyNodes[0].y} C ${journeyNodes[0].x+120},${journeyNodes[0].y} ${journeyNodes[1].x-120},${journeyNodes[1].y} ${journeyNodes[1].x},${journeyNodes[1].y}` +
               ` C ${journeyNodes[1].x+120},${journeyNodes[1].y} ${journeyNodes[2].x-120},${journeyNodes[2].y} ${journeyNodes[2].x},${journeyNodes[2].y}`;
    }, [journeyNodes]);

    const fillNode = (s: string) => ({
        done:   'oklch(0.80 0.115 155)',
        active: 'var(--amber)',
        next:   'oklch(0.95 0.018 78)',
        goal:   'transparent',
    })[s] || 'var(--cream)';

    if (isLoggedIn === false) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20 px-5 z-10 text-center">
                <div className="surface rounded-2xl p-8 border border-[color:var(--cream)]/10 max-w-md w-full">
                    <h2 className="italic-serif text-3xl mb-3 text-[color:var(--cream)] font-normal">Dynamic Roadmap</h2>
                    <p className="text-sm text-[color:var(--cream-dim)] mb-6 font-light">Please log in to generate an active milestone roadmap matched to your targeted Olympiads.</p>
                    <Link href="/login" className="btn-amber inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14px] font-semibold">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoggedIn === null) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 z-10 text-[color:var(--cream-dim)]">
                <div className="w-6 h-6 border-2 border-[color:var(--amber)] border-t-transparent rounded-full animate-spin" />
                <span className="mono text-[10px] tracking-wider uppercase">Loading training timelines...</span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1320px] mx-auto px-6 z-10 relative">
            
            {/* Header strip */}
            <header className="rise mt-8 mb-8" style={{ '--d': '280ms' } as React.CSSProperties}>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <div className="chip mb-2.5">Track · {trackOptions.find(t => t.value === track)?.label || 'Mathematics'}</div>
                        <h1 className="text-[clamp(40px,5.2vw,72px)] leading-[0.96] tracking-[-0.02em] text-[color:var(--cream)] font-normal">
                            The path from
                            <br />
                            <span className="italic-serif font-light">where you are</span><span className="text-[color:var(--amber)]">,</span>
                            {' '}to <span className="italic-serif font-light">where you're going.</span>
                        </h1>
                    </div>
                    {alreadyCompleted && (
                        <div className="flex items-end gap-6 pb-1.5">
                            <div className="text-right">
                                <div className="mono text-[9px] tracking-[0.18em] text-[color:var(--cream-mt)] font-bold">YOU ARE HERE</div>
                                <div className="italic-serif mt-1 text-[26px] leading-none text-[color:var(--cream)]">AIME · 9/15</div>
                            </div>
                            <div className="mono text-[18px] text-[color:var(--cream-mt)] font-bold">→</div>
                            <div className="text-right">
                                <div className="mono text-[9px] tracking-[0.18em] text-[color:var(--amber)] font-bold">GOAL · JUN 2026</div>
                                <div className="italic-serif mt-1 text-[26px] leading-none text-[color:var(--amber)] uppercase">{goal.split(' ').slice(-1)[0] || 'USAMO'}</div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {!alreadyCompleted ? (
                /* Dynamic Curriculum Setup Form */
                <div className="rise max-w-2xl mx-auto surface rounded-2xl p-7 border border-[color:var(--cream)]/10 mb-20" style={{ '--d': '400ms' } as React.CSSProperties}>
                    <div className="border-b hairline pb-3 mb-6">
                        <span className="mono text-[10px] tracking-[0.16em] text-[color:var(--amber)] font-bold">CURRICULUM SETUP</span>
                        <h2 className="italic-serif text-3xl text-[color:var(--cream)] mt-1 font-light">Outline your targets</h2>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        {/* Track Select */}
                        <div>
                            <label className="block mono text-[10px] tracking-wider text-gray-300 mb-2.5 uppercase font-semibold">
                                Select Competition Track
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {trackOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setTrack(opt.value)}
                                        className={`flex flex-col justify-between p-4 rounded-xl text-left border transition-all cursor-pointer hover:translate-y-[-1px]
                                            ${track === opt.value
                                                ? 'bg-[color:var(--amber)]/10 border-[color:var(--amber)] text-[color:var(--cream)] shadow-md shadow-[color:var(--amber)]/5'
                                                : 'bg-[color:var(--ink-800)]/30 border-[color:var(--cream)]/10 text-[color:var(--cream-dim)] hover:border-[color:var(--cream)]/20'
                                            }`}
                                    >
                                        <span className="mono text-[9px] text-[color:var(--cream-mt)] font-semibold">{opt.num}</span>
                                        <span className="italic-serif text-[20px] mt-4 font-normal text-[color:var(--cream)]">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Level Selection */}
                        <div>
                            <label className="block mono text-[10px] tracking-wider text-gray-300 mb-2.5 uppercase font-semibold">
                                What is your current level?
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(levelsByTrack[track] || []).map((lvl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentLevel(lvl)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13.5px] text-left transition-all border cursor-pointer
                                            ${currentLevel === lvl
                                                ? 'bg-[color:var(--good)]/10 border-[color:var(--good)]/40 text-[color:var(--cream)]'
                                                : 'bg-white/[0.02] border-[color:var(--cream)]/10 text-[color:var(--cream-dim)] hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                                            ${currentLevel === lvl
                                                ? 'bg-[color:var(--good)] text-[color:var(--ink-900)]'
                                                : 'bg-[color:var(--ink-900)] text-[color:var(--cream-mt)] border border-[color:var(--cream)]/10'
                                            }`}
                                        >
                                            {idx + 1}
                                        </span>
                                        <span className="font-light">{lvl}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Goal Selection */}
                        <div>
                            <label className="block mono text-[10px] tracking-wider text-gray-300 mb-2.5 uppercase font-semibold">
                                What is your target milestone?
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(goalsByTrack[track] || []).map((g, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setGoal(g)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13.5px] text-left transition-all border cursor-pointer
                                            ${goal === g
                                                ? 'bg-[color:var(--amber)]/10 border-[color:var(--amber)]/40 text-[color:var(--cream)]'
                                                : 'bg-white/[0.02] border-[color:var(--cream)]/10 text-[color:var(--cream-dim)] hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                                            ${goal === g
                                                ? 'bg-[color:var(--amber)] text-[color:var(--ink-900)]'
                                                : 'bg-[color:var(--ink-900)] text-[color:var(--cream-mt)] border border-[color:var(--cream)]/10'
                                            }`}
                                        >
                                            {idx + 1}
                                        </span>
                                        <span className="font-light">{g}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-amber w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-semibold text-[color:var(--ink-900)] mt-4 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            disabled={isGenerating || !goal.trim() || !currentLevel.trim()}
                        >
                            {isGenerating ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-[color:var(--ink-900)] border-t-transparent rounded-full animate-spin" />
                                    <span>CALCULATING PRACTICE STEPS...</span>
                                </div>
                            ) : (
                                'Generate My Coaching Roadmap'
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                /* Journey Timeline Graph Result display */
                <div className="space-y-12">
                    <section className="rise" style={{ '--d': '420ms' } as React.CSSProperties}>
                        <div className="surface relative overflow-hidden rounded-2xl px-6 py-8 border border-[color:var(--cream)]/10">
                            {/* Year rulers */}
                            <div className="mb-3 flex items-center justify-between mono text-[10px] tracking-[0.18em] text-[color:var(--cream-mt)] uppercase font-semibold">
                                <span>2024</span><span>SPRING ‘25</span><span>FALL ‘25</span><span>SPRING ‘26</span><span>SUMMER ‘26</span>
                            </div>

                            {/* Journey path drawing scroll-box */}
                            <div className="relative w-full overflow-x-auto thin-scroll">
                                <svg viewBox="0 0 1140 240" className="block w-full min-w-[1100px]" style={{ height: 260 }}>
                                    {[0,1,2,3,4].map(i => (
                                        <line key={i} x1={100 + i*240} x2={100 + i*240} y1={20} y2={220}
                                              stroke="oklch(0.95 0.02 80 / 0.06)" strokeDasharray="2 4" />
                                    ))}
                                    <line x1={60} x2={1080} y1={120} y2={120} stroke="oklch(0.95 0.02 80 / 0.08)" />

                                    {/* Paths curve draws */}
                                    <path d={smoothD} fill="none" stroke="oklch(0.95 0.02 80 / 0.18)" strokeWidth="2" strokeDasharray="4 6" />
                                    <path d={completedD} fill="none" stroke="var(--amber)" strokeWidth="2.4" className="draw-path" strokeLinecap="round" />

                                    {/* Interactive Nodes */}
                                    {journeyNodes.map((n, i) => {
                                        const isSelected = selectedNode === n.id;
                                        return (
                                            <g key={n.id} className="node-pop cursor-pointer" style={{ animationDelay: `${900 + i*180}ms` } as React.CSSProperties}
                                               onClick={() => setSelectedNode(n.id)}>
                                                {isSelected && (
                                                    <circle cx={n.x} cy={n.y} r="28" fill="none" stroke="var(--amber)" strokeOpacity="0.4" strokeDasharray="2 4" />
                                                )}
                                                <circle cx={n.x} cy={n.y} r="18"
                                                        fill={fillNode(n.state)}
                                                        stroke={n.state === 'goal' ? 'var(--amber)' : 'transparent'}
                                                        strokeWidth={n.state === 'goal' ? 1.5 : 0}
                                                        strokeDasharray={n.state === 'goal' ? '3 4' : undefined} />
                                                {n.state === 'done' && (
                                                    <path d={`M ${n.x-6},${n.y} l 4,4 l 7,-8`} stroke="var(--ink-900)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                )}
                                                {n.state === 'active' && (
                                                    <circle cx={n.x} cy={n.y} r="5" fill="var(--ink-900)" />
                                                )}
                                                {n.state === 'next' && (
                                                    <circle cx={n.x} cy={n.y} r="6" fill="none" stroke="var(--ink-900)" strokeWidth="1.4" />
                                                )}
                                                {n.state === 'goal' && (
                                                    <circle cx={n.x} cy={n.y} r="3.5" fill="var(--amber)" />
                                                )}

                                                <text x={n.x} y={n.y + (i % 2 === 0 ? 50 : -32)}
                                                      textAnchor="middle"
                                                      className="italic-serif text-[22px] font-normal leading-none"
                                                      fill="var(--cream)">{n.label}</text>
                                                <text x={n.x} y={n.y + (i % 2 === 0 ? 68 : -50)}
                                                      textAnchor="middle"
                                                      className="mono text-[10px] tracking-wider"
                                                      fill="var(--cream-mt)">{n.sub.toUpperCase()}</text>
                                            </g>
                                        );
                                    })}

                                    {/* Active pulsing focus ring */}
                                    {journeyNodes.find(n => n.state === 'active') && (
                                        <g>
                                            <circle cx="560" cy="150" r="34" fill="none" stroke="var(--amber)" strokeOpacity="0.25">
                                                <animate attributeName="r" values="22;38;22" dur="3.4s" repeatCount="indefinite" />
                                                <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="3.4s" repeatCount="indefinite" />
                                            </circle>
                                        </g>
                                    )}
                                </svg>
                            </div>

                            {/* Legend details */}
                            <div className="mt-3 flex flex-wrap items-center gap-5 mono text-[10px] tracking-[0.16em] text-[color:var(--cream-mt)] font-semibold">
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{background:'oklch(0.80 0.115 155)'}}/> COMPLETED STEP</span>
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[color:var(--amber)]" /> CURRENT FOCUS</span>
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[color:var(--cream)]" /> COMING NEXT</span>
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full border border-[color:var(--amber)]" /> TARGET TARGET</span>
                            </div>
                        </div>
                    </section>

                    {/* Dynamic topic masteries + upcoming exams */}
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
                        
                        {/* Topic Mastery breakdown */}
                        <section className="rise" style={{ '--d': '640ms' } as React.CSSProperties}>
                            <div className="mb-4 flex items-end justify-between border-b hairline pb-2">
                                <h2 className="italic-serif text-[34px] leading-none text-[color:var(--cream)] font-normal">Topic mastery <span className="text-[color:var(--cream-mt)]">— active track</span></h2>
                                <span className="mono text-[10px] tracking-[0.14em] text-[color:var(--cream-mt)] font-semibold">CURRENT % · TARGET %</span>
                            </div>
                            
                            <div className="surface overflow-hidden rounded-2xl border border-[color:var(--cream)]/10">
                                {[
                                    { name: 'Number Theory',      now: 62, need: 80, weight: 'high'   },
                                    { name: 'Combinatorics',      now: 71, need: 85, weight: 'high'   },
                                    { name: 'Algebra',            now: 78, need: 75, weight: 'medium' },
                                    { name: 'Geometry',           now: 54, need: 75, weight: 'high'   },
                                    { name: 'Functional Equations', now: 42, need: 70, weight: 'medium' },
                                    { name: 'Inequalities',       now: 60, need: 70, weight: 'medium' },
                                ].map((t, i) => {
                                    const gap = Math.max(0, t.need - t.now);
                                    return (
                                        <div key={t.name} className={`grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 px-6 py-4.5 ${i ? 'border-t border-[color:var(--cream)]/5' : ''}`}>
                                            <div className="col-span-2 flex items-baseline justify-between">
                                                <div className="flex items-baseline gap-3">
                                                    <span className="italic-serif text-[22px] text-[color:var(--cream)] font-light">{t.name}</span>
                                                    {t.weight === 'high' && (
                                                        <span className="mono text-[9px] tracking-[0.14em] text-[color:var(--amber)] font-bold">HIGH LEVERAGE</span>
                                                    )}
                                                </div>
                                                <div className="flex items-baseline gap-2.5">
                                                    <span className="italic-serif text-[22px] text-[color:var(--cream-dim)] font-light">{t.now}%</span>
                                                    <span className="mono text-[11px] text-[color:var(--cream-mt)]">→</span>
                                                    <span className="italic-serif text-[22px] text-[color:var(--amber)] font-medium">{t.need}%</span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 relative h-1.5 overflow-hidden rounded-full bg-[color:var(--ink-900)]/60">
                                                <span className="absolute inset-y-0 left-0 bg-[color:var(--cream)]/30" style={{ width: `${t.now}%` }} />
                                                <span className="absolute inset-y-0 left-0 bg-[color:var(--amber)]" style={{ width: `${Math.min(t.now, t.need)}%`, opacity: 0.85 }} />
                                                <span className="absolute top-0 h-full w-[1.5px] bg-[color:var(--amber)]" style={{ left: `${t.need}%` }} />
                                            </div>
                                            <div className="col-span-2 mt-0.5 flex items-center justify-between mono text-[9px] tracking-[0.14em] text-[color:var(--cream-mt)] font-semibold">
                                                <span>
                                                    {gap > 0 ? `+${gap}% TO GO` : 'MET TARGET COMPLETED'}
                                                    <span className="mx-2">·</span>
                                                    ~{Math.max(3, Math.round(gap/4))} WEEKS EXPECTED
                                                </span>
                                                <Link href={getTrainerUrl()} className="text-[color:var(--amber)] hover:underline font-bold">DRILL THIS →</Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Calendar Exams milestone strip */}
                        <aside className="rise" style={{ '--d': '780ms' } as React.CSSProperties}>
                            <div className="mb-4 flex items-end justify-between border-b hairline pb-2">
                                <h2 className="italic-serif text-[34px] leading-none text-[color:var(--cream)] font-normal">Calendar</h2>
                                <button className="mono text-[9px] tracking-[0.16em] text-[color:var(--cream-dim)] hover:text-[color:var(--cream)] font-semibold uppercase cursor-pointer">+ SUBSCRIBE</button>
                            </div>
                            
                            <div className="surface overflow-hidden rounded-2xl border border-[color:var(--cream)]/10">
                                {[
                                    { date: 'NOV 06 · 2025', name: 'AMC 10/12 B',     status: 'register', detail: '17 weeks of prep · you have 6h/wk' },
                                    { date: 'FEB 03 · 2026', name: 'AIME I',           status: 'queued',   detail: 'Auto-qualified via AMC · retake' },
                                    { date: 'APR 14 · 2026', name: 'USAMO',            status: 'target',   detail: 'Qualifying score needed: 100 (AMC + 10× AIME)' },
                                    { date: 'JUN 09 · 2026', name: 'MOP Selection',    status: 'goal',     detail: 'Top ≈30 USAMO scorers' },
                                ].map((e, i) => {
                                    const color = e.status === 'target' ? 'var(--amber)' : e.status === 'goal' ? 'oklch(0.80 0.115 155)' : 'var(--cream)';
                                    return (
                                        <div key={i} className={`grid grid-cols-[auto_1fr] gap-4 px-5 py-4.5 ${i ? 'border-t border-[color:var(--cream)]/5' : ''}`}>
                                            <span className="mono text-[9.5px] tracking-[0.16em] font-semibold shrink-0" style={{ color }}>{e.date}</span>
                                            <div>
                                                <div className="flex items-baseline justify-between gap-3">
                                                    <span className="italic-serif text-[21px] leading-none text-[color:var(--cream)] font-light">{e.name}</span>
                                                    <span className="mono text-[9px] tracking-[0.16em] font-bold" style={{ color }}>{e.status.toUpperCase()}</span>
                                                </div>
                                                <div className="mt-1 text-[13px] text-[color:var(--cream-dim)] font-light">{e.detail}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </aside>
                    </div>

                    {/* Detailed weekly timeline calendar layout */}
                    <section className="rise" style={{ '--d': '900ms' } as React.CSSProperties}>
                        <div className="mb-4 flex items-end justify-between border-b hairline pb-2">
                            <h2 className="italic-serif text-[34px] leading-none text-[color:var(--cream)] font-normal">This week, in detail</h2>
                            <span className="mono text-[10px] tracking-[0.14em] text-[color:var(--cream-mt)] font-semibold uppercase">AUTO-TUNED · LIVE</span>
                        </div>
                        
                        <div className="surface grid grid-cols-2 md:grid-cols-7 overflow-hidden rounded-2xl border border-[color:var(--cream)]/10 bg-[color:var(--ink-850)]/20">
                            {[
                                { d: 'Mon', focus: 'Number Theory', mins: 60, done: true  },
                                { d: 'Tue', focus: 'Combinatorics', mins: 45, done: true  },
                                { d: 'Wed', focus: 'Mixed mock',    mins: 90, done: true  },
                                { d: 'Thu', focus: 'Geometry',      mins: 60, done: false, today: true },
                                { d: 'Fri', focus: 'Number Theory', mins: 60, done: false },
                                { d: 'Sat', focus: 'Past USAMO',    mins: 120, done: false },
                                { d: 'Sun', focus: 'Rest / review', mins: 30,  done: false },
                            ].map((day, i) => (
                                <div key={day.d}
                                     className={`relative flex flex-col gap-3.5 p-5 ${i ? 'border-t border-[color:var(--cream)]/5 md:border-t-0 md:border-l' : ''} ${day.today ? 'bg-[color:var(--amber)]/[0.08]' : ''}`}>
                                    {day.today && <span className="absolute inset-x-0 top-0 h-[3px] bg-[color:var(--amber)]" />}
                                    <div className="flex items-center justify-between">
                                        <span className={`mono text-[9px] tracking-[0.2em] font-bold ${day.today ? 'text-[color:var(--amber)]' : 'text-[color:var(--cream-mt)]'}`}>{day.d.toUpperCase()}</span>
                                        {day.done && (
                                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="var(--good)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        )}
                                    </div>
                                    <div className="italic-serif text-[18px] leading-tight text-[color:var(--cream)] font-light">{day.focus}</div>
                                    <div className="mt-6 mono text-[9.5px] tracking-[0.14em] text-[color:var(--cream-mt)] font-semibold uppercase">{day.mins} MIN</div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12 pb-10">
                            <button 
                                onClick={() => setAlreadyCompleted(false)}
                                className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold text-[14.5px] cursor-pointer"
                            >
                                Reset & Reconfigure Goals
                            </button>
                        </div>
                    </section>
                </div>
            )}

        </div>
    );
}
