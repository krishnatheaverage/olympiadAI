'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { getUser } from '@/lib/auth';
import LatexRenderer from '@/components/LatexRenderer';
import {
    Problem,
    ProblemsData,
    loadProblems,
    clearProblemsCache,
    getProblemsForTrack,
    filterProblems,
    getUniqueContests,
    getUniqueTopics,
    shuffleProblems,
    checkAnswer,
    splitProblemParts,
    hasAnswerKey,
    normalizeMathTopic,
    MATH_TOPIC_CATEGORIES,
} from '@/lib/problems';
import { recordUserActivity, UserActivity, insertProblem } from '@/lib/supabase';

interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
}

const TRACKS = ['AMC', 'AIME', 'USAMO', 'USAPhO', 'USNCO', 'F=ma'] as const;
type CodexTrack = typeof TRACKS[number];

function TrainerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTrack = searchParams.get('track') || 'AMC';
    const initialDifficulty = searchParams.get('difficulty') || 'all';
    const initialContest = searchParams.get('contest') || 'all';
    const initialTopic = searchParams.get('topic') || 'all';

    const [authChecked, setAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [problemsData, setProblemsData] = useState<ProblemsData | null>(null);
    const [activeTab, setActiveTab] = useState<CodexTrack>(
        TRACKS.includes(initialTrack as any) ? (initialTrack as CodexTrack) : 'AMC'
    );
    const [selectedContest, setSelectedContest] = useState(initialContest);
    const [selectedTopic, setSelectedTopic] = useState(initialTopic);
    const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    // True for the brief window after a correct answer while we auto-advance to
    // the next problem. Drives the "moving on" confirmation in the feedback card.
    const [autoAdvancing, setAutoAdvancing] = useState(false);
    const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [showManualAdd, setShowManualAdd] = useState(false);

    // Scratchpad state
    const [scratchpad, setScratchpad] = useState('');

    // AI Hints + Solution state
    const [aiHint1, setAiHint1] = useState<string | null>(null);
    const [aiHint2, setAiHint2] = useState<string | null>(null);
    const [aiSolution, setAiSolution] = useState<string | null>(null);
    const [isLoadingHints, setIsLoadingHints] = useState(false);
    const [hintStage, setHintStage] = useState<0 | 1 | 2 | 3>(0); // 0=none, 1=hint1, 2=hint2, 3=solution

    // Strict proof-grading state (USAMO / proof problems, 0-7 scale)
    const [proofText, setProofText] = useState('');
    // Optional photo of a hand-drawn structure/work, sent to the grader as a
    // base64 data URL alongside (or instead of) the typed solution.
    const [submissionImage, setSubmissionImage] = useState<string | null>(null);
    const [isGrading, setIsGrading] = useState(false);
    const [grade, setGrade] = useState<{
        score: number;
        verdict: string;
        strengths: string;
        gaps: string;
        toReach7: string;
    } | null>(null);

    // AI Tutor state
    const [showTutor, setShowTutor] = useState(true);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [newProblem, setNewProblem] = useState({
        contest: '',
        year: 2024,
        number: 1,
        topic: '',
        difficulty: 'easy' as 'easy' | 'medium' | 'hard',
        problem: '',
        choices: ['', '', '', '', ''],
        correct_answer: '',
        correct_value: '',
        solution: '',
        track: 'math' as 'math' | 'chemistry' | 'physics',
        source_link: '',
    });

    useEffect(() => {
        getUser().then(user => {
            if (!user) {
                setIsLoggedIn(false);
            } else {
                setAuthChecked(true);
            }
        });
    }, [router]);

    useEffect(() => {
        if (authChecked) {
            loadProblems().then(setProblemsData).catch(console.error);
        }
    }, [authChecked]);

    // Scroll the chat panel to its newest message — but only when a message
    // is actually appended, never when the chat is cleared (resetTutor on
    // problem navigation would otherwise jerk the whole page downward).
    // `block: 'nearest'` keeps the scroll inside the chat container instead
    // of scrolling the outer page.
    useEffect(() => {
        if (chatMessages.length === 0) return;
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [chatMessages]);

    // Map active Tab to database track & problems
    const trackProblems = useMemo(() => {
        if (!problemsData) return [];
        
        let trackKey: 'math' | 'chemistry' | 'physics' = 'math';
        if (activeTab === 'USNCO') trackKey = 'chemistry';
        else if (activeTab === 'USAPhO' || activeTab === 'F=ma') trackKey = 'physics';
        
        const baseProblems = problemsData[trackKey] || [];
        
        // Filter base problems by active sub-contest tab
        let filtered = baseProblems;
        if (activeTab === 'AMC') {
            filtered = baseProblems.filter(p => p.contest.toUpperCase().includes('AMC'));
        } else if (activeTab === 'AIME') {
            filtered = baseProblems.filter(p => p.contest.toUpperCase().includes('AIME'));
        } else if (activeTab === 'USAMO') {
            filtered = baseProblems.filter(p => p.contest.toUpperCase().includes('USAMO'));
        } else if (activeTab === 'USAPhO') {
            filtered = baseProblems.filter(p => p.contest.toUpperCase().includes('USAPHO'));
        } else if (activeTab === 'F=ma') {
            filtered = baseProblems.filter(p => p.contest.toUpperCase().includes('F=MA') || p.contest.toLowerCase().includes('f=ma'));
        }

        // Fallback to full track if contest-specific filter is empty
        if (filtered.length > 0) {
            return filtered.map(p => ({ ...p, track: trackKey }));
        }
        return baseProblems.map(p => ({ ...p, track: trackKey }));
    }, [problemsData, activeTab]);

    const availableContests = useMemo(() => getUniqueContests(trackProblems), [trackProblems]);
    const isMathTrack = activeTab === 'AMC' || activeTab === 'AIME' || activeTab === 'USAMO';
    const availableTopics = useMemo(
        () => (isMathTrack ? [...MATH_TOPIC_CATEGORIES] : getUniqueTopics(trackProblems)),
        [trackProblems, isMathTrack]
    );

    const [shuffleSeed, setShuffleSeed] = useState(0);

    const filteredProblems = useMemo(() => {
        const baseFiltered = filterProblems(trackProblems, {
            contest: selectedContest,
            topic: isMathTrack ? 'all' : selectedTopic,
            difficulty: selectedDifficulty,
        });
        const filtered = isMathTrack && selectedTopic !== 'all'
            ? baseFiltered.filter(p => normalizeMathTopic(p.topic) === selectedTopic)
            : baseFiltered;
        if (isShuffled) return shuffleProblems(filtered);
        return filtered;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackProblems, selectedContest, selectedTopic, selectedDifficulty, isShuffled, shuffleSeed, isMathTrack]);

    const currentProblem: Problem | null = filteredProblems[currentProblemIndex] || null;

    const [currentPartIndex, setCurrentPartIndex] = useState(0);

    const { intro: problemIntro, parts: problemParts } = useMemo(
        () => currentProblem ? splitProblemParts(currentProblem.problem) : { intro: '', parts: [] },
        [currentProblem]
    );
    const hasParts = problemParts.length > 1;
    const currentPart = problemParts[currentPartIndex] || null;
    const problemHasAnswer = currentProblem ? hasAnswerKey(currentProblem) : false;
    const useAiFeedback = !problemHasAnswer || hasParts;
    // Physics / chemistry free-response is a "solution"; math is a "proof".
    const solutionWord =
        currentProblem?.track === 'physics' || currentProblem?.track === 'chemistry'
            ? 'solution'
            : 'proof';

    // Load/Save scratchpad to local storage dynamically when problem changes
    useEffect(() => {
        if (currentProblem) {
            const key = `scratchpad_${currentProblem.contest}_${currentProblem.year}_${currentProblem.number}`;
            const saved = localStorage.getItem(key);
            setScratchpad(saved || '');
        }
    }, [currentProblem]);

    const handleScratchpadChange = (val: string) => {
        setScratchpad(val);
        if (currentProblem) {
            const key = `scratchpad_${currentProblem.contest}_${currentProblem.year}_${currentProblem.number}`;
            localStorage.setItem(key, val);
        }
    };

    useEffect(() => {
        setCurrentPartIndex(0);
        setUserAnswer('');
        setFeedback(null);
        setProofText('');
        setGrade(null);
        setIsGrading(false);
    }, [currentProblem]);

    const resetState = useCallback(() => {
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
        setAutoAdvancing(false);
        setCurrentProblemIndex(0);
        setCurrentPartIndex(0);
        setUserAnswer('');
        setFeedback(null);
        setShowSolution(false);
        setProofText('');
        setSubmissionImage(null);
        setGrade(null);
        setIsGrading(false);
    }, []);

    const resetTutor = useCallback(() => {
        setChatMessages([]);
        setChatInput('');
        setAiHint1(null);
        setAiHint2(null);
        setAiSolution(null);
        setIsLoadingHints(false);
        setHintStage(0);
    }, []);

    const fetchAiHints = async () => {
        if (!currentProblem || isLoadingHints || aiHint1) return;
        setIsLoadingHints(true);
        try {
            const res = await fetch('/api/solve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem: currentProblem.problem,
                    correct_answer: currentProblem.correct_answer || currentProblem.correct_value,
                    choices: currentProblem.choices,
                    contest: currentProblem.contest,
                    year: currentProblem.year,
                    number: currentProblem.number,
                    topic: currentProblem.topic,
                }),
            });
            const data = await res.json();
            setAiHint1(data.hint1 || 'Could not generate hint.');
            setAiHint2(data.hint2 || 'Could not generate hint.');
            setAiSolution(data.solution || 'Could not generate solution.');
        } catch (err) {
            console.error('Failed to fetch hints:', err);
            setAiHint1('Failed to generate hints. Please try again.');
            setAiHint2('Failed to generate hints. Please try again.');
            setAiSolution('Failed to generate solution. Please try again.');
        }
        setIsLoadingHints(false);
    };

    const revealNextHint = () => {
        if (hintStage === 0) {
            if (!aiHint1) fetchAiHints();
            setHintStage(1);
        } else if (hintStage === 1) {
            setHintStage(2);
        } else if (hintStage === 2) {
            setHintStage(3);
        }
    };

    const requestAiFeedback = () => {
        if (!currentProblem) return;
        setShowTutor(true);
        const partLabel = currentPart?.label ? ` part (${currentPart.label})` : '';
        const partText = currentPart?.body || currentProblem.problem;
        const work = scratchpad.trim();
        const message = work
            ? `Here is my scratch work on${partLabel}:\n\n"${work}"\n\nCould you give me feedback on my approach and a hint on what step to take next?`
            : `I'm working on${partLabel}. Could you give me a progressive hint to get started?`;
        sendTutorMessage(message, partText);

        recordUserActivity({
            contest: currentProblem.contest,
            year: currentProblem.year,
            number: currentProblem.number,
            topic: currentProblem.topic,
            difficulty: currentProblem.difficulty,
            track: currentProblem.track || 'math',
            is_correct: false,
            is_graded: false,
        }).catch(err => console.error('Failed to record AI feedback engagement', err));
    };

    const gradeProof = async () => {
        if (!currentProblem || isGrading) return;
        const submission = (proofText.trim() || scratchpad.trim());
        // Allow grading a photo on its own (e.g. a hand-drawn structure) even
        // when nothing was typed.
        if (!submission && !submissionImage) return;
        setIsGrading(true);
        setGrade(null);
        try {
            const res = await fetch('/api/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem: currentProblem.problem,
                    solution: submission || '(See attached photo of my work.)',
                    contest: currentProblem.contest,
                    year: currentProblem.year,
                    number: currentProblem.number,
                    topic: currentProblem.topic,
                    track: currentProblem.track,
                    image_url: currentProblem.image_url,
                    submission_image: submissionImage,
                }),
            });
            const data = await res.json();
            if (data.error) {
                setGrade({
                    score: 0,
                    verdict: data.error,
                    strengths: '- None.',
                    gaps: '- The grader could not evaluate this submission. Please try again.',
                    toReach7: '',
                });
            } else {
                setGrade(data);
            }
            recordUserActivity({
                contest: currentProblem.contest,
                year: currentProblem.year,
                number: currentProblem.number,
                topic: currentProblem.topic,
                difficulty: currentProblem.difficulty,
                track: currentProblem.track || 'math',
                is_correct: (data.score ?? 0) >= 6,
                is_graded: false,
            }).catch(err => console.error('Failed to record proof grade', err));
        } catch (err) {
            console.error('Failed to grade proof:', err);
            setGrade({
                score: 0,
                verdict: 'Connection error while grading.',
                strengths: '- None.',
                gaps: '- Could not reach the grader. Please try again.',
                toReach7: '',
            });
        }
        setIsGrading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProblem || !userAnswer.trim()) return;

        const isCorrect = checkAnswer(currentProblem, userAnswer);
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        // On a correct answer, give a beat to register the green confirmation,
        // then auto-advance to the next problem so the session keeps flowing.
        // A wrong answer stays put so the student can review and retry.
        if (isCorrect) {
            setAutoAdvancing(true);
            if (advanceTimer.current) clearTimeout(advanceTimer.current);
            advanceTimer.current = setTimeout(() => nextProblem(), 1500);
        }

        try {
            await recordUserActivity({
                contest: currentProblem.contest,
                year: currentProblem.year,
                number: currentProblem.number,
                topic: currentProblem.topic,
                difficulty: currentProblem.difficulty,
                track: currentProblem.track || 'math',
                is_correct: isCorrect,
            });
        } catch (error) {
            console.error('Failed to record activity', error);
        }
    };

    // Cancel any pending auto-advance (e.g. when the student navigates manually
    // before the timer fires) so we never double-skip a problem.
    const cancelAutoAdvance = () => {
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
        setAutoAdvancing(false);
    };

    // Clear any pending auto-advance timer when the component unmounts.
    useEffect(() => () => {
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
    }, []);

    const nextProblem = () => {
        cancelAutoAdvance();
        setCurrentProblemIndex((prev) => prev < filteredProblems.length - 1 ? prev + 1 : 0);
        setUserAnswer('');
        setFeedback(null);
        setShowSolution(false);
        resetTutor();
    };

    const prevProblem = () => {
        cancelAutoAdvance();
        setCurrentProblemIndex((prev) => prev > 0 ? prev - 1 : filteredProblems.length - 1);
        setUserAnswer('');
        setFeedback(null);
        setShowSolution(false);
        resetTutor();
    };

    const selectProblem = (idx: number) => {
        cancelAutoAdvance();
        setCurrentProblemIndex(idx);
        setUserAnswer('');
        setFeedback(null);
        setShowSolution(false);
        resetTutor();
    };

    const sendTutorMessage = async (content: string, partOverride?: string) => {
        if (!content.trim() || isChatLoading || !currentProblem) return;

        const userMsg: ChatMessage = { role: 'user', content: content.trim() };

        const problemTextForContext = partOverride || currentProblem.problem;
        const partTag = currentPart?.label ? ` part (${currentPart.label})` : '';
        const problemHeading = `${currentProblem.contest} ${currentProblem.year} #${currentProblem.number} (${currentProblem.topic})`;
        const problemBlock = problemTextForContext?.trim()
            ? `\n\n${problemHeading}\n\n"${problemTextForContext}"`
            : `\n\n${problemHeading}${currentProblem.image_url ? ' (see attached image)' : ''}`;
        const contextPrefix = chatMessages.length === 0
            ? `I'm working on this problem${partTag}:${problemBlock}\n\nMy question: `
            : '';

        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const messagesForAPI = [
                ...chatMessages.map(m => ({
                    role: m.role === 'ai' ? 'assistant' : 'user',
                    content: m.content,
                })),
                { role: 'user', content: contextPrefix + content.trim() },
            ];

            const response = await fetch('/api/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messagesForAPI,
                    problem: problemTextForContext,
                    correct_answer: currentProblem?.correct_answer || currentProblem?.correct_value,
                    topic: currentProblem?.topic,
                    contest: currentProblem?.contest,
                    year: currentProblem?.year,
                    number: currentProblem?.number,
                    choices: currentProblem?.choices,
                    image_url: currentProblem?.image_url,
                    // Current scratchpad contents so the coach can reference
                    // what the student has actually written/attempted.
                    scratchpad: scratchpad?.trim() || '',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setChatMessages(prev => [...prev, { role: 'ai', content: data.message }]);
            } else {
                setChatMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I had trouble connecting. Please try again.' }]);
            }
        } catch {
            setChatMessages(prev => [...prev, { role: 'ai', content: 'Connection error. Please try again.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const problemToInsert = {
                ...newProblem,
                choices: newProblem.choices.some(c => c.trim()) ? newProblem.choices : null,
            };
            await insertProblem(problemToInsert);
            alert('Problem added successfully!');
            setShowManualAdd(false);
            clearProblemsCache();
            loadProblems().then(setProblemsData);
        } catch (error) {
            console.error('Failed to add problem:', error);
            alert('Failed to add problem.');
        }
    };

    // Calculate years listed for year filter
    const availableYears = useMemo(() => {
        const years = trackProblems.map(p => p.year);
        return [...new Set(years)].sort((a, b) => b - a).slice(0, 7);
    }, [trackProblems]);

    const activeYear = currentProblem ? currentProblem.year : null;

    const handleYearSelect = (year: number) => {
        // Find first problem matching this year
        const matchIdx = filteredProblems.findIndex(p => p.year === year);
        if (matchIdx !== -1) {
            selectProblem(matchIdx);
        } else {
            const trackMatchIdx = trackProblems.findIndex(p => p.year === year);
            if (trackMatchIdx !== -1) {
                // reset filters that might prevent showing this year
                setSelectedContest('all');
                setSelectedTopic('all');
                setSelectedDifficulty('all');
                // wait for re-evaluation and select the problem
                setTimeout(() => {
                    const idx = trackProblems.filter(p => p.year === year)[0];
                    if (idx) {
                        const newFiltered = filterProblems(trackProblems, {
                            contest: 'all',
                            topic: 'all',
                            difficulty: 'all'
                        });
                        const realIdx = newFiltered.findIndex(p => p.id === idx.id);
                        if (realIdx !== -1) selectProblem(realIdx);
                    }
                }, 50);
            }
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-[70vh] text-gray-100 flex flex-col items-center justify-center pt-16 px-4 z-10">
                <div className="surface rounded-2xl p-8 max-w-md w-full text-center border hairline">
                    <h2 className="italic-serif text-3xl mb-3 text-[color:var(--cream)]">Please Log In</h2>
                    <p className="text-sm text-[color:var(--cream-dim)] mb-6">You need to have an active session to practice in the trainer dashboard.</p>
                    <Link href="/login" className="btn-amber inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-medium">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (!authChecked || !problemsData) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 z-10 text-[color:var(--cream-dim)]">
                <div className="w-6 h-6 border-2 border-[color:var(--amber)] border-t-transparent rounded-full animate-spin mb-2" />
                <span className="mono text-[11px] tracking-wider">{!authChecked ? 'VALIDATING SESSION...' : 'LOADING TRAINING BASE...'}</span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1320px] mx-auto px-6 z-10 relative">
            {/* Header/Title block */}
            <div className="rise text-center mt-6 mb-8" style={{ '--d': '120ms' } as React.CSSProperties}>
                <span className="mono text-[10px] tracking-[0.2em] text-[color:var(--amber)] uppercase">PRACTICE ENVIRONMENT</span>
                <h1 className="italic-serif text-5xl md:text-6xl text-[color:var(--cream)] mt-1.5 leading-none">Problem Trainer</h1>
                <p className="text-[15px] text-[color:var(--cream-dim)] max-w-lg mx-auto mt-2.5">
                    Hone your skills on authentic Olympiad questions with our progressive AI Coach guidance.
                </p>
            </div>

            {/* Track tabs */}
            <div className="rise border-b hairline pb-3 mb-6" style={{ '--d': '200ms' } as React.CSSProperties}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-1">
                        {TRACKS.map((t, i) => (
                            <button
                                key={t}
                                onClick={() => { setActiveTab(t); setSelectedTopic('all'); setSelectedContest('all'); resetState(); }}
                                className={`group relative rounded-full px-4 py-2 text-[14px] transition-colors cursor-pointer ${
                                    activeTab === t ? 'text-[color:var(--ink-900)]' : 'text-[color:var(--cream-dim)] hover:text-[color:var(--cream)]'
                                }`}
                            >
                                {activeTab === t && <span className="absolute inset-0 rounded-full bg-[color:var(--cream)]" />}
                                <span className="relative flex items-baseline gap-2">
                                    <span className="mono text-[10px] opacity-60">0{i+1}</span>
                                    <span className="italic-serif text-[17px] font-medium">{t}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="mono text-[10px] tracking-[0.18em] text-[color:var(--cream-mt)]">SHUFFLE</span>
                            <button 
                                onClick={() => { setShuffleSeed(prev => prev + 1); setIsShuffled(true); resetState(); }}
                                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                                    isShuffled 
                                        ? 'border-[color:var(--amber)] text-[color:var(--amber)] bg-[color:var(--amber)]/10' 
                                        : 'border-[color:var(--cream)]/15 text-[color:var(--cream-dim)] hover:text-[color:var(--amber)] hover:border-[color:var(--amber)]'
                                }`}
                                title="Shuffle Problems"
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M1 3h2l5 6h2M1 9h2l5-6h2M9 1l2 2-2 2M9 7l2 2-2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter bar */}
            <div className="rise mb-8" style={{ '--d': '280ms' } as React.CSSProperties}>
                <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[color:var(--cream)]/5">
                    {/* Active problem breadcrumb */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={prevProblem}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--cream)]/15 text-[color:var(--cream-dim)] hover:text-[color:var(--cream)] cursor-pointer" 
                            aria-label="Previous problem"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        
                        <div className="mono flex items-center gap-2 text-[12px] tracking-[0.08em] text-[color:var(--cream-dim)]">
                            <span className="uppercase">{currentProblem?.contest || activeTab}</span>
                            <span className="text-[color:var(--cream-mt)]">/</span>
                            <span>{currentProblem?.year || 'YEAR'}</span>
                            <span className="text-[color:var(--cream-mt)]">/</span>
                            <span className="text-[color:var(--cream)]">Problem {currentProblem?.number || 0}</span>
                            {currentProblem && (
                                <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border hairline px-2 py-0.5 text-[10px] text-[color:var(--amber)]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)]" />
                                    {currentProblem.topic.toUpperCase()}
                                </span>
                            )}
                        </div>

                        <button 
                            onClick={nextProblem}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--cream)]/15 text-[color:var(--cream-dim)] hover:text-[color:var(--cream)] cursor-pointer" 
                            aria-label="Next problem"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                    </div>

                    {/* Filter selectors */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Contest selector */}
                        <div className="flex items-center gap-2">
                            <span className="mono text-[10px] text-[color:var(--cream-mt)] uppercase">CONTEST</span>
                            <select 
                                className="bg-[color:var(--ink-850)]/50 border border-[color:var(--cream)]/10 text-[color:var(--cream)] rounded-md px-2 py-1 text-xs outline-none focus:border-[color:var(--amber)]"
                                value={selectedContest}
                                onChange={(e) => { setSelectedContest(e.target.value); resetState(); }}
                            >
                                <option value="all">All Contests</option>
                                {availableContests.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Topic selector */}
                        <div className="flex items-center gap-2">
                            <span className="mono text-[10px] text-[color:var(--cream-mt)] uppercase">TOPIC</span>
                            <select 
                                className="bg-[color:var(--ink-850)]/50 border border-[color:var(--cream)]/10 text-[color:var(--cream)] rounded-md px-2 py-1 text-xs outline-none focus:border-[color:var(--amber)]"
                                value={selectedTopic}
                                onChange={(e) => { setSelectedTopic(e.target.value); resetState(); }}
                            >
                                <option value="all">All Topics</option>
                                {availableTopics.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        {/* Difficulty selector */}
                        <div className="flex items-center gap-2">
                            <span className="mono text-[10px] text-[color:var(--cream-mt)] uppercase">DIFF</span>
                            <select 
                                className="bg-[color:var(--ink-850)]/50 border border-[color:var(--cream)]/10 text-[color:var(--cream)] rounded-md px-2 py-1 text-xs outline-none focus:border-[color:var(--amber)]"
                                value={selectedDifficulty}
                                onChange={(e) => { setSelectedDifficulty(e.target.value); resetState(); }}
                            >
                                <option value="all">All Levels</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        
                        {/* Add problem button toggle */}
                        <button 
                            className="bg-[color:var(--ink-800)]/40 hover:bg-[color:var(--ink-700)]/40 border border-[color:var(--cream)]/10 text-[color:var(--cream-dim)] hover:text-[color:var(--cream)] rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer" 
                            onClick={() => setShowManualAdd(!showManualAdd)}
                        >
                            {showManualAdd ? 'Hide Add Form' : '+ Add Problem'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Manual add problem drawer/popup */}
            {showManualAdd && (
                <div className="rise mb-8 surface rounded-2xl p-5 border border-indigo-500/20 max-w-2xl mx-auto" style={{ '--d': '100ms' } as React.CSSProperties}>
                    <div className="flex items-center justify-between border-b hairline pb-3 mb-4">
                        <span className="mono text-[10px] tracking-[0.16em] text-[color:var(--amber)] uppercase">CONTRIBUTE PROBLEMS</span>
                        <h3 className="italic-serif text-2xl">Insert Problem to DB</h3>
                    </div>
                    <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">TRACK</label>
                                <select 
                                    className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none"
                                    value={newProblem.track}
                                    onChange={e => setNewProblem({ ...newProblem, track: e.target.value as any })}
                                >
                                    <option value="math">Math Olympiad</option>
                                    <option value="chemistry">Chemistry Olympiad</option>
                                    <option value="physics">Physics Olympiad</option>
                                </select>
                            </div>
                            <div>
                                <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">CONTEST</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none" 
                                    placeholder="e.g. AIME"
                                    value={newProblem.contest} 
                                    onChange={e => setNewProblem({ ...newProblem, contest: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-1/2">
                                    <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">YEAR</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none" 
                                        value={newProblem.year}
                                        onChange={e => setNewProblem({ ...newProblem, year: parseInt(e.target.value) })} 
                                        required 
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">PROBLEM NUMBER</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none" 
                                        value={newProblem.number}
                                        onChange={e => setNewProblem({ ...newProblem, number: parseInt(e.target.value) })} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">TOPIC</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none" 
                                    placeholder="e.g. Geometry"
                                    value={newProblem.topic} 
                                    onChange={e => setNewProblem({ ...newProblem, topic: e.target.value })} 
                                />
                            </div>
                            <div>
                                <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">DIFFICULTY</label>
                                <select 
                                    className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none"
                                    value={newProblem.difficulty}
                                    onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value as any })}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">PROBLEM BODY (LaTeX supported)</label>
                                <textarea 
                                    className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none min-h-[80px] resize-y" 
                                    placeholder="Type mathematical expressions using LaTeX, e.g. $x^2 + y^2 = z^2$"
                                    value={newProblem.problem}
                                    onChange={e => setNewProblem({ ...newProblem, problem: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">CORRECT ANSWER LETTER (For MC, e.g. A)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none" 
                                    placeholder="e.g. A"
                                    value={newProblem.correct_answer} 
                                    onChange={e => setNewProblem({ ...newProblem, correct_answer: e.target.value })} 
                                />
                            </div>
                            <div>
                                <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">CORRECT VALUE (For Free Response, e.g. 42)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none" 
                                    placeholder="e.g. 42"
                                    value={newProblem.correct_value} 
                                    onChange={e => setNewProblem({ ...newProblem, correct_value: e.target.value })} 
                                />
                            </div>
                            <div>
                                <label className="mono text-[10px] text-[color:var(--cream-mt)] block mb-1">SOLUTION DESCRIPTION</label>
                                <textarea 
                                    className="w-full bg-[color:var(--ink-900)] border border-[color:var(--cream)]/10 rounded-lg px-3 py-2 text-sm text-[color:var(--cream)] focus:border-[color:var(--amber)] focus:outline-none min-h-[60px] resize-y" 
                                    placeholder="Explain the step-by-step solution..."
                                    value={newProblem.solution}
                                    onChange={e => setNewProblem({ ...newProblem, solution: e.target.value })} 
                                />
                            </div>
                            <button type="submit" className="btn-amber w-full rounded-full py-2.5 text-sm font-semibold transition-all mt-2 cursor-pointer">
                                Save problem to database
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Three-Column Dashboard Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_360px] gap-8 mt-4 items-start pb-20">
                
                {/* 1st Column: SiblingRail (Problem Index Rail) */}
                <aside className="rise" style={{ '--d': '360ms' } as React.CSSProperties}>
                    <div className="mb-3 mono text-[10px] tracking-[0.18em] text-[color:var(--cream-mt)] uppercase">
                        {activeTab} · {filteredProblems.length} PROBLEMS
                    </div>
                    
                    <ol className="space-y-1.5 max-h-[360px] overflow-y-auto thin-scroll pr-1">
                        {filteredProblems.map((p, idx) => {
                            const isCurrent = idx === currentProblemIndex;
                            const isSolved = false; // We can integrate user solve history if needed
                            
                            // Style determination
                            let statusStyle = 'bg-transparent text-[color:var(--cream-mt)] border border-[color:var(--cream)]/10';
                            if (isCurrent) {
                                statusStyle = 'bg-[color:var(--amber)] text-[color:var(--ink-900)] font-bold';
                            } else if (isSolved) {
                                statusStyle = 'bg-[color:var(--good)]/15 text-[color:var(--good)]';
                            }
                            
                            return (
                                <li key={p.id || `local-${idx}`}>
                                    <button 
                                        onClick={() => selectProblem(idx)}
                                        className="group w-full flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[color:var(--ink-850)]/40 cursor-pointer"
                                    >
                                        <span className={`flex h-6 w-9 shrink-0 items-center justify-center rounded-md mono text-[10px] tracking-wider transition-all ${statusStyle}`}>
                                            P{idx + 1}
                                        </span>
                                        <span className={`text-[13px] truncate ${isCurrent ? 'text-[color:var(--cream)] font-medium' : 'text-[color:var(--cream-dim)] group-hover:text-[color:var(--cream)]'}`}>
                                            {p.topic}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                        {filteredProblems.length === 0 && (
                            <li className="text-[12px] italic text-[color:var(--cream-mt)]">No problems match active filters.</li>
                        )}
                    </ol>

                    <div className="mt-6 mb-3 mono text-[10px] tracking-[0.18em] text-[color:var(--cream-mt)] uppercase">JUMP TO YEAR</div>
                    <div className="flex flex-wrap gap-1.5">
                        {availableYears.map(y => (
                            <button 
                                key={y} 
                                onClick={() => handleYearSelect(y)}
                                className={`rounded-md px-2 py-1 mono text-[11px] transition-colors cursor-pointer ${
                                    activeYear === y 
                                        ? 'bg-[color:var(--cream)] text-[color:var(--ink-900)] font-bold' 
                                        : 'text-[color:var(--cream-dim)] hover:text-[color:var(--cream)] border border-[color:var(--cream)]/5 hover:border-[color:var(--cream)]/15'
                                }`}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* 2nd Column: ProblemPanel (Problem Details + Input + Scratchpad) */}
                <section className="rise space-y-6 flex-1 min-w-0" style={{ '--d': '440ms' } as React.CSSProperties}>
                    {currentProblem ? (
                        <div className="space-y-6">
                            {/* Glass Surface Panel */}
                            <div className="surface rounded-2xl overflow-hidden border border-[color:var(--cream)]/10">
                                {/* Problem panel header */}
                                <div className="flex items-center justify-between border-b hairline px-6 py-4 bg-[color:var(--ink-850)]/30">
                                    <div className="flex items-baseline gap-3.5">
                                        <span className="mono text-[10px] tracking-[0.18em] text-[color:var(--cream-mt)] uppercase">
                                            {currentProblem.contest} · {currentProblem.year}
                                        </span>
                                        <span className="italic-serif text-[26px] leading-none text-[color:var(--cream)]">
                                            Problem {currentProblem.number}
                                            <span className="text-[color:var(--amber)]">.</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mono text-[10px] text-[color:var(--cream-mt)]">
                                        <span className="uppercase">{currentProblem.difficulty} LEVEL</span>
                                        <span className="h-3 w-px bg-[color:var(--cream)]/15" />
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--good)] animate-pulse" /> 
                                            ONLINE
                                        </span>
                                    </div>
                                </div>

                                {/* Problem presentation body */}
                                <div className="px-6 py-6 space-y-4">
                                    {/* Warnings if diagram required */}
                                    {(currentProblem.problem.includes('[Diagram Required]') || currentProblem.problem.includes('[Graph Required]')) && !currentProblem.image_url && (
                                        <div className="px-4 py-3 bg-[color:var(--warn)]/10 border border-[color:var(--warn)]/20 rounded-lg text-[color:var(--warn)] text-xs flex items-center gap-2">
                                            <span>▲</span>
                                            <span>This problem refers to a diagram. Consider checking the original AoPS source.</span>
                                        </div>
                                    )}

                                    {/* Multi-part structure rendering */}
                                    {hasParts ? (
                                        <div className="space-y-4">
                                            {problemIntro && (
                                                <div className="pb-4 border-b hairline text-[17px] leading-relaxed text-[color:var(--cream)]">
                                                    <LatexRenderer text={problemIntro} />
                                                </div>
                                            )}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {problemParts.map((p, i) => (
                                                    <button
                                                        key={p.label || i}
                                                        onClick={() => { setCurrentPartIndex(i); setUserAnswer(''); setFeedback(null); }}
                                                        className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors cursor-pointer
                                                            ${i === currentPartIndex
                                                                ? 'bg-[color:var(--cream)] text-[color:var(--ink-900)] border-[color:var(--cream)] font-bold'
                                                                : 'bg-transparent text-[color:var(--cream-dim)] border-[color:var(--cream)]/10 hover:text-[color:var(--cream)] hover:border-[color:var(--cream)]/20'
                                                            }`}
                                                    >
                                                        Part {p.label || i + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            {currentPart && (
                                                <div className="pt-2 animate-in fade-in duration-200">
                                                    <div className="mono text-[10px] uppercase tracking-wider text-[color:var(--amber)] mb-2 font-semibold">
                                                        PART {currentPart.label || (currentPartIndex + 1)}
                                                    </div>
                                                    <div className="text-[17px] leading-relaxed text-[color:var(--cream)]">
                                                        <LatexRenderer text={currentPart.body} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-[18px] leading-[1.65] text-[color:var(--cream)] font-light">
                                            <LatexRenderer text={currentProblem.problem} />
                                        </div>
                                    )}

                                    {/* Diagram image rendering */}
                                    {currentProblem.image_url && (
                                        <div className="mt-6 flex justify-center">
                                            {currentProblem.contest?.toUpperCase().includes('USNCO') && currentProblem.image_url.includes('/pages/') ? (
                                                <div className="border border-[color:var(--cream)]/10 rounded-xl overflow-hidden w-full max-w-xl bg-white text-black p-2">
                                                    <div className="px-3 py-1.5 bg-[color:var(--ink-850)] text-[color:var(--cream-dim)] text-xs mono mb-2 text-center rounded">
                                                        Find Exam Question #{currentProblem.number} Below
                                                    </div>
                                                    <div className="max-h-[380px] overflow-y-auto thin-scroll">
                                                        <img
                                                            src={currentProblem.image_url}
                                                            alt="Exam reference page"
                                                            className="w-full block"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={currentProblem.image_url}
                                                    alt="Problem diagram reference"
                                                    className="max-w-full rounded-xl border border-[color:var(--cream)]/10 shadow-lg bg-[color:var(--ink-900)]/30"
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Topic categories list */}
                                    <div className="flex flex-wrap gap-1.5 pt-4">
                                        <span className="mono text-[9px] tracking-[0.14em] rounded-full border hairline px-2.5 py-1 text-[color:var(--cream-mt)] bg-white/[0.02]">
                                            {currentProblem.contest.toUpperCase()}
                                        </span>
                                        <span className="mono text-[9px] tracking-[0.14em] rounded-full border hairline px-2.5 py-1 text-[color:var(--cream-mt)] bg-white/[0.02]">
                                            YEAR {currentProblem.year}
                                        </span>
                                        <span className="mono text-[9px] tracking-[0.14em] rounded-full border hairline px-2.5 py-1 text-[color:var(--cream-mt)] bg-white/[0.02]">
                                            {currentProblem.topic.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Multiple choice selections */}
                            {currentProblem.choices && !useAiFeedback && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {currentProblem.choices.map((choice, idx) => {
                                        const letter = String.fromCharCode(65 + idx);
                                        const isSelected = userAnswer.toUpperCase() === letter;
                                        return (
                                            <button 
                                                key={idx} 
                                                type="button" 
                                                onClick={() => setUserAnswer(letter)}
                                                className={`flex items-center gap-3.5 px-5 py-4 rounded-xl text-[14.5px] text-left transition-all border cursor-pointer hover:translate-y-[-1px]
                                                    ${isSelected
                                                        ? 'bg-[color:var(--amber)]/10 border-[color:var(--amber)] text-[color:var(--cream)] shadow-md shadow-[color:var(--amber)]/5'
                                                        : 'bg-[color:var(--ink-800)]/30 border-[color:var(--cream)]/10 text-[color:var(--cream-dim)] hover:border-[color:var(--cream)]/20 hover:text-[color:var(--cream)]'
                                                    }`}
                                            >
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11.5px] font-bold shrink-0 transition-colors
                                                    ${isSelected
                                                        ? 'bg-[color:var(--amber)] text-[color:var(--ink-900)]'
                                                        : 'bg-[color:var(--ink-900)] text-[color:var(--cream-mt)] border border-[color:var(--cream)]/10'
                                                    }`}
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
                            )}

                            {/* Scratch work area + final submission block */}
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
                                
                                {/* Handwriting autosaved scratchpad */}
                                <div className="flex flex-col">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="mono text-[9px] tracking-[0.18em] text-[color:var(--cream-mt)] uppercase">SCRATCHPAD · AUTOSAVED</span>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleScratchpadChange(scratchpad + ' \\sqrt{x} ')}
                                                className="mono text-[9px] tracking-[0.14em] text-[color:var(--cream-dim)] hover:text-[color:var(--amber)] cursor-pointer"
                                            >
                                                ∑ LATEX
                                            </button>
                                            <button 
                                                onClick={() => handleScratchpadChange('')}
                                                className="mono text-[9px] tracking-[0.14em] text-[color:var(--cream-dim)] hover:text-[color:var(--amber)] cursor-pointer"
                                            >
                                                ↺ CLEAR
                                            </button>
                                        </div>
                                    </div>
                                    <textarea 
                                        className="scratch thin-scroll flex-1 min-h-[170px]" 
                                        placeholder="Sketch out your formulas, factorization, or scratchpad steps here. Live AI tutor reads this scratch space..."
                                        value={scratchpad} 
                                        onChange={e => handleScratchpadChange(e.target.value)} 
                                    />
                                </div>

                                {/* Form answer entry box */}
                                <div className="surface rounded-2xl p-5 border border-[color:var(--cream)]/10 flex flex-col justify-between h-full min-h-[200px]">
                                    <div>
                                        <span className="mono text-[9px] tracking-[0.18em] text-[color:var(--cream-mt)] uppercase">FINAL ANSWER</span>
                                        
                                        {useAiFeedback ? (
                                            <div className="mt-3 flex flex-col gap-3">
                                                <p className="text-xs text-[color:var(--cream-dim)] leading-relaxed">
                                                    Write your full {solutionWord} below and have it graded on the official scale of <span className="text-[color:var(--amber)] font-medium">0&ndash;7</span>.
                                                </p>
                                                <textarea
                                                    className="scratch thin-scroll min-h-[150px] text-[13px]"
                                                    placeholder={`Write your complete ${solutionWord} here. Be rigorous — every step must be justified. Hand-waving is penalized.`}
                                                    value={proofText}
                                                    onChange={e => setProofText(e.target.value)}
                                                />

                                                {/* Optional photo upload — draw a structure or work
                                                    it out on paper, snap a picture, and have it graded. */}
                                                {submissionImage ? (
                                                    <div className="relative rounded-lg border border-[color:var(--cream)]/10 bg-black/20 p-2">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={submissionImage}
                                                            alt="Your uploaded work"
                                                            className="mx-auto max-h-[260px] w-auto rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setSubmissionImage(null)}
                                                            className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-[color:var(--cream)] hover:bg-black cursor-pointer"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="flex items-center justify-center gap-2 rounded-full border border-dashed border-[color:var(--cream)]/20 py-2.5 text-[12px] text-[color:var(--cream-dim)] hover:border-[color:var(--amber)]/40 hover:text-[color:var(--cream)] cursor-pointer transition-colors">
                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 9.5V2m0 0L4 5m3-3l3 3M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                        Upload a photo of your work / drawn structure
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={e => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                const reader = new FileReader();
                                                                reader.onload = () =>
                                                                    setSubmissionImage(reader.result as string);
                                                                reader.readAsDataURL(file);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                )}

                                                <button
                                                    onClick={gradeProof}
                                                    disabled={isGrading || !(proofText.trim() || scratchpad.trim() || submissionImage)}
                                                    className="btn-amber w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    {isGrading ? `Grading ${solutionWord}…` : `Grade my ${solutionWord} · strict 0–7`}
                                                    {!isGrading && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                                </button>
                                            </div>
                                        ) : (
                                            <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
                                                {!currentProblem.choices && (
                                                    <input
                                                        type="text"
                                                        className="input-line text-[22px] italic-serif font-light w-full"
                                                        placeholder="Type your answer..."
                                                        value={userAnswer}
                                                        onChange={(e) => setUserAnswer(e.target.value)}
                                                    />
                                                )}
                                                <button 
                                                    type="submit" 
                                                    disabled={!userAnswer.trim()}
                                                    className="btn-amber w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    Submit Final Answer
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    {useAiFeedback && (
                                        <button 
                                            onClick={requestAiFeedback}
                                            className="btn-primary w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold cursor-pointer text-[color:var(--ink-900)] mt-4"
                                        >
                                            Get AI Evaluation
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        </button>
                                    )}

                                    <div className="mt-3 flex items-center justify-between mono text-[9px] tracking-[0.14em] text-[color:var(--cream-mt)]">
                                        <span>ENTER TO GRADE</span>
                                        <span onClick={() => setShowSolution(!showSolution)} className="hover:text-[color:var(--cream)] cursor-pointer">
                                            {showSolution ? 'HIDE ANSWER' : 'SHOW SOLUTION'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Solution & Progressive Hint revealing deck */}
                            {(showSolution || feedback || hintStage > 0 || grade || isGrading) && (
                                <div className="space-y-3 animate-in fade-in duration-300">
                                    {/* Strict proof grade card (0-7) */}
                                    {grade && (() => {
                                        const tone = grade.score >= 6
                                            ? { c: 'var(--good)', label: 'Essentially complete' }
                                            : grade.score >= 4
                                            ? { c: 'var(--amber)', label: 'Substantial progress' }
                                            : grade.score >= 2
                                            ? { c: 'var(--amber)', label: 'Partial progress' }
                                            : { c: 'var(--bad)', label: solutionWord === 'solution' ? 'Not yet a solution' : 'Not yet a proof' };
                                        return (
                                            <div className="surface rounded-2xl p-5 border" style={{ borderColor: `color-mix(in oklch, ${tone.c} 35%, transparent)` }}>
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-baseline gap-3">
                                                        <span className="italic-serif font-light leading-none" style={{ fontSize: 46, color: tone.c }}>{grade.score}</span>
                                                        <span className="mono text-[13px] text-[color:var(--cream-mt)]">/ 7</span>
                                                    </div>
                                                    <span className="mono text-[9px] tracking-[0.18em] uppercase px-3 py-1 rounded-full" style={{ color: tone.c, background: `color-mix(in oklch, ${tone.c} 12%, transparent)` }}>{tone.label}</span>
                                                </div>
                                                <p className="mt-3 text-[13px] text-[color:var(--cream-dim)] leading-relaxed">
                                                    <LatexRenderer text={grade.verdict} />
                                                </p>
                                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <span className="mono text-[9px] tracking-[0.18em] text-[color:var(--good)] uppercase">Strengths</span>
                                                        <div className="mt-2 text-[12px] text-[color:var(--cream-dim)] leading-relaxed proof-list">
                                                            <LatexRenderer text={grade.strengths} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="mono text-[9px] tracking-[0.18em] text-[color:var(--bad)] uppercase">Gaps &amp; errors</span>
                                                        <div className="mt-2 text-[12px] text-[color:var(--cream-dim)] leading-relaxed proof-list">
                                                            <LatexRenderer text={grade.gaps} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {grade.toReach7 && (
                                                    <div className="mt-4 pt-3 border-t hairline">
                                                        <span className="mono text-[9px] tracking-[0.18em] text-[color:var(--amber)] uppercase">To reach 7</span>
                                                        <div className="mt-2 text-[12px] text-[color:var(--cream-dim)] leading-relaxed">
                                                            <LatexRenderer text={grade.toReach7} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {isGrading && !grade && (
                                        <div className="surface rounded-2xl p-5 border border-[color:var(--cream)]/10 text-[13px] text-[color:var(--cream-dim)] flex items-center gap-3">
                                            <span className="inline-block h-3 w-3 rounded-full animate-pulse" style={{ background: 'var(--amber)' }} />
                                            Grading your proof against the strict 0&ndash;7 rubric…
                                        </div>
                                    )}

                                    {/* Dynamic Submit Grading feedback alert */}
                                    {feedback && !useAiFeedback && (
                                        <div className={`px-5 py-4 rounded-xl text-sm font-medium border ${
                                            feedback === 'correct' 
                                                ? 'bg-[color:var(--good)]/10 text-[color:var(--good)] border-[color:var(--good)]/20' 
                                                : 'bg-[color:var(--bad)]/10 text-[color:var(--bad)] border-[color:var(--bad)]/20'
                                        }`}>
                                            {feedback === 'correct' ? (
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span>✓</span>
                                                        <span>Correct! Outstanding logic and numerical calculation!</span>
                                                    </div>
                                                    {autoAdvancing && (
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            <span className="flex items-center gap-2 mono text-[10px] tracking-[0.12em] text-[color:var(--good)]/80 uppercase">
                                                                <span className="inline-block h-3 w-3 rounded-full border-2 border-[color:var(--good)] border-t-transparent animate-spin" />
                                                                Next problem…
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={cancelAutoAdvance}
                                                                className="mono text-[10px] tracking-[0.12em] uppercase text-[color:var(--cream-mt)] hover:text-[color:var(--cream)] cursor-pointer"
                                                            >
                                                                Stay
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex items-center gap-2 font-semibold">
                                                        <span>✗</span>
                                                        <span>Incorrect answer attempt.</span>
                                                    </div>
                                                    <div className="mt-1 text-xs text-[color:var(--cream-dim)] font-light leading-relaxed">
                                                        {(() => {
                                                            const correctLetter = currentProblem.correct_answer?.trim().toUpperCase();
                                                            const letterIdx = correctLetter ? correctLetter.charCodeAt(0) - 65 : -1;
                                                            const choiceText = currentProblem.choices && letterIdx >= 0 && letterIdx < currentProblem.choices.length
                                                                ? ` (${currentProblem.choices[letterIdx]})` : '';
                                                            return `Correct Answer: ${currentProblem.correct_answer || currentProblem.correct_value}${choiceText}`;
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Stored solution from database row */}
                                    {showSolution && currentProblem.solution && (
                                        <div className="surface rounded-2xl p-5 border border-[color:var(--cream)]/10">
                                            <div className="mono text-[10px] tracking-[0.16em] text-[color:var(--amber)] uppercase mb-3 font-semibold">DATABASE SOLUTION KEY</div>
                                            <div className="text-[15px] leading-[1.6] text-[color:var(--cream-dim)] font-light whitespace-pre-wrap">
                                                <LatexRenderer text={currentProblem.solution} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Source Link */}
                                    {showSolution && currentProblem.source_link && (
                                        <div className="text-right">
                                            <a 
                                                href={currentProblem.source_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="mono text-[11px] text-[color:var(--amber)] hover:underline"
                                            >
                                                View Original Source Exam Page →
                                            </a>
                                        </div>
                                    )}

                                    {/* AI progressive hint generation system */}
                                    {!currentProblem.solution && (showSolution || hintStage > 0) && (
                                        <div className="space-y-3">
                                            {/* Hint 1 block */}
                                            {hintStage >= 1 && (
                                                <div className="surface rounded-2xl p-5 border border-amber-500/10 bg-amber-500/[0.02]">
                                                    <div className="flex items-baseline justify-between mb-2">
                                                        <span className="mono text-[10px] tracking-[0.16em] text-[color:var(--amber)] font-bold">PROGRESSIVE HINT 01</span>
                                                        <span className="mono text-[9px] text-[color:var(--cream-mt)]">FREE</span>
                                                    </div>
                                                    {aiHint1 ? (
                                                        <div className="text-[14px] leading-[1.55] text-[color:var(--cream-dim)] whitespace-pre-wrap">
                                                            <LatexRenderer text={aiHint1} />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2.5 text-xs text-[color:var(--cream-mt)] py-2">
                                                            <div className="w-3.5 h-3.5 border-2 border-[color:var(--amber)] border-t-transparent rounded-full animate-spin" />
                                                            <span>Drafting progressive tip...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Hint 2 block */}
                                            {hintStage >= 2 && (
                                                <div className="surface rounded-2xl p-5 border border-indigo-500/10 bg-indigo-500/[0.02]">
                                                    <div className="flex items-baseline justify-between mb-2">
                                                        <span className="mono text-[10px] tracking-[0.16em] text-indigo-400 font-bold">PROGRESSIVE HINT 02</span>
                                                        <span className="mono text-[9px] text-[color:var(--cream-mt)]">-2 XP</span>
                                                    </div>
                                                    {aiHint2 ? (
                                                        <div className="text-[14px] leading-[1.55] text-[color:var(--cream-dim)] whitespace-pre-wrap">
                                                            <LatexRenderer text={aiHint2} />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2.5 text-xs text-[color:var(--cream-mt)] py-2">
                                                            <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                                            <span>Pushing progressive details...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Full Solution progressive block */}
                                            {hintStage >= 3 && (
                                                <div className="surface rounded-2xl p-5 border border-emerald-500/15 bg-emerald-500/[0.02]">
                                                    <div className="flex items-baseline justify-between mb-2">
                                                        <span className="mono text-[10px] tracking-[0.16em] text-emerald-400 font-bold">FULL SOLUTION PATH</span>
                                                        <span className="mono text-[9px] text-[color:var(--cream-mt)]">-10 XP</span>
                                                    </div>
                                                    {aiSolution ? (
                                                        <div className="text-[14px] leading-[1.55] text-[color:var(--cream-dim)] whitespace-pre-wrap">
                                                            <LatexRenderer text={aiSolution} />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2.5 text-xs text-[color:var(--cream-mt)] py-2">
                                                            <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                                            <span>Writing solution logic...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Progressive prompt deck actions */}
                                            {hintStage < 3 && (
                                                <button
                                                    onClick={revealNextHint}
                                                    disabled={isLoadingHints}
                                                    className={`w-full text-xs font-semibold py-3 rounded-full cursor-pointer transition-all border text-center
                                                        ${hintStage === 2
                                                            ? 'bg-[color:var(--amber)] text-[color:var(--ink-900)] border-[color:var(--amber)] hover:opacity-90'
                                                            : 'bg-transparent text-[color:var(--cream-dim)] border-[color:var(--cream)]/15 hover:border-[color:var(--cream)]/30 hover:text-[color:var(--cream)]'
                                                        }`}
                                                >
                                                    {isLoadingHints ? 'SOLVING PATHWAY CONSTRUCTING...' :
                                                        hintStage === 0 ? 'Reveal Hint 01 (Free)' :
                                                        hintStage === 1 ? 'Reveal Hint 02 (-2 XP)' :
                                                        'Reveal Full Solution Sketch (-10 XP)'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="surface rounded-2xl p-10 border border-[color:var(--cream)]/10 text-center text-[color:var(--cream-mt)]">
                            No training problems found under this contest selection. Modify filters to search again.
                        </div>
                    )}
                </section>

                {/* 3rd Column: CoachPanel (Interactive AI Coach Chat Panel) */}
                <aside className="rise sticky top-6 self-start lg:w-[360px]" style={{ '--d': '520ms' } as React.CSSProperties}>
                    <div className="surface rounded-2xl overflow-hidden border border-[color:var(--cream)]/10">
                        
                        {/* Coach header widget */}
                        <div className="flex items-center justify-between border-b hairline px-5 py-4 bg-[color:var(--ink-850)]/30">
                            <div className="flex items-center gap-2.5">
                                <span className="relative flex h-7 w-7 items-center justify-center rounded-full"
                                      style={{ background: 'radial-gradient(circle at 30% 30%, var(--amber), oklch(0.35 0.08 50))' }}>
                                    <span className="absolute inset-0 rounded-full ring-1 ring-[color:var(--amber)]/50 animate-pulse" />
                                </span>
                                <div className="leading-tight">
                                    <div className="italic-serif text-[18px] text-[color:var(--cream)] font-medium">AI Coach</div>
                                    <div className="mono text-[9px] tracking-[0.14em] text-[color:var(--cream-mt)] uppercase">READING SCRATCH · ACTIVE</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setChatMessages([])} 
                                className="mono text-[9px] text-[color:var(--cream-mt)] hover:text-[color:var(--cream)] uppercase transition-colors cursor-pointer"
                                title="Clear conversation"
                            >
                                Clear
                            </button>
                        </div>

                        {/* Real-time observation alerts */}
                        <div className="border-b hairline px-5 py-4 bg-[color:var(--ink-900)]/20">
                            <div className="flex items-start gap-3">
                                <span className="mt-1 flex h-2 w-2 rounded-full bg-[color:var(--amber)] pulse-dot shrink-0" />
                                <div className="text-[13px] leading-[1.5] text-[color:var(--cream-dim)] font-light">
                                    {scratchpad.trim() ? (
                                        <span>
                                            I see formulas on your board. Try restating in modules, or ask me to check if your parities hold!
                                        </span>
                                    ) : (
                                        <span>
                                            Your scratchboard is empty. Jot down some thoughts, or click chips below for progressive tips.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interactive message chat viewport stream */}
                        <div className="h-[250px] overflow-y-auto p-4 flex flex-col gap-3.5 thin-scroll bg-[color:var(--ink-900)]/45">
                            {chatMessages.length === 0 && (
                                <div className="text-center text-[color:var(--cream-mt)] text-[12.5px] italic py-8 font-light max-w-[200px] mx-auto">
                                    Ask me why a formula holds, detail your path, or describe where you are blocked!
                                </div>
                            )}
                            
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold
                                        ${msg.role === 'ai'
                                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                            : 'bg-[color:var(--ink-800)] border border-[color:var(--cream)]/10 text-[color:var(--cream-dim)]'
                                        }`}
                                    >
                                        {msg.role === 'ai' ? 'C' : 'U'}
                                    </div>
                                    <div className={`px-3 py-2 rounded-xl text-[13px] leading-relaxed font-light
                                        ${msg.role === 'ai'
                                            ? 'bg-[color:var(--ink-850)]/90 border border-[color:var(--cream)]/10 text-[color:var(--cream-dim)]'
                                            : 'bg-[color:var(--cream)] text-[color:var(--ink-900)] font-normal'
                                        }`}
                                    >
                                        <LatexRenderer text={msg.content} />
                                    </div>
                                </div>
                            ))}

                            {isChatLoading && (
                                <div className="flex gap-2 self-start animate-pulse">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white">C</div>
                                    <div className="px-3 py-2 rounded-xl bg-[color:var(--ink-850)] border border-[color:var(--cream)]/10 text-[color:var(--cream-mt)] text-xs">
                                        <div className="flex gap-1 py-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Quick Action Suggestion Prompts */}
                        <div className="flex gap-1.5 px-4 pt-2.5 pb-1 flex-wrap bg-[color:var(--ink-900)]/45">
                            {['Give me a hint', "I'm stuck", 'Explain concepts', 'Is this right?'].map((action, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => sendTutorMessage(action)} 
                                    disabled={isChatLoading}
                                    className="text-[10px] px-2.5 py-1 rounded-md bg-transparent hover:bg-[color:var(--cream)]/5 text-[color:var(--cream-dim)] border border-[color:var(--cream)]/10 transition-colors disabled:opacity-40 cursor-pointer"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Input Ask Box */}
                        <div className="border-t hairline px-4 py-4 bg-[color:var(--ink-850)]/40">
                            <form 
                                onSubmit={e => { e.preventDefault(); if (chatInput.trim()) sendTutorMessage(chatInput); }}
                                className="flex items-center gap-2 rounded-full border border-[color:var(--cream)]/15 bg-[color:var(--ink-900)]/70 pl-4 pr-1.5 py-1.5"
                            >
                                <span className="mono text-[10px] tracking-wider text-[color:var(--amber)] font-bold">ASK</span>
                                <input 
                                    type="text" 
                                    placeholder="Ask the coach details..." 
                                    className="flex-1 bg-transparent text-[13px] text-[color:var(--cream)] outline-none placeholder:italic placeholder:text-[color:var(--cream-mt)]"
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    disabled={isChatLoading}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!chatInput.trim() || isChatLoading}
                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--amber)] text-[color:var(--ink-900)] cursor-pointer disabled:opacity-40"
                                >
                                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 5.5h8M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                            </form>
                            <div className="mt-2.5 flex items-center justify-between mono text-[8.5px] tracking-[0.14em] text-[color:var(--cream-mt)]">
                                <span>FREE COFFEE CHAT</span>
                                <span>SOLVES PROBLEM STEPS</span>
                            </div>
                        </div>

                    </div>
                </aside>

            </div>
        </div>
    );
}

export default function TrainerPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[70vh] bg-stage bg-noise flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[color:var(--amber)] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <TrainerContent />
        </Suspense>
    );
}
