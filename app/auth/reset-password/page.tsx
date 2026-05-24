'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updatePassword } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sessionReady, setSessionReady] = useState<boolean | null>(null);

    // The user lands here after clicking the recovery link in their email.
    // The auth callback already exchanged the token for a session — verify
    // a session actually exists so we don't show a useless form to someone
    // who navigated here directly.
    useEffect(() => {
        if (!supabase) { setSessionReady(false); return; }
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSessionReady(!!session);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await updatePassword(password);
            setSuccess(true);
            // Brief pause so the user sees the success state, then dashboard.
            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not update password.');
        } finally {
            setLoading(false);
        }
    };

    if (sessionReady === false) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] px-5">
                <div className="surface w-full max-w-sm rounded-2xl p-8 border border-[color:var(--cream)]/10 text-center">
                    <h1 className="italic-serif text-3xl mb-3 text-[color:var(--cream)] font-normal">Link expired</h1>
                    <p className="text-sm text-[color:var(--cream-dim)] mb-6">
                        This password-reset link is invalid or has expired. Request a new one from the login page.
                    </p>
                    <Link href="/login" className="btn-amber inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold">
                        Back to login
                    </Link>
                </div>
            </div>
        );
    }

    if (sessionReady === null) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-5">
            <div className="surface w-full max-w-sm rounded-2xl p-8 border border-[color:var(--cream)]/10">
                <h1 className="italic-serif text-3xl mb-2 text-[color:var(--cream)] font-normal text-center">Set a new password</h1>
                <p className="text-sm text-[color:var(--cream-dim)] text-center mb-6">Choose a password you&apos;ll remember this time.</p>

                {success ? (
                    <div className="rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 text-sm text-center">
                        Password updated. Redirecting you to your dashboard…
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2.5 text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-medium text-[color:var(--cream-mt)] uppercase tracking-wider mb-1.5">New Password</label>
                            <input
                                type="password"
                                className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-gray-100 text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-colors"
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[color:var(--cream-mt)] uppercase tracking-wider mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                className={`w-full bg-[#0a0a0f] border rounded-lg px-3 py-2.5 text-gray-100 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-colors ${
                                    confirmPassword && confirmPassword !== password
                                        ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/25'
                                        : 'border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/25'
                                }`}
                                placeholder="Re-enter to confirm"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            {confirmPassword && confirmPassword !== password && (
                                <p className="mt-1 text-[11px] text-red-400">Passwords do not match.</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !password || password !== confirmPassword}
                            className="btn-amber w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating…' : 'Update password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
