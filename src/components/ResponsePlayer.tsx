import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Volume } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';
import { marked } from 'marked';

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
      // Extract pure text content from the HTML for speech
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = responseText;
      const textContent = tempDiv.textContent || '';

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts",
          voice: "alloy",
          input: textContent
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
    <div className="flex flex-col items-center space-y-4 w-full max-w-2xl">
      <div className="w-full px-6 py-4 rounded-lg bg-max-light-grey bg-opacity-20 backdrop-blur-sm">
        <div className="text-max-light-grey markdown-content" dangerouslySetInnerHTML={{ __html: marked.parse(responseText) as string }} />
      </div>

      {audioUrl && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="lg"
            onClick={togglePlayback}
            disabled={isFetching}
            className="bg-max-yellow hover:bg-yellow-400 text-black p-6"
          >
            {isPlaying ? <Square size={24} /> : <Play size={24} />}
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
