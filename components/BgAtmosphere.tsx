'use client';

export default function BgAtmosphere() {
  return (
    <>
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <svg className="pointer-events-none absolute -right-40 top-[120px] z-0 opacity-[0.18]"
           width="780" height="780" viewBox="0 0 780 780" fill="none" aria-hidden="true">
        {[80, 170, 260, 350].map((r, i) => (
          <circle key={i} cx="390" cy="390" r={r} stroke="oklch(0.95 0.02 80)" strokeOpacity={0.35 - i * 0.06} />
        ))}
        <line x1="0" x2="780" y1="390" y2="390" stroke="oklch(0.95 0.02 80 / 0.18)" />
        <line x1="390" x2="390" y1="0" y2="780" stroke="oklch(0.95 0.02 80 / 0.18)" />
        <circle cx="600" cy="220" r="5" fill="var(--amber)" />
      </svg>
    </>
  );
}
