import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import BgAtmosphere from '@/components/BgAtmosphere';
import Footer from '@/components/Footer';

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
      <head />
      <body className="bg-stage bg-noise relative min-h-screen overflow-x-hidden flex flex-col antialiased">
        <BgAtmosphere />
        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <Navbar />
          <main className="flex-1 w-full pt-4 md:pt-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
