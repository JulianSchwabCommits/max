import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

interface SettingsContextType {
  openaiApiKey: string;
  requestUrl: string;
  authPassword: string;
  setOpenaiApiKey: (key: string) => void;
  setRequestUrl: (url: string) => void;
  setAuthPassword: (password: string) => void;
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

  // Load saved settings on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openaiApiKey') || '';
    const savedRequestUrl = localStorage.getItem('requestUrl') || '';
    const savedAuthPassword = localStorage.getItem('authPassword') || '';

    setOpenaiApiKeyState(savedApiKey);
    setRequestUrlState(savedRequestUrl);
    setAuthPasswordState(savedAuthPassword);
  }, []);

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

  const isSettingsComplete = Boolean(openaiApiKey && requestUrl && authPassword);

  return (
    <SettingsContext.Provider
      value={{
        openaiApiKey,
        requestUrl,
        authPassword,
        setOpenaiApiKey,
        setRequestUrl,
        setAuthPassword,
        isSettingsComplete,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
