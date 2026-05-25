'use client';

import Link from 'next/link';

function HeroCopy() {
  return (
    <div className="relative z-20 max-w-[640px]">
      <div className="rise flex items-center gap-3" style={{ '--d': '320ms' } as React.CSSProperties}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-[color:var(--amber)] pulse-dot" />
          <span className="relative h-2 w-2 rounded-full bg-[color:var(--amber)]" />
        </span>
        <span className="chip text-xs">AMC · AIME · USAMO · USAPhO · USNCO · F=ma</span>
      </div>

      <h1 className="rise mt-7 text-[clamp(44px,6.8vw,92px)] font-normal leading-[0.94] tracking-[-0.02em] text-[color:var(--cream)]"
          style={{ '--d': '420ms', fontFamily: '"Newsreader", serif' } as React.CSSProperties}>
        <span className="italic-serif font-light">Personal</span> coaching
        <br />
        for the US olympiads<span className="text-[color:var(--amber)]">.</span>
      </h1>

      <p className="rise mt-7 max-w-[520px] text-[17.5px] leading-[1.6] text-[color:var(--cream-dim)] font-light"
         style={{ '--d': '560ms' } as React.CSSProperties}>
        OlympiadAI is a daily training tool for high‑school students
        preparing for the AMC, AIME, USAMO, USAPhO, USNCO and F=ma —
        built around the official syllabi, past contest problems, and
        step‑by‑step solutions that meet you where you're stuck.
      </p>

      <div className="rise mt-9 flex flex-wrap items-center gap-4.5" style={{ '--d': '700ms' } as React.CSSProperties}>
        <Link href="/trainer" className="btn-primary inline-flex items-center gap-3 rounded-full px-7 py-4 text-[15px] font-semibold text-[color:var(--ink-900)]">
          <span>Start Training</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <Link href="/dashboard" className="btn-ghost inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-medium text-[color:var(--cream)]">
          <span>Go to Dashboard</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>

      <div className="rise mt-10 flex items-center gap-6 text-[13px] text-[color:var(--cream-mt)]"
           style={{ '--d': '820ms' } as React.CSSProperties}>
        <div className="flex -space-x-2">
          {['#caa078','#7da9b8','#b97f5d','#9ab38f'].map((c,i) => (
            <span key={i} className="h-7 w-7 rounded-full ring-2 ring-[color:var(--ink-900)]"
                  style={{ background: `linear-gradient(135deg, ${c}, oklch(0.18 0.035 240))` }} />
          ))}
        </div>
        <div className="leading-tight">
          <div className="text-[color:var(--cream)] font-medium">100% free · every track, every problem, every hint</div>
          <div className="font-mono text-[10.5px] text-[color:var(--cream-mt)] mt-0.5">No accounts gated · no paywalls · no ads</div>
        </div>
      </div>
    </div>
  );
}

function HintBubble() {
  return (
    <div className="float-in persist-hover surface absolute left-[-28px] top-[24px] w-[280px] rounded-2xl p-4 border border-[color:var(--cream)]/10"
         style={{ '--d': '900ms', '--rot': '-3.2deg' } as React.CSSProperties}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, var(--amber), oklch(0.35 0.08 50))' }} />
          <div className="font-mono text-[9px] tracking-[0.2em] text-[color:var(--cream-dim)]">COACH · HINT 02</div>
        </div>
        <div className="font-mono text-[9px] text-[color:var(--cream-mt)]">USAMO '21 · P4</div>
      </div>
      <p className="mt-3 text-[13.5px] leading-[1.5] text-[color:var(--cream)] font-light">
        You factored <span className="italic-serif">n² − 1</span>. Good.
        Now ask — <span className="text-[color:var(--amber)]">what does that force about the parity of </span>
        <span className="italic-serif">k</span>?
      </p>
      <div className="mt-3.5 flex items-center gap-2">
        <button className="rounded-full border border-[color:var(--amber)] px-3 py-1 font-mono text-[9px] tracking-[0.1em] text-[color:var(--amber)] cursor-pointer">SHOW NEXT</button>
        <button className="rounded-full border border-[color:var(--cream)]/20 px-3 py-1 font-mono text-[9px] tracking-[0.1em] text-[color:var(--cream-dim)] cursor-pointer">I'VE GOT IT</button>
      </div>
    </div>
  );
}

