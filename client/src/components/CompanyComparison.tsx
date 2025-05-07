import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
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
      <DialogContent className="max-w-5xl w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">Company Comparison</DialogTitle>
          <DialogDescription>
            Side-by-side comparison of selected companies
          </DialogDescription>
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

        <div className="mt-6">
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

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
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