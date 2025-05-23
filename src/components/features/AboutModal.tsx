import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--brutalist-yellow)] text-md bg-opacity-30 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--background)] border-2 border-[var(--ui-border)] brutalist-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
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
              <h2 className="text-xl font-bold text-[var(--foreground)]">About Hyperlocal</h2>
            </div>
            <button
              onClick={onClose}
              className="brutalist-chip bg-[var(--brutalist-gray)] text-white px-2 py-1 cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="prose prose-md dark:prose-invert max-w-none">
            <p className="font-bold">
              Hyperlocal is a real-time AI-powered chat interface that answers user questions about local disruptions across cities worldwide using live web data.
            </p>

            <h3 className="mt-6 mb-2 text-[var(--brutalist-purple)]">Capabilities</h3>
            <div className="bg-[var(--ui-bubble-user)] border-2 border-[var(--ui-border)] brutalist-border p-4 mb-4">
              <ul className="list-none pl-0 space-y-2 font-bold">
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-[var(--brutalist-red)] mr-2 mt-1"></span>
                  <span>Traffic delays and road closures</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-[var(--brutalist-yellow)] mr-2 mt-1"></span>
                  <span>Public transport interruptions</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-[var(--brutalist-green)] mr-2 mt-1"></span>
                  <span>Protests and public events</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-[var(--brutalist-purple)] mr-2 mt-1"></span>
                  <span>Weather events and alerts</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-[var(--brutalist-gray)] mr-2 mt-1"></span>
                  <span>Construction projects</span>
                </li>
              </ul>
            </div>

            <h3 className="mt-6 mb-2 text-[var(--brutalist-green)]">Usage Instructions</h3>
            <p className="font-bold mb-2">
              Simply ask a question about disruptions in a specific city or area:
            </p>
            <div className="bg-[var(--ui-bubble-user)] text-sm border-2 border-[var(--ui-border)] brutalist-border p-4 mb-4">
              <p className="m-0 font-mono">"Are there any road closures in downtown Chicago?"</p>
              <p className="m-0 font-mono">"What's causing delays at London Heathrow Airport?"</p>
              <p className="m-0 font-mono">"Is the metro running on time in Paris?"</p>
            </div>

            <h3 className="mt-6 mb-2 text-[var(--brutalist-red)]">Project Information</h3>
            <p className="font-bold">
              Hyperlocal was built for the Bright Data Real-Time AI Agents Hackathon. It leverages Bright Data MCP to power an LLM-based intelligent agent capable of discovering relevant pages across the web, accessing complex pages, extracting structured real-time data, and interacting with dynamic content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