function ProblemCard() {
  return (
    <div className="float-in persist-hover surface absolute right-[-12px] top-[-8px] w-[330px] overflow-hidden rounded-2xl border border-[color:var(--cream)]/10"
         style={{ '--d': '1150ms', '--rot': '2.4deg' } as React.CSSProperties}>
      <div className="relative">
        <div className="scan-bar" />
        <div className="flex items-center justify-between border-b hairline px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)]" />
            <span className="font-mono text-[9px] tracking-[0.18em] text-[color:var(--cream-dim)]">P3 · COMBINATORICS</span>
          </div>
          <span className="font-mono text-[9px] text-[color:var(--cream-mt)]">04:18</span>
        </div>
        <div className="px-4 py-4">
          <div className="text-[13px] leading-[1.5] text-[color:var(--cream)] font-light">
            Let <span className="italic-serif text-sm">S</span> be a set of <span className="font-mono text-xs">2025</span> positive integers
            such that for every pair <span className="italic-serif text-sm">a, b</span> ∈ <span className="italic-serif text-sm">S</span>,
            the quantity:
          </div>
          <div className="my-3 rounded-lg border border-[color:var(--cream)]/5 bg-[color:var(--ink-900)]/60 px-3 py-3 text-center italic-serif text-[18px] text-[color:var(--cream)] font-light">
            ⌊ a²⁄b ⌋ + ⌊ b²⁄a ⌋
          </div>
          <div className="text-[13px] leading-[1.5] text-[color:var(--cream-dim)] font-light">
            is divisible by <span className="italic-serif text-[color:var(--cream)] text-sm">a + b</span>. Prove that
            <span className="italic-serif text-[color:var(--cream)] text-sm"> S</span> contains at most…
          </div>
        </div>
        <div className="flex items-center justify-between border-t hairline px-4 py-2 bg-[color:var(--ink-900)]/20">
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <span key={i} className={`h-1 w-5 rounded-full ${i<=4 ? 'bg-[color:var(--amber)]' : 'bg-[color:var(--cream)]/15'}`} />
            ))}
          </div>
          <span className="font-mono text-[9px] text-[color:var(--cream-mt)]">DIFFICULTY 8.4</span>
        </div>
      </div>
    </div>
  );
}

function ProgressCard() {
  return (
    <div className="float-in persist-hover surface absolute right-[40px] bottom-[-20px] w-[300px] rounded-2xl p-4 border border-[color:var(--cream)]/10"
         style={{ '--d': '1400ms', '--rot': '-1.8deg' } as React.CSSProperties}>
      <div className="flex items-baseline justify-between">
        <div>
          <div className="font-mono text-[9px] tracking-[0.2em] text-[color:var(--cream-dim)]">7‑DAY ACCURACY</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="italic-serif text-[38px] leading-none text-[color:var(--cream)]">71<span className="text-[color:var(--amber)]">%</span></span>
            <span className="font-mono text-[10px] text-[color:var(--chalk)]">▲ 12.4</span>
          </div>
        </div>
        <div className="text-right font-mono text-[9px] text-[color:var(--cream-mt)]">
          <div>P‑SOLVED · 47</div>
          <div className="mt-0.5">STREAK · 19D</div>
        </div>
      </div>

      <svg viewBox="0 0 280 70" className="spark mt-3 h-[70px] w-full">
        <defs>
          <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="var(--amber)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0,1,2,3].map(i => (
          <line key={i} x1="0" x2="280" y1={10 + i*18} y2={10 + i*18} stroke="oklch(0.95 0.02 80 / 0.06)" />
        ))}
        <path className="draw" d="M0,55 L28,50 L56,52 L84,40 L112,44 L140,30 L168,34 L196,22 L224,26 L252,14 L280,18"
              fill="none" stroke="var(--amber)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0,55 L28,50 L56,52 L84,40 L112,44 L140,30 L168,34 L196,22 L224,26 L252,14 L280,18 L280,70 L0,70 Z"
              fill="url(#sparkFill)" opacity="0.9" />
        {[[28,50],[112,44],[196,22],[280,18]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill="var(--ink-900)" stroke="var(--amber)" strokeWidth="1.4" />
        ))}
      </svg>
    </div>
  );
}

function StreakChip() {
  return (
    <div className="float-in persist-hover surface absolute left-[40px] bottom-[60px] rounded-full px-4 py-2 border border-[color:var(--cream)]/10"
         style={{ '--d': '1650ms', '--rot': '4deg' } as React.CSSProperties}>
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" className="flicker">
          <path d="M9 1c1 3 4 4 4 8a4 4 0 11-8 0c0-2 1-3 2-4-1 3 1 4 2 4 0-2-1-4 0-8z"
                fill="var(--amber)" stroke="var(--amber-dim)" strokeWidth="0.6" />
        </svg>
        <div className="font-mono text-[10.5px] tracking-[0.08em] text-[color:var(--cream)]">
          19 <span className="text-[color:var(--cream-mt)]">days</span> · longest 34
        </div>
      </div>
    </div>
  );
}

function ConstellationBackdrop() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 540" fill="none" aria-hidden="true">
      <g stroke="oklch(0.95 0.02 80 / 0.14)" strokeWidth="1">
        <path className="draw" d="M70 120 L210 80 L330 180 L420 100 L470 260 L360 360 L220 320 L130 410 L60 320 Z" />
      </g>
      {[
        [70,120],[210,80],[330,180],[420,100],[470,260],[360,360],[220,320],[130,410],[60,320]
      ].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="oklch(0.95 0.02 80 / 0.45)" />
      ))}
      <circle cx="420" cy="100" r="6" fill="none" stroke="var(--amber)" strokeWidth="1" />
      <circle cx="420" cy="100" r="2.4" fill="var(--amber)" />
    </svg>
  );
}

