'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LatexRenderer from '@/components/LatexRenderer';
import {
    Problem,
    ProblemsData,
    loadProblems,
    checkAnswer,
    shuffleProblems,
} from '@/lib/problems';
import { getUser } from '@/lib/auth';
import { recordMockResult } from '@/lib/supabase';
import { MOCK_CONFIGS, MockConfig } from '@/lib/mock';

type Phase = 'setup' | 'active' | 'done';

interface MockResultSummary {
    correct: number;
    wrong: number;
    blank: number;
    total: number;
    score: number;
    elapsed: number;
}

export default function MockPage() {
    const router = useRouter();

    const [authChecked, setAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [problemsData, setProblemsData] = useState<ProblemsData | null>(null);

    const [selectedKey, setSelectedKey] = useState<string>('AMC 10');
    const [phase, setPhase] = useState<Phase>('setup');

    const [problems, setProblems] = useState<Problem[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [flagged, setFlagged] = useState<Set<number>>(new Set());
    const [currentIdx, setCurrentIdx] = useState(0);
    const [remainingSec, setRemainingSec] = useState(0);

    const [result, setResult] = useState<MockResultSummary | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // The submit handler closes over a lot of state, so stash the live values
    // in a ref and let the auto-submit (on timer expiry) read them.
    const stateRef = useRef({
        problems,
        answers,
        startedAt: 0,
        config: MOCK_CONFIGS[selectedKey],
        selectedKey,
    });
    stateRef.current = {
        problems,
        answers,
        startedAt: stateRef.current.startedAt,
        config: MOCK_CONFIGS[selectedKey],
        selectedKey,
    };

    useEffect(() => {
        getUser().then(user => {
            if (!user) setIsLoggedIn(false);
            else setAuthChecked(true);
        });
    }, []);

    useEffect(() => {
        if (authChecked) loadProblems().then(setProblemsData).catch(console.error);
    }, [authChecked]);

    const submitTest = useCallback(async () => {
        const { problems: probs, answers: ans, startedAt, config, selectedKey: key } = stateRef.current;
        if (probs.length === 0) return;

        const elapsed = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
        let correct = 0;
        let wrong = 0;
        let blank = 0;
        probs.forEach((p, i) => {
            const a = (ans[i] || '').trim();
            if (!a) blank++;
            else if (checkAnswer(p, a)) correct++;
            else wrong++;
        });
        const score = config.scoring(correct, wrong, blank);

        setResult({ correct, wrong, blank, total: probs.length, score, elapsed });
        setPhase('done');

        setIsSaving(true);
        try {
            await recordMockResult({
                contest: key,
                track: config.track,
                num_questions: probs.length,
                num_correct: correct,
                score: Math.round(score * 10) / 10,
                duration_seconds: elapsed,
                time_limit_seconds: config.timeMin * 60,
            });
        } catch (err) {
            console.error('Failed to save mock result:', err);
        } finally {
            setIsSaving(false);
        }
    }, []);

    // Countdown ticker. Auto-submits when the clock hits zero.
    useEffect(() => {
        if (phase !== 'active') return;
        const id = setInterval(() => {
            setRemainingSec(prev => {
                if (prev <= 1) {
                    clearInterval(id);
                    submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [phase, submitTest]);

    const config: MockConfig = MOCK_CONFIGS[selectedKey];

    const startTest = () => {
        if (!problemsData) return;
        const pool = (problemsData[config.track] || []).filter(p =>
            (p.contest || '').toUpperCase().includes(config.contestPrefix.toUpperCase())
        );
        if (pool.length === 0) {
            alert(`No ${config.label} problems found in the database yet. Try a different contest.`);
            return;
        }
        const picked = shuffleProblems(pool).slice(0, Math.min(config.numQ, pool.length));
        setProblems(picked);
        setAnswers(new Array(picked.length).fill(''));
        setFlagged(new Set());
        setCurrentIdx(0);
        setRemainingSec(config.timeMin * 60);
        stateRef.current.startedAt = Date.now();
        setPhase('active');
    };

    const fmtTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return h > 0
            ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
            : `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const updateAnswer = (val: string) => {
        setAnswers(prev => {
            const next = [...prev];
            next[currentIdx] = val;
            return next;
        });
    };

    const toggleFlag = () => {
        setFlagged(prev => {
            const next = new Set(prev);
            if (next.has(currentIdx)) next.delete(currentIdx);
            else next.add(currentIdx);
            return next;
        });
    };

    if (isLoggedIn === false) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20 px-5 z-10 text-center">
                <div className="surface rounded-2xl p-8 border border-[color:var(--cream)]/10 max-w-md w-full">
                    <h2 className="italic-serif text-3xl mb-3 text-[color:var(--cream)] font-normal">Mock Tests</h2>
                    <p className="text-sm text-[color:var(--cream-dim)] mb-6 font-light">Log in to take timed mocks and track your scores over time.</p>
                    <Link href="/login" className="btn-amber inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14px] font-semibold">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (!authChecked || !problemsData) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 z-10 text-[color:var(--cream-dim)]">
                <div className="w-6 h-6 border-2 border-[color:var(--amber)] border-t-transparent rounded-full animate-spin" />
                <span className="mono text-[10px] tracking-wider uppercase">Loading mock test arena...</span>
            </div>
        );
    }

    // ---------- SETUP PHASE ----------
    if (phase === 'setup') {
        return (
            <div className="w-full max-w-[1100px] mx-auto px-6 z-10 relative">
                <header className="rise mt-8 mb-8" style={{ '--d': '280ms' } as React.CSSProperties}>
                    <div className="chip mb-2.5">Timed Practice · Contest Conditions</div>
                    <h1 className="text-[clamp(40px,5.2vw,68px)] leading-[0.96] tracking-[-0.02em] text-[color:var(--cream)] font-normal">
                        Take a <span className="italic-serif font-light">mock test</span><span className="text-[color:var(--amber)]">.</span>
                    </h1>
                    <p className="text-[15px] text-[color:var(--cream-dim)] max-w-xl mt-4 font-light">
                        Pick a contest format and we'll randomly pull problems from your bank, run the official timer, and log your score on your dashboard graph.
                    </p>
                </header>

                <div className="rise grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" style={{ '--d': '400ms' } as React.CSSProperties}>
                    {Object.entries(MOCK_CONFIGS).map(([key, cfg]) => {
                        const active = key === selectedKey;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setSelectedKey(key)}
                                className={`text-left p-5 rounded-2xl border transition-all cursor-pointer hover:translate-y-[-1px]
                                    ${active
                                        ? 'bg-[color:var(--amber)]/10 border-[color:var(--amber)] shadow-md shadow-[color:var(--amber)]/5'
                                        : 'surface border-[color:var(--cream)]/10 hover:border-[color:var(--cream)]/20'
                                    }`}
                            >
                                <div className="flex items-baseline justify-between mb-1.5">
                                    <span className="italic-serif text-[24px] text-[color:var(--cream)] font-light">{cfg.label}</span>
                                    <span className="mono text-[10px] tracking-[0.16em] text-[color:var(--cream-mt)] uppercase font-bold">
                                        {cfg.track}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mono text-[10px] tracking-[0.14em] text-[color:var(--cream-dim)] font-semibold">
                                    <span>{cfg.numQ} QUESTIONS</span>
                                    <span className="text-[color:var(--cream-mt)]">·</span>
                                    <span>{cfg.timeMin} MIN</span>
                                    {cfg.scoreSuffix && (
                                        <>
                                            <span className="text-[color:var(--cream-mt)]">·</span>
                                            <span>SCORE {cfg.scoreSuffix.trim()}</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="rise surface rounded-2xl p-6 border border-[color:var(--cream)]/10 mb-12" style={{ '--d': '520ms' } as React.CSSProperties}>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="mono text-[10px] tracking-[0.16em] text-[color:var(--amber)] font-bold uppercase">Ready to launch</span>
                            <div className="italic-serif text-[28px] text-[color:var(--cream)] mt-1 font-light">
                                {config.label}
                                <span className="text-[color:var(--cream-mt)] text-[20px] ml-2">· {config.numQ}q / {config.timeMin}min</span>
                            </div>
                            <p className="text-[13px] text-[color:var(--cream-dim)] mt-2 font-light max-w-md">
                                Timer starts the moment you click. Auto-submits at expiry. Closing the tab forfeits the attempt.
                            </p>
                        </div>
                        <button
                            onClick={startTest}
                            className="btn-amber inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-[color:var(--ink-900)] cursor-pointer"
                        >
                            Start mock
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ---------- ACTIVE PHASE ----------
    if (phase === 'active') {
        const current = problems[currentIdx];
        const answered = answers.filter(a => a && a.trim()).length;
        const timeLow = remainingSec <= 60;

        return (
            <div className="w-full max-w-[1320px] mx-auto px-6 z-10 relative pb-16">
                {/* Sticky top bar with timer */}
                <div className="sticky top-2 z-20 mb-6">
                    <div className="surface rounded-2xl border border-[color:var(--cream)]/10 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                            <span className="mono text-[10px] tracking-[0.18em] text-[color:var(--amber)] font-bold uppercase">{config.label} · MOCK</span>
                            <span className="mono text-[11px] text-[color:var(--cream-dim)]">
                                {answered}/{problems.length} answered
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`italic-serif text-[34px] leading-none font-light ${timeLow ? 'text-[color:var(--bad)] animate-pulse' : 'text-[color:var(--cream)]'}`}>
                                {fmtTime(remainingSec)}
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('Submit early? Unanswered questions will be counted blank.')) submitTest();
                                }}
                                className="btn-ghost rounded-full px-4 py-2 text-[12px] font-semibold cursor-pointer"
                            >
                                Submit early
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8">
                    {/* Problem panel */}
                    <section className="surface rounded-2xl border border-[color:var(--cream)]/10 overflow-hidden">
                        <div className="flex items-center justify-between border-b hairline px-6 py-4 bg-[color:var(--ink-850)]/30">
                            <div className="flex items-baseline gap-3">
                                <span className="mono text-[10px] tracking-[0.18em] text-[color:var(--cream-mt)] uppercase">
                                    Question
                                </span>
                                <span className="italic-serif text-[28px] leading-none text-[color:var(--cream)]">
                                    {currentIdx + 1}<span className="text-[color:var(--amber)]">.</span>
                                </span>
                            </div>
                            <button
                                onClick={toggleFlag}
                                className={`mono text-[10px] tracking-[0.16em] uppercase font-bold cursor-pointer ${
                                    flagged.has(currentIdx) ? 'text-[color:var(--amber)]' : 'text-[color:var(--cream-mt)] hover:text-[color:var(--cream)]'
                                }`}
                            >
                                {flagged.has(currentIdx) ? '★ FLAGGED' : '☆ FLAG'}
                            </button>
                        </div>

                        <div className="px-6 py-6 space-y-5">
                            <div className="text-[17px] leading-[1.65] text-[color:var(--cream)] font-light">
                                <LatexRenderer text={current.problem} />
                            </div>

                            {current.image_url && (
                                <div className="flex justify-center">
                                    <img src={current.image_url} alt="" className="max-w-full rounded-xl border border-[color:var(--cream)]/10" />
                                </div>
                            )}

                            {current.choices ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                                    {current.choices.map((choice, idx) => {
                                        const letter = String.fromCharCode(65 + idx);
                                        const selected = (answers[currentIdx] || '').toUpperCase() === letter;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => updateAnswer(letter)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] text-left border transition-all cursor-pointer
                                                    ${selected
                                                        ? 'bg-[color:var(--amber)]/10 border-[color:var(--amber)] text-[color:var(--cream)]'
                                                        : 'bg-[color:var(--ink-800)]/30 border-[color:var(--cream)]/10 text-[color:var(--cream-dim)] hover:border-[color:var(--cream)]/20'
                                                    }`}
                                            >
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0
                                                    ${selected ? 'bg-[color:var(--amber)] text-[color:var(--ink-900)]' : 'bg-[color:var(--ink-900)] text-[color:var(--cream-mt)] border border-[color:var(--cream)]/10'}`}
                                                >
                                                    {letter}
                                                </span>
                                                <div className="flex-1 overflow-x-auto thin-scroll">
                                                    <LatexRenderer text={choice} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="pt-2">
                                    <label className="mono text-[10px] tracking-[0.16em] text-[color:var(--cream-mt)] uppercase font-bold">Your answer</label>
                                    <input
                                        type="text"
                                        className="input-line text-[20px] italic-serif font-light w-full mt-2"
                                        placeholder="Type your answer..."
                                        value={answers[currentIdx] || ''}
                                        onChange={e => updateAnswer(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="border-t hairline px-6 py-4 flex items-center justify-between bg-[color:var(--ink-850)]/30">
                            <button
                                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                                disabled={currentIdx === 0}
                                className="btn-ghost rounded-full px-5 py-2 text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ← Previous
                            </button>
                            {currentIdx < problems.length - 1 ? (
                                <button
                                    onClick={() => setCurrentIdx(i => Math.min(problems.length - 1, i + 1))}
                                    className="btn-amber rounded-full px-5 py-2 text-[13px] font-semibold cursor-pointer"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (confirm('Submit and finish? You can review answers after.')) submitTest();
                                    }}
                                    className="btn-amber rounded-full px-5 py-2 text-[13px] font-semibold cursor-pointer"
                                >
                                    Finish & Submit
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Question palette */}
                    <aside>
                        <div className="mb-3 mono text-[10px] tracking-[0.18em] text-[color:var(--cream-mt)] uppercase font-bold">Navigator</div>
                        <div className="grid grid-cols-5 gap-1.5">
                            {problems.map((_, i) => {
                                const isCurrent = i === currentIdx;
                                const isAnswered = !!(answers[i] && answers[i].trim());
                                const isFlagged = flagged.has(i);
                                let cls = 'bg-transparent text-[color:var(--cream-mt)] border-[color:var(--cream)]/10';
                                if (isCurrent) cls = 'bg-[color:var(--cream)] text-[color:var(--ink-900)] border-[color:var(--cream)] font-bold';
                                else if (isAnswered) cls = 'bg-[color:var(--good)]/15 text-[color:var(--good)] border-[color:var(--good)]/30';
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIdx(i)}
                                        className={`relative aspect-square rounded-md border mono text-[11px] cursor-pointer transition-colors hover:border-[color:var(--cream)]/30 ${cls}`}
                                    >
                                        {i + 1}
                                        {isFlagged && <span className="absolute -top-1 -right-1 text-[color:var(--amber)] text-[10px]">★</span>}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4 space-y-1.5 mono text-[10px] tracking-[0.12em] text-[color:var(--cream-mt)]">
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-sm bg-[color:var(--good)]/50" /> ANSWERED</div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-sm border border-[color:var(--cream)]/30" /> UNTOUCHED</div>
                            <div className="flex items-center gap-2"><span className="text-[color:var(--amber)]">★</span> FLAGGED</div>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }

    // ---------- DONE PHASE ----------
    if (phase === 'done' && result) {
        const accPct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
        return (
            <div className="w-full max-w-[1100px] mx-auto px-6 z-10 relative">
                <header className="rise mt-8 mb-8" style={{ '--d': '280ms' } as React.CSSProperties}>
                    <span className="mono text-[10px] tracking-[0.18em] text-[color:var(--amber)] font-bold uppercase">Mock Complete</span>
                    <h1 className="text-[clamp(40px,5.2vw,68px)] leading-[0.96] tracking-[-0.02em] text-[color:var(--cream)] font-normal mt-1">
                        Your <span className="italic-serif font-light">{config.label}</span> score
                    </h1>
                </header>

                <div className="rise grid grid-cols-1 md:grid-cols-3 gap-5 mb-8" style={{ '--d': '400ms' } as React.CSSProperties}>
                    <div className="surface rounded-2xl p-6 border border-[color:var(--cream)]/10">
                        <span className="chip">Raw Score</span>
                        <div className="italic-serif text-[72px] leading-none text-[color:var(--cream)] font-light mt-3">
                            {result.score}
                        </div>
                        {config.scoreSuffix && (
                            <div className="mono text-[10px] tracking-[0.16em] text-[color:var(--cream-mt)] mt-1 font-bold">
                                {config.scoreSuffix.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="surface rounded-2xl p-6 border border-[color:var(--cream)]/10">
                        <span className="chip">Accuracy</span>
                        <div className="italic-serif text-[72px] leading-none text-[color:var(--cream)] font-light mt-3">
                            {accPct}<span className="text-[28px] text-[color:var(--amber)]">%</span>
                        </div>
                        <div className="mono text-[10px] tracking-[0.16em] text-[color:var(--cream-mt)] mt-1 font-bold">
                            {result.correct} CORRECT · {result.wrong} WRONG · {result.blank} BLANK
                        </div>
                    </div>
                    <div className="surface rounded-2xl p-6 border border-[color:var(--cream)]/10">
                        <span className="chip">Time used</span>
                        <div className="italic-serif text-[72px] leading-none text-[color:var(--cream)] font-light mt-3">
                            {fmtTime(result.elapsed)}
                        </div>
                        <div className="mono text-[10px] tracking-[0.16em] text-[color:var(--cream-mt)] mt-1 font-bold">
                            OUT OF {fmtTime(config.timeMin * 60)}
                        </div>
                    </div>
                </div>

                <div className="rise surface rounded-2xl p-6 border border-[color:var(--cream)]/10 mb-12" style={{ '--d': '520ms' } as React.CSSProperties}>
                    <div className="mono text-[10px] tracking-[0.16em] text-[color:var(--amber)] font-bold uppercase mb-3">Per-Problem Breakdown</div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                        {problems.map((p, i) => {
                            const a = (answers[i] || '').trim();
                            const isCorrect = a && checkAnswer(p, a);
                            const isBlank = !a;
                            const color = isCorrect ? 'bg-[color:var(--good)]/30 text-[color:var(--good)] border-[color:var(--good)]/50'
                                : isBlank ? 'bg-transparent text-[color:var(--cream-mt)] border-[color:var(--cream)]/10'
                                : 'bg-[color:var(--bad)]/20 text-[color:var(--bad)] border-[color:var(--bad)]/40';
                            return (
                                <div key={i} className={`aspect-square rounded-md border mono text-[11px] flex items-center justify-center ${color}`} title={`Q${i+1}: ${isCorrect ? 'correct' : isBlank ? 'blank' : 'wrong'}`}>
                                    {i + 1}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="rise flex flex-wrap items-center justify-center gap-3 pb-12" style={{ '--d': '640ms' } as React.CSSProperties}>
                    <Link href="/dashboard" className="btn-amber inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-[color:var(--ink-900)]">
                        {isSaving ? 'Saving...' : 'View progress chart →'}
                    </Link>
                    <button
                        onClick={() => {
                            setResult(null);
                            setPhase('setup');
                            setProblems([]);
                            setAnswers([]);
                        }}
                        className="btn-ghost rounded-full px-6 py-3 text-[14px] font-semibold cursor-pointer"
                    >
                        Take another mock
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
