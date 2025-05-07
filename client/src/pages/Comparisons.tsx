import React, { useState } from "react";
import CompanyTile from "@/components/CompanyTile";
import CompanyDetailDialog from "@/components/CompanyDetailDialog";
import CompanyComparison from "@/components/CompanyComparison";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { CompanyData } from "@/lib/dataProcessor";
import { mockCompanies } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, BarChart2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Comparisons() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical");
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyData[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Check if user is PE & BOD
  const isPortfolioUser = user?.role === 'PE & BOD';

  // Fetch companies data (using mock for now)
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['/api/companies'],
    queryFn: async () => {
      // In a real implementation, this would fetch from the API
      return Promise.resolve(mockCompanies);
    },
    // Only fetch if user is a PE & BOD user
    enabled: isPortfolioUser
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
    // If shift is pressed, add to comparison selection
    if (window.event && (window.event as MouseEvent).shiftKey) {
      handleCompanySelection(company);
    } else {
      // Normal click - open company details
      setSelectedCompany(company);
      setIsDetailOpen(true);
    }
  };

  // Close company detail dialog
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };
  
  // Handle company selection for comparison
  const handleCompanySelection = (company: CompanyData) => {
    setSelectedCompanies(prev => {
      // If already selected, remove it
      if (prev.some(c => c.id === company.id)) {
        return prev.filter(c => c.id !== company.id);
      }
      // Otherwise add it (limit to 4 companies for readability)
      else if (prev.length < 4) {
        return [...prev, company];
      }
      return prev;
    });
  };
  
  // Open company comparison dialog
  const handleOpenComparison = () => {
    if (selectedCompanies.length >= 2) {
      setIsComparisonOpen(true);
    }
  };
  
  // Close company comparison dialog
  const handleCloseComparison = () => {
    setIsComparisonOpen(false);
  };
  
  // Render restricted access message for non-PE & BOD users
  if (!isPortfolioUser) {
    return (
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Company Comparisons</h1>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center p-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                <Lock className="h-8 w-8 text-yellow-700" />
              </div>
              <h2 className="text-xl font-semibold text-yellow-800">Access Restricted</h2>
              <p className="text-yellow-700 max-w-md">
                Comparative insights are only available at the portfolio level. 
                Please log in with a PE & BOD account to access benchmarking across companies.
              </p>
              
              <div className="flex items-center justify-center mt-4 gap-2 bg-white p-4 rounded-lg border border-yellow-200 w-full max-w-md">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Your current role ({user?.role}) is limited to single-company view.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex flex-wrap justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Company Comparisons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hold <kbd className="px-1 py-0.5 text-xs bg-muted border rounded">Shift</kbd> + click on companies to select up to 4 for comparison
          </p>
        </div>
        
        {selectedCompanies.length >= 2 && (
          <Button 
            onClick={handleOpenComparison}
            className="flex items-center gap-1"
            variant="default"
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            Compare {selectedCompanies.length} Companies
          </Button>
        )}
      </div>
      
      {selectedCompanies.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h3 className="text-sm font-medium text-blue-700">Selected for comparison: {selectedCompanies.length}/4</h3>
              <span className="ml-2 text-xs text-blue-600">(Hold shift + click to select companies)</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCompanies([])}
              className="text-xs"
            >
              Clear Selection
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCompanies.map(company => (
              <div key={company.id} className="bg-white px-2 py-1 rounded border border-blue-300 flex items-center text-sm">
                {company.name}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-1 ml-1" 
                  onClick={() => handleCompanySelection(company)}
                >
                  <span className="sr-only">Remove</span>
                  <span className="text-xs">&times;</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
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
                  isSelected={selectedCompanies.some(c => c.id === company.id)}
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
                  isSelected={selectedCompanies.some(c => c.id === company.id)}
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
                  isSelected={selectedCompanies.some(c => c.id === company.id)}
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
                  isSelected={selectedCompanies.some(c => c.id === company.id)}
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
      
      {/* Company comparison dialog */}
      {selectedCompanies.length >= 2 && (
        <CompanyComparison
          companies={selectedCompanies}
          isOpen={isComparisonOpen}
          onClose={handleCloseComparison}
        />
      )}
    </div>
  );
}