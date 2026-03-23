'use client';

import { useEffect, useState } from 'react';
import { supabase, fetchProfile, updateProfile, Profile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [username, setUsername] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
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
        router.push('/login');
    };

    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage(null);
        try {
            const result = await updateProfile({ username });
            if (result) {
                setSaveMessage('Username updated!');
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

        const { error } = await supabase.auth.resetPasswordForEmail(
            user.email,
            { redirectTo: `${window.location.origin}/login` }
        );
        if (error) alert(error.message);
        else alert('Password reset email sent!');
    };

    if (!isLoggedIn) {
        return (
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2 className="section-header__title">Please Log In</h2>
                <p className="section-header__subtitle" style={{ marginBottom: '1rem' }}>You need to be logged in to view settings.</p>
                <Link href="/login" className="btn btn--hero" style={{ marginTop: '0.5rem' }}>Go to Login</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    const trackLabels: Record<string, string> = {
        math: 'Math Olympiad',
        chemistry: 'Chemistry Olympiad',
        physics: 'Physics Olympiad',
    };

    return (
        <div className="page-container" style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div className="section-header">
                <h1 className="section-header__title">Settings</h1>
                <p className="section-header__subtitle">
                    Manage your account and preferences
                </p>
            </div>

            {/* Profile */}
            <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card__title">Profile</div>
                <form onSubmit={handleUpdateUsername} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="input-group">
                        <label className="input-group__label">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                        />
                    </div>
                    <button type="submit" className="btn btn--primary" style={{ width: '100%' }} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Update Username'}
                    </button>
                    {saveMessage && (
                        <div className={saveMessage.includes('Failed') ? 'importer-error' : 'importer-success'}
                            style={{ maxWidth: '100%', margin: 0 }}>
                            {saveMessage}
                        </div>
                    )}
                </form>
            </div>

            {/* Current Goal */}
            <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card__title">Current Goal</div>
                {profile?.target_track && profile?.target_goal ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Track</span>
                            <span style={{ fontWeight: 600 }}>{trackLabels[profile.target_track] || profile.target_track}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Goal</span>
                            <span style={{ fontWeight: 600 }}>{profile.target_goal}</span>
                        </div>
                        <Link href="/roadmap" className="btn btn--secondary" style={{ width: '100%', marginTop: '0.25rem' }}>
                            Update My Goal
                        </Link>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>No goal set yet.</p>
                        <Link href="/roadmap" className="btn btn--primary" style={{ width: '100%' }}>
                            Set My Goal
                        </Link>
                    </div>
                )}
            </div>

            {/* Account */}
            <div className="card">
                <div className="card__title">Account</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={handleChangePassword} className="btn btn--secondary" style={{ width: '100%' }}>
                        Change Password
                    </button>
                    <button onClick={handleLogout} className="btn btn--ghost" style={{ width: '100%', color: 'var(--error)' }}>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
