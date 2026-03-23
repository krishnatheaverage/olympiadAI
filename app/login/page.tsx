'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const isValidEmail = (email: string) => {
        const trimmed = email.trim().toLowerCase();
        // Must match standard email format
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return false;
        // Must have a real-looking domain (not single-char domains)
        const domain = trimmed.split('@')[1];
        if (!domain || domain.length < 4) return false;
        // Block obviously fake TLDs
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

        setLoading(true);

        try {
            if (isSignUp) {
                const signUpData = await signUp(email, password);
                // If user is auto-confirmed (no email confirmation required), log them in directly
                if (signUpData.session) {
                    router.push('/dashboard');
                    router.refresh();
                } else {
                    // Auto sign-in after signup
                    try {
                        await signIn(email, password);
                        router.push('/dashboard');
                        router.refresh();
                    } catch {
                        setSuccess('Account created! You can now log in.');
                        setIsSignUp(false);
                    }
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
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <div className="login-card">
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h1 className="section-header__title">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="section-header__subtitle">
                        {isSignUp
                            ? 'Sign up to track your progress'
                            : 'Log in to your OlympiadAI account'}
                    </p>
                </div>

                {error && <div className="importer-error" style={{ maxWidth: '100%', margin: '0 0 0.75rem' }}>{error}</div>}
                {success && <div className="importer-success" style={{ maxWidth: '100%', margin: '0 0 0.75rem' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="input-group">
                            <label className="input-group__label">Email</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-group__label">Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn--primary btn--lg"
                            disabled={loading}
                            style={{ width: '100%', marginTop: '0.25rem' }}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner" />
                                    {isSignUp ? 'Creating account...' : 'Logging in...'}
                                </>
                            ) : isSignUp ? 'Sign Up' : 'Log In'}
                        </button>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {isSignUp ? (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="login-toggle"
                                onClick={() => { setIsSignUp(false); setError(null); setSuccess(null); }}
                            >
                                Log in
                            </button>
                        </>
                    ) : (
                        <>
                            Don&apos;t have an account?{' '}
                            <button
                                type="button"
                                className="login-toggle"
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
