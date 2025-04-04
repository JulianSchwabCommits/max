import React, { useState, useEffect } from 'react';
import VoiceRecorder from '@/components/VoiceRecorder';
import ResponsePlayer from '@/components/ResponsePlayer';
import SettingsPanel from '@/components/SettingsPanel';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';

const Main: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const { isSettingsComplete } = useSettings();

  const handleResponseReceived = (responseText: string) => {
    setResponse(responseText);
  };

  return (
    <div className="min-h-screen bg-max-dark-grey flex flex-col items-center justify-center p-4 relative">
      <SettingsPanel />

      {!isSettingsComplete ? (
        <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700 w-full max-w-2xl">
          <h1 className="text-4xl font-bold text-max-light-grey">Welcome to Max Speech</h1>
          <p className="text-xl text-max-light-grey opacity-80 max-w-xl text-center">
            Press and hold the yellow circle to ask Max anything, then press 'Send' when you're ready.
          </p>
          <div className="text-max-light-grey bg-red-500 bg-opacity-20 p-4 rounded-md">
            Please configure your settings before starting.
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-2xl">
          <VoiceRecorder onResponseReceived={handleResponseReceived} />

          {response && <ResponsePlayer responseText={response} />}
        </div>
      )}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <SettingsProvider>
      <Main />
    </SettingsProvider>
  );
};

export default Index;
