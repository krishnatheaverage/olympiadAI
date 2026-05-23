import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'OlympiadAI: AI-Powered Olympiad Training',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
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
