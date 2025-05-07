import { useState } from "react";
import { 
  BrainCircuit, 
  FileText, 
  Loader2, 
  PlusCircle, 
  RefreshCcw, 
  SlidersHorizontal 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import AiInsightPanel from "./AiInsightPanel";
import GptSummaryCard from "./GptSummaryCard";
import TopicClusterCard from "./TopicClusterCard";
import AiFollowupDialog from "./AiFollowupDialog";
import useGptInsights from "@/hooks/useGptInsights";
import { Insight } from "@/types/insights";

interface AiInsightsViewProps {
  surveyId?: number;
}

export default function AiInsightsView({ surveyId = 1 }: AiInsightsViewProps) {
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<Insight | undefined>(undefined);
  
  const { 
    insights, 
    summaryReport, 
    topicClusters, 
    isLoading, 
    switchInsightType,
    insightType,
    generateFollowup
  } = useGptInsights(surveyId);
  
  const handleFollowupClick = (insight: Insight) => {
    setSelectedInsight(insight);
    setIsFollowupOpen(true);
  };
  
  const handleFollowupSubmit = async (question: string) => {
    const result = await generateFollowup(question);
    return result;
  };
  
  const handleFeedback = (type: 'positive' | 'negative') => {
    // In a real implementation, this would send feedback to the server
    console.log(`User gave ${type} feedback`);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <CardTitle>AI Insights</CardTitle>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="insights" 
            className="w-full"
            onValueChange={(value) => {
              if (value === "insights") switchInsightType("main");
              if (value === "summary") switchInsightType("summary");
              if (value === "topics") switchInsightType("topics");
            }}
          >
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="insights" className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>Insights</span>
                {insights.length > 0 && (
                  <Badge variant="outline" className="ml-1 h-5 px-1.5 py-0 text-xs">
                    {insights.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="space-y-4">
              {isLoading && insightType === "main" ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                </div>
              ) : insights.length > 0 ? (
                <ScrollArea className="max-h-[600px] pr-4 -mr-4">
                  <div className="space-y-6">
                    {insights.map((insight, index) => (
                      <AiInsightPanel 
                        key={index} 
                        insight={insight}
                        onFeedback={handleFeedback}
                        onFollowUp={() => handleFollowupClick(insight)}
                      />
                    ))}
                    
                    <div className="flex justify-center py-2">
                      <Button 
                        variant="outline" 
                        className="gap-1.5"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>Generate more insights</span>
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTitle className="flex items-center gap-2 text-amber-700">
                    <RefreshCcw className="h-4 w-4" />
                    No insights generated yet
                  </AlertTitle>
                  <AlertDescription className="text-amber-600">
                    Click the button below to generate insights from your survey data.
                  </AlertDescription>
                  <div className="mt-4">
                    <Button 
                      className="gap-1.5"
                    >
                      <BrainCircuit className="h-4 w-4" />
                      <span>Generate insights</span>
                    </Button>
                  </div>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="summary">
              {isLoading && insightType === "summary" ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                </div>
              ) : (
                <GptSummaryCard 
                  surveyId={surveyId}
                  onRefresh={() => console.log("Refresh summary")}
                  onDownload={() => console.log("Download summary")}
                  onFullReport={() => console.log("View full report")}
                />
              )}
            </TabsContent>
            
            <TabsContent value="topics">
              {isLoading && insightType === "topics" ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                </div>
              ) : (
                <TopicClusterCard topicClusters={topicClusters} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AiFollowupDialog
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        onSubmit={handleFollowupSubmit}
        selectedInsight={selectedInsight}
      />
    </>
  );
}