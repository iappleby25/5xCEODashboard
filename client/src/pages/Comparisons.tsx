import React, { useState } from "react";
import CompanyTile from "@/components/CompanyTile";
import CompanyDetailDialog from "@/components/CompanyDetailDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { CompanyData } from "@/lib/dataProcessor";
import { mockCompanies } from "@/lib/mockData";

export default function Comparisons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical");
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch companies data (using mock for now)
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['/api/companies'],
    queryFn: async () => {
      // In a real implementation, this would fetch from the API
      return Promise.resolve(mockCompanies);
    },
  });

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort companies based on selected sort option
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === "alphabetical") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "score_high") {
      return b.averageScore - a.averageScore;
    } else if (sortBy === "score_low") {
      return a.averageScore - b.averageScore;
    }
    return 0;
  });

  // Get companies by performance (red, yellow, green)
  const greenCompanies = sortedCompanies.filter(c => c.averageScore >= 80);
  const yellowCompanies = sortedCompanies.filter(c => c.averageScore >= 60 && c.averageScore < 80);
  const redCompanies = sortedCompanies.filter(c => c.averageScore < 60);

  // Handle company tile click
  const handleCompanyClick = (company: CompanyData) => {
    setSelectedCompany(company);
    setIsDetailOpen(true);
  };

  // Close company detail dialog
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">Company Comparisons</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select defaultValue={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="score_high">Highest Score</SelectItem>
              <SelectItem value="score_low">Lowest Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Companies</TabsTrigger>
          <TabsTrigger value="performing">High Performing</TabsTrigger>
          <TabsTrigger value="average">Average Performing</TabsTrigger>
          <TabsTrigger value="struggling">Struggling</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">All Companies ({sortedCompanies.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedCompanies.map((company) => (
                <CompanyTile
                  key={company.id}
                  company={company}
                  onClick={handleCompanyClick}
                />
              ))}
              {sortedCompanies.length === 0 && (
                <div className="col-span-full text-center p-8 bg-neutral-50 rounded-md">
                  No companies found matching your search criteria.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performing" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">High Performing Companies ({greenCompanies.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {greenCompanies.map((company) => (
                <CompanyTile
                  key={company.id}
                  company={company}
                  onClick={handleCompanyClick}
                />
              ))}
              {greenCompanies.length === 0 && (
                <div className="col-span-full text-center p-8 bg-neutral-50 rounded-md">
                  No high performing companies found.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="average" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Average Performing Companies ({yellowCompanies.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {yellowCompanies.map((company) => (
                <CompanyTile
                  key={company.id}
                  company={company}
                  onClick={handleCompanyClick}
                />
              ))}
              {yellowCompanies.length === 0 && (
                <div className="col-span-full text-center p-8 bg-neutral-50 rounded-md">
                  No average performing companies found.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="struggling" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Struggling Companies ({redCompanies.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {redCompanies.map((company) => (
                <CompanyTile
                  key={company.id}
                  company={company}
                  onClick={handleCompanyClick}
                />
              ))}
              {redCompanies.length === 0 && (
                <div className="col-span-full text-center p-8 bg-neutral-50 rounded-md">
                  No struggling companies found.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CompanyDetailDialog
        company={selectedCompany}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}