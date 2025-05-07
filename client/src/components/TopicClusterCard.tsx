import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopicCluster } from "@/types/insights";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TopicClusterCardProps {
  topicClusters: TopicCluster[];
}

export default function TopicClusterCard({ topicClusters }: TopicClusterCardProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayClusters = showAll ? topicClusters : topicClusters.slice(0, 3);
  
  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return "text-success bg-success/10";
    if (score >= 0.4) return "text-amber-500 bg-amber-50";
    return "text-error bg-error/10";
  };
  
  const getSentimentIcon = (score: number) => {
    if (score >= 0.6) return <TrendingUp className="h-3 w-3" />;
    if (score <= 0.4) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Key Topics</CardTitle>
        </div>
        <CardDescription>
          Automatically identified topics from survey responses
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-sm">
        <ScrollArea className={showAll ? "h-[300px]" : "h-auto"}>
          <div className="space-y-3">
            {displayClusters.map((cluster, index) => (
              <div key={index} className="p-3 border rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cluster.topic}</span>
                  <Badge 
                    variant="outline" 
                    className={`${getSentimentColor(cluster.sentimentScore)} flex items-center gap-1`}
                  >
                    {getSentimentIcon(cluster.sentimentScore)}
                    <span>{(cluster.sentimentScore * 100).toFixed(0)}%</span>
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {cluster.keywords.map((kw, i) => (
                    <span 
                      key={i} 
                      className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Sentiment score</span>
                  <span>Mentions: {cluster.count}</span>
                </div>
                <Progress 
                  value={cluster.sentimentScore * 100} 
                  className={`h-1.5 mt-1 ${
                    cluster.sentimentScore >= 0.7 ? "bg-success/20" :
                    cluster.sentimentScore >= 0.4 ? "bg-amber-100" :
                    "bg-error/20"
                  }`}
                  style={{
                    "--tw-bg-opacity": "1",
                    "--progress-foreground-color": cluster.sentimentScore >= 0.7 
                      ? "var(--success)" 
                      : cluster.sentimentScore >= 0.4 
                      ? "rgb(245 158 11)" 
                      : "var(--error)"
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {topicClusters.length > 3 && (
          <button
            type="button"
            className="w-full flex items-center justify-center mt-3 text-sm text-primary"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                <span>Show all {topicClusters.length} topics</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}