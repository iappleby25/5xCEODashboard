import React from "react";
import {
  Dialog, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CompanyData, CompanyScores, formatRadarData } from "@/lib/dataProcessor";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// Custom DialogContent that doesn't have the default close button
const NoXDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
NoXDialogContent.displayName = "NoXDialogContent";

interface CompanyComparisonProps {
  companies: CompanyData[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyComparison({
  companies,
  isOpen,
  onClose,
}: CompanyComparisonProps) {
  if (!companies || companies.length === 0) return null;
  
  // Format radar data for comparison
  const radarData = formatComparisonRadarData(companies);
  
  const getScoreColorClass = (score: number) => 
    score >= 80 
      ? "text-green-600" 
      : score >= 60 
        ? "text-yellow-600" 
        : "text-red-600";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <NoXDialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white pb-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Company Comparison</DialogTitle>
              <DialogDescription>
                Side-by-side comparison of selected companies
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <span className="text-2xl">&times;</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">5xCEO Framework Performance</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                cx="50%" 
                cy="50%" 
                outerRadius="80%" 
                data={radarData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                
                {companies.map((company, index) => (
                  <Radar
                    key={company.id}
                    name={company.name}
                    dataKey={`company${index}`}
                    stroke={getRadarColor(index)}
                    fill={getRadarColor(index)}
                    fillOpacity={0.3}
                  />
                ))}
                
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 mb-10">
          <h3 className="text-lg font-medium mb-4">Performance Metrics Comparison</h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                {companies.map(company => (
                  <TableHead key={company.id}>{company.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Overall Score</TableCell>
                {companies.map(company => (
                  <TableCell 
                    key={company.id} 
                    className={`font-semibold ${getScoreColorClass(company.averageScore)}`}
                  >
                    {company.averageScore}%
                  </TableCell>
                ))}
              </TableRow>
              {Object.keys(companies[0].scores)
                .filter(key => key !== "totalScore")
                .map(key => {
                  const scoreKey = key as keyof CompanyScores;
                  return (
                    <TableRow key={key}>
                      <TableCell className="font-medium">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </TableCell>
                      {companies.map(company => (
                        <TableCell 
                          key={`${company.id}-${key}`}
                          className={`${getScoreColorClass(company.scores[scoreKey])}`}
                        >
                          {company.scores[scoreKey]}%
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </div>
      </NoXDialogContent>
    </Dialog>
  );
}

// Helper functions
function formatComparisonRadarData(companies: CompanyData[]) {
  // Use first company to determine which metrics to include
  const metrics = Object.keys(companies[0].scores).filter(key => key !== "totalScore");
  
  return metrics.map(metric => {
    const dataPoint: any = {
      subject: metric.replace(/([A-Z])/g, " $1").trim(),
    };
    
    // Add each company's score for this metric
    companies.forEach((company, index) => {
      const scoreKey = metric as keyof CompanyScores;
      dataPoint[`company${index}`] = company.scores[scoreKey];
    });
    
    return dataPoint;
  });
}

function getRadarColor(index: number) {
  const colors = [
    "#8884d8", // purple
    "#82ca9d", // green
    "#ffc658", // yellow
    "#ff8042", // orange
    "#0088FE", // blue
    "#FF8042", // coral
    "#FFBB28", // amber
    "#00C49F", // teal
  ];
  
  return colors[index % colors.length];
}