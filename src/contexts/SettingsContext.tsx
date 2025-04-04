
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface SettingsContextType {
  openaiApiKey: string;
  requestUrl: string;
  authPassword: string;
  sessionMode: 'classic' | 'guided';
  setOpenaiApiKey: (key: string) => void;
  setRequestUrl: (url: string) => void;
  setAuthPassword: (password: string) => void;
  setSessionMode: (mode: 'classic' | 'guided') => void;
  isSettingsComplete: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [openaiApiKey, setOpenaiApiKeyState] = useState('');
  const [requestUrl, setRequestUrlState] = useState('');
  const [authPassword, setAuthPasswordState] = useState('');
  const [sessionMode, setSessionModeState] = useState<'classic' | 'guided'>('classic');

  const setOpenaiApiKey = (key: string) => {
    setOpenaiApiKeyState(key);
    localStorage.setItem('openaiApiKey', key);
    toast.success('OpenAI API key saved');
  };

  const setRequestUrl = (url: string) => {
    setRequestUrlState(url);
    localStorage.setItem('requestUrl', url);
    toast.success('Request URL saved');
  };

  const setAuthPassword = (password: string) => {
    setAuthPasswordState(password);
    localStorage.setItem('authPassword', password);
    toast.success('Authentication password saved');
  };

  const setSessionMode = (mode: 'classic' | 'guided') => {
    setSessionModeState(mode);
    localStorage.setItem('sessionMode', mode);
  };

  // Load saved settings on mount
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('openaiApiKey') || '';
    const savedRequestUrl = localStorage.getItem('requestUrl') || '';
    const savedAuthPassword = localStorage.getItem('authPassword') || '';
    const savedSessionMode = localStorage.getItem('sessionMode') as 'classic' | 'guided' || 'classic';

    setOpenaiApiKeyState(savedApiKey);
    setRequestUrlState(savedRequestUrl);
    setAuthPasswordState(savedAuthPassword);
    setSessionModeState(savedSessionMode);
  }, []);

  const isSettingsComplete = Boolean(openaiApiKey && requestUrl && authPassword);

  return (
    <SettingsContext.Provider
      value={{
        openaiApiKey,
        requestUrl,
        authPassword,
        sessionMode,
        setOpenaiApiKey,
        setRequestUrl,
        setAuthPassword,
        setSessionMode,
        isSettingsComplete,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
