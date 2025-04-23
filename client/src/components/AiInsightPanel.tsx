import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Brain, MessageSquare } from "lucide-react";

interface Insight {
  title: string;
  content: string;
  tags: string[];
  isPositive: boolean;
}

interface AiInsightPanelProps {
  insight?: Insight;
}

export default function AiInsightPanel({ insight }: AiInsightPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Default insight if none provided
  const defaultInsight: Insight = {
    title: "Employee satisfaction has increased by 12% over the last quarter",
    content: "Key factors contributing to this improvement include:\n- New flexible work policy implemented in July (mentioned in 47% of comments)\n- Leadership town halls have improved transparency scores by 18%\n- Improved onboarding process positively impacted new hire experience",
    tags: ["Positive Trend", "Leadership Impact", "Q3 Results"],
    isPositive: true
  };

  const activeInsight = insight || defaultInsight;
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10 p-4 mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 mt-2 mr-2">
        <button 
          type="button" 
          className="text-neutral-400 hover:text-neutral-600"
          onClick={toggleExpanded}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-sm text-neutral-500">AI INSIGHTS</h3>
          <p className="font-medium text-lg mt-1 mb-2">{activeInsight.title}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {activeInsight.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className={activeInsight.isPositive ? "bg-success/10 text-success" : "bg-error/10 text-error"}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-auto hidden lg:flex">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Ask follow-up
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 text-sm text-neutral-600 whitespace-pre-line">
          {activeInsight.content}
        </div>
      )}
      
      {isExpanded && (
        <div className="mt-3 flex lg:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Ask follow-up
          </Button>
        </div>
      )}
    </Card>
  );
}
