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
} from '@/lib/problems';
import { recordUserActivity, UserActivity, insertProblem } from '@/lib/supabase';

interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
}

function TrainerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTrack = searchParams.get('track') || 'all';
    const initialDifficulty = searchParams.get('difficulty') || 'all';
    const initialContest = searchParams.get('contest') || 'all';

    const [authChecked, setAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [problemsData, setProblemsData] = useState<ProblemsData | null>(null);
    const [selectedTrack, setSelectedTrack] = useState(initialTrack);
    const [selectedContest, setSelectedContest] = useState(initialContest);
    const [selectedTopic, setSelectedTopic] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [showManualAdd, setShowManualAdd] = useState(false);

    // AI Hints + Solution state
    const [aiHint1, setAiHint1] = useState<string | null>(null);
    const [aiHint2, setAiHint2] = useState<string | null>(null);
    const [aiSolution, setAiSolution] = useState<string | null>(null);
    const [isLoadingHints, setIsLoadingHints] = useState(false);
    const [hintStage, setHintStage] = useState<0 | 1 | 2 | 3>(0); // 0=none, 1=hint1, 2=hint2, 3=solution

    // AI Tutor state
    const [showTutor, setShowTutor] = useState(false);
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

    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const trackProblems = useMemo(() => {
        if (!problemsData) return [];
        return getProblemsForTrack(problemsData, selectedTrack);
    }, [problemsData, selectedTrack]);

    const availableContests = useMemo(() => getUniqueContests(trackProblems), [trackProblems]);
    const availableTopics = useMemo(() => getUniqueTopics(trackProblems), [trackProblems]);

    const [shuffleSeed, setShuffleSeed] = useState(0);

    const filteredProblems = useMemo(() => {
        const filtered = filterProblems(trackProblems, {
            contest: selectedContest,
            topic: selectedTopic,
            difficulty: selectedDifficulty,
        });
        if (isShuffled) return shuffleProblems(filtered);
        return filtered;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackProblems, selectedContest, selectedTopic, selectedDifficulty, isShuffled, shuffleSeed]);

    const currentProblem: Problem | null = filteredProblems[currentProblemIndex] || null;

    const [currentPartIndex, setCurrentPartIndex] = useState(0);

    const { intro: problemIntro, parts: problemParts } = useMemo(
        () => currentProblem ? splitProblemParts(currentProblem.problem) : { intro: '', parts: [] },
        [currentProblem]
    );
    const hasParts = problemParts.length > 1;
    const currentPart = problemParts[currentPartIndex] || null;
    const problemHasAnswer = currentProblem ? hasAnswerKey(currentProblem) : false;
    // Multi-part problems are graded per part via AI tutor, so suppress the
    // single-answer Submit flow even when correct_answer is set on the row.
    const useAiFeedback = !problemHasAnswer || hasParts;

    useEffect(() => {
        setCurrentPartIndex(0);
        setUserAnswer('');
        setFeedback(null);
    }, [currentProblem]);

    const resetState = useCallback(() => {
        setCurrentProblemIndex(0);
        setCurrentPartIndex(0);
        setUserAnswer('');
        setFeedback(null);
        setShowSolution(false);
    }, []);

    // Reset tutor chat and AI hints/solution when problem changes
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
            // Fetch hints on first click, then show hint 1
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
        const work = userAnswer.trim();
        const message = work
            ? `Here is my work on${partLabel}:\n\n${work}\n\nCould you give me feedback and a hint on what to do next?`
            : `I'm working on${partLabel}. Could you give me a hint on how to start?`;
        sendTutorMessage(message, partText);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProblem || !userAnswer.trim()) return;

        const isCorrect = checkAnswer(currentProblem, userAnswer);
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        try {
            await recordUserActivity({
                contest: currentProblem.contest,
                year: currentProblem.year,
                number: currentProblem.number,
                topic: currentProblem.topic,
                difficulty: currentProblem.difficulty,
                track: currentProblem.track || selectedTrack as UserActivity['track'],
                is_correct: isCorrect,
            });
        } catch (error) {
            console.error('Failed to record activity', error);
        }
    };

    const nextProblem = () => {
        setCurrentProblemIndex((prev) => prev < filteredProblems.length - 1 ? prev + 1 : 0);
        setUserAnswer('');
        setFeedback(null);
        setShowSolution(false);
        resetTutor();
    };

    const prevProblem = () => {
        setCurrentProblemIndex((prev) => prev > 0 ? prev - 1 : filteredProblems.length - 1);
        setUserAnswer('');
        setFeedback(null);
        setShowSolution(false);
        resetTutor();
    };

    const selectProblem = (idx: number) => {
        setCurrentProblemIndex(idx);
        setUserAnswer('');
        setFeedback(null);
        setShowSolution(false);
        resetTutor();
    };

    // AI Tutor: send message. `partOverride` lets the caller swap in a single
    // sub-part's text instead of the entire problem (used for multi-part questions).
    const sendTutorMessage = async (content: string, partOverride?: string) => {
        if (!content.trim() || isChatLoading || !currentProblem) return;

        const userMsg: ChatMessage = { role: 'user', content: content.trim() };

        const problemTextForContext = partOverride || currentProblem.problem;
        const partTag = currentPart?.label ? ` part (${currentPart.label})` : '';
        const contextPrefix = chatMessages.length === 0
            ? `I'm working on this problem${partTag}:\n\n${currentProblem.contest} ${currentProblem.year} #${currentProblem.number} (${currentProblem.topic})\n\n"${problemTextForContext}"\n\nMy question: `
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

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#050507] text-gray-100 flex flex-col items-center justify-center pt-16 px-4">
                <h2 className="text-2xl font-bold mb-3">Please Log In</h2>
                <p className="text-gray-400 mb-4">You need to be logged in to use the trainer.</p>
                <Link href="/login" className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-6 py-2.5 font-medium transition-colors">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (!authChecked || !problemsData) {
        return (
            <div className="min-h-screen bg-[#050507] flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500">{!authChecked ? 'Checking login...' : 'Loading problems...'}</span>
            </div>
        );
    }

    const difficultyBadge = (difficulty: string) => {
        const base = 'text-xs font-semibold px-2 py-0.5 rounded-full';
        switch (difficulty) {
            case 'easy': return `${base} bg-green-500/10 text-green-400 border border-green-500/20`;
            case 'medium': return `${base} bg-amber-500/10 text-amber-400 border border-amber-500/20`;
            case 'hard': return `${base} bg-red-500/10 text-red-400 border border-red-500/20`;
            default: return `${base} bg-white/5 text-gray-400 border border-white/10`;
        }
    };

    return (
        <div className="min-h-screen bg-[#050507] text-gray-100 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Problem Trainer</h1>
                <p className="text-gray-400">
                    Practice with real contest problems and test your skills
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Problem Area */}
                <div className="flex-1 min-w-0">
                    {currentProblem ? (
                        <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5">
                            {/* Problem Meta Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs bg-white/[0.04] text-gray-400 px-2.5 py-1 rounded-md border border-white/[0.06]">
                                    {currentProblem.contest}
                                </span>
                                <span className="text-xs bg-white/[0.04] text-gray-400 px-2.5 py-1 rounded-md border border-white/[0.06]">
                                    {currentProblem.year}
                                </span>
                                <span className="text-xs bg-white/[0.04] text-gray-400 px-2.5 py-1 rounded-md border border-white/[0.06]">
                                    #{currentProblem.number}
                                </span>
                                <span className="text-xs bg-white/[0.04] text-gray-400 px-2.5 py-1 rounded-md border border-white/[0.06]">
                                    {currentProblem.topic}
                                </span>
                                <span className={difficultyBadge(currentProblem.difficulty)}>{currentProblem.difficulty}</span>
                            </div>

                            {/* Problem Title */}
                            <h2 className="text-lg font-semibold text-gray-100 mb-4">
                                {currentProblem.contest} {currentProblem.year} Problem #{currentProblem.number}
                            </h2>

                            {/* Problem Text */}
                            <div className="text-gray-300 leading-relaxed text-[0.95rem]">
                                {(currentProblem.problem.includes('[Diagram Required]') || currentProblem.problem.includes('[Graph Required]')) && !currentProblem.image_url && (
                                    <div className="mb-4 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm flex items-center gap-2">
                                        <span>Warning:</span>
                                        <span>This problem requires a diagram. Please check the original source below.</span>
                                    </div>
                                )}
                                {hasParts ? (
                                    <>
                                        {problemIntro && (
                                            <div className="mb-4 pb-4 border-b border-white/[0.06]">
                                                <LatexRenderer text={problemIntro} />
                                            </div>
                                        )}
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            {problemParts.map((p, i) => (
                                                <button
                                                    key={p.label || i}
                                                    onClick={() => { setCurrentPartIndex(i); setUserAnswer(''); setFeedback(null); }}
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors
                                                        ${i === currentPartIndex
                                                            ? 'bg-indigo-500 text-white border-indigo-500'
                                                            : 'bg-white/[0.04] text-gray-400 border-white/[0.06] hover:bg-white/[0.08]'
                                                        }`}>
                                                    Part {p.label || i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        {currentPart && (
                                            <div>
                                                <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-2">
                                                    Part {currentPart.label}
                                                </div>
                                                <LatexRenderer text={currentPart.body} />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <LatexRenderer text={currentProblem.problem} />
                                )}
                                {currentProblem.image_url && (
                                    <div className="mt-4 text-center">
                                        {(currentProblem.contest?.includes('USNCO') && currentProblem.image_url.includes('/pages/')) ? (
                                            <div className="border border-white/[0.06] rounded-lg overflow-hidden">
                                                <div className="px-3 py-2 bg-indigo-500/10 border-b border-white/[0.06] text-xs text-indigo-400 font-semibold">
                                                    Find Question #{currentProblem.number} on this exam page (scroll to find it)
                                                </div>
                                                <div className="max-h-[500px] overflow-y-auto bg-white">
                                                    <img
                                                        src={currentProblem.image_url}
                                                        alt={`Exam page containing ${currentProblem.contest} ${currentProblem.year} Problem #${currentProblem.number}`}
                                                        className="w-full block"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={currentProblem.image_url}
                                                alt={`Diagram for ${currentProblem.contest} ${currentProblem.year} Problem #${currentProblem.number}`}
                                                className="max-w-full rounded-lg border border-white/[0.06]"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Multiple Choice */}
                            {currentProblem.choices && !useAiFeedback && (
                                <div className="mt-6 flex flex-col gap-2">
                                    {currentProblem.choices.map((choice, idx) => {
                                        const letter = String.fromCharCode(65 + idx);
                                        const isSelected = userAnswer.toUpperCase() === letter;
                                        return (
                                            <button key={idx} type="button" onClick={() => setUserAnswer(letter)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left transition-all cursor-pointer
                                                    ${isSelected
                                                        ? 'bg-indigo-500/15 border border-indigo-500 text-gray-100'
                                                        : 'bg-white/[0.03] border border-white/[0.06] text-gray-300 hover:bg-white/[0.06]'
                                                    }`}>
                                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                                    ${isSelected
                                                        ? 'bg-indigo-500 text-white'
                                                        : 'bg-[#16161f] text-gray-500'
                                                    }`}>{letter}</span>
                                                <LatexRenderer text={choice} />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Answer Section */}
                            <div className="mt-6">
                                {useAiFeedback ? (
                                    <div className="flex flex-col gap-3">
                                        <textarea
                                            className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors min-h-[80px] resize-y"
                                            placeholder={hasParts
                                                ? `Sketch your work for part ${currentPart?.label || ''} here (optional)...`
                                                : 'Sketch your work or attempt here (optional)...'}
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)} />
                                        <div className="flex flex-wrap gap-3 items-center">
                                            <button
                                                type="button"
                                                onClick={requestAiFeedback}
                                                className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                                                Get AI Feedback{hasParts && currentPart?.label ? ` on Part ${currentPart.label}` : ''}
                                            </button>
                                            <button type="button" className="bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.06] rounded-lg px-4 py-2 text-sm font-medium transition-colors" onClick={() => setShowSolution(!showSolution)}>
                                                {showSolution ? 'Hide Solution' : 'Show Solution'}
                                            </button>
                                            <span className="text-xs text-gray-500">
                                                {hasParts ? 'Multi-part problem — graded by the AI Tutor.' : 'No answer key for this problem — use the AI Tutor.'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <form className="flex flex-wrap gap-3 items-center" onSubmit={handleSubmit}>
                                        {!currentProblem.choices && (
                                            <input type="text" className="flex-1 min-w-[200px] bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                                                placeholder="Enter your answer..."
                                                value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
                                        )}
                                        <button type="submit" className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors" disabled={!userAnswer.trim()}>Submit</button>
                                        <button type="button" className="bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.06] rounded-lg px-4 py-2 text-sm font-medium transition-colors" onClick={() => setShowSolution(!showSolution)}>
                                            {showSolution ? 'Hide Solution' : 'Show Solution'}
                                        </button>
                                    </form>
                                )}

                                {feedback && !useAiFeedback && (
                                    <div className={`mt-3 px-4 py-3 rounded-lg text-sm font-medium ${feedback === 'correct' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {feedback === 'correct'
                                            ? 'Correct! Well done!'
                                            : (() => {
                                                const letterIdx = currentProblem.correct_answer?.toUpperCase().charCodeAt(0) - 65;
                                                const choiceText = currentProblem.choices && letterIdx >= 0 && letterIdx < currentProblem.choices.length
                                                    ? ` (${currentProblem.choices[letterIdx]})` : '';
                                                return `Incorrect. The correct answer is: ${currentProblem.correct_answer || currentProblem.correct_value}${choiceText}`;
                                            })()}
                                    </div>
                                )}

                                {showSolution && (
                                    <div className="mt-3 flex flex-col gap-3">
                                        {/* Stored solution (from DB) */}
                                        {currentProblem.solution && (
                                            <div className="p-4 bg-[#16161f] rounded-lg text-sm leading-7 border border-white/[0.06]">
                                                <div className="font-bold mb-2 text-indigo-400">Solution</div>
                                                <div className="whitespace-pre-wrap">
                                                    <LatexRenderer text={currentProblem.solution} />
                                                </div>
                                            </div>
                                        )}

                                        {/* AI Progressive Hints */}
                                        {!currentProblem.solution && (
                                            <>
                                                {currentProblem.source_link && (
                                                    <div>
                                                        <a href={currentProblem.source_link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline break-all text-sm hover:text-indigo-300">
                                                            View on AoPS
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Hint 1 */}
                                                {hintStage >= 1 && (
                                                    <div className="p-4 bg-amber-500/[0.08] rounded-lg text-sm leading-7 border border-amber-500/30">
                                                        <div className="font-bold mb-2 text-amber-400 flex items-center gap-2">
                                                            <span>Hint 1</span>
                                                        </div>
                                                        {aiHint1 ? (
                                                            <div className="whitespace-pre-wrap"><LatexRenderer text={aiHint1} /></div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                                                <span>Generating hint with AI...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Hint 2 */}
                                                {hintStage >= 2 && (
                                                    <div className="p-4 bg-indigo-500/[0.08] rounded-lg text-sm leading-7 border border-indigo-500/30">
                                                        <div className="font-bold mb-2 text-indigo-400 flex items-center gap-2">
                                                            <span>Hint 2</span>
                                                        </div>
                                                        {aiHint2 ? (
                                                            <div className="whitespace-pre-wrap"><LatexRenderer text={aiHint2} /></div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                                                <span>Generating hint with AI...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Full Solution */}
                                                {hintStage >= 3 && (
                                                    <div className="p-4 bg-emerald-500/[0.08] rounded-lg text-sm leading-7 border border-emerald-500/30">
                                                        <div className="font-bold mb-2 text-emerald-400 flex items-center gap-2">
                                                            <span>Full Solution</span>
                                                        </div>
                                                        {aiSolution ? (
                                                            <div className="whitespace-pre-wrap"><LatexRenderer text={aiSolution} /></div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                                                <span>Generating solution with AI...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Progressive reveal button */}
                                                {hintStage < 3 && (
                                                    <button
                                                        onClick={revealNextHint}
                                                        className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                                                            ${hintStage === 2
                                                                ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                                                                : 'bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.06]'
                                                            }`}
                                                        disabled={isLoadingHints}
                                                    >
                                                        {isLoadingHints ? 'Generating...' :
                                                            hintStage === 0 ? 'Show Hint 1' :
                                                            hintStage === 1 ? 'Show Hint 2' :
                                                            'Show Full Solution'}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Navigation + AI Help */}
                            <div className="flex justify-between mt-6 gap-3">
                                <button className="text-gray-400 hover:text-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors" onClick={prevProblem}>
                                    Prev
                                </button>
                                <button className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors
                                    ${showTutor
                                        ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.06]'
                                    }`} onClick={() => setShowTutor(!showTutor)}>
                                    {showTutor ? 'Hide Tutor' : 'AI Tutor'}
                                </button>
                                <button className="text-gray-400 hover:text-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors" onClick={nextProblem}>
                                    Next
                                </button>
                            </div>

                            {/* Integrated AI Tutor Panel */}
                            {showTutor && (
                                <div className="mt-4 border border-indigo-500/30 rounded-xl overflow-hidden bg-[#111118]">
                                    {/* Tutor Header */}
                                    <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm">
                                                AI
                                            </span>
                                            <div>
                                                <div className="text-sm font-bold">AI Tutor</div>
                                                <div className="text-[0.7rem] text-gray-500">Hints, not answers</div>
                                            </div>
                                        </div>
                                        <button className="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 rounded hover:bg-white/[0.04] transition-colors" onClick={() => { setChatMessages([]); setChatInput(''); }}>
                                            Clear
                                        </button>
                                    </div>

                                    {/* Chat messages */}
                                    <div className="max-h-[300px] overflow-y-auto p-4 flex flex-col gap-3">
                                        {chatMessages.length === 0 && (
                                            <div className="text-center text-gray-500 text-sm py-4">
                                                Ask me for a hint, explain your approach, or tell me where you&apos;re stuck!
                                            </div>
                                        )}
                                        {chatMessages.map((msg, idx) => (
                                            <div key={idx} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs shrink-0
                                                    ${msg.role === 'ai'
                                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                                        : 'bg-[#16161f] border border-white/[0.08] text-gray-400'
                                                    }`}>
                                                    {msg.role === 'ai' ? 'AI' : 'You'}
                                                </div>
                                                <div className={`px-3.5 py-2.5 rounded-lg text-sm leading-relaxed
                                                    ${msg.role === 'ai'
                                                        ? 'bg-[#16161f] border border-white/[0.06] text-gray-200'
                                                        : 'bg-indigo-500 text-white'
                                                    }`}>
                                                    <LatexRenderer text={msg.content} />
                                                </div>
                                            </div>
                                        ))}
                                        {isChatLoading && (
                                            <div className="flex gap-2 self-start">
                                                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white">AI</div>
                                                <div className="px-3.5 py-2.5 rounded-lg bg-[#16161f] border border-white/[0.06]">
                                                    <div className="flex gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0ms]" />
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:150ms]" />
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:300ms]" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Quick actions */}
                                    <div className="flex gap-1.5 px-4 pb-2 flex-wrap">
                                        {['Give me a hint', "I'm stuck", 'Explain the concept', 'Is my approach right?'].map((action, idx) => (
                                            <button key={idx} onClick={() => sendTutorMessage(action)} disabled={isChatLoading}
                                                className="text-xs px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 border border-white/[0.06] transition-colors disabled:opacity-40">
                                                {action}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Input */}
                                    <form onSubmit={(e) => { e.preventDefault(); sendTutorMessage(chatInput); }}
                                        className="flex gap-2 px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                                        <input type="text" className="flex-1 bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                                            placeholder="Ask the tutor..."
                                            value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={isChatLoading} />
                                        <button type="submit" className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                            disabled={isChatLoading || !chatInput.trim()}>
                                            ↑
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Source Link */}
                            {currentProblem.source_link && (
                                <div className="mt-4 text-center">
                                    <a href={currentProblem.source_link} target="_blank" rel="noopener noreferrer"
                                        className="w-full inline-flex justify-center items-center bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.06] rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                                        View Original Source (PDF/Web)
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center h-64 text-gray-500 gap-4">
                            <span className="text-3xl">No results</span>
                            <span className="text-sm">No problems found for this filter. Try a different combination.</span>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0">
                    {/* Track Filter */}
                    <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Track</div>
                        <select className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors" value={selectedTrack}
                            onChange={(e) => { setSelectedTrack(e.target.value); setSelectedContest('all'); setSelectedTopic('all'); resetState(); }}>
                            <option value="all">All Tracks</option>
                            <option value="math">Math Olympiad</option>
                            <option value="chemistry">Chemistry Olympiad</option>
                            <option value="physics">Physics Olympiad</option>
                        </select>
                    </div>

                    {/* Contest Filter */}
                    <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contest</div>
                        <select className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors" value={selectedContest}
                            onChange={(e) => { setSelectedContest(e.target.value); resetState(); }}>
                            <option value="all">All Contests</option>
                            {availableContests.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Topic Filter */}
                    <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Topic</div>
                        <select className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors" value={selectedTopic}
                            onChange={(e) => { setSelectedTopic(e.target.value); resetState(); }}>
                            <option value="all">All Topics</option>
                            {availableTopics.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Difficulty</div>
                        <select className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors" value={selectedDifficulty}
                            onChange={(e) => { setSelectedDifficulty(e.target.value); resetState(); }}>
                            <option value="all">All Levels</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    {/* Shuffle Button */}
                    <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-4">
                        <button className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors
                            ${isShuffled
                                ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                                : 'bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.06]'
                            }`}
                            onClick={() => { if (!isShuffled) setShuffleSeed(prev => prev + 1); setIsShuffled(!isShuffled); resetState(); }}>
                            {isShuffled ? 'Shuffled' : 'Shuffle Problems'}
                        </button>
                    </div>

                    {/* Add Problem Button */}
                    <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-4">
                        <button className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.06] rounded-lg px-4 py-2 text-sm font-medium transition-colors" onClick={() => setShowManualAdd(!showManualAdd)}>
                            {showManualAdd ? 'Hide Manual Add' : 'Add Problem'}
                        </button>
                    </div>

                    {/* Manual Add Form */}
                    {showManualAdd && (
                        <div className="bg-indigo-500/[0.05] border border-indigo-500/30 rounded-xl p-4">
                            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">Add Problem</div>
                            <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
                                <select className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-indigo-500/50" value={newProblem.track}
                                    onChange={e => setNewProblem({ ...newProblem, track: e.target.value as typeof newProblem.track })}>
                                    <option value="math">Math Olympiad</option>
                                    <option value="chemistry">Chemistry Olympiad</option>
                                    <option value="physics">Physics Olympiad</option>
                                </select>
                                <input type="text" className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50" placeholder="Contest (e.g. AMC 10A)"
                                    value={newProblem.contest} onChange={e => setNewProblem({ ...newProblem, contest: e.target.value })} required />
                                <div className="flex gap-2">
                                    <input type="number" className="w-1/2 bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50" placeholder="Year" value={newProblem.year}
                                        onChange={e => setNewProblem({ ...newProblem, year: parseInt(e.target.value) })} required />
                                    <input type="number" className="w-1/2 bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50" placeholder="No." value={newProblem.number}
                                        onChange={e => setNewProblem({ ...newProblem, number: parseInt(e.target.value) })} required />
                                </div>
                                <input type="text" className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50" placeholder="Topic" value={newProblem.topic}
                                    onChange={e => setNewProblem({ ...newProblem, topic: e.target.value })} />
                                <textarea className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 min-h-[80px] resize-y" placeholder="Problem Text" value={newProblem.problem}
                                    onChange={e => setNewProblem({ ...newProblem, problem: e.target.value })} required />
                                <input type="text" className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50" placeholder="Correct Answer" value={newProblem.correct_answer}
                                    onChange={e => setNewProblem({ ...newProblem, correct_answer: e.target.value })} required />
                                <textarea className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 min-h-[60px] resize-y" placeholder="Solution" value={newProblem.solution}
                                    onChange={e => setNewProblem({ ...newProblem, solution: e.target.value })} />
                                <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">Save Problem</button>
                            </form>
                        </div>
                    )}

                    {/* Problem List */}
                    <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-4 flex-1">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Problems ({filteredProblems.length})</div>
                        <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto pr-1">
                            {filteredProblems.map((p, idx) => (
                                <div key={p.id || `local-${idx}`}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm
                                        ${idx === currentProblemIndex
                                            ? 'bg-indigo-500/15 border border-indigo-500/30 text-gray-100'
                                            : 'hover:bg-white/[0.04] text-gray-400'
                                        }`}
                                    onClick={() => selectProblem(idx)}>
                                    <span className="text-xs">{p.contest} #{p.number}</span>
                                    <span className={difficultyBadge(p.difficulty)} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                                        {p.difficulty}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TrainerPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050507] flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <TrainerContent />
        </Suspense>
    );
}
