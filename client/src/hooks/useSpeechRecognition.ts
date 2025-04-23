import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasRecognitionSupport: boolean;
  error: string | null;
}

const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if the browser supports the Web Speech API
  const browserSupportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  const hasRecognitionSupport = browserSupportsSpeechRecognition;
  
  // Define Speech Recognition object
  let recognition: any;
  
  if (hasRecognitionSupport) {
    // Use the appropriate constructor based on browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  }
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  const startListening = useCallback(() => {
    if (!hasRecognitionSupport) {
      setError('Your browser does not support speech recognition.');
      return;
    }
    
    setError(null);
    
    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to start speech recognition: ${err.message}`);
      } else {
        setError('Failed to start speech recognition');
      }
      setIsListening(false);
    }
  }, [hasRecognitionSupport]);
  
  const stopListening = useCallback(() => {
    if (!hasRecognitionSupport) return;
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to stop speech recognition: ${err.message}`);
      } else {
        setError('Failed to stop speech recognition');
      }
    }
  }, [hasRecognitionSupport]);
  
  useEffect(() => {
    if (!hasRecognitionSupport) return;
    
    // Recognition event handlers
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };
    
    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // This is a normal event when no speech is detected
        return;
      }
      
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    // Cleanup
    return () => {
      if (isListening) {
        try {
          recognition.stop();
        } catch (err) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [hasRecognitionSupport, isListening]);
  
  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport,
    error
  };
};

export default useSpeechRecognition;
