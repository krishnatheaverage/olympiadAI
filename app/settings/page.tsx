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
            <div className="flex flex-col items-center justify-center pt-20 px-5">
                <h2 className="text-2xl font-bold text-white mb-2">Please Log In</h2>
                <p className="text-gray-400 mb-4">You need to be logged in to view settings.</p>
                <Link href="/login" className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-colors">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center pt-20">
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
        <div className="max-w-lg mx-auto px-5 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your account and preferences</p>
            </div>

            {/* Profile */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5 mb-3">
                <h3 className="text-sm font-semibold text-white mb-3">Profile</h3>
                <form onSubmit={handleUpdateUsername} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Username</label>
                        <input
                            type="text"
                            className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-gray-100 text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-colors"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                        />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-lg transition-colors disabled:opacity-50" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Update Username'}
                    </button>
                    {saveMessage && (
                        <div className={`px-3 py-2 rounded-lg text-sm ${saveMessage.includes('Failed') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
                            {saveMessage}
                        </div>
                    )}
                </form>
            </div>

            {/* Current Goal */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5 mb-3">
                <h3 className="text-sm font-semibold text-white mb-3">Current Goal</h3>
                {profile?.target_track && profile?.target_goal ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Track</span>
                            <span className="font-medium text-white">{trackLabels[profile.target_track] || profile.target_track}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Goal</span>
                            <span className="font-medium text-white">{profile.target_goal}</span>
                        </div>
                        <Link href="/roadmap" className="mt-1 w-full py-2.5 text-center bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.06] rounded-lg text-sm font-medium transition-colors">
                            Update My Goal
                        </Link>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-3">No goal set yet.</p>
                        <Link href="/roadmap" className="block w-full py-2.5 text-center bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-sm font-medium transition-colors">
                            Set My Goal
                        </Link>
                    </div>
                )}
            </div>

            {/* Account */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Account</h3>
                <div className="flex flex-col gap-2">
                    <button onClick={handleChangePassword} className="w-full py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.06] rounded-lg text-sm font-medium transition-colors">
                        Change Password
                    </button>
                    <button onClick={handleLogout} className="w-full py-2.5 bg-white/[0.02] hover:bg-red-500/10 text-red-400 border border-white/[0.06] hover:border-red-500/20 rounded-lg text-sm font-medium transition-colors">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
