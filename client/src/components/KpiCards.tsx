import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { ChevronUp, ChevronDown } from "lucide-react";

interface KpiData {
  participation: {
    rate: number;
    change: number;
    direction: string;
  };
  averageScore: {
    score: number;
    change: number;
    direction: string;
  };
}

interface KpiCardsProps {
  kpiData?: KpiData;
}

export default function KpiCards({ kpiData }: KpiCardsProps) {
  // Default data if none provided
  const defaultData: KpiData = {
    participation: {
      rate: 87,
      change: 5,
      direction: "up"
    },
    averageScore: {
      score: 4.2,
      change: 0.3,
      direction: "up"
    }
  };

  const data = kpiData || defaultData;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Participation Rate */}
      <Card className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-neutral-500">Participation</h3>
          <Badge 
            variant="outline"
            className={`bg-${data.participation.direction === "up" ? "success" : "error"}/10 text-${data.participation.direction === "up" ? "success" : "error"} px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center`}
          >
            {data.participation.direction === "up" ? (
              <ChevronUp className="h-3 w-3 mr-0.5" />
            ) : (
              <ChevronDown className="h-3 w-3 mr-0.5" />
            )}
            {data.participation.change}%
          </Badge>
        </div>
        <p className="mt-2 text-2xl font-semibold">{data.participation.rate}%</p>
        <Progress className="mt-2 h-1 bg-neutral-100" value={data.participation.rate} />
      </Card>
      
      {/* Average Score */}
      <Card className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-neutral-500">Avg. Score</h3>
          <Badge 
            variant="outline"
            className={`bg-${data.averageScore.direction === "up" ? "success" : "error"}/10 text-${data.averageScore.direction === "up" ? "success" : "error"} px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center`}
          >
            {data.averageScore.direction === "up" ? (
              <ChevronUp className="h-3 w-3 mr-0.5" />
            ) : (
              <ChevronDown className="h-3 w-3 mr-0.5" />
            )}
            {data.averageScore.change}
          </Badge>
        </div>
        <p className="mt-2 text-2xl font-semibold">{data.averageScore.score}<span className="text-sm text-neutral-400">/5</span></p>
        <div className="mt-2 flex space-x-1">
          {[...Array(5)].map((_, i) => (
            i < Math.floor(data.averageScore.score) ? (
              <StarFilledIcon key={i} className="h-4 w-4 text-warning" />
            ) : (
              <StarIcon key={i} className="h-4 w-4 text-neutral-200" />
            )
          ))}
        </div>
      </Card>
    </div>
  );
}
