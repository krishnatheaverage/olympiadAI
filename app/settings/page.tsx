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
                // Notify navbar to update display name
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
                <h2>Please Log In</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>You need to be logged in to view settings.</p>
                <Link href="/login" className="btn btn--primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Go to Login
                </Link>
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
        math: '🧮 Math Olympiad',
        chemistry: '⚗️ Chemistry Olympiad',
        physics: '⚛️ Physics Olympiad',
        usaco: '💻 Coding Olympiad',
    };

    return (
        <div className="page-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="section-header">
                <h1 className="section-header__title">Settings</h1>
                <p className="section-header__subtitle">
                    Manage your account and preferences
                </p>
            </div>

            {/* Profile Section */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Profile
                </h3>
                <form onSubmit={handleUpdateUsername} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                        <div style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            background: saveMessage.includes('Failed') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: saveMessage.includes('Failed') ? '#f87171' : '#34d399',
                            border: `1px solid ${saveMessage.includes('Failed') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                        }}>
                            {saveMessage}
                        </div>
                    )}
                </form>
            </div>

            {/* Current Goal */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Current Goal
                </h3>
                {profile?.target_track && profile?.target_goal ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Track</span>
                            <span style={{ fontWeight: 600 }}>{trackLabels[profile.target_track] || profile.target_track}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Goal</span>
                            <span style={{ fontWeight: 600 }}>{profile.target_goal}</span>
                        </div>
                        <Link href="/roadmap" className="btn btn--secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Update My Goal
                        </Link>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>No goal set yet.</p>
                        <Link href="/roadmap" className="btn btn--primary" style={{ width: '100%' }}>
                            Set My Goal
                        </Link>
                    </div>
                )}
            </div>

            {/* Account Actions */}
            <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Account
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button onClick={handleChangePassword} className="btn btn--secondary" style={{ width: '100%' }}>
                        Change Password
                    </button>
                    <button onClick={handleLogout} className="btn btn--ghost" style={{ width: '100%', color: '#f87171' }}>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
