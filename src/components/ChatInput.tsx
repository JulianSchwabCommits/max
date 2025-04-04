import React, { useState, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback(() => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  }, [inputValue, onSendMessage, isLoading]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="flex items-end gap-2 p-4 border-t border-border bg-apple-black rounded-b-xl">
      <textarea
        className="flex-1 bg-secondary h-12 max-h-32 rounded-full consistent-padding resize-none text-sm outline-none border border-border focus:border-apple-blue transition-colors"
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        rows={1}
      />
      <Button
        size="icon"
        className={cn(
          "pill-shape bg-apple-blue hover:bg-apple-blue/90 text-white h-12 w-12",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleSubmit}
        disabled={isLoading || !inputValue.trim()}
      >
        <Send size={18} />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
};

export default ChatInput;
