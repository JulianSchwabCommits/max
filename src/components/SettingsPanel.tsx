import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/contexts/SettingsContext';

const SettingsPanel: React.FC = () => {
  const {
    openaiApiKey,
    requestUrl,
    authPassword,
    setOpenaiApiKey,
    setRequestUrl,
    setAuthPassword
  } = useSettings();

  const [tempApiKey, setTempApiKey] = useState(openaiApiKey);
  const [tempRequestUrl, setTempRequestUrl] = useState(requestUrl);
  const [tempAuthPassword, setTempAuthPassword] = useState(authPassword);
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveSettings = () => {
    setOpenaiApiKey(tempApiKey);
    setRequestUrl(tempRequestUrl);
    setAuthPassword(tempAuthPassword);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
        >
          <Settings className="h-6 w-6 text-max-light-grey" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your OpenAI API key, request URL, and authentication password.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="requestUrl">Request URL</Label>
            <Input
              id="requestUrl"
              value={tempRequestUrl}
              onChange={(e) => setTempRequestUrl(e.target.value)}
              placeholder="https://your-api-endpoint.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="authPassword">Authentication Password</Label>
            <Input
              id="authPassword"
              type="password"
              value={tempAuthPassword}
              onChange={(e) => setTempAuthPassword(e.target.value)}
              placeholder="Your password"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSaveSettings}
            className="bg-max-yellow hover:bg-yellow-400 text-black"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
