import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CompanyData, formatRadarData } from "@/lib/dataProcessor";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  ResponsiveContainer,
  Tooltip
} from "recharts";

interface CompanyDetailDialogProps {
  company?: CompanyData;
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyDetailDialog({
  company,
  isOpen,
  onClose,
}: CompanyDetailDialogProps) {
  if (!company) return null;

  const radarData = formatRadarData(company.scores);
  const scoreColorClass = 
    company.averageScore >= 80 
      ? "text-green-600" 
      : company.averageScore >= 60 
        ? "text-yellow-600" 
        : "text-red-600";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <div className="flex items-center">
            <div className="w-12 h-12 mr-4 rounded-full overflow-hidden">
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <DialogTitle className="text-2xl">{company.name}</DialogTitle>
          </div>
          <DialogDescription className="flex items-center mt-2">
            <span className="mr-2">Performance Score:</span>
            <span className={`text-xl font-bold ${scoreColorClass}`}>
              {company.averageScore}%
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-lg font-medium mb-2">5xCEO Framework Performance</h3>
            <div className="h-[300px] w-full">
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
                  <Radar
                    name={company.name}
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Key Insights</h3>
            <div className="space-y-2 mt-2">
              {company.insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-3 bg-neutral-50 rounded-md text-sm"
                >
                  {insight}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Key Performance Areas</h3>
              <div className="space-y-2">
                {Object.entries(company.scores)
                  .filter(([key]) => key !== "totalScore")
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <div className="flex items-center">
                        <div className="bg-neutral-200 w-32 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              value >= 80
                                ? "bg-green-500"
                                : value >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{value}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
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