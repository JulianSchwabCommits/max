
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChatSettings } from '@/hooks/useChat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSave: (settings: ChatSettings) => void;
  onClearChat: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onClearChat
}) => {
  const [apiUrl, setApiUrl] = React.useState(settings.apiUrl);
  const [authPassword, setAuthPassword] = React.useState(settings.authPassword);

  React.useEffect(() => {
    setApiUrl(settings.apiUrl);
    setAuthPassword(settings.authPassword);
  }, [settings, isOpen]);

  const handleSave = () => {
    onSave({
      apiUrl,
      authPassword
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-apple-darkgray border border-border text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API URL</Label>
            <Input
              id="api-url"
              placeholder="https://api.example.com/chat"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="bg-secondary border-border text-white"
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL for the chat API endpoint
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password">Authentication Password</Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="bg-secondary border-border text-white"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Password used for authentication header
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="destructive"
            onClick={onClearChat}
            className="w-full sm:w-auto"
          >
            Clear Chat
          </Button>
          <Button 
            onClick={handleSave}
            className="w-full sm:w-auto bg-apple-blue hover:bg-apple-blue/90 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
