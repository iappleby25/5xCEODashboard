import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryReport {
  summary: string;
  improvementAreas: {
    area: string;
    percentage: number;
  }[];
  recommendation: string;
}

export default function GptSummaryCard() {
  // Fetch summary report
  const { data, isLoading, error } = useQuery<SummaryReport>({
    queryKey: ["/api/generate-insights/1/summary"],
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

  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <CardTitle className="text-base">AI Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <CardTitle className="text-base">AI Summary</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="text-sm space-y-3">
        <p>{summaryData.summary}</p>
        
        <div className="p-3 bg-accent/5 border-l-2 border-accent rounded">
          <p className="font-medium text-neutral-700">Top improvement areas:</p>
          <ol className="list-decimal list-inside mt-1">
            {summaryData.improvementAreas.map((area, index) => (
              <li key={index}>
                {area.area} (mentioned by {area.percentage}%)
              </li>
            ))}
          </ol>
        </div>
        
        <p>{summaryData.recommendation}</p>
        
        <div className="mt-3 text-right">
          <Button 
            variant="link" 
            className="text-sm text-primary hover:text-primary-dark p-0" 
            asChild
          >
            <a href="#" className="flex items-center justify-end">
              <span>Full report</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
