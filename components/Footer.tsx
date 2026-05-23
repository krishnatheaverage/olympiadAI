'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mx-auto mt-20 max-w-[1320px] w-full px-8 pb-12 z-10">
      <div className="rise flex flex-col items-start justify-between gap-6 border-t hairline pt-8 md:flex-row md:items-center" style={{ '--d': '300ms' } as React.CSSProperties}>
        <Link href="/" className="italic-serif text-[26px] leading-none text-[color:var(--cream)] hover:opacity-80 transition-opacity">
          olympiad<span className="text-[color:var(--amber)]">ai</span>
          <span className="text-[color:var(--cream-mt)]">.</span>
        </Link>
        <div className="mono text-[11px] tracking-[0.16em] text-[color:var(--cream-mt)]">
          AMC · AIME · USAMO · USAPhO · USNCO · F=ma
        </div>
        <div className="flex items-center gap-5 text-[13px] text-[color:var(--cream-dim)]">
          <Link href="/dashboard" className="hover:text-[color:var(--cream)] transition-colors">Dashboard</Link>
          <Link href="/trainer"   className="hover:text-[color:var(--cream)] transition-colors">Trainer</Link>
          <Link href="/roadmap"   className="hover:text-[color:var(--cream)] transition-colors">Roadmap</Link>
          <Link href="/settings"  className="hover:text-[color:var(--cream)] transition-colors">Settings</Link>
        </div>
      </div>
    </footer>
  );
}
