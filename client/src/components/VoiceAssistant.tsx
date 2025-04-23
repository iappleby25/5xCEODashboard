import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Mic, Keyboard, ChevronRight } from "lucide-react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAssistant({ isOpen, onClose }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const { toast } = useToast();

  const {
    transcript: recognizedText,
    isListening: recognitionActive,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error: recognitionError
  } = useSpeechRecognition();

  // Start listening when the modal opens
  useEffect(() => {
    if (isOpen && hasRecognitionSupport && !isTextMode) {
      startListening();
      setIsListening(true);
    }
    // Reset transcript and response when modal is opened
    if (isOpen) {
      setTranscript("");
      setResponse(null);
      setTextInput("");
    }
  }, [isOpen, hasRecognitionSupport, isTextMode, startListening]);

  // Update transcript from recognition
  useEffect(() => {
    if (recognizedText) {
      setTranscript(recognizedText);
    }
  }, [recognizedText]);

  // Handle recognition errors
  useEffect(() => {
    if (recognitionError) {
      toast({
        title: "Voice Recognition Error",
        description: recognitionError,
        variant: "destructive",
      });
      setIsTextMode(true);
    }
  }, [recognitionError, toast]);

  // Process voice command or text input
  const processInput = async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    try {
      // Send to Flask backend via Express proxy
      const res = await apiRequest("POST", "/api/process-voice", {
        transcript: text,
        context: {
          currentView: "dashboard"
        }
      });
      
      const data = await res.json();
      
      // Display response
      setResponse(data.response);
      
      // Handle the action response based on the result
      handleActionResponse(data);
      
    } catch (error) {
      toast({
        title: "Error processing command",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      stopListening();
      setIsListening(false);
    }
  };

  // Handle the different actions that could come from the voice processing
  const handleActionResponse = (data: any) => {
    if (!data.action || data.action === "unknown") {
      return;
    }
    
    // Handle different actions
    switch (data.action) {
      case "filter":
        toast({
          title: "Applying filters",
          description: `Filtering by ${Object.keys(data.parameters).map(key => `${key}: ${data.parameters[key]}`).join(", ")}`,
        });
        break;
      case "navigate":
        // In a real implementation, you would navigate to the specified page
        toast({
          title: "Navigation",
          description: `Navigating to ${data.parameters.destination}`,
        });
        break;
      case "insight":
        toast({
          title: "Generating insights",
          description: "Preparing insights based on your request",
        });
        break;
      // Add more action handlers as needed
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processInput(textInput);
  };

  const toggleInputMode = () => {
    if (!isTextMode) {
      stopListening();
      setIsListening(false);
    } else if (hasRecognitionSupport) {
      startListening();
      setIsListening(true);
    }
    setIsTextMode(!isTextMode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mic className="h-5 w-5 text-primary mr-2" />
            Voice Assistant
          </DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {isTextMode ? (
          <form onSubmit={handleTextSubmit} className="py-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your question..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isProcessing}
              />
              <Button type="submit" size="sm" disabled={isProcessing || !textInput.trim()}>
                {isProcessing ? "Processing..." : "Ask"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-4">
            <div className="border rounded-lg p-4 mb-4 bg-neutral-50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mic className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-neutral-600">
                  {isListening 
                    ? "Listening for your query..." 
                    : transcript 
                      ? "Processing your query..." 
                      : "Click to start speaking"}
                </p>
              </div>
              
              {transcript && (
                <div className="p-3 bg-white border border-neutral-200 rounded-md mb-3">
                  <p className="text-sm font-medium">"{transcript}"</p>
                </div>
              )}
              
              {isListening && !transcript && (
                <div className="relative h-6 w-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center space-x-1">
                    {/* Audio visualization bars */}
                    <div className="h-2 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-3 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "100ms" }}></div>
                    <div className="h-4 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></div>
                    <div className="h-5 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
                    <div className="h-6 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></div>
                    <div className="h-4 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "500ms" }}></div>
                    <div className="h-3 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></div>
                    <div className="h-2 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "700ms" }}></div>
                  </div>
                </div>
              )}
              
              {response && (
                <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mt-3">
                  <p className="text-sm">{response}</p>
                </div>
              )}
            </div>
            
            {!transcript && !response && (
              <div className="text-sm">
                <p className="font-medium mb-2">Try asking:</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                    <span>"Show me Engineering department scores"</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                    <span>"Compare Q3 vs Q2 results"</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                    <span>"What are the key insights from the latest survey?"</span>
                  </li>
                </ul>
              </div>
            )}
            
            {transcript && !response && !isProcessing && (
              <div className="flex justify-center">
                <Button onClick={() => processInput(transcript)} disabled={isProcessing}>
                  Process Query
                </Button>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="flex justify-between sm:justify-between">
          {response ? (
            <Button variant="outline" onClick={() => {
              setTranscript("");
              setResponse(null);
              if (!isTextMode && hasRecognitionSupport) {
                startListening();
                setIsListening(true);
              }
            }}>
              Ask another question
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          )}
          
          <Button variant="outline" onClick={toggleInputMode} className="flex items-center space-x-1">
            {isTextMode ? (
              <>
                <Mic className="h-4 w-4 mr-1" />
                <span>Use Voice</span>
              </>
            ) : (
              <>
                <Keyboard className="h-4 w-4 mr-1" />
                <span>Type Instead</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
