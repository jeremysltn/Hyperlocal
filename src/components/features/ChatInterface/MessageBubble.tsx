import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'ai' | 'system'; // 'system' for status messages
  timestamp?: string;
  metadata?: Record<string, any>; // For additional data like quick actions, etc.
  isLatest?: boolean;
  onQuickActionClick?: (action: string) => void; // Handler for quick action clicks
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  text, 
  sender, 
  timestamp, 
  metadata, 
  isLatest = false,
  onQuickActionClick 
}) => {
  const isUser = sender === 'user';
  
  // Styling for brutalist design
  const bubbleClasses = isUser
    ? 'bg-[var(--ui-bubble-user)] text-[var(--foreground)] border-2 border-[var(--ui-border)] brutalist-border' // User message
    : sender === 'ai'
    ? 'bg-[var(--ui-bubble-ai)] text-[var(--foreground)] border-2 border-[var(--ui-border)] brutalist-border' // AI response
    : 'bg-[var(--brutalist-red)] text-white border-2 border-[var(--ui-border)] brutalist-border'; // System message style

  // Full width for AI responses to emphasize the answer
  const widthClass = sender === 'ai' ? 'w-full' : 'max-w-xs lg:max-w-md';
  
  // Label for messages
  const label = isUser ? 'User' : sender === 'ai' ? 'Hyperlocal' : 'Hyperlocal';

  // Animation class for latest message
  const animationClass = isLatest ? 'message-animation' : '';

  return (
    <div className={`mb-6 ${animationClass}`}>
      <div className="text-sm text-[var(--brutalist-gray)] mb-1 font-bold">{label}</div>
      <div className={`${widthClass} px-4 py-3 ${bubbleClasses}`}>
        {sender === 'ai' ? (
          <div className="prose prose-lg font-bold dark:prose-invert max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
            <ReactMarkdown>
              {text}
            </ReactMarkdown>
            
            {/* Quick action chips for AI responses */}
            {metadata?.quickActions && metadata.quickActions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {metadata.quickActions.map((action: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => onQuickActionClick && onQuickActionClick(action)}
                    className="px-3 py-1 brutalist-chip bg-[var(--brutalist-purple)] text-white"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-wrap font-bold text-lg">{text}</p>
        )}
      </div>
      {timestamp && (
        <span className="text-sm text-[var(--brutalist-gray)] mt-1 block">
          {timestamp}
        </span>
      )}
    </div>
  );
};

export default MessageBubble;
