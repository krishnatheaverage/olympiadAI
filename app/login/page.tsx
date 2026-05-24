'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const isValidEmail = (email: string) => {
        const trimmed = email.trim().toLowerCase();
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return false;
        const domain = trimmed.split('@')[1];
        if (!domain || domain.length < 4) return false;
        const tld = domain.split('.').pop() || '';
        if (tld.length < 2 || tld.length > 10) return false;
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address (e.g. you@example.com).');
            return;
        }

        // Confirm password match — only required when creating an account.
        if (isSignUp && password !== confirmPassword) {
            setError('Passwords do not match. Please re-enter to confirm.');
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                const signUpData = await signUp(email, password);
                if (signUpData.session) {
                    router.push('/dashboard');
                    router.refresh();
                } else {
                    setSuccess('Check your email! We sent a confirmation link to ' + email + '. Click it to activate your account.');
                    setIsSignUp(false);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                }
            } else {
                await signIn(email, password);
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-5">
            <div className="w-full max-w-sm bg-[#111118] border border-white/[0.06] rounded-2xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {isSignUp
                            ? 'Sign up to track your progress'
                            : 'Log in to your OlympiadAI account'}
                    </p>
                </div>

                {error && (
                    <div className="mb-3 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-3 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                        <input
                            type="email"
                            className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-gray-100 text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-colors"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
                        <input
                            type="password"
                            className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-gray-100 text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-colors"
                            placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {isSignUp && (
                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                className={`w-full bg-[#0a0a0f] border rounded-lg px-3 py-2.5 text-gray-100 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-colors ${
                                    confirmPassword && confirmPassword !== password
                                        ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/25'
                                        : 'border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/25'
                                }`}
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            {confirmPassword && confirmPassword !== password && (
                                <p className="mt-1 text-[11px] text-red-400">Passwords do not match.</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-1 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="loading-spinner" />
                                {isSignUp ? 'Creating account...' : 'Logging in...'}
                            </>
                        ) : isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div className="text-center mt-5 text-xs text-gray-500">
                    {isSignUp ? (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                                onClick={() => { setIsSignUp(false); setError(null); setSuccess(null); setConfirmPassword(''); }}
                            >
                                Log in
                            </button>
                        </>
                    ) : (
                        <>
                            Don&apos;t have an account?{' '}
                            <button
                                type="button"
                                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                                onClick={() => { setIsSignUp(true); setError(null); setSuccess(null); }}
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
