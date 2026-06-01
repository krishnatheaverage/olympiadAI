'use client';

import { useEffect, useState, useTransition } from 'react';
import { supabase, fetchProfile, updateProfile, Profile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const trackOptions = [
    { value: 'math', label: 'Math Olympiad' },
    { value: 'chemistry', label: 'Chemistry Olympiad' },
    { value: 'physics', label: 'Physics Olympiad' },
];

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

// NOTE: These section components MUST live at module scope (not nested inside
// SettingsPage). When they were defined inside the page component, every
// keystroke re-created them as brand-new function identities, so React
// unmounted and remounted the whole subsection on each render — which
// destroyed the focused <input> and booted the cursor out after one
// character. Hoisting them keeps their identity stable across renders.

function ProfileSection({ username, setUsername, saveMessage, isSaving, onSubmit }: {
    username: string;
    setUsername: (v: string) => void;
    saveMessage: string | null;
    isSaving: boolean;
    onSubmit: (e: React.FormEvent) => void;
}) {
    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            <div className="mb-5 flex items-baseline justify-between">
                <h2 className="italic-serif text-[40px] leading-none text-[color:var(--cream)]">01 · Profile</h2>
                {saveMessage && (
                    <span className="mono text-[10px] tracking-[0.16em] text-[color:var(--good)] uppercase">
                        {saveMessage}
                    </span>
                )}
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Display name */}
                <div className="row border-t hairline pt-6 pb-2">
                    <div>
                        <div className="italic-serif text-[24px] leading-tight text-[color:var(--cream)]">Display name</div>
                        <div className="mt-1 text-[13px] leading-[1.5] text-[color:var(--cream-mt)]">Shown on the leaderboard and in coach messages.</div>
                    </div>
                    <div>
                        <input
                            className="input-line"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                {/* Username handle */}
                <div className="row border-t hairline pt-6 pb-2">
                    <div>
                        <div className="italic-serif text-[24px] leading-tight text-[color:var(--cream)]">Username</div>
                        <div className="mt-1 text-[13px] leading-[1.5] text-[color:var(--cream-mt)] font-light">Your unique handle. Lowercase, alphanumeric.</div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="italic-serif text-[20px] text-[color:var(--cream-mt)] font-light">@</span>
                            <input
                                className="input-line uppercase"
                                value={username.toLowerCase().replace(/[^a-z0-9_]/g, '')}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mt-2.5 mono text-[10px] tracking-[0.14em] text-[color:var(--cream-mt)] font-semibold">
                            olympiad.ai/<span className="text-[color:var(--cream)] font-bold">{username.toLowerCase() || 'handle'}</span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSaving || !username.trim()}
                    className="btn-amber w-full rounded-full py-3.5 text-sm font-semibold transition-all mt-4 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[color:var(--ink-900)]"
                >
                    {isSaving ? 'Updating Profile Details...' : 'Save Profile Changes'}
                </button>
            </form>
        </div>
    );
}

