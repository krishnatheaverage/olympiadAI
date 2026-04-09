'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase, fetchProfile } from '@/lib/supabase';
import { signOut } from '@/lib/auth';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/trainer', label: 'Trainer' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/settings', label: 'Settings' },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const loadDisplayName = async (email: string | undefined) => {
        if (!email) {
            setDisplayName(null);
            return;
        }
        try {
            const profile = await fetchProfile();
            if (profile?.username) {
                setDisplayName(profile.username);
                return;
            }
        } catch { /* ignore */ }
        setDisplayName(email);
    };

    useEffect(() => {
        if (!supabase) return;

        supabase.auth.getSession().then(({ data: { session } }) => {
            loadDisplayName(session?.user?.email);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            loadDisplayName(session?.user?.email);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleProfileUpdate = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.username) {
                setDisplayName(detail.username);
            }
        };
        window.addEventListener('profile-updated', handleProfileUpdate);
        return () => window.removeEventListener('profile-updated', handleProfileUpdate);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error('Logout error:', err);
        }
        setDisplayName(null);
        router.push('/');
        router.refresh();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-[#050507]/80 backdrop-blur-xl border-b border-white/[0.06]">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white hover:text-indigo-400 transition-colors">
                <span className="text-indigo-400">&#9889;</span>
                <span>OlympiadAI</span>
            </Link>

            <button
                className="md:hidden text-gray-400 hover:text-white text-xl"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation menu"
            >
                {mobileOpen ? '\u2715' : '\u2630'}
            </button>

            <div className={`${mobileOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-14 md:top-0 left-0 right-0 md:left-auto md:right-auto bg-[#050507] md:bg-transparent border-b md:border-0 border-white/[0.06] items-start md:items-center gap-1 md:gap-1 p-4 md:p-0`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            pathname === link.href
                                ? 'text-white bg-white/[0.08]'
                                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}

                {displayName ? (
                    <div className="flex items-center gap-3 ml-2 pl-3 border-l border-white/[0.08]">
                        <span className="text-sm text-gray-400 truncate max-w-[140px]">{displayName}</span>
                        <button
                            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className={`ml-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            pathname === '/login'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                        }`}
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
