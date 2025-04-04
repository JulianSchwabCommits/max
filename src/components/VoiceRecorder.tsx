
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';
import { marked } from 'marked';

interface VoiceRecorderProps {
  onResponseReceived: (response: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onResponseReceived }) => {
  const { openaiApiKey, requestUrl, authPassword, isSettingsComplete } = useSettings();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!isSettingsComplete) {
      toast.error('Please complete your settings first');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        transcribeAudio(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Cannot access microphone. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    if (!openaiApiKey) {
      toast.error('OpenAI API key is required');
      return;
    }

    setIsTranscribing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model', 'gpt-4o-mini-transcribe');
      
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to transcribe audio');
      }
      
      setTranscription(data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Error transcribing audio. Check your API key and try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const sendTranscription = async () => {
    if (!transcription) {
      toast.error('No transcription to send');
      return;
    }

    if (!requestUrl) {
      toast.error('Request URL is required');
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pw': authPassword
        },
        body: JSON.stringify({
          message: transcription
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.text();
      // Convert the response to HTML using marked
      const formattedResponse = marked(responseData);
      onResponseReceived(formattedResponse);
    } catch (error) {
      console.error('Error sending transcription:', error);
      toast.error('Error sending your message. Please check your settings and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCircleMouseDown = () => {
    startRecording();
  };

  const handleCircleMouseUp = () => {
    stopRecording();
  };

  const handleTouchStart = () => {
    startRecording();
  };

  const handleTouchEnd = () => {
    stopRecording();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div
        className={cn(
          "w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md",
          isRecording 
            ? "bg-red-500 animate-pulse-gentle" 
            : "bg-max-yellow hover:bg-yellow-400"
        )}
        onMouseDown={handleCircleMouseDown}
        onMouseUp={handleCircleMouseUp}
        onMouseLeave={isRecording ? handleCircleMouseUp : undefined}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isRecording ? (
          <MicOff className="w-12 h-12 text-white" />
        ) : (
          <Mic className="w-12 h-12 text-white" />
        )}
      </div>

      {/* Transcription display */}
      {(transcription || isTranscribing) && (
        <div className="w-full max-w-md px-4 py-2 rounded-lg bg-max-light-grey bg-opacity-20 backdrop-blur-sm">
          <p className="text-max-light-grey text-center">
            {isTranscribing ? "Transcribing..." : transcription}
          </p>
        </div>
      )}

      {/* Send button */}
      {transcription && !isProcessing && (
        <Button 
          onClick={sendTranscription}
          className="bg-max-yellow hover:bg-yellow-400 text-black"
        >
          <Send className="mr-2 h-4 w-4" /> Send
        </Button>
      )}

      {isProcessing && (
        <div className="text-max-light-grey">Processing request...</div>
      )}
    </div>
  );
};

export default VoiceRecorder;
