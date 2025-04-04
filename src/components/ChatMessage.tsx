import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/hooks/useChat';
import { renderMarkdown } from '@/utils/markdownUtils';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'consistent-padding rounded-2xl max-w-[80%] animate-slide-up',
        isUser
          ? 'bg-apple-blue text-white ml-auto'
          : 'bg-secondary text-white mr-auto'
      )}
    >
      {isUser ? (
        <p className="text-sm">{message.content}</p>
      ) : (
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />
      )}
    </div>
  );
};

export default ChatMessage;
