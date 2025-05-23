import React from 'react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  hasUserAsked?: boolean;
  isPasswordProtected?: boolean;
  isUnlocked?: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ 
  onSendMessage, 
  isLoading, 
  inputValue, 
  setInputValue,
  hasUserAsked = false,
  isPasswordProtected = false,
  isUnlocked = true
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  // Determine placeholder text based on user interaction state
  const getPlaceholder = () => {
    if (isLoading) return "Scanning data...";
    
    // If password protection is enabled and not unlocked, show password prompt
    if (isPasswordProtected && !isUnlocked) {
      return "Enter jury password to enable the app...";
    }
    
    if (hasUserAsked) return "Ask about another disruption...";
    return "Ask about disruptions (specify a city or localized area for improved accuracy)...";
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-2 bg-[var(--background)]">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={getPlaceholder()}
        className="flex-grow px-4 py-3 font-bold brutalist-input focus:outline-none disabled:opacity-50 text-lg"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-6 py-3 brutalist-button disabled:opacity-50 disabled:cursor-not-allowed text-lg cursor-pointer"
        disabled={isLoading || !inputValue.trim()}
      >
        {isLoading ? "Scanning" : "Send"}
      </button>
    </form>
  );
};

export default InputBar;
