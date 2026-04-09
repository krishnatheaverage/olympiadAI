import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'OlympiadAI — AI-Powered Olympiad Training',
  description:
    'Train for Math, Chemistry, Physics, and Coding Olympiads with AI-guided practice, personalized roadmaps, and real contest problems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050507] text-gray-100 antialiased">
        {/* Background effects */}
        <div className="bg-noise" />
        <div className="bg-glow bg-glow--top" />
        <div className="bg-glow bg-glow--orb1" />
        <div className="bg-glow bg-glow--orb2" />
        <div className="bg-vignette" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
