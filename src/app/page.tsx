'use client';

import { useState, useEffect } from "react";
import ChatWindow from '@/components/features/ChatInterface/ChatWindow';
import AboutModal from '@/components/features/AboutModal';
import ComingSoonPage from '@/components/features/ComingSoonPage';

export default function Home() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  // Initialize with the environment variable value directly
  const [isLoading, setIsLoading] = useState(true);
  const [isComingSoon, setIsComingSoon] = useState(false);

  useEffect(() => {
    // Check the environment variable
    const comingSoonValue = process.env.NEXT_PUBLIC_COMING_SOON;
    setIsComingSoon(comingSoonValue === 'true');
    setIsLoading(false);
  }, []);

  // Show nothing during initial load to prevent flash
  if (isLoading) {
    return null;
  }

  // If the coming soon page is enabled, show it
  if (isComingSoon) {
    return <ComingSoonPage />;
  }

  // Otherwise, show the main app
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-[var(--background)]">
      <header className="max-w-[800px] mx-auto w-full mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="lightning-container" style={{ position: 'relative', width: '32px', height: '32px', marginRight: '-17px', marginTop: '12px' }}>
            <div style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '16px solid var(--brutalist-red)',
              transform: 'rotate(35deg)',
              top: '-2px',
              left: '4px'
            }}></div>
            <div style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '16px solid var(--brutalist-red)',
              transform: 'rotate(35deg)',
              top: '14px',
              left: '-4px'
            }}></div>
          </div>

          <h1 className="text-2xl font-bold text-[var(--foreground)]">Hyperlocal</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="text-sm px-3 py-1 brutalist-chip bg-[var(--brutalist-yellow)] text-black cursor-pointer"
          >
            About
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full">
        <ChatWindow />
      </main>

      <footer className="max-w-[800px] mx-auto w-full mt-8 pt-6 text-center text-sm font-bold">
        <p>built & designed by <a href="https://github.com/jeremysltn" target="_blank" className="text-[var(--brutalist-purple)] hover:text-[var(--brutalist-red)] hover:underline transition-colors relative inline-block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[var(--brutalist-purple)] after:bottom-0 after:left-0 hover:after:bg-[var(--brutalist-red)]">@jeremysltn</a> for the <a href="https://dev.to/challenges/brightdata-2025-05-07" className="text-[var(--brutalist-purple)] hover:text-[var(--brutalist-red)] hover:underline transition-colors relative inline-block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[var(--brutalist-purple)] after:bottom-0 after:left-0 hover:after:bg-[var(--brutalist-red)]">Bright Data Real-Time AI Agents Hackathon</a></p>
      </footer>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
}
