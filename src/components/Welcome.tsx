
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const { sessionMode, setSessionMode, isSettingsComplete } = useSettings();

  const handleModeSelection = (mode: 'classic' | 'guided') => {
    setSessionMode(mode);
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
      <h1 className="text-4xl font-bold text-max-light-grey">Hey early bird!</h1>
      <p className="text-xl text-max-light-grey opacity-80 max-w-md text-center">
        Press and hold the yellow circle to ask Max anything, then press 'Send' when you're ready.
      </p>

      {!isSettingsComplete && (
        <div className="text-max-light-grey bg-red-500 bg-opacity-20 p-4 rounded-md">
          Please configure your settings before starting.
        </div>
      )}

      <div className="flex space-x-4">
        <Button
          onClick={() => handleModeSelection('classic')}
          className={`${
            sessionMode === 'classic'
              ? 'bg-max-yellow text-black'
              : 'bg-gray-500 text-max-light-grey'
          } hover:bg-yellow-400 hover:text-black transition-all`}
          disabled={!isSettingsComplete}
        >
          Classic Mode
        </Button>
        <Button
          onClick={() => handleModeSelection('guided')}
          className={`${
            sessionMode === 'guided'
              ? 'bg-max-yellow text-black'
              : 'bg-gray-500 text-max-light-grey'
          } hover:bg-yellow-400 hover:text-black transition-all`}
          disabled={!isSettingsComplete}
        >
          Guided Mode
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
