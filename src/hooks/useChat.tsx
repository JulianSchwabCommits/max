
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

// Define types for our chat
export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export type ChatSettings = {
  apiUrl: string;
  authPassword: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('chat-settings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : { apiUrl: '', authPassword: '' };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chat-settings', JSON.stringify(settings));
  }, [settings]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Check if API URL is configured
      if (!settings.apiUrl) {
        toast.error('Please configure the API URL in settings');
        return;
      }

      // Create a user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      // Add user message to chat
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Prepare headers
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Add auth header if password is set - Using "pw" header instead of "Authorization"
        if (settings.authPassword) {
          headers['pw'] = settings.authPassword;
        }

        // Send message to API
        const response = await fetch(settings.apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            message: content,
            history: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Create assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || 'Sorry, I received an empty response.',
          timestamp: new Date(),
        };

        // Add assistant message to chat
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message. Please check your settings and try again.');
        
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, I encountered an error while processing your request.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, settings]
  );

  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast.success('Settings updated');
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    toast.success('Chat cleared');
  }, []);

  return {
    messages,
    isLoading,
    settings,
    sendMessage,
    updateSettings,
    clearChat,
  };
};
