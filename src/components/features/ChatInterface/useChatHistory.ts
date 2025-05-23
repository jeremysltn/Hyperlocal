import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp?: string;
  metadata?: Record<string, any>; // For additional data like severity, sources, quick actions, etc.
}

export interface UseChatHistoryReturn {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  clearMessages: () => void;
}

const useChatHistory = (initialMessages: Message[] = []): UseChatHistoryReturn => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(), // Modern way to generate UUIDs in browser
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, addMessage, setMessages, clearMessages };
};

export default useChatHistory;
