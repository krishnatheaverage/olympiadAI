'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase, fetchProfile } from '@/lib/supabase';
import { signOut } from '@/lib/auth';

const navLinks = [
  { href: '/', label: 'Home', num: '01' },
  { href: '/dashboard', label: 'Dashboard', num: '02' },
  { href: '/trainer', label: 'Trainer', num: '03' },
  { href: '/roadmap', label: 'Roadmap', num: '04' },
  { href: '/settings', label: 'Settings', num: '05' },
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

  const getFirstLetter = (name: string | null) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="relative z-30 mx-auto flex w-full max-w-[1320px] items-center justify-between px-6 pt-7 pb-4">
      {/* Brand logo */}
      <Link href="/" className="rise flex items-center gap-3" style={{ '--d': '60ms' } as React.CSSProperties}>
        <svg width="34" height="34" viewBox="0 0 34 34" className="shrink-0">
          <circle cx="17" cy="17" r="15.5" fill="none" stroke="var(--cream)" strokeOpacity="0.55" />
          <circle cx="17" cy="17" r="10"   fill="none" stroke="var(--cream)" strokeOpacity="0.35" />
          <circle cx="17" cy="17" r="4.5"  fill="none" stroke="var(--cream)" strokeOpacity="0.85" />
          <circle cx="26" cy="9"  r="2.4"  fill="var(--amber)" />
        </svg>
        <div className="leading-tight">
          <div className="mono text-[12px] tracking-[0.2em] text-[color:var(--cream-dim)]">OLYMPIAD</div>
          <div className="italic-serif -mt-0.5 text-[22px] text-[color:var(--cream)]">ai<span className="text-[color:var(--amber)]">.</span></div>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <ul className="rise hidden items-center gap-9 md:flex" style={{ '--d': '160ms' } as React.CSSProperties}>
        {navLinks.map((link) => {
          const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <li key={link.href} className="group cursor-pointer">
              <Link href={link.href} className="block">
                <div className="flex items-baseline gap-2">
                  <span className={`mono text-[10px] ${active ? 'text-[color:var(--amber)]' : 'text-[color:var(--cream-mt)]'}`}>{link.num}</span>
                  <span className={`text-[15px] transition-colors ${active ? 'text-[color:var(--cream)] font-medium' : 'text-[color:var(--cream-dim)] group-hover:text-[color:var(--cream)]'}`}>{link.label}</span>
                </div>
                <div className={`mt-1 h-px bg-[color:var(--amber)] transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Auth Panel / Actions */}
      <div className="rise flex items-center gap-3" style={{ '--d': '240ms' } as React.CSSProperties}>
        {/* Mobile Toggle Button */}
        <button
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--cream)]/15 text-[color:var(--cream-dim)] transition-colors hover:text-[color:var(--cream)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          ) : (
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 2h14M1 6h14M1 10h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          )}
        </button>

        {displayName ? (
          <div className="flex items-center gap-3">
            <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-[color:var(--cream)]/15 text-[color:var(--cream-dim)] transition-colors hover:text-[color:var(--cream)] sm:inline-flex" aria-label="Notifications">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M8 2a4 4 0 00-4 4v2.5L3 11h10l-1-2.5V6a4 4 0 00-4-4zM6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center gap-2.5 rounded-full border border-[color:var(--cream)]/15 bg-[color:var(--ink-850)]/60 py-1 pl-1 pr-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full mono text-[11px] text-[color:var(--ink-900)] font-bold"
                    style={{ background: 'linear-gradient(135deg, var(--amber), oklch(0.55 0.12 50))' }}>
                {getFirstLetter(displayName)}
              </span>
              <span className="mono text-[12px] tracking-[0.06em] text-[color:var(--cream)] truncate max-w-[90px]">{displayName}</span>
              <button 
                onClick={handleLogout}
                className="mono text-[10px] text-[color:var(--cream-mt)] hover:text-red-400 transition-colors ml-1 cursor-pointer"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="btn-amber text-xs font-semibold px-4 py-2 rounded-full transition-all inline-flex items-center justify-center"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Drawer menu */}
      {mobileOpen && (
        <div className="absolute top-20 left-6 right-6 z-40 md:hidden surface rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <li key={link.href} className="border-b hairline pb-2 last:border-0 last:pb-0">
                  <Link href={link.href} className="flex justify-between items-center py-1">
                    <span className={`text-[15px] ${active ? 'text-[color:var(--cream)] font-bold' : 'text-[color:var(--cream-dim)]'}`}>{link.label}</span>
                    <span className="mono text-[10px] text-[color:var(--cream-mt)]">{link.num}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
