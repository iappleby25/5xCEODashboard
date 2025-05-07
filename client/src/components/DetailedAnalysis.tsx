import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, ComposedChart
} from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SurveyData, CompanyScores, formatRadarData, ComparisonData, createComparisonData } from '@/lib/dataProcessor';
import { useAuth } from "@/context/AuthContext";

// Colors for charts
const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#8b5cf6'];

interface DetailedAnalysisProps {
  filteredData: SurveyData[];
  currentViewLevel: string;
  selectedCompany?: string;
  selectedRole?: string;
}

const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ 
  filteredData, 
  currentViewLevel, 
  selectedCompany, 
  selectedRole 
}) => {
  // Get the user role to determine what should be shown
  const { user } = useAuth();
  // State for dialog to show company-specific scores
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [companyScores, setCompanyScores] = useState<Array<{ company: string; score: number }>>([]);
  
  // State for comparison view
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  // Effect to handle comparison view
  useEffect(() => {
    // Only process comparison data when in compare view
    if (currentViewLevel === "compare" && selectedCompany) {
      console.log("Selected company:", selectedCompany);
      console.log("All filtered data:", filteredData);
      
      // For Leadership Team users, we want to compare their individual scores to the company average
      
      // First, filter for Leadership Team data specifically when available
      let individualData = filteredData.filter(item => 
        item.role === "LEADERSHIP TEAM" && item.companyName === selectedCompany
      );
      
      // If no Leadership Team data available, fall back to other roles
      if (individualData.length === 0) {
        individualData = filteredData.filter(item => 
          item.role === "CEO" && item.companyName === selectedCompany
        );
      }
      
      // Then get all data for the company to calculate average
      // Since we don't have a specific "COMPANY" role in our mock data, we'll use all entries for this company
      const companyData = filteredData.filter(item => 
        item.companyName === selectedCompany
      );
      
      console.log("Individual data:", individualData);
      console.log("Company data:", companyData);
      
      // Create comparison data - if no individual data, just use company data twice
      // This is just for demo purposes to ensure the UI shows something
      let compData: ComparisonData[] = [];
      if (individualData.length > 0) {
        compData = createComparisonData(individualData, companyData);
      } else if (companyData.length > 0) {
        // For demo, create a synthetic comparison if no individual data exists
        const demoCompany = { ...companyData[0] };
        demoCompany.role = "LEADERSHIP TEAM";
        compData = createComparisonData([demoCompany], companyData);
      }
      
      console.log("Comparison data:", compData);
      
      setComparisonData(compData);
      setShowComparison(true);
    } else {
      setShowComparison(false);
    }
  }, [currentViewLevel, selectedCompany, filteredData]);

  // Handle click on a bar in the chart
  const handleBarClick = (data: any, index: number) => {
    const category = data.name;
    const categoryKey = getCategoryKey(category);
    
    if (categoryKey) {
      // Create a Map to store unique companies with their scores
      const companyScoreMap = new Map<string, number>();
      
      // Populate the map with company names and scores
      filteredData
        .filter(item => item.scores && item.companyName)
        .forEach(item => {
          const companyName = item.companyName;
          const score = item.scores ? item.scores[categoryKey as keyof CompanyScores] : 0;
          
          // If company already exists in map, we keep the highest score
          if (companyScoreMap.has(companyName)) {
            const existingScore = companyScoreMap.get(companyName) || 0;
            if (score > existingScore) {
              companyScoreMap.set(companyName, score);
            }
          } else {
            companyScoreMap.set(companyName, score);
          }
        });
      
      // Convert map to array and sort
      const scores = Array.from(companyScoreMap.entries())
        .map(([company, score]) => ({ company, score }))
        .sort((a, b) => b.score - a.score); // Sort highest to lowest
      
      setSelectedCategory(category);
      setCompanyScores(scores);
      setDialogOpen(true);
    }
  };

  // Convert category display name to the key in CompanyScores
  const getCategoryKey = (category: string): string | null => {
    switch (category) {
      case 'Strategic Clarity': return 'strategicClarity';
      case 'Scalable Talent': return 'scalableTalent';
      case 'Relentless Focus': return 'relentlessFocus';
      case 'Disciplined Execution': return 'disciplinedExecution';
      case 'Energized Culture': return 'energizedCulture';
      default: return null;
    }
  };
  // Calculate average scores across all dimensions
  const aggregateScores = (): CompanyScores => {
    if (!filteredData.length) {
      return {
        strategicClarity: 0,
        scalableTalent: 0,
        relentlessFocus: 0,
        disciplinedExecution: 0,
        energizedCulture: 0,
        totalScore: 0
      };
    }

    const validScores = filteredData.filter(item => item.scores);
    if (!validScores.length) return {
      strategicClarity: 0,
      scalableTalent: 0,
      relentlessFocus: 0,
      disciplinedExecution: 0,
      energizedCulture: 0,
      totalScore: 0
    };

    const total = {
      strategicClarity: 0,
      scalableTalent: 0,
      relentlessFocus: 0,
      disciplinedExecution: 0,
      energizedCulture: 0,
      totalScore: 0
    };

    validScores.forEach(item => {
      if (item.scores) {
        total.strategicClarity += item.scores.strategicClarity;
        total.scalableTalent += item.scores.scalableTalent;
        total.relentlessFocus += item.scores.relentlessFocus;
        total.disciplinedExecution += item.scores.disciplinedExecution;
        total.energizedCulture += item.scores.energizedCulture;
        total.totalScore += item.scores.totalScore;
      }
    });

    return {
      strategicClarity: Math.round(total.strategicClarity / validScores.length),
      scalableTalent: Math.round(total.scalableTalent / validScores.length),
      relentlessFocus: Math.round(total.relentlessFocus / validScores.length),
      disciplinedExecution: Math.round(total.disciplinedExecution / validScores.length),
      energizedCulture: Math.round(total.energizedCulture / validScores.length),
      totalScore: Math.round(total.totalScore / validScores.length)
    };
  };

  const averageScores = aggregateScores();

  // Prepare data for bar chart
  const prepareBarChartData = () => {
    return [
      { name: 'Strategic Clarity', value: averageScores.strategicClarity },
      { name: 'Scalable Talent', value: averageScores.scalableTalent },
      { name: 'Relentless Focus', value: averageScores.relentlessFocus },
      { name: 'Disciplined Execution', value: averageScores.disciplinedExecution },
      { name: 'Energized Culture', value: averageScores.energizedCulture },
    ];
  };

  // Prepare data for pie chart (distribution of scores)
  const preparePieChartData = () => {
    const categories = [
      { name: 'Strategic Clarity', value: averageScores.strategicClarity },
      { name: 'Scalable Talent', value: averageScores.scalableTalent },
      { name: 'Relentless Focus', value: averageScores.relentlessFocus },
      { name: 'Disciplined Execution', value: averageScores.disciplinedExecution },
      { name: 'Energized Culture', value: averageScores.energizedCulture },
    ];
    return categories;
  };

  // Prepare comparative data across companies (if available)
  const prepareCompanyComparison = () => {
    const companies = new Map<string, CompanyScores>();
    
    filteredData.forEach(item => {
      if (item.scores && item.companyName) {
        companies.set(item.companyName, item.scores);
      }
    });

    return Array.from(companies.entries()).map(([name, scores]) => ({
      name,
      ...scores
    }));
  };

  // Get radar data for the chosen context
  const getRadarData = () => {
    return formatRadarData(averageScores);
  };

  // Find the highest and lowest scoring areas
  const findStrengthsAndWeaknesses = () => {
    const scores = [
      { name: 'Strategic Clarity', value: averageScores.strategicClarity },
      { name: 'Scalable Talent', value: averageScores.scalableTalent },
      { name: 'Relentless Focus', value: averageScores.relentlessFocus },
      { name: 'Disciplined Execution', value: averageScores.disciplinedExecution },
      { name: 'Energized Culture', value: averageScores.energizedCulture },
    ];

    const sortedScores = [...scores].sort((a, b) => b.value - a.value);
    return {
      strengths: sortedScores.slice(0, 2),
      weaknesses: sortedScores.slice(-2).reverse()
    };
  };

  const { strengths, weaknesses } = findStrengthsAndWeaknesses();

  // Add function to prepare comparison chart data
  const prepareComparisonChartData = () => {
    return comparisonData;
  };

  return (
    <div className="space-y-6">
      {/* Show special UI for comparison view */}
      {showComparison && currentViewLevel === "compare" && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              {comparisonData.length > 0 ? (
                <div className="h-[520px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={prepareComparisonChartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 160 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="subject" 
                        angle={-45} 
                        textAnchor="end"
                        height={140}
                        tick={{ dy: 70, fontSize: 14 }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tickCount={6}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="custom-tooltip bg-white p-2 border border-gray-200 rounded-md">
                                {payload.map((entry, index) => (
                                  <div key={index} className="flex items-center mb-1">
                                    <div 
                                      className="w-4 h-4 mr-2 rounded-sm" 
                                      style={{ backgroundColor: entry.dataKey === 'individual' ? '#8884d8' : '#ff7300' }}
                                    />
                                    <span className="mr-2">
                                      {entry.dataKey === 'individual' ? 'Individual' : 'Company Avg'}:
                                    </span>
                                    <span className="font-semibold">{entry.value}%</span>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        wrapperStyle={{ paddingTop: 80 }}
                        iconSize={12}
                        iconType="square"
                      />
                      <Bar 
                        dataKey="individual" 
                        name="Individual" 
                        fill="#8884d8" 
                        barSize={40}
                      />
                      <Line
                        type="monotone"
                        dataKey="company"
                        name="Company Avg"
                        stroke="#ff7300"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] bg-neutral-50 rounded-md border border-neutral-200">
                  <p className="text-neutral-500">No comparison data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Original analysis card - only show if not in comparison view */}
      {(!showComparison || currentViewLevel !== "compare") && (
        <Card>
          <CardHeader>
            <CardTitle>Framework Score Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comparative">Radar View</TabsTrigger>
                <TabsTrigger value="trends">Distribution</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">5xCEO Score Distribution</h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareBarChartData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={0} 
                          interval={0}
                          height={60}
                          tick={(props) => {
                            const { x, y, payload } = props;
                            const words = payload.value.split(' ');
                            return (
                              <g transform={`translate(${x},${y})`}>
                                {words.map((word: string, index: number) => (
                                  <text
                                    key={index}
                                    x={0}
                                    y={0}
                                    dy={14 + index * 12}
                                    textAnchor="middle"
                                    fill="#666"
                                    fontSize={12}
                                  >
                                    {word}
                                  </text>
                                ))}
                              </g>
                            );
                          }}
                        />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          fill="#2563eb" 
                          name="Score (%)" 
                          onClick={handleBarClick}
                          cursor="pointer"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comparative">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">5xCEO Score Radar</h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        cx="50%" 
                        cy="50%" 
                        outerRadius="80%" 
                        data={getRadarData()}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Average Scores"
                          dataKey="value"
                          stroke="#2563eb"
                          fill="#2563eb"
                          fillOpacity={0.6}
                        />
                        <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Score Distribution</h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={preparePieChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {preparePieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Detailed analysis cards - only show if not in comparison view */}
      {(!showComparison || currentViewLevel !== "compare") && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Strengths & Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-green-600 mb-2">Top Strengths</h3>
                  {strengths.map((item, index) => (
                    <div key={index} className="flex items-center justify-between mb-2 p-2 bg-green-50 rounded-md">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-md font-medium text-amber-600 mb-2">Areas for Improvement</h3>
                  {weaknesses.map((item, index) => (
                    <div key={index} className="flex items-center justify-between mb-2 p-2 bg-amber-50 rounded-md">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Average Score:</span>
                  <span className={`text-xl font-bold ${averageScores.totalScore >= 80 ? 'text-green-600' : averageScores.totalScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {averageScores.totalScore}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${averageScores.totalScore >= 80 ? 'bg-green-600' : averageScores.totalScore >= 60 ? 'bg-amber-500' : 'bg-red-600'}`}
                      style={{ width: `${averageScores.totalScore}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Needs Improvement</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Strategic Clarity</span>
                    <span>{averageScores.strategicClarity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scalable Talent</span>
                    <span>{averageScores.scalableTalent}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Relentless Focus</span>
                    <span>{averageScores.relentlessFocus}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Disciplined Execution</span>
                    <span>{averageScores.disciplinedExecution}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Energized Culture</span>
                    <span>{averageScores.energizedCulture}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Context Summary removed as requested */}

      {/* Dialog to show company scores when bar is clicked */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCategory} Scores by Company</DialogTitle>
            <DialogDescription>
              Click on any bar in the chart to view detailed scores for each company.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyScores.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.company}</TableCell>
                    <TableCell className="text-right">
                      <span 
                        className={`font-semibold ${
                          item.score >= 80 ? 'text-green-600' : 
                          item.score >= 60 ? 'text-amber-600' : 'text-red-600'
                        }`}
                      >
                        {item.score}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {companyScores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-neutral-500">
                      No company data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailedAnalysis;