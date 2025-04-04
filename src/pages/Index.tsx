
import React, { useState } from 'react';
import VoiceRecorder from '@/components/VoiceRecorder';
import ResponsePlayer from '@/components/ResponsePlayer';
import SettingsPanel from '@/components/SettingsPanel';
import Welcome from '@/components/Welcome';
import { SettingsProvider } from '@/contexts/SettingsContext';

const Index: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const [started, setStarted] = useState(false);

  const handleResponseReceived = (responseText: string) => {
    setResponse(responseText);
  };

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-max-dark-grey flex flex-col items-center justify-center p-4 relative">
        <SettingsPanel />
        
        {!started ? (
          <Welcome onStart={handleStart} />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-md">
            <VoiceRecorder onResponseReceived={handleResponseReceived} />
            
            {response && <ResponsePlayer responseText={response} />}
          </div>
        )}
      </div>
    </SettingsProvider>
  );
};

export default Index;
