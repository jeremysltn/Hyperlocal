import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import useChatHistory, { Message } from './useChatHistory';

// Progress bar component that advances with loading messages
const LoadingProgressBar: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const totalSteps = 7; // Total number of loading messages
  
  const loadingMessages = [
    "Scanning for real-time disruption data...",
    "Gathering information from multiple sources...",
    "Processing real-time updates... (1/3)",
    "Processing real-time updates... (2/3)",
    "Processing real-time updates... (3/3)",
    "Identifying relevant information...",
    "Summarizing findings..."
  ];
  
  useEffect(() => {
    // Only set up interval if we haven't reached the last message
    if (messageIndex < loadingMessages.length - 1) {
      // Rotate through messages every 8 seconds
      const interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          // If we're about to reach the last message, clear the interval
          const nextIndex = prevIndex + 1;
          if (nextIndex === loadingMessages.length - 1) {
            clearInterval(interval);
          }
          return nextIndex < loadingMessages.length ? nextIndex : prevIndex;
        });
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [messageIndex, loadingMessages.length]);
  
  // Calculate progress percentage
  const progressPercentage = ((messageIndex + 1) / totalSteps) * 100;
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (progressPercentage < 33) return 'var(--brutalist-red)';
    if (progressPercentage < 66) return 'var(--brutalist-yellow)';
    return 'var(--brutalist-green)';
  };
  
  return (
    <div className="w-full mb-3">
      <div className="w-full h-4 bg-[var(--ui-bubble-user)] border-2 border-[var(--ui-border)]">
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${progressPercentage}%`, 
            backgroundColor: getProgressColor()
          }}
        ></div>
      </div>
    </div>
  );
};

// Loading message component that cycles through different messages and stops at the last one
const LoadingMessage: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const loadingMessages = [
    "Scanning for real-time disruption data...",
    "Gathering information from multiple sources...",
    "Processing real-time updates... (1/3)",
    "Processing real-time updates... (2/3)",
    "Processing real-time updates... (3/3)",
    "Identifying relevant information...",
    "Summarizing findings..."
  ];
  
  useEffect(() => {
    // Only set up interval if we haven't reached the last message
    if (messageIndex < loadingMessages.length - 1) {
      // Rotate through messages every 8 seconds
      const interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          // If we're about to reach the last message, clear the interval
          const nextIndex = prevIndex + 1;
          if (nextIndex === loadingMessages.length - 1) {
            clearInterval(interval);
          }
          return nextIndex < loadingMessages.length ? nextIndex : prevIndex;
        });
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [messageIndex, loadingMessages.length]);
  
  return (
    <p className="text-sm font-bold m-0">
      {loadingMessages[messageIndex]}
    </p>
  );
};

interface ChatWindowProps {
  // Example: API endpoint for the chat
  // apiEndpoint: string;
}

const ChatWindow: React.FC<ChatWindowProps> = (/* { apiEndpoint } */) => {
  const { messages, addMessage, setMessages, clearMessages } = useChatHistory();
  const [isLoading, setIsLoading] = React.useState(false); // To manage loading state
  const [inputValue, setInputValue] = React.useState(''); // To manage input value for suggestions
  const [initialLoading, setInitialLoading] = React.useState(true); // For initial loading animation
  const [hasUserAsked, setHasUserAsked] = React.useState(false); // To track if user has asked a question
  const [isPasswordProtected, setIsPasswordProtected] = React.useState(false); // To track if password protection is enabled
  const [isUnlocked, setIsUnlocked] = React.useState(false); // To track if the app is unlocked
  const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scrolling
  
  // Check if password protection is enabled
  useEffect(() => {
    const passwordProtected = process.env.NEXT_PUBLIC_PASSWORD_PROTECTED === 'true';
    setIsPasswordProtected(passwordProtected);
    
    // If not password protected, set as unlocked
    if (!passwordProtected) {
      setIsUnlocked(true);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial welcome message with loading animation
  useEffect(() => {
    // Show loading for 1 second, then display welcome message
    const timer = setTimeout(() => {
      setInitialLoading(false);
      
      // Get current date in a friendly format
      const currentDate = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric'
      };
      const formattedDate = currentDate.toLocaleDateString('en-US', options);
      
      // Add welcome message
      addMessage({ 
        text: `👋 Hello! Welcome to Hyperlocal.\n\nToday is ${formattedDate} and I'm here to help you with real-time information about disruptions in your area, including traffic delays, public transport issues, weather events, and more.\n\nJust let me know which city or area you're interested in, and I'll find the latest updates for you! You can also click one of the buttons below to get started with some live examples.`, 
        sender: 'ai',
        metadata: {
          quickActions: [
            "Any road closed in Paris?",
            "Weather alerts in California",
            "Airport delays in New York City",
            "Public transport issues in London"
          ]
        }
      });
      
      // If password protection is enabled, add a message explaining why
      const passwordProtected = process.env.NEXT_PUBLIC_PASSWORD_PROTECTED === 'true';
      if (passwordProtected) {
        setTimeout(() => {
          addMessage({ 
            text: "Hyperlocal is currently password-protected for jury members only due to unexpected automated queries from bots. To ensure the application remains functional for the hackathon evaluation, we've implemented this protection measure.\n\nPlease enter the jury password to access the full functionality.", 
            sender: 'system' 
          });
        }, 500); // Add this message 0.5 second after the welcome message
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [addMessage]);

  const handleSendMessage = async (text: string) => {
    addMessage({ text, sender: 'user' });
    setIsLoading(true);
    
    // If the app is password protected and not unlocked, verify the password
    if (isPasswordProtected && !isUnlocked) {
      try {
        const response = await fetch('/api/verify-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: text }),
        });

        const data = await response.json();
        
        if (data.success) {
          setIsUnlocked(true);
          addMessage({ 
            text: "Password correct! The application is now unlocked. You can now ask questions about disruptions in your area.", 
            sender: 'ai' 
          });
        } else {
          addMessage({ 
            text: "Incorrect password. Please try again.", 
            sender: 'system' 
          });
        }
        
        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Error verifying password:", error);
        addMessage({ 
          text: "An error occurred while verifying the password. Please try again.", 
          sender: 'system' 
        });
        setIsLoading(false);
        return;
      }
    }
    
    // If we get here, the app is either not password protected or already unlocked
    setHasUserAsked(true);
    const sessionId = 'session_placeholder_123'; // Placeholder for session ID management

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.type === 'result' && data.content) {
        addMessage({ 
          text: data.content, 
          sender: 'ai',
          // metadata: {
          //   quickActions: [
          //     "More details",
          //     "Show map",
          //     "End time?",
          //     "Alternative routes"
          //   ]
          // }
        });
      } else if (data.type === 'error' || data.error) {
        const errorMessage = data.error || data.content || 'An error occurred';
        addMessage({ text: `Error: ${errorMessage}`, sender: 'system' });
      } else {
        // Handle unexpected response structure
        addMessage({ text: 'System error: Unexpected response received.', sender: 'system' });
      }

    } catch (error) {
      console.error("Error sending message to /api/chat:", error);
      const errorMessage = error instanceof Error ? error.message : 'Could not get a response.';
      addMessage({ text: `Error: ${errorMessage}`, sender: 'system' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset chat history except for the first AI message when user asks a new question after getting a response
  const handleNewQuestion = (text: string) => {
    if (hasUserAsked && messages.length > 1) {
      // Find the first AI message (the welcome message)
      const welcomeMessage = messages[0];
      
      // Clear messages and add back only the welcome message
      clearMessages();
      if (welcomeMessage && welcomeMessage.sender === 'ai') {
        addMessage({ text: welcomeMessage.text, sender: 'ai', metadata: welcomeMessage.metadata });
      }
      
      // Send the new message after resetting
      handleSendMessage(text);
    } else {
      // If this is the first question, just send it normally
      handleSendMessage(text);
    }
  };

  // Static quick query suggestions
  // const quickQueries = [
  //   "Airport delays in Paris",
  //   "Public transport issues in London",
  //   "Road construction near New York City",
  //   "Weather alerts in California"
  // ];

  return (
    <div className="flex flex-col h-[70vh] lg:h-[750px] max-w-[800px] w-full mx-auto bg-[var(--background)] brutalist-border message-animation">
      <div className="flex-grow p-6 space-y-4 overflow-y-auto">
        {initialLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex space-x-2">
              <div className="h-3 w-3 bg-[var(--brutalist-red)] live-pulse"></div>
              <div className="h-3 w-3 bg-[var(--brutalist-yellow)] live-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-3 w-3 bg-[var(--brutalist-green)] live-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-center text-xl font-bold text-[var(--foreground)]">Ask about disruptions</p>
            <div className="bg-[var(--brutalist-yellow)] border-2 border-[var(--ui-border)] p-4 max-w-md brutalist-border">
              <p className="text-center text-black">
                <span className="font-bold">Important:</span> Specify the city when asking about disruptions.
                You can also mention a specific street or area for more precise results.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              sender={msg.sender}
              timestamp={msg.timestamp}
              metadata={msg.metadata}
              isLatest={index === messages.length - 1 && msg.sender === 'ai'}
              onQuickActionClick={(action) => setInputValue(action)}
            />
          ))
        )}
        {isLoading && (
          <div className="w-full message-animation">
            <div className="text-xs mb-1 font-bold">Hyperlocal</div>
            <div className="w-full px-4 py-3 bg-[var(--ui-bubble-ai)] text-[var(--foreground)] border-2 border-[var(--ui-border)] brutalist-border">
              <div className="flex flex-col space-y-3">
                <LoadingProgressBar />
                <LoadingMessage />
                <p className="text-sm font-bold text-[var(--brutalist-purple)] m-0">
                  This could take 20 to 60 seconds as we're monitoring multiple sources for the most up-to-date information.
                </p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-4 py-3 border-t-2 border-[var(--ui-border)]">
        {/* <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {quickQueries.map((query, index) => (
            <button 
              key={index}
              onClick={() => setInputValue(query)}
              className="px-3 py-1 text-xs brutalist-chip bg-[var(--brutalist-gray)] text-white"
            >
              {query}
            </button>
          ))}
        </div> */}
        <InputBar 
          onSendMessage={handleNewQuestion} 
          isLoading={isLoading} 
          inputValue={inputValue}
          setInputValue={setInputValue}
          hasUserAsked={hasUserAsked}
          isPasswordProtected={isPasswordProtected}
          isUnlocked={isUnlocked}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
