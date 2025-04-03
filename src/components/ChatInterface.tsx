
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SettingsButton from './SettingsButton';
import SettingsModal from './SettingsModal';
import { useChat } from '@/hooks/useChat';

const ChatInterface: React.FC = () => {
  const {
    messages,
    isLoading,
    settings,
    sendMessage,
    updateSettings,
    clearChat
  } = useChat();

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto relative overflow-hidden rounded-xl border border-border">
      <header className="p-6 text-center relative">
        <h1 className="text-2xl font-semibold text-white">Ask Max Anything!</h1>
        <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="py-3 px-4 rounded-2xl bg-secondary max-w-[80%] mr-auto rounded-bl-sm">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-apple-gray animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-apple-gray animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-apple-gray animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={updateSettings}
        onClearChat={clearChat}
      />
    </div>
  );
};

export default ChatInterface;
