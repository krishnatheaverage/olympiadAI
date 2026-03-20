import Link from 'next/link';

const tracks = [
  {
    key: 'math',
    icon: '🧮',
    title: 'Math Olympiad',
    desc: 'AMC, AIME, and USAMO preparation. Master advanced problem-solving across algebra, number theory, geometry, and combinatorics.',
  },
  {
    key: 'chemistry',
    icon: '⚗️',
    title: 'Chemistry Olympiad',
    desc: 'USNCO Local and National Exam preparation covering thermodynamics, kinetics, equilibrium, organic chemistry, spectroscopy, and lab techniques.',
  },
  {
    key: 'physics',
    icon: '⚛️',
    title: 'Physics Olympiad',
    desc: 'F=ma and USAPhO preparation covering mechanics, electricity & magnetism, thermodynamics, waves, and modern physics.',
  },
];

const features = [
  {
    icon: '🎯',
    title: 'Smart Roadmaps',
    desc: 'AI-generated training plans tailored to your goal and current skill level.',
  },
  {
    icon: '🤖',
    title: 'AI Tutor',
    desc: 'Step-by-step guidance that teaches you HOW to think, not just what the answer is.',
  },
  {
    icon: '📚',
    title: 'Real Contest Problems',
    desc: 'Practice with authentic problems from AMC, AIME, USAMO, USNCO, F=ma, and USAPhO contests.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    desc: 'Track your improvement over time with detailed analytics and performance insights.',
  },
];

export default function HomePage() {
  return (
    <div className="page-container">
      {/* Hero */}
      <section className="hero">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          AI-Powered Training Platform
        </div>

        <h1 className="hero__title">
          Train Smarter for{' '}
          <span className="hero__title-gradient">Every Olympiad</span>
        </h1>

        <p className="hero__subtitle">
          Master Math, Chemistry, and Physics with AI-guided practice,
          personalized roadmaps, and real contest problems.
        </p>

        <div className="hero__actions">
          <Link href="/trainer" className="btn btn--primary btn--lg">
            Start Training →
          </Link>
        </div>
      </section>

      {/* Track Selection */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="section-header__title">Choose Your Track</h2>
          <p className="section-header__subtitle">
            Select a competition track to start your training journey
          </p>
        </div>

        <div className="tracks-grid">
          {tracks.map((track) => (
            <Link href={`/trainer?track=${track.key}`} key={track.key}>
              <div className={`track-card track-card--${track.key}`}>
                <div className="track-card__icon">{track.icon}</div>
                <h3 className="track-card__title">{track.title}</h3>
                <p className="track-card__desc">{track.desc}</p>
                <div className="track-card__arrow">→</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="section-header__title">Why OlympiadAI?</h2>
          <p className="section-header__subtitle">
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
    </div>
  );
}
