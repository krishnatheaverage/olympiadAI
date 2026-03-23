'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

    const resetState = useCallback(() => {
        setCurrentProblemIndex(0);
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

    // AI Tutor: send message
    const sendTutorMessage = async (content: string) => {
        if (!content.trim() || isChatLoading || !currentProblem) return;

        const userMsg: ChatMessage = { role: 'user', content: content.trim() };

        // Build context with the current problem
        const contextPrefix = chatMessages.length === 0
            ? `I'm working on this problem:\n\n${currentProblem.contest} ${currentProblem.year} #${currentProblem.number} (${currentProblem.topic})\n\n"${currentProblem.problem}"\n\nMy question: `
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
                    problem: currentProblem?.problem,
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
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2 className="section-header__title">Please Log In</h2>
                <p className="section-header__subtitle" style={{ marginBottom: '1rem' }}>You need to be logged in to use the trainer.</p>
                <Link href="/login" className="btn btn--primary">Go to Login</Link>
            </div>
        );
    }

    if (!authChecked || !problemsData) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <div className="loading-spinner" />
                <span style={{ color: 'var(--text-muted)' }}>{!authChecked ? 'Checking login...' : 'Loading problems...'}</span>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="section-header">
                <h1 className="section-header__title">Problem Trainer</h1>
                <p className="section-header__subtitle">
                    Practice with real contest problems and test your skills
                </p>
            </div>

            <div className="trainer-layout">
                {/* Main Problem Area */}
                <div className="problem-display">
                    {currentProblem ? (
                        <>
                            <div className="problem-meta">
                                <span className="problem-meta__tag">📋 {currentProblem.contest}</span>
                                <span className="problem-meta__tag">📅 {currentProblem.year}</span>
                                <span className="problem-meta__tag">#{currentProblem.number}</span>
                                <span className="problem-meta__tag">🏷️ {currentProblem.topic}</span>
                                <span className={`badge badge--${currentProblem.difficulty}`}>{currentProblem.difficulty}</span>
                            </div>

                            <h2 className="problem-title">
                                {currentProblem.contest} {currentProblem.year} Problem #{currentProblem.number}
                            </h2>

                            <div className="problem-text">
                                {(currentProblem.problem.includes('[Diagram Required]') || currentProblem.problem.includes('[Graph Required]')) && !currentProblem.image_url && (
                                    <div style={{
                                        marginBottom: '1rem', padding: '0.75rem 1rem',
                                        background: 'rgba(251, 191, 36, 0.1)', border: '1px solid var(--accent-amber)',
                                        borderRadius: 'var(--radius-md)', color: 'var(--accent-amber)',
                                        fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}>
                                        <span>⚠️</span>
                                        <span>This problem requires a diagram. Please check the original source below.</span>
                                    </div>
                                )}
                                <LatexRenderer text={currentProblem.problem} />
                                {currentProblem.image_url && (
                                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                        {(currentProblem.contest?.includes('USNCO') && currentProblem.image_url.includes('/pages/')) ? (
                                            <div style={{
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: 'var(--radius-md)',
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    padding: '0.5rem 0.75rem',
                                                    background: 'rgba(59, 130, 246, 0.1)',
                                                    borderBottom: '1px solid var(--border-subtle)',
                                                    fontSize: '0.8rem',
                                                    color: 'var(--accent-primary)',
                                                    fontWeight: 600,
                                                }}>
                                                    📄 Find Question #{currentProblem.number} on this exam page (scroll to find it)
                                                </div>
                                                <div style={{
                                                    maxHeight: '500px',
                                                    overflowY: 'auto',
                                                    background: 'white',
                                                }}>
                                                    <img
                                                        src={currentProblem.image_url}
                                                        alt={`Exam page containing ${currentProblem.contest} ${currentProblem.year} Problem #${currentProblem.number}`}
                                                        style={{ width: '100%', display: 'block' }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={currentProblem.image_url}
                                                alt={`Diagram for ${currentProblem.contest} ${currentProblem.year} Problem #${currentProblem.number}`}
                                                style={{
                                                    maxWidth: '100%',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '1px solid var(--border-subtle)',
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Multiple Choice */}
                            {currentProblem.choices && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {currentProblem.choices.map((choice, idx) => {
                                        const letter = String.fromCharCode(65 + idx);
                                        const isSelected = userAnswer.toUpperCase() === letter;
                                        return (
                                            <button key={idx} type="button" onClick={() => setUserAnswer(letter)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem 1rem',
                                                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-glass)',
                                                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                                                    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                                                    fontSize: '0.9rem', cursor: 'pointer', transition: 'all var(--transition-fast)', textAlign: 'left',
                                                }}>
                                                <span style={{
                                                    width: '28px', height: '28px', borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                                    fontSize: '0.8rem', fontWeight: 700,
                                                    color: isSelected ? 'white' : 'var(--text-muted)', flexShrink: 0,
                                                }}>{letter}</span>
                                                <LatexRenderer text={choice} />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Answer Section */}
                            <div className="answer-section">
                                <form className="answer-section__form" onSubmit={handleSubmit}>
                                    {!currentProblem.choices && (
                                        <input type="text" className="answer-section__input" placeholder="Enter your answer..."
                                            value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
                                    )}
                                    <button type="submit" className="btn btn--primary" disabled={!userAnswer.trim()}>Submit</button>
                                    <button type="button" className="btn btn--secondary" onClick={() => setShowSolution(!showSolution)}>
                                        {showSolution ? 'Hide Solution' : 'Show Solution'}
                                    </button>
                                </form>

                                {feedback && (
                                    <div className={`answer-feedback answer-feedback--${feedback}`}>
                                        {feedback === 'correct'
                                            ? '✅ Correct! Well done!'
                                            : (() => {
                                                const letterIdx = currentProblem.correct_answer?.toUpperCase().charCodeAt(0) - 65;
                                                const choiceText = currentProblem.choices && letterIdx >= 0 && letterIdx < currentProblem.choices.length
                                                    ? ` (${currentProblem.choices[letterIdx]})` : '';
                                                return `❌ Incorrect. The correct answer is: ${currentProblem.correct_answer || currentProblem.correct_value}${choiceText}`;
                                            })()}
                                    </div>
                                )}

                                {showSolution && (
                                    <div style={{
                                        marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                                    }}>
                                        {/* Stored solution (from DB) */}
                                        {currentProblem.solution && (
                                            <div style={{
                                                padding: '1rem 1.25rem', background: 'var(--bg-tertiary)',
                                                borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.7,
                                                border: '1px solid var(--border-subtle)',
                                            }}>
                                                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Solution</div>
                                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                                    <LatexRenderer text={currentProblem.solution} />
                                                </div>
                                            </div>
                                        )}

                                        {/* AI Progressive Hints */}
                                        {!currentProblem.solution && (
                                            <>
                                                {currentProblem.source_link && (
                                                    <div>
                                                        <a href={currentProblem.source_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', wordBreak: 'break-all', fontSize: '0.85rem' }}>
                                                            View on AoPS →
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Hint 1 */}
                                                {hintStage >= 1 && (
                                                    <div style={{
                                                        padding: '1rem 1.25rem', background: 'rgba(251, 191, 36, 0.08)',
                                                        borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.7,
                                                        border: '1px solid rgba(251, 191, 36, 0.3)',
                                                    }}>
                                                        <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span>💡</span> Hint 1
                                                        </div>
                                                        {aiHint1 ? (
                                                            <div style={{ whiteSpace: 'pre-wrap' }}><LatexRenderer text={aiHint1} /></div>
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                                                <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
                                                                <span>Generating hint with AI...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Hint 2 */}
                                                {hintStage >= 2 && (
                                                    <div style={{
                                                        padding: '1rem 1.25rem', background: 'rgba(59, 130, 246, 0.08)',
                                                        borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.7,
                                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                                    }}>
                                                        <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span>🔍</span> Hint 2
                                                        </div>
                                                        {aiHint2 ? (
                                                            <div style={{ whiteSpace: 'pre-wrap' }}><LatexRenderer text={aiHint2} /></div>
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                                                <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
                                                                <span>Generating hint with AI...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Full Solution */}
                                                {hintStage >= 3 && (
                                                    <div style={{
                                                        padding: '1rem 1.25rem', background: 'rgba(16, 185, 129, 0.08)',
                                                        borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.7,
                                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                                    }}>
                                                        <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span>✅</span> Full Solution
                                                        </div>
                                                        {aiSolution ? (
                                                            <div style={{ whiteSpace: 'pre-wrap' }}><LatexRenderer text={aiSolution} /></div>
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                                                <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
                                                                <span>Generating solution with AI...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Progressive reveal button */}
                                                {hintStage < 3 && (
                                                    <button
                                                        onClick={revealNextHint}
                                                        className={`btn ${hintStage === 2 ? 'btn--primary' : 'btn--secondary'}`}
                                                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                                        disabled={isLoadingHints}
                                                    >
                                                        {isLoadingHints ? 'Generating...' :
                                                            hintStage === 0 ? '💡 Show Hint 1' :
                                                            hintStage === 1 ? '🔍 Show Hint 2' :
                                                            '✅ Show Full Solution'}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Navigation + AI Help */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '0.75rem' }}>
                                <button className="btn btn--ghost" onClick={prevProblem}>← Previous</button>
                                <button className={`btn ${showTutor ? 'btn--primary' : 'btn--secondary'}`} onClick={() => setShowTutor(!showTutor)}>
                                    🧠 {showTutor ? 'Hide Tutor' : 'AI Tutor'}
                                </button>
                                <button className="btn btn--ghost" onClick={nextProblem}>Next →</button>
                            </div>

                            {/* Integrated AI Tutor Panel */}
                            {showTutor && (
                                <div style={{
                                    marginTop: '1rem', border: '1px solid var(--border-accent)',
                                    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                                    background: 'var(--bg-card)',
                                }}>
                                    <div style={{
                                        padding: '0.75rem 1rem', background: 'var(--bg-glass)',
                                        borderBottom: '1px solid var(--border-subtle)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{
                                                width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                                                background: 'var(--gradient-primary)', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                                            }}>🧠</span>
                                            <div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>AI Tutor</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hints, not answers</div>
                                            </div>
                                        </div>
                                        <button className="btn btn--ghost btn--sm" onClick={() => { setChatMessages([]); setChatInput(''); }}>
                                            Clear
                                        </button>
                                    </div>

                                    {/* Chat messages */}
                                    <div style={{
                                        maxHeight: '300px', overflowY: 'auto', padding: '1rem',
                                        display: 'flex', flexDirection: 'column', gap: '0.75rem',
                                    }}>
                                        {chatMessages.length === 0 && (
                                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem 0' }}>
                                                Ask me for a hint, explain your approach, or tell me where you&apos;re stuck!
                                            </div>
                                        )}
                                        {chatMessages.map((msg, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex', gap: '0.5rem',
                                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '85%', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                            }}>
                                                <div style={{
                                                    width: '28px', height: '28px', borderRadius: 'var(--radius-sm)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.75rem', flexShrink: 0,
                                                    background: msg.role === 'ai' ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                                                    border: msg.role === 'user' ? '1px solid var(--border-light)' : 'none',
                                                }}>
                                                    {msg.role === 'ai' ? '🧠' : '👤'}
                                                </div>
                                                <div style={{
                                                    padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)',
                                                    fontSize: '0.85rem', lineHeight: 1.5,
                                                    background: msg.role === 'ai' ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                                                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                                    border: msg.role === 'ai' ? '1px solid var(--border-subtle)' : 'none',
                                                }}>
                                                    <LatexRenderer text={msg.content} />
                                                </div>
                                            </div>
                                        ))}
                                        {isChatLoading && (
                                            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start' }}>
                                                <div style={{
                                                    width: '28px', height: '28px', borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--gradient-primary)', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
                                                }}>🧠</div>
                                                <div style={{
                                                    padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                                                }}>
                                                    <div className="typing-indicator">
                                                        <div className="typing-indicator__dot" />
                                                        <div className="typing-indicator__dot" />
                                                        <div className="typing-indicator__dot" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Quick actions */}
                                    <div style={{ display: 'flex', gap: '0.375rem', padding: '0 1rem 0.5rem', flexWrap: 'wrap' }}>
                                        {['Give me a hint', "I'm stuck", 'Explain the concept', 'Is my approach right?'].map((action, idx) => (
                                            <button key={idx} className="quick-action" onClick={() => sendTutorMessage(action)} disabled={isChatLoading}
                                                style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}>
                                                {action}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Input */}
                                    <form onSubmit={(e) => { e.preventDefault(); sendTutorMessage(chatInput); }}
                                        style={{
                                            display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem',
                                            borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-glass)',
                                        }}>
                                        <input type="text" className="chat-input__field" placeholder="Ask the tutor..."
                                            value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={isChatLoading}
                                            style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem 0.75rem' }} />
                                        <button type="submit" className="chat-input__send" disabled={isChatLoading || !chatInput.trim()}
                                            style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>↑</button>
                                    </form>
                                </div>
                            )}

                            {/* Source Link */}
                            {currentProblem.source_link && (
                                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                    <a href={currentProblem.source_link} target="_blank" rel="noopener noreferrer"
                                        className="btn btn--secondary btn--sm" style={{ width: '100%', justifyContent: 'center' }}>
                                        📄 View Original Source (PDF/Web)
                                    </a>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', flexDirection: 'column', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>🔍</span>
                            No problems found for this filter. Try a different combination.
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="problem-sidebar">
                    <div className="filter-card">
                        <div className="filter-card__title">Track</div>
                        <select className="select-field" value={selectedTrack}
                            onChange={(e) => { setSelectedTrack(e.target.value); setSelectedContest('all'); setSelectedTopic('all'); resetState(); }}>
                            <option value="all">All Tracks</option>
                            <option value="math">Math Olympiad</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="physics">Physics</option>
                        </select>
                    </div>

                    <div className="filter-card">
                        <div className="filter-card__title">Contest</div>
                        <select className="select-field" value={selectedContest}
                            onChange={(e) => { setSelectedContest(e.target.value); resetState(); }}>
                            <option value="all">All Contests</option>
                            {availableContests.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="filter-card">
                        <div className="filter-card__title">Topic</div>
                        <select className="select-field" value={selectedTopic}
                            onChange={(e) => { setSelectedTopic(e.target.value); resetState(); }}>
                            <option value="all">All Topics</option>
                            {availableTopics.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="filter-card">
                        <div className="filter-card__title">Difficulty</div>
                        <select className="select-field" value={selectedDifficulty}
                            onChange={(e) => { setSelectedDifficulty(e.target.value); resetState(); }}>
                            <option value="all">All Levels</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div className="filter-card">
                        <button className={`btn ${isShuffled ? 'btn--primary' : 'btn--secondary'}`} style={{ width: '100%' }}
                            onClick={() => { if (!isShuffled) setShuffleSeed(prev => prev + 1); setIsShuffled(!isShuffled); resetState(); }}>
                            🔀 {isShuffled ? 'Shuffled' : 'Shuffle Problems'}
                        </button>
                    </div>

                    <div className="filter-card">
                        <button className="btn btn--secondary" style={{ width: '100%' }} onClick={() => setShowManualAdd(!showManualAdd)}>
                            ➕ {showManualAdd ? 'Hide Manual Add' : 'Add Problem'}
                        </button>
                    </div>

                    {showManualAdd && (
                        <div className="filter-card" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--accent-primary)' }}>
                            <div className="filter-card__title" style={{ color: 'var(--accent-primary)' }}>Add Problem</div>
                            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <select className="select-field" value={newProblem.track}
                                    onChange={e => setNewProblem({ ...newProblem, track: e.target.value as typeof newProblem.track })}>
                                    <option value="math">Math</option>
                                    <option value="chemistry">Chemistry</option>
                                    <option value="physics">Physics</option>
                                </select>
                                <input type="text" className="input-field" placeholder="Contest (e.g. AMC 10A)"
                                    value={newProblem.contest} onChange={e => setNewProblem({ ...newProblem, contest: e.target.value })} required />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="number" className="input-field" placeholder="Year" value={newProblem.year}
                                        onChange={e => setNewProblem({ ...newProblem, year: parseInt(e.target.value) })} style={{ width: '50%' }} required />
                                    <input type="number" className="input-field" placeholder="No." value={newProblem.number}
                                        onChange={e => setNewProblem({ ...newProblem, number: parseInt(e.target.value) })} style={{ width: '50%' }} required />
                                </div>
                                <input type="text" className="input-field" placeholder="Topic" value={newProblem.topic}
                                    onChange={e => setNewProblem({ ...newProblem, topic: e.target.value })} />
                                <textarea className="input-field" placeholder="Problem Text" value={newProblem.problem}
                                    onChange={e => setNewProblem({ ...newProblem, problem: e.target.value })} style={{ minHeight: '80px', resize: 'vertical' }} required />
                                <input type="text" className="input-field" placeholder="Correct Answer" value={newProblem.correct_answer}
                                    onChange={e => setNewProblem({ ...newProblem, correct_answer: e.target.value })} required />
                                <textarea className="input-field" placeholder="Solution" value={newProblem.solution}
                                    onChange={e => setNewProblem({ ...newProblem, solution: e.target.value })} style={{ minHeight: '60px', resize: 'vertical' }} />
                                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Save Problem</button>
                            </form>
                        </div>
                    )}

                    <div className="filter-card" style={{ flex: 1 }}>
                        <div className="filter-card__title">Problems ({filteredProblems.length})</div>
                        <div className="problem-list">
                            {filteredProblems.map((p, idx) => (
                                <div key={p.id || `local-${idx}`}
                                    className={`problem-list__item ${idx === currentProblemIndex ? 'problem-list__item--active' : ''}`}
                                    onClick={() => selectProblem(idx)}>
                                    <span style={{ fontSize: '0.8rem' }}>{p.contest} #{p.number}</span>
                                    <span className={`badge badge--${p.difficulty}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
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
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="loading-spinner" />
            </div>
        }>
            <TrainerContent />
        </Suspense>
    );
}
