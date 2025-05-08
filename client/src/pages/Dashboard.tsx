import React, { useState, useEffect } from "react";
import FilterBar, { ViewLevel, TimePeriod } from "@/components/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import KpiCards from "@/components/KpiCards";
import DataTable from "@/components/DataTable";
import DetailedAnalysis from "@/components/DetailedAnalysis";
import AiInsightsView from "@/components/AiInsightsView";
import { filterSurveyData, getUniqueCompanies, getUniqueRoles, SurveyData, ViewLevelType } from "@/lib/dataProcessor";
import { useQuery } from "@tanstack/react-query";
import { mockCompanies, getMockSurveyData, mockSurveyData as allMockSurveyData } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  // Previously PE & BOD users were redirected to Comparisons page
  // Now we allow them to access the Dashboard as well
  
  // Define view levels for the filter based on user role (order flipped as requested)
  const viewLevels: ViewLevel[] = user?.role === 'ADMIN'
    ? [
        { value: "all", label: "All Survey Takers" },
        { value: "holding", label: "Holding" },
        { value: "company", label: "Company" },
        { value: "team", label: "Team" }
      ]
    : user?.role === 'PE & BOD'
    ? [
        { value: "holding", label: "Holding" },
        { value: "company", label: "Company" },
        { value: "team", label: "Team" }
      ]
    : user?.role === 'CEO'
    ? [
        { value: "company", label: "Company" },
        { value: "team", label: "Team" }
      ]
    : user?.role === 'LEADERSHIP TEAM'
    ? [
        { value: "company", label: "Company" },
        { value: "team", label: "Team" },
        { value: "compare", label: "Compare" }
      ]
    : [
        { value: "company", label: "Company" },
        { value: "team", label: "Team" }
      ];

  // Define time periods for the filter
  const timePeriods: TimePeriod[] = [
    { value: "q2_2023", label: "Q2 2023" },
    { value: "q1_2023", label: "Q1 2023" },
    { value: "q4_2022", label: "Q4 2022" },
    { value: "q3_2022", label: "Q3 2022" },
    { value: "all", label: "All Time" }
  ];

  // State for filters - default to appropriate view level based on user role
  const getDefaultViewLevel = (): ViewLevelType => {
    if (user?.role === 'ADMIN') return "all"; // Admin defaults to all survey takers view
    if (user?.role === 'PE & BOD') return "holding";
    if (user?.role === 'CEO' || user?.role === 'LEADERSHIP TEAM') return "company";
    return "team"; // Default to team view for other users instead of individual
  };
  const [currentViewLevel, setCurrentViewLevel] = useState<ViewLevelType>(getDefaultViewLevel());
  const [currentTimePeriod, setCurrentTimePeriod] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [surveyTypeFilter, setSurveyTypeFilter] = useState("all");
  const [responseStatusFilter, setResponseStatusFilter] = useState("all");
  
  // For CEO/LEADERSHIP users, default to their company (GlobalSolutions)
  const defaultCompany = (user?.role !== 'PE & BOD' && user?.role !== 'ADMIN') ? "GlobalSolutions" : undefined;
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(defaultCompany);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [selectedFirm, setSelectedFirm] = useState<string | undefined>("placeholder");
  
  // Convert mockCompanies to SurveyData format for consistency with Dashboard view
  const convertedMockSurveyData: SurveyData[] = mockCompanies.map(company => ({
    companyName: company.name,
    role: "COMPANY", // Default role for converted companies
    responses: {
      id: company.id,
      totalPoints: company.averageScore,
      status: "complete"
    },
    scores: company.scores,
    logo: company.logo
  }));

  // Get survey data with question information
  const surveyDataWithQuestions = getMockSurveyData();
  
  // Combine all survey data sources to ensure we have all companies and question data
  const combinedMockSurveyData = [
    ...allMockSurveyData,
    ...surveyDataWithQuestions.filter(item => 
      !allMockSurveyData.some(existingItem => 
        existingItem.companyName === item.companyName && existingItem.role === item.role
      )
    ),
    ...convertedMockSurveyData.filter(
      item => !allMockSurveyData.some(existingItem => existingItem.companyName === item.companyName)
    )
  ];

  // Compute filtered data based on selected filters
  const [filteredData, setFilteredData] = useState<SurveyData[]>(combinedMockSurveyData);

  // Get unique companies and roles
  const companies = getUniqueCompanies(combinedMockSurveyData);
  const roles = getUniqueRoles(combinedMockSurveyData);

  // Fetch survey data (simulated)
  const { data: surveyData, isLoading } = useQuery({
    queryKey: ['/api/surveys'],
    queryFn: async () => {
      // In a real implementation, this would fetch from the API
      return Promise.resolve(combinedMockSurveyData);
    },
  });

  // Set default selections when view level changes or component mounts
  useEffect(() => {
    if (surveyData && companies.length > 0 && roles.length > 0) {
      // Set default company for company and team views
      if ((currentViewLevel === "company" || currentViewLevel === "team") && !selectedCompany) {
        if (user?.role !== "PE & BOD" && user?.role !== "ADMIN") {
          setSelectedCompany("GlobalSolutions");
        } else {
          setSelectedCompany(companies[0]);
        }
      }
      
      // Set default role for team view
      if (currentViewLevel === "team" && !selectedRole) {
        setSelectedRole(roles[0]);
      }
    }
  }, [currentViewLevel, companies, roles, surveyData, selectedCompany, selectedRole, user?.role]);

  // Apply filters when dependencies change
  useEffect(() => {
    if (surveyData) {
      const filtered = filterSurveyData(
        surveyData,
        currentViewLevel,
        selectedCompany,
        selectedRole
      );
      setFilteredData(filtered);
    }
  }, [
    surveyData,
    currentViewLevel,
    selectedCompany,
    selectedRole,
    currentTimePeriod,
    departmentFilter,
    surveyTypeFilter,
    responseStatusFilter
  ]);

  // Handle view level change
  const handleViewLevelChange = (value: string) => {
    // For non-PE/BOD/ADMIN users, prevent setting view level to holding
    if (value === "holding" && user?.role !== "PE & BOD" && user?.role !== "ADMIN") {
      return;
    }
    
    // For non-ADMIN users, prevent setting view level to all
    if (value === "all" && user?.role !== "ADMIN") {
      return;
    }
    
    setCurrentViewLevel(value as ViewLevelType);
    
    // Set appropriate defaults based on view level
    if (value === "all") {
      // Reset both company and role when in all view
      setSelectedCompany(undefined);
      setSelectedRole(undefined);
    } else if (value === "holding") {
      // Reset both company and role when in holding view
      setSelectedCompany(undefined);
      setSelectedRole(undefined);
    } else if (value === "company") {
      // Set default company for company view (GlobalSolutions for CEO/Leadership, first company for others)
      if (user?.role !== "PE & BOD" && user?.role !== "ADMIN") {
        setSelectedCompany("GlobalSolutions");
      } else if (companies.length > 0) {
        setSelectedCompany(companies[0]);
      }
      // Clear role selection in company view
      setSelectedRole(undefined);
    } else if (value === "team") {
      // Set default company and role for team view
      if (user?.role !== "PE & BOD" && user?.role !== "ADMIN") {
        setSelectedCompany("GlobalSolutions");
      } else if (companies.length > 0) {
        setSelectedCompany(companies[0]);
      }
      
      // Set default role for team view - for LEADERSHIP TEAM users, always set to LEADERSHIP TEAM role
      if (user?.role === "LEADERSHIP TEAM") {
        setSelectedRole("LEADERSHIP TEAM");
      } else if (roles.length > 0) {
        setSelectedRole(roles[0]);
      }
    }
  };

  // Handle company change
  const handleCompanyChange = (value: string) => {
    // Only PE & BOD and ADMIN users can change companies freely
    // Other roles are locked to GlobalSolutions, but we don't want to restrict them from selecting it
    setSelectedCompany(value);
    
    if (currentViewLevel === "team") {
      // Reset role when changing company in team view
      setSelectedRole(undefined);
    }
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };
  
  // Handle firm change
  const handleFirmChange = (value: string) => {
    // For PE & BOD users, always set to placeholder regardless of the attempted value
    if (user?.role === 'PE & BOD') {
      setSelectedFirm("placeholder");
    } else {
      // For other users, allow changing the firm
      setSelectedFirm(value);
    }
  };

  return (
    <div className="flex-1">
      {/* Show filter bar for all users, CEO can now switch between views */}
      <FilterBar
        viewLevels={viewLevels}
        timePeriods={timePeriods}
        currentViewLevel={currentViewLevel}
        currentTimePeriod={currentTimePeriod}
        showAdvancedFilters={showAdvancedFilters}
        departmentFilter={departmentFilter}
        surveyTypeFilter={surveyTypeFilter}
        responseStatusFilter={responseStatusFilter}
        selectedCompany={selectedCompany}
        selectedRole={selectedRole}
        selectedFirm={selectedFirm}
        companies={companies}
        roles={roles}
        // Handle all filter changes - conditionally based on user role
        onViewLevelChange={handleViewLevelChange}
        onTimePeriodChange={setCurrentTimePeriod}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        onDepartmentFilterChange={setDepartmentFilter}
        onSurveyTypeFilterChange={setSurveyTypeFilter}
        onResponseStatusFilterChange={setResponseStatusFilter}
        onCompanyChange={handleCompanyChange}
        onRoleChange={handleRoleChange}
        onFirmChange={handleFirmChange}
      />

      <div className="p-4">
        <Tabs 
          defaultValue={(() => {
            // Check if there's a tab parameter in the URL
            const searchParams = new URLSearchParams(window.location.search);
            const tabParam = searchParams.get('tab');
            
            // Return the tab param if valid, otherwise use role-based default
            if (tabParam && ['overview', 'details', 'insights'].includes(tabParam)) {
              return tabParam;
            }
            
            // Default behavior based on user role
            return user?.role === 'CEO' || user?.role === 'LEADERSHIP TEAM' ? "details" : "overview";
          })()}
          className="w-full"
        >
          <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current View Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {viewLevels.find(level => level.value === currentViewLevel)?.label || "Holding"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentViewLevel === "team" ? "Company + Role" : 
                     currentViewLevel === "company" ? "Company only" : 
                     currentViewLevel === "holding" ? "All companies in firm" : 
                     currentViewLevel === "all" ? "All survey takers across all firms" : "All data"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Selected Company
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedCompany || "All Companies"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(currentViewLevel === "team" || currentViewLevel === "company") ? 
                      "Filtered to specific company" : "No company filter applied"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Selected Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedRole || "All Roles"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentViewLevel === "team" ? 
                      "Filtered to specific role" : "No role filter applied"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <KpiCards />

            <Card>
              <CardHeader>
                <CardTitle>Data Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-neutral-500">Total Records</span>
                      <span className="text-2xl font-bold">
                        {filteredData?.length || 0}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-neutral-500">Companies</span>
                      <span className="text-2xl font-bold">
                        {getUniqueCompanies(filteredData).length}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-neutral-500">Roles</span>
                      <span className="text-2xl font-bold">
                        {getUniqueRoles(filteredData).length}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-neutral-500">Avg. Score</span>
                      <span className="text-2xl font-bold">
                        {filteredData.length > 0
                          ? Math.round(
                              filteredData.reduce(
                                (sum, item) => sum + (item.responses.totalPoints || 0),
                                0
                              ) / filteredData.length
                            )
                          : 0}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Filtered Data Preview</h3>
                    <div className="border rounded-md">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Company
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Total Points
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          {filteredData.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                                {item.companyName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                {item.role}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                {item.responses.totalPoints}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                {item.responses.status}
                              </td>
                            </tr>
                          ))}
                          {filteredData.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-4 text-center text-sm text-neutral-500">
                                No data available with current filters
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <DetailedAnalysis 
              filteredData={filteredData} 
              currentViewLevel={currentViewLevel}
              selectedCompany={selectedCompany}
              selectedRole={selectedRole}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4 mt-4">
            {/* Show context summary for all users except CEO and LEADERSHIP TEAM */}
            <Card className="border-primary/10 bg-primary/5">
              <CardContent className="pt-4">
                <p className="text-neutral-600">
                  AI-generated insights based on the filtered data for view level:
                  <strong>
                    {" "}
                    {viewLevels.find(level => level.value === currentViewLevel)?.label || "Holding"}
                  </strong>
                </p>
              </CardContent>
            </Card>
            
            <AiInsightsView surveyId={1} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}