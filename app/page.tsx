import Link from 'next/link';

const tracks = [
  {
    key: 'math',
    title: 'Math Olympiad',
    desc: 'AMC, AIME, and USAMO preparation. Master advanced problem-solving across algebra, number theory, geometry, and combinatorics.',
    icon: 'M',
    gradient: 'from-blue-500 to-indigo-500',
    glow: 'group-hover:shadow-indigo-500/20',
  },
  {
    key: 'chemistry',
    title: 'Chemistry Olympiad',
    desc: 'USNCO Local and National Exam preparation covering thermodynamics, kinetics, equilibrium, organic chemistry, and more.',
    icon: 'C',
    gradient: 'from-green-500 to-teal-500',
    glow: 'group-hover:shadow-green-500/20',
  },
  {
    key: 'physics',
    title: 'Physics Olympiad',
    desc: 'F=ma and USAPhO preparation covering mechanics, electricity & magnetism, thermodynamics, waves, and modern physics.',
    icon: 'P',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'group-hover:shadow-amber-500/20',
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
    <div className="max-w-5xl mx-auto px-5 py-12">
      {/* Hero */}
      <section className="text-center py-16 md:py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI-Powered Training Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-5">
          Train Smarter<br />
          for <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Every Olympiad</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          Master Math, Chemistry, and Physics with AI-guided practice,
          personalized roadmaps, and real contest problems.
        </p>

        <div className="flex items-center justify-center gap-3 mb-12">
          <Link href="/trainer" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25">
            Start Training
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
          <Link href="/roadmap" className="px-6 py-3 text-gray-300 hover:text-white border border-white/[0.08] hover:border-white/[0.16] rounded-xl font-medium transition-all">
            Set Your Goal
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tracks */}
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Choose Your Track</h2>
          <p className="text-gray-400">Select a competition track to start your training journey</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {tracks.map((track) => (
            <Link href={`/trainer?track=${track.key}`} key={track.key} className="group">
              <div className={`relative bg-[#111118] border border-white/[0.06] rounded-xl p-6 transition-all hover:border-white/[0.12] hover:shadow-xl ${track.glow} overflow-hidden`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center text-white text-xl font-bold mb-4`}>
                  {track.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{track.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{track.desc}</p>
                <div className="mt-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Why OlympiadAI?</h2>
          <p className="text-gray-400">Everything you need to reach the next level</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-[#111118] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="text-center bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-10 md:p-14">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to level up?</h2>
          <p className="text-gray-400 mb-6">
            Join students training for AMC, AIME, USNCO, F=ma, and more.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25">
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
