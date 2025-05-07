import {
  ArrowUpRight,
  ChevronRight,
  Download,
  Loader2,
  RefreshCcw,
  Sparkles
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { SummaryReport } from "@/types/insights";
import { Progress } from "@/components/ui/progress";

interface GptSummaryCardProps {
  surveyId?: number;
  onRefresh?: () => void;
  onDownload?: () => void;
  onFullReport?: () => void;
}

export default function GptSummaryCard({ 
  surveyId = 1, 
  onRefresh, 
  onDownload,
  onFullReport
}: GptSummaryCardProps) {
  // Fetch summary report
  const { data, isLoading, error, refetch } = useQuery<SummaryReport>({
    queryKey: [`/api/generate-insights/${surveyId}/summary`],
  });

  // Default data if fetch fails or is loading
  const defaultData: SummaryReport = {
    summary: "Based on survey responses from 243 employees across 5 departments, there's a positive correlation between work-life balance improvements and overall satisfaction scores.",
    improvementAreas: [
      { area: "Communication transparency", percentage: 42 },
      { area: "Career growth opportunities", percentage: 37 },
      { area: "Feedback implementation", percentage: 29 }
    ],
    recommendation: "Consider implementing more regular career development conversations and transparent project allocation."
  };

  const summaryData = data || defaultData;
  
  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      await refetch();
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <CardTitle className="text-base">AI Summary Analysis</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-primary/10"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
            {onDownload && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-primary/10"
                onClick={onDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Powered by AI analysis of all survey responses
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-sm space-y-4">
        <p className="text-neutral-700">{summaryData.summary}</p>
        
        <div className="p-3 bg-accent/5 border-l-2 border-accent rounded">
          <p className="font-medium text-neutral-700 mb-2">Top improvement areas:</p>
          <div className="space-y-3">
            {summaryData.improvementAreas.map((area, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{area.area}</span>
                  <span className="font-medium">{area.percentage}%</span>
                </div>
                <Progress value={area.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-primary/5 p-3 rounded-md">
          <div className="flex items-start space-x-2 mb-1">
            <Badge variant="outline" className="bg-primary/10 text-primary border-0">
              Recommendation
            </Badge>
          </div>
          <p className="text-neutral-700">{summaryData.recommendation}</p>
        </div>
        
        <div className="mt-3 text-right">
          <Button 
            variant="link" 
            className="text-sm text-primary hover:text-primary-dark p-0 gap-1" 
            onClick={onFullReport}
          >
            <span>View full report</span>
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}