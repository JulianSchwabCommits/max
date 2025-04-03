
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="ghost" 
      size="icon"
      onClick={onClick}
      className="absolute top-4 right-4 text-apple-gray hover:text-white hover:bg-secondary/80"
    >
      <Settings size={20} />
      <span className="sr-only">Settings</span>
    </Button>
  );
};

export default SettingsButton;
