import Link from 'next/link';

const tracks = [
  {
    key: 'math',
    title: 'Math Olympiad',
    desc: 'AMC, AIME, and USAMO preparation. Master advanced problem-solving across algebra, number theory, geometry, and combinatorics.',
    icon: 'M',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    glow: 'rgba(99, 102, 241, 0.15)',
  },
  {
    key: 'chemistry',
    title: 'Chemistry Olympiad',
    desc: 'USNCO Local and National Exam preparation covering thermodynamics, kinetics, equilibrium, organic chemistry, and more.',
    icon: 'C',
    gradient: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    glow: 'rgba(20, 184, 166, 0.15)',
  },
  {
    key: 'physics',
    title: 'Physics Olympiad',
    desc: 'F=ma and USAPhO preparation covering mechanics, electricity & magnetism, thermodynamics, waves, and modern physics.',
    icon: 'P',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    glow: 'rgba(249, 115, 22, 0.15)',
  },
];

const features = [
  {
    title: 'Smart Roadmaps',
    desc: 'AI-generated training plans tailored to your goal and current skill level.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    ),
  },
  {
    title: 'AI Tutor',
    desc: 'Step-by-step guidance that teaches you how to think, not just what the answer is.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    ),
  },
  {
    title: 'Real Contest Problems',
    desc: 'Practice with authentic problems from AMC, AIME, USNCO, F=ma, and USAPhO.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    ),
  },
  {
    title: 'Progress Tracking',
    desc: 'Track your improvement over time with detailed analytics and performance insights.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    ),
  },
];

const stats = [
  { value: '1,800+', label: 'Contest Problems' },
  { value: '3', label: 'Olympiad Tracks' },
  { value: 'AI', label: 'Powered Tutoring' },
  { value: '24/7', label: 'Available' },
];

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          AI-Powered Training Platform
        </div>

        <h1 className="hero__title">
          Train Smarter<br />
          for <span className="hero__title-gradient">Every Olympiad</span>
        </h1>

        <p className="hero__subtitle">
          Master Math, Chemistry, and Physics with AI-guided practice,
          personalized roadmaps, and real contest problems.
        </p>

        <div className="hero__actions">
          <Link href="/trainer" className="btn btn--hero">
            Start Training
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
          <Link href="/roadmap" className="btn btn--ghost-hero">
            Set Your Goal
          </Link>
        </div>

        {/* Stats bar */}
        <div className="hero__stats">
          {stats.map((s, i) => (
            <div className="hero__stat" key={i}>
              <span className="hero__stat-value">{s.value}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tracks */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Choose Your Track</h2>
          <p className="section__subtitle">
            Select a competition track to start your training journey
          </p>
        </div>

        <div className="tracks-grid">
          {tracks.map((track) => (
            <Link href={`/trainer?track=${track.key}`} key={track.key}>
              <div className={`track-card track-card--${track.key}`}>
                <div className="track-card__icon-wrap" style={{ background: track.gradient }}>
                  <span className="track-card__icon-letter">{track.icon}</span>
                </div>
                <h3 className="track-card__title">{track.title}</h3>
                <p className="track-card__desc">{track.desc}</p>
                <div className="track-card__arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
                <div className="track-card__glow" style={{ background: track.glow }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Why OlympiadAI?</h2>
          <p className="section__subtitle">
            Everything you need to reach the next level
          </p>
        </div>

        <div className="features__grid">
          {features.map((feature, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-card__title">Ready to level up?</h2>
          <p className="cta-card__desc">
            Join students training for AMC, AIME, USNCO, F=ma, and more.
          </p>
          <Link href="/login" className="btn btn--hero">
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
