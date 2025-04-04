
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Volume } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

interface ResponsePlayerProps {
  responseText: string;
}

const ResponsePlayer: React.FC<ResponsePlayerProps> = ({ responseText }) => {
  const { openaiApiKey } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (responseText) {
      fetchAudioResponse();
    }
  }, [responseText]);

  const fetchAudioResponse = async () => {
    if (!responseText || !openaiApiKey) return;

    setIsFetching(true);
    try {
      const response = await fetch('https://api.openai.com/v1/audio/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          input: responseText,
          voice: 'alloy'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Auto-play the audio
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    } catch (error) {
      console.error('Error fetching audio response:', error);
      toast.error('Error generating speech. Please check your API key and try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md">
      <div className="w-full px-4 py-2 rounded-lg bg-max-light-grey bg-opacity-20 backdrop-blur-sm">
        <p className="text-max-light-grey text-center">{responseText}</p>
      </div>

      {audioUrl && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayback}
            disabled={isFetching}
            className="bg-max-yellow hover:bg-yellow-400 text-black"
          >
            {isPlaying ? <Square size={16} /> : <Play size={16} />}
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={stopPlayback}
            disabled={!isPlaying}
            className="bg-max-light-grey hover:bg-gray-300 text-black"
          >
            <Square size={16} />
          </Button>
        </div>
      )}

      {isFetching && (
        <div className="text-max-light-grey">Generating speech...</div>
      )}
    </div>
  );
};

export default ResponsePlayer;
