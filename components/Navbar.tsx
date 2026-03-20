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
        // Try to get username from profile
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

    // Close mobile menu on navigation
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Listen for profile updates (e.g. username change in settings)
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
        <nav className="navbar">
            <Link href="/" className="navbar__logo">
                <span className="navbar__logo-icon">⚡</span>
                <span>OlympiadAI</span>
            </Link>

            <button
                className="navbar__mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation menu"
            >
                {mobileOpen ? '✕' : '☰'}
            </button>

            <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`navbar__link ${pathname === link.href ? 'navbar__link--active' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}

                {displayName ? (
                    <div className="navbar__user">
                        <span className="navbar__user-email">{displayName}</span>
                        <button className="navbar__logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className={`navbar__link navbar__link--login ${pathname === '/login' ? 'navbar__link--active' : ''}`}
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