function FloatingCluster() {
  return (
    <div className="relative z-10 hidden h-[520px] lg:block w-full">
      <ConstellationBackdrop />
      <HintBubble />
      <ProblemCard />
      <ProgressCard />
      <StreakChip />
    </div>
  );
}

function TrustBanner() {
  const items = [
    ['1,800+',       'contest problems · in library'],
    ['6',            'olympiad tracks · AMC → F=ma'],
    ['30 yrs',       'of past papers · indexed'],
    ['Step‑by‑step', 'solutions · every problem'],
    ['LaTeX',        'native rendering · in‑browser'],
    ['Free',         'forever · no paywalls'],
  ];
  
  const row = (
    <div className="marquee-track items-center text-[color:var(--cream-dim)] py-1">
      {[...items, ...items].map(([n, l], i) => (
        <div key={i} className="flex items-baseline gap-3 whitespace-nowrap">
          <span className="italic-serif text-[28px] leading-none text-[color:var(--cream)]">{n}</span>
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase">{l}</span>
          <span className="ml-8 inline-block h-1 w-1 rounded-full bg-[color:var(--amber)]" />
        </div>
      ))}
    </div>
  );
  
  return (
    <section className="relative mt-24 border-y hairline py-7 overflow-hidden"
             style={{ background: 'linear-gradient(180deg, oklch(0.18 0.035 240 / 0.4), transparent)' }}>
      <div className="rise" style={{ '--d': '1100ms' } as React.CSSProperties}>{row}</div>
    </section>
  );
}

function Features() {
  const cards = [
    {
      tag: '01 · CURRICULUM',
      title: "Built around the exam you're sitting.",
      body: "AMC 10/12, AIME, USAMO, USAPhO, USNCO and F=ma — each track is organized around the official syllabi and indexed against three decades of past problems.",
    },
    {
      tag: '02 · COACH',
      title: "Hints that meet you where you're stuck.",
      body: "Type your work into the editor and the AI coach finds the line where your reasoning slipped, then asks the smallest possible question to nudge you forward.",
    },
    {
      tag: '03 · ROADMAP',
      title: "A study path you can actually see.",
      body: "Pick a target contest and a date. Your weekly plan reshapes around the topics that move your score most — algebra, combinatorics, mechanics, kinetics.",
    },
  ];
  return (
    <section className="relative mx-auto mt-20 max-w-[1320px] px-8 w-full z-10">
      <div className="rise grid grid-cols-1 gap-6 md:grid-cols-3" style={{ '--d': '1200ms' } as React.CSSProperties}>
        {cards.map((c, i) => (
          <article key={i} className="group surface relative overflow-hidden rounded-2xl p-7 border border-[color:var(--cream)]/10">
            <div className="chip">{c.tag}</div>
            <h3 className="italic-serif mt-5 text-[30px] leading-[1.05] text-[color:var(--cream)] font-normal">{c.title}</h3>
            <p className="mt-4 text-[14.5px] leading-[1.6] text-[color:var(--cream-dim)] font-light">{c.body}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-mono text-[11px] text-[color:var(--cream-mt)] font-semibold uppercase tracking-wider">Read more</span>
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none"
                   className="text-[color:var(--cream-dim)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[color:var(--amber)]">
                <path d="M1 7h19M14 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full"
                  style={{ background: 'radial-gradient(circle, oklch(0.78 0.155 62 / 0.16), transparent 70%)' }} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="w-full">
      <main className="relative mx-auto max-w-[1320px] px-8 pt-10 z-10">
        {/* meta line above hero */}
        <div className="rise mb-10 flex flex-col sm:flex-row justify-between gap-2 text-[color:var(--cream-mt)]"
             style={{ '--d': '280ms' } as React.CSSProperties}>
          <div className="font-mono text-[10.5px] tracking-[0.2em] font-semibold">
            <span className="text-[color:var(--amber)]">●</span> &nbsp;LIVE &nbsp;·&nbsp; ALL TRACKS OPEN
          </div>
          <div className="font-mono text-[10.5px] tracking-[0.2em] font-semibold">
            AI COACHING FOR HIGH‑SCHOOL STEM OLYMPIADS
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <HeroCopy />
          <FloatingCluster />
        </div>

        {/* horizontal scale ruler under hero */}
        <div className="rise mt-16 flex items-end justify-between border-t hairline pt-3"
             style={{ '--d': '900ms' } as React.CSSProperties}>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[9px] tracking-[0.22em] text-[color:var(--cream-mt)] font-semibold uppercase">SCROLL</span>
            <span className="font-mono text-[9px] text-[color:var(--cream-mt)]">↓</span>
          </div>
          <div className="hidden sm:flex items-end gap-[3px]">
            {Array.from({length: 40}).map((_,i) => (
              <span key={i}
                    className="block w-[1px] bg-[color:var(--cream)]/20"
                    style={{ height: i % 5 === 0 ? 14 : 7 }} />
            ))}
          </div>
          <div className="font-mono text-[9px] tracking-[0.22em] text-[color:var(--cream-mt)] font-semibold uppercase">
            01 / 05 &nbsp;·&nbsp; LANDING
          </div>
        </div>
      </main>

      <TrustBanner />
      <Features />
    </div>
  );
}
