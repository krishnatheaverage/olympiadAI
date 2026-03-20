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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
                setSuccess('Account created! Check your email to confirm, then log in.');
                setIsSignUp(false);
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
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="section-header__title">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="section-header__subtitle">
                        {isSignUp
                            ? 'Sign up to track your progress'
                            : 'Log in to your OlympiadAI account'}
                    </p>
                </div>

                {error && <div className="importer-error" style={{ maxWidth: '100%', marginBottom: '1rem' }}>⚠️ {error}</div>}
                {success && <div className="importer-success" style={{ maxWidth: '100%', marginBottom: '1rem' }}>✅ {success}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="importer-field">
                            <label className="importer-field__label">Email</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="importer-field">
                            <label className="importer-field__label">Password</label>
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
                            style={{ width: '100%', marginTop: '0.5rem' }}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner" />
                                    {isSignUp ? 'Creating account...' : 'Logging in...'}
                                </>
                            ) : isSignUp ? (
                                '🚀 Sign Up'
                            ) : (
                                '🔑 Log In'
                            )}
                        </button>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
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