function GoalsSection({ targetTrack, setTargetTrack, targetGoal, setTargetGoal, saveProfileData, saveStatus }: {
    targetTrack: 'math' | 'chemistry' | 'physics';
    setTargetTrack: (v: 'math' | 'chemistry' | 'physics') => void;
    targetGoal: string;
    setTargetGoal: (v: string) => void;
    saveProfileData: (fields: Partial<Profile>) => void;
    saveStatus: 'saved' | 'saving' | 'error' | null;
}) {
    const handleTrackUpdate = (trackVal: 'math' | 'chemistry' | 'physics') => {
        setTargetTrack(trackVal);
        saveProfileData({ target_track: trackVal });
    };

    const handleGoalUpdate = (goalVal: string) => {
        setTargetGoal(goalVal);
        saveProfileData({ target_goal: goalVal });
    };

    const goals = goalsByTrack[targetTrack] || [];

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            <div className="mb-5 flex items-baseline justify-between">
                <h2 className="italic-serif text-[40px] leading-none text-[color:var(--cream)]">02 · Training Goals</h2>
                {saveStatus && (
                    <span className="mono text-[10px] tracking-[0.16em] text-[color:var(--amber)] uppercase font-semibold">
                        {saveStatus === 'saving' ? 'CALCULATING ROADMAP...' : 'ROADMAP TUNED!'}
                    </span>
                )}
            </div>

            {/* Primary track selection */}
            <div className="row border-t hairline pt-6 pb-2">
                <div>
                    <div className="italic-serif text-[24px] leading-tight text-[color:var(--cream)]">Primary track</div>
                    <div className="mt-1 text-[13px] leading-[1.5] text-[color:var(--cream-mt)]">The main contest track you want to build accuracy on.</div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {trackOptions.map(t => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => handleTrackUpdate(t.value as 'math' | 'chemistry' | 'physics')}
                            className={`rounded-full border px-4 py-2 italic-serif text-[16px] transition-colors cursor-pointer ${
                                targetTrack === t.value
                                    ? 'border-[color:var(--amber)] bg-[color:var(--amber)] text-[color:var(--ink-900)] font-bold'
                                    : 'border-[color:var(--cream)]/15 text-[color:var(--cream-dim)] hover:text-[color:var(--cream)]'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Target milestone outcome */}
            <div className="row border-t hairline pt-6 pb-2">
                <div>
                    <div className="italic-serif text-[24px] leading-tight text-[color:var(--cream)]">Target outcome</div>
                    <div className="mt-1 text-[13px] leading-[1.5] text-[color:var(--cream-mt)]">Choose a goal to align your personal roadmap.</div>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {goals.map((g, idx) => {
                        const isSelected = targetGoal === g;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleGoalUpdate(g)}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors text-left ${
                                    isSelected
                                        ? 'border-[color:var(--amber)] bg-[color:var(--amber)]/[0.08] text-[color:var(--cream)] shadow shadow-[color:var(--amber)]/5'
                                        : 'border-[color:var(--cream)]/10 text-[color:var(--cream-dim)] hover:border-[color:var(--cream)]/25 hover:text-white'
                                }`}
                            >
                                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                    isSelected ? 'border-[color:var(--amber)] bg-[color:var(--amber)]' : 'border-[color:var(--cream)]/25'
                                }`}>
                                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--ink-900)]" />}
                                </span>
                                <div>
                                    <div className="italic-serif text-[18px] leading-tight">{g}</div>
                                    <div className="mono text-[8.5px] tracking-[0.12em] text-[color:var(--cream-mt)] mt-0.5">TIMELINE ANCHOR</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="text-center mt-6">
                <Link href="/roadmap" className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-2 text-xs font-semibold">
                    Reconstruct Journey Timeline →
                </Link>
            </div>
        </div>
    );
}

function ToggleRow({ label, hint, value, set }: { label: string; hint: string; value: boolean; set: (v: boolean) => void }) {
    return (
        <div className="row border-t hairline pt-6 pb-2">
            <div>
                <div className="italic-serif text-[24px] leading-tight text-[color:var(--cream)]">{label}</div>
                <div className="mt-1.5 text-[13px] leading-[1.5] text-[color:var(--cream-mt)] font-light">{hint}</div>
            </div>
            <div>
                <div className="flex items-center justify-between gap-4">
                    <span className="mono text-[10px] tracking-[0.14em] text-[color:var(--cream-mt)] font-bold">{value ? 'ON' : 'OFF'}</span>
                    <div
                        className={`toggle relative w-11 h-6 rounded-full cursor-pointer transition-colors ${value ? 'on bg-[color:var(--amber)]' : 'bg-white/10'}`}
                        onClick={() => set(!value)}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[color:var(--cream)] transition-transform duration-200 ${
                                value ? 'translate-x-5 bg-[color:var(--ink-900)]' : ''
                            }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CoachSection() {
    const [hints, setHints] = useState(true);
    const [latex, setLatex] = useState(true);
    const [autosave, setAutosave] = useState(true);

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            <div className="mb-5 flex items-baseline justify-between">
                <h2 className="italic-serif text-[40px] leading-none text-[color:var(--cream)]">03 · Coach Behavior</h2>
            </div>
            <ToggleRow label="Live hints" hint="Coach reads your scratchpad and offers progressive nudges in real time." value={hints} set={setHints} />
            <ToggleRow label="LaTeX autorender" hint="Renders KaTeX markup inline as you type inside scratchboards." value={latex} set={setLatex} />
            <ToggleRow label="Autosave scratch" hint="Snapshots your scratchwork every 4 seconds. Never lose formulas." value={autosave} set={setAutosave} />
        </div>
    );
}

function AccountSection({ profile, onChangePassword }: { profile: Profile | null; onChangePassword: () => void }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            <div className="mb-5 flex items-baseline justify-between">
                <h2 className="italic-serif text-[40px] leading-none text-[color:var(--cream)]">04 · Account</h2>
            </div>

            {/* Email */}
            <div className="row border-t hairline pt-6 pb-2">
                <div>
                    <div className="italic-serif text-[24px] leading-tight text-[color:var(--cream)]">Email address</div>
                    <div className="mt-1 text-[13px] leading-[1.5] text-[color:var(--cream-mt)]">Used to verify sessions and send milestone reminders.</div>
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <input className="input-line max-w-sm disabled:opacity-60" value={profile?.id ? "Verified Profile Session" : "Valid Session"} disabled />
                        <span className="mono text-[9px] tracking-[0.14em] text-[color:var(--good)] font-bold">ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* Password changes */}
            <div className="row border-t hairline pt-6 pb-2">
                <div>
                    <div className="italic-serif text-[24px] leading-tight text-[color:var(--cream)]">Security</div>
                    <div className="mt-1 text-[13px] leading-[1.5] text-[color:var(--cream-mt)] font-light">Trigger password resets safely via verified email.</div>
                </div>
                <div>
                    <button
                        onClick={onChangePassword}
                        className="btn-ghost rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer text-[color:var(--cream)]"
                    >
                        Reset Password via Email
                    </button>
                </div>
            </div>
        </div>
    );
}

function DangerSection({ onLogout }: { onLogout: () => void }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            <div className="mb-5 flex items-baseline justify-between">
                <h2 className="italic-serif text-[40px] leading-none text-[color:var(--cream)]">05 · Session / Safety</h2>
            </div>

            {/* Sign out */}
            <div className="row border-t hairline pt-6 pb-2">
                <div>
                    <div className="italic-serif text-[24px] leading-tight text-[color:var(--cream)]">Sign out</div>
                    <div className="mt-1 text-[13px] leading-[1.5] text-[color:var(--cream-mt)] font-light">Close your active session and return to landing homepage.</div>
                </div>
                <div>
                    <button
                        onClick={onLogout}
                        className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer text-red-400 border-red-500/20 hover:border-red-500 hover:text-red-300"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 4V2H2v10h7v-2M6 7h7m0 0L10 4m3 3l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Terminate Active Session
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Form fields
    const [activeSection, setActiveSection] = useState('profile');
    const [username, setUsername] = useState('');
    const [targetTrack, setTargetTrack] = useState<'math' | 'chemistry' | 'physics'>('math');
    const [targetGoal, setTargetGoal] = useState('');

    // Status indicators
    const [, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    void startTransition;

    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            if (!supabase) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            try {
                const profileData = await fetchProfile();
                setProfile(profileData);
                if (profileData?.username) setUsername(profileData.username);
                if (profileData?.target_track) setTargetTrack(profileData.target_track);
                if (profileData?.target_goal) setTargetGoal(profileData.target_goal);
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    // Auto-save or quick-save profile changes
    const saveProfileData = async (fields: Partial<Profile>) => {
        setSaveStatus('saving');
        try {
            const result = await updateProfile(fields);
            if (result) {
                setProfile(result);
                setSaveStatus('saved');
                if (fields.username !== undefined) {
                    window.dispatchEvent(new CustomEvent('profile-updated', { detail: { username: fields.username } }));
                }
            } else {
                setSaveStatus('error');
            }
        } catch {
            setSaveStatus('error');
        } finally {
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;
        setIsSaving(true);
        setSaveMessage(null);
        try {
            const result = await updateProfile({ username });
            if (result) {
                setSaveMessage('Username updated successfully!');
                setProfile(result);
                window.dispatchEvent(new CustomEvent('profile-updated', { detail: { username } }));
            } else {
                setSaveMessage('Failed to update username.');
            }
        } catch {
            setSaveMessage('Failed to update username.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(null), 3000);
        }
    };

    const handleChangePassword = async () => {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) return;

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                user.email,
                { redirectTo: `${window.location.origin}/login` }
            );
            if (error) alert(error.message);
            else alert('Password reset email sent successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to send password reset email.');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20 px-5 z-10 text-center">
                <div className="surface rounded-2xl p-8 border border-[color:var(--cream)]/10 max-w-md w-full">
                    <h2 className="italic-serif text-3xl mb-3 text-[color:var(--cream)] font-normal">Settings Console</h2>
                    <p className="text-sm text-[color:var(--cream-dim)] mb-6 font-light">Please log in to manage your training profiles, goals, and security credentials.</p>
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
                <span className="mono text-[10px] tracking-wider uppercase">Loading security profile...</span>
            </div>
        );
    }

    const navigationItems = [
        { key: 'profile',  n: '01', label: 'Profile',         sub: 'Display handle, schools' },
        { key: 'goals',    n: '02', label: 'Training Goals',  'sub': 'Track, contest, milestones' },
        { key: 'coach',    n: '03', label: 'Coach Behavior',  sub: 'Hint speeds, formats' },
        { key: 'account',  n: '04', label: 'Account',         sub: 'Passwords, reset routes' },
        { key: 'danger',   n: '05', label: 'Sign Out / Close', sub: 'Terminate sessions' },
    ];

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'goals':
                return (
                    <GoalsSection
                        targetTrack={targetTrack}
                        setTargetTrack={setTargetTrack}
                        targetGoal={targetGoal}
                        setTargetGoal={setTargetGoal}
                        saveProfileData={saveProfileData}
                        saveStatus={saveStatus}
                    />
                );
            case 'coach':
                return <CoachSection />;
            case 'account':
                return <AccountSection profile={profile} onChangePassword={handleChangePassword} />;
            case 'danger':
                return <DangerSection onLogout={handleLogout} />;
            case 'profile':
            default:
                return (
                    <ProfileSection
                        username={username}
                        setUsername={setUsername}
                        saveMessage={saveMessage}
                        isSaving={isSaving}
                        onSubmit={handleUpdateUsername}
                    />
                );
        }
    };

    return (
        <div className="w-full max-w-[1100px] mx-auto px-6 z-10 relative pb-20">
            {/* Page Header */}
            <header className="rise mt-8 mb-10" style={{ '--d': '280ms' } as React.CSSProperties}>
                <div className="chip mb-2.5">Olympiad Member · Active Status</div>
                <h1 className="text-[clamp(44px,5.2vw,72px)] leading-[0.96] tracking-[-0.02em] text-[color:var(--cream)] font-normal">
                    <span className="italic-serif font-light">Settings.</span>
                </h1>
                <p className="mt-3.5 max-w-[560px] text-[15px] leading-[1.6] text-[color:var(--cream-dim)] font-light">
                    Adjust your profile handles, update your target contests, configure the coach, or safely terminate sessions.
                </p>
            </header>

            {/* Grid Layout: Sidebar Nav + Settings Content */}
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 mt-4 items-start">

                {/* Left Sidebar SectionNav */}
                <nav className="rise sticky top-6 self-start space-y-3" style={{ '--d': '360ms' } as React.CSSProperties}>
                    <div className="mb-2 mono text-[10px] tracking-[0.18em] text-[color:var(--cream-mt)] font-semibold uppercase">SECTIONS</div>
                    <ol className="space-y-1.5">
                        {navigationItems.map((item) => {
                            const isCurrent = activeSection === item.key;
                            return (
                                <li key={item.key}>
                                    <button
                                        onClick={() => setActiveSection(item.key)}
                                        className={`group relative grid w-full grid-cols-[24px_1fr] gap-2 rounded-xl px-4.5 py-3.5 text-left transition-colors cursor-pointer ${
                                            isCurrent ? 'bg-[color:var(--ink-850)]/60' : 'hover:bg-[color:var(--ink-850)]/40'
                                        }`}
                                    >
                                        {isCurrent && (
                                            <span className="absolute inset-y-2 left-0 w-[2.5px] rounded-full bg-[color:var(--amber)]" />
                                        )}
                                        <span className={`mono text-[10.5px] font-bold ${isCurrent ? 'text-[color:var(--amber)]' : 'text-[color:var(--cream-mt)]'}`}>{item.n}</span>
                                        <div>
                                            <div className={`italic-serif text-[19px] leading-tight ${isCurrent ? 'text-[color:var(--cream)] font-medium' : 'text-[color:var(--cream-dim)] group-hover:text-[color:var(--cream)]'}`}>{item.label}</div>
                                            <div className="mono text-[8.5px] tracking-[0.06em] text-[color:var(--cream-mt)] font-semibold mt-0.5 uppercase">{item.sub}</div>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                {/* Right Settings Content */}
                <div className="min-w-0 bg-[#111118]/25 border border-[color:var(--cream)]/10 rounded-2xl p-7 surface shadow-lg">
                    {renderActiveSection()}
                </div>

            </div>
        </div>
    );
}
