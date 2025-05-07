import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getScoreColorClass } from "@/lib/dataProcessor";
import { CompanyData } from "@/lib/dataProcessor";
import { CheckCircle } from "lucide-react";

interface CompanyTileProps {
  company: CompanyData;
  onClick: (company: CompanyData) => void;
  isSelected?: boolean;
}

export default function CompanyTile({ company, onClick, isSelected = false }: CompanyTileProps) {
  const colorClass = getScoreColorClass(company.averageScore);
  const borderColorClass = isSelected
    ? "border-blue-500" 
    : company.averageScore >= 80 
      ? "border-green-500" 
      : company.averageScore >= 60 
        ? "border-yellow-500" 
        : "border-red-500";
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-2 ${borderColorClass} ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={() => onClick(company)}
    >
      <CardContent className="p-4 flex flex-col items-center relative">
        {isSelected && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="h-6 w-6 text-blue-500" />
          </div>
        )}
        
        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 mt-2">
          <img 
            src={company.logo} 
            alt={`${company.name} logo`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h3 className="font-semibold text-lg mb-1">{company.name}</h3>
        
        <div className={`text-center py-1 px-3 rounded-full text-sm font-medium mt-2 ${colorClass}`}>
          Score: {company.averageScore}%
        </div>
        
        {isSelected && (
          <div className="mt-2 text-xs text-blue-600 font-medium">
            Selected for comparison
          </div>
        )}
      </CardContent>
    </Card>
  );
}