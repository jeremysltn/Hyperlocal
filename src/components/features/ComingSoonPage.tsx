import React from 'react';

const ComingSoonPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
            <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
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

                <div className="bg-[var(--brutalist-yellow)] border-2 border-[var(--ui-border)] p-6 max-w-md brutalist-border mx-auto">
                    <p className="text-2xl font-bold text-black mb-2">Coming Soon</p>
                    <p className="text-lg text-black">
                        We're working on bringing you real-time disruption information for cities worldwide.
                    </p>
                </div>

                <div className="mt-8 flex space-x-3 justify-center">
                    <div className="h-4 w-4 bg-[var(--brutalist-red)] live-pulse"></div>
                    <div className="h-4 w-4 bg-[var(--brutalist-yellow)] live-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-4 w-4 bg-[var(--brutalist-green)] live-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonPage;
