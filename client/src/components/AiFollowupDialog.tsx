import { useState } from "react";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Insight } from "@/types/insights";
import { Card } from "@/components/ui/card";

interface AiFollowupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string) => Promise<any>;
  selectedInsight?: Insight;
}

export default function AiFollowupDialog({
  isOpen,
  onClose,
  onSubmit,
  selectedInsight
}: AiFollowupDialogProps) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!question.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await onSubmit(question);
      setResponse(result.content || "I've analyzed your question but couldn't generate a specific answer. Please try asking a different question about this insight.");
    } catch (error) {
      setResponse("Sorry, I encountered an error processing your question. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetDialog = () => {
    setQuestion("");
    setResponse(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle>Ask for more insight</DialogTitle>
          </div>
          <DialogDescription>
            Ask follow-up questions about this insight to get more detailed information
          </DialogDescription>
        </DialogHeader>
        
        {/* Context - original insight */}
        {selectedInsight && (
          <div className="px-6 py-3 bg-neutral-50">
            <h4 className="text-sm font-medium text-neutral-500 mb-1">Original insight:</h4>
            <p className="text-sm font-medium">{selectedInsight.title}</p>
          </div>
        )}
        
        <div className="px-6 py-4 overflow-y-auto max-h-[400px]">
          {/* Response if available */}
          {response && (
            <Card className="mb-4 p-4 bg-primary/5 border-primary/10">
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-primary mt-1" />
                <div className="text-sm">
                  {response}
                </div>
              </div>
            </Card>
          )}
          
          {/* Input form */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-neutral-500 mb-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Your question</span>
            </div>
            
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a specific question about this insight..."
              className="min-h-[100px] text-sm"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 bg-neutral-50">
          <div className="w-full flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={resetDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!question.trim() || isSubmitting}
              className="gap-1"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  <span>Ask question</span>
                  <Send className="h-3 w-3" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}