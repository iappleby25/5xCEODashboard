import React from 'react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, RefreshCcw, Download, ArrowUpRight, Loader2 } from "lucide-react";

import { SummaryReport } from "@/types/insights";

interface SummaryFallbackProps {
  summaryData?: SummaryReport;
  onRefresh?: () => void;
}

export default function SummaryFallback({ 
  summaryData,
  onRefresh
}: SummaryFallbackProps) {
  
  // Default data 
  const defaultData: SummaryReport = {
    summary: "Based on survey responses from 243 employees across 5 departments, there's a positive correlation between work-life balance improvements and overall satisfaction scores.",
    improvementAreas: [
      { area: "Communication transparency", percentage: 42 },
      { area: "Career growth opportunities", percentage: 37 },
      { area: "Feedback implementation", percentage: 29 }
    ],
    recommendation: "Consider implementing more regular career development conversations and transparent project allocation."
  };

  const reportData = summaryData || defaultData;
  
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
              onClick={onRefresh}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-primary/10"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Powered by AI analysis of all survey responses
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-sm space-y-4">
        <p className="text-neutral-700">{reportData.summary}</p>
        
        <div className="p-3 bg-accent/5 border-l-2 border-accent rounded">
          <p className="font-medium text-neutral-700 mb-2">Top improvement areas:</p>
          <div className="space-y-3">
            {reportData.improvementAreas.map((area: { area: string; percentage: number }, index: number) => (
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
          <p className="text-neutral-700">{reportData.recommendation}</p>
        </div>
        
        <div className="mt-3 text-right">
          <Button 
            variant="link" 
            className="text-sm text-primary hover:text-primary-dark p-0 gap-1" 
            onClick={() => window.open(`/report/1`, '_blank')}
          >
            <span>View full report</span>
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}