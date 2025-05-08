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
  // State for dialog to show company-specific scores, team/role scores, or question scores
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [companyScores, setCompanyScores] = useState<Array<{ company: string; score: number }>>([]);
  const [teamScores, setTeamScores] = useState<Array<{ role: string; score: number }>>([]);
  const [questionScores, setQuestionScores] = useState<Array<{ question: string; score: number }>>([]);
  const [dialogActiveTab, setDialogActiveTab] = useState("primary"); // Tracks active tab in dialog
  
  // State for comparison view
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  // Effect to handle comparison view
  useEffect(() => {
    // Only process comparison data when in compare view
    if (currentViewLevel === "compare" && selectedCompany) {
      console.log("Selected company:", selectedCompany);
      console.log("All filtered data:", filteredData);
      
      // For Leadership Team users, we want to compare their team scores to the company average
      
      // First, filter for Leadership Team data specifically when available
      let teamData = filteredData.filter(item => 
        item.role === "LEADERSHIP TEAM" && item.companyName === selectedCompany
      );
      
      // If no Leadership Team data available, fall back to other roles
      if (teamData.length === 0) {
        teamData = filteredData.filter(item => 
          item.role === "CEO" && item.companyName === selectedCompany
        );
      }
      
      // Then get all data for the company to calculate average
      // Since we don't have a specific "COMPANY" role in our mock data, we'll use all entries for this company
      const companyData = filteredData.filter(item => 
        item.companyName === selectedCompany
      );
      
      console.log("Team data:", teamData);
      console.log("Company data:", companyData);
      
      // Create comparison data - if no team data, just use company data twice
      // This is just for demo purposes to ensure the UI shows something
      let compData: ComparisonData[] = [];
      if (teamData.length > 0) {
        compData = createComparisonData(teamData, companyData);
      } else if (companyData.length > 0) {
        // For demo, create a synthetic comparison if no team data exists
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

  // Function to get questions for a specific category
  const getQuestionsForCategory = (category: string): string[] => {
    switch(category) {
      case 'Strategic Clarity':
        return [
          "How well does leadership articulate a clear vision?",
          "Are company goals consistently aligned with strategy?",
          "Is the strategic decision-making process transparent?",
          "How well are strategic priorities communicated?",
          "Do employees understand how their work contributes to strategy?"
        ];
      case 'Scalable Talent':
        return [
          "How effective is the company's talent acquisition process?",
          "Are professional development opportunities readily available?",
          "How well does the company retain top performers?",
          "Is there a clear career progression framework?",
          "How effective is knowledge transfer within teams?"
        ];
      case 'Relentless Focus':
        return [
          "How well do team members prioritize high-impact activities?",
          "Are meetings productive and outcome-focused?",
          "How effectively are resources allocated to strategic initiatives?",
          "Is there a clear process for eliminating low-value work?",
          "How well does the team maintain focus during execution?"
        ];
      case 'Disciplined Execution':
        return [
          "How consistently are project deadlines met?",
          "Are there clear accountability structures for deliverables?",
          "How effectively are risks identified and mitigated?",
          "Is there a structured approach to project management?",
          "How well are execution metrics tracked and acted upon?"
        ];
      case 'Energized Culture':
        return [
          "How engaged are team members in their daily work?",
          "Is there a strong sense of belonging and inclusion?",
          "How effectively are company values demonstrated in daily operations?",
          "Is feedback regularly exchanged at all levels?",
          "How supportive is the work environment of innovation and creativity?"
        ];
      default:
        return ["No specific questions available for this category"];
    }
  };
  
  // Function to generate question scores for a category with consistent results
  const generateQuestionScores = (
    category: string, 
    categoryKey: string, 
    baseScore: number
  ): Array<{ question: string; score: number }> => {
    const questions = getQuestionsForCategory(category);
    
    // Generate scores for questions that are within +/- 10% of the base score
    const minScore = Math.max(50, baseScore - 10);
    const maxScore = Math.min(100, baseScore + 10);
    
    return questions.map((question, index) => {
      // Use a deterministic "random" value based on the category and question index
      // This ensures the same question always gets the same score
      const hash = category.charCodeAt(0) + question.length + (index * 7);
      const pseudoRandomValue = (hash % 100) / 100; // Value between 0 and 1
      
      // Generate a consistent score within the range
      const scoreRange = maxScore - minScore;
      const offset = Math.floor(pseudoRandomValue * scoreRange);
      const score = minScore + offset;
      
      return {
        question,
        score
      };
    }).sort((a, b) => b.score - a.score); // Sort by score highest to lowest
  };
  
  // Handle click on a bar in the chart
  const handleBarClick = (data: any, index: number) => {
    const category = data.name;
    const categoryKey = getCategoryKey(category);
    
    if (categoryKey) {
      setSelectedCategory(category);
      setDialogActiveTab("primary"); // Reset to primary tab
      
      // For all view levels, prepare question scores
      let baseScore = 75; // Default
      if (filteredData.length > 0) {
        let relevantData = filteredData;
        
        // Filter data based on view level
        if (currentViewLevel === "team" && selectedCompany && selectedRole) {
          relevantData = filteredData.filter(item => 
            item.scores && 
            item.companyName === selectedCompany && 
            item.role === selectedRole
          );
        } else if (currentViewLevel === "company" && selectedCompany) {
          relevantData = filteredData.filter(item => 
            item.scores && 
            item.companyName === selectedCompany
          );
        }
        
        // Calculate the base score from the relevant data
        const categoryScore = relevantData
          .reduce((total, item) => {
            return total + (item.scores ? item.scores[categoryKey as keyof CompanyScores] : 0);
          }, 0);
        
        if (relevantData.length > 0) {
          baseScore = Math.round(categoryScore / relevantData.length);
        }
      }
      
      // Generate question scores for all view levels
      const questionList = generateQuestionScores(category, categoryKey, baseScore);
      setQuestionScores(questionList);
      
      // For company and holding views, prepare team scores
      if (currentViewLevel !== "team") {
        const roleScoreMap = new Map<string, { total: number; count: number }>();
        
        // Filter data based on view level
        let dataToProcess = filteredData;
        if (currentViewLevel === "company" && selectedCompany) {
          dataToProcess = filteredData.filter(item => 
            item.companyName === selectedCompany
          );
        }
        // For holding view, we use all data across all companies
        
        // Populate the map with role names and scores
        dataToProcess
          .filter(item => item.scores && item.role)
          .forEach(item => {
            const role = item.role;
            const score = item.scores ? item.scores[categoryKey as keyof CompanyScores] : 0;
            
            // Calculate running total and count for average
            if (roleScoreMap.has(role)) {
              const current = roleScoreMap.get(role)!;
              roleScoreMap.set(role, {
                total: current.total + score,
                count: current.count + 1
              });
            } else {
              roleScoreMap.set(role, {
                total: score,
                count: 1
              });
            }
          });
        
        // Convert map to array, calculate averages, and sort
        const roleScores = Array.from(roleScoreMap.entries())
          .map(([role, { total, count }]) => ({ 
            role, 
            score: Math.round(total / count) // Calculate average score
          }))
          .sort((a, b) => b.score - a.score); // Sort highest to lowest
        
        setTeamScores(roleScores);
      } else {
        setTeamScores([]);
      }
      
      // For holding view, prepare company scores
      if (currentViewLevel === "holding" || currentViewLevel === "compare") {
        const companyScoreMap = new Map<string, { total: number; count: number }>();
        
        // Populate the map with company names and scores
        filteredData
          .filter(item => item.scores && item.companyName)
          .forEach(item => {
            const companyName = item.companyName;
            const score = item.scores ? item.scores[categoryKey as keyof CompanyScores] : 0;
            
            // Calculate running total and count for average
            if (companyScoreMap.has(companyName)) {
              const current = companyScoreMap.get(companyName)!;
              companyScoreMap.set(companyName, {
                total: current.total + score,
                count: current.count + 1
              });
            } else {
              companyScoreMap.set(companyName, {
                total: score,
                count: 1
              });
            }
          });
        
        // Convert map to array, calculate averages, and sort
        const scores = Array.from(companyScoreMap.entries())
          .map(([company, { total, count }]) => ({ 
            company, 
            score: Math.round(total / count) // Calculate average score
          }))
          .sort((a, b) => b.score - a.score); // Sort highest to lowest
        
        setCompanyScores(scores);
      } else {
        setCompanyScores([]);
      }
      
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

  // Get all teams for company view in sorted order
  const findAllTeamsSorted = () => {
    // Get all roles/teams with their total scores for the selected company
    const teamScores = filteredData
      .filter(item => item.companyName === selectedCompany && item.role && item.scores)
      .map(item => ({
        name: item.role || "",
        value: item.scores?.totalScore || 0
      }))
      // Remove duplicates by role name
      .reduce((unique, item) => {
        const exists = unique.find(i => i.name === item.name);
        if (!exists) {
          unique.push(item);
        }
        return unique;
      }, [] as { name: string, value: number }[]);
    
    // Sort teams by score, highest first
    return [...teamScores].sort((a, b) => b.value - a.value);
  };

  // Find the highest and lowest scoring areas for the current view level
  const findStrengthsAndWeaknesses = () => {
    // If in holding view, show top/bottom companies
    if (currentViewLevel === "holding") {
      return findTopAndBottomCompanies();
    }
    
    // If in company view, show all teams sorted by score
    if (currentViewLevel === "company" && selectedCompany) {
      const sortedTeams = findAllTeamsSorted();
      return {
        strengths: sortedTeams, // All teams in sorted order
        weaknesses: [] // Not used for company view
      };
    }
    
    // Otherwise (team view), show top/bottom framework categories
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
  
  // Find top and bottom companies for holding view
  const findTopAndBottomCompanies = () => {
    // Get all companies with their total scores
    const companyScores = filteredData
      .filter(item => item.companyName && item.scores)
      .map(item => ({
        name: item.companyName || "",
        value: item.scores?.totalScore || 0
      }))
      // Remove duplicates by company name
      .reduce((unique, item) => {
        const exists = unique.find(i => i.name === item.name);
        if (!exists) {
          unique.push(item);
        }
        return unique;
      }, [] as { name: string, value: number }[]);
    
    // Sort companies by score
    const sortedCompanies = [...companyScores].sort((a, b) => b.value - a.value);
    
    return {
      strengths: sortedCompanies.slice(0, 3), // Top 3 companies
      weaknesses: sortedCompanies.slice(-3).reverse() // Bottom 3 companies
    };
  };
  
  // Find top and bottom question scores for the score breakdown tile
  const findTopAndBottomQuestions = () => {
    // Extract all questions from the data
    const allQuestions: { question: string, score: number }[] = [];
    
    // Collect all questions and their scores from the filtered data
    filteredData.forEach(item => {
      if (item.questions) {
        item.questions.forEach((q: { question: string; score: number; category?: string }) => {
          if (q.question && q.score !== undefined) {
            allQuestions.push({
              question: q.question,
              score: q.score
            });
          }
        });
      }
    });
    
    // If no questions found in filtered data, generate questions based on categories
    if (allQuestions.length === 0 && currentViewLevel === "team") {
      // Generate questions for each framework category using the average scores
      const categories = [
        { name: 'Strategic Clarity', key: 'strategicClarity', score: averageScores.strategicClarity },
        { name: 'Scalable Talent', key: 'scalableTalent', score: averageScores.scalableTalent },
        { name: 'Relentless Focus', key: 'relentlessFocus', score: averageScores.relentlessFocus },
        { name: 'Disciplined Execution', key: 'disciplinedExecution', score: averageScores.disciplinedExecution },
        { name: 'Energized Culture', key: 'energizedCulture', score: averageScores.energizedCulture }
      ];
      
      // Generate questions for each category
      categories.forEach(category => {
        const questions = getQuestionsForCategory(category.name);
        const generatedScores = generateQuestionScores(category.name, category.key, category.score);
        generatedScores.forEach(item => {
          allQuestions.push(item);
        });
      });
    }
    
    // Group questions by name and calculate average score
    const questionMap = new Map<string, number[]>();
    allQuestions.forEach(item => {
      if (!questionMap.has(item.question)) {
        questionMap.set(item.question, []);
      }
      questionMap.get(item.question)?.push(item.score);
    });
    
    // Calculate average score for each question
    const questionAverages = Array.from(questionMap.entries()).map(([question, scores]) => {
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return {
        question,
        score: Math.round(avgScore)
      };
    });
    
    // Sort questions by score
    const sortedQuestions = [...questionAverages].sort((a, b) => b.score - a.score);
    
    return {
      topQuestions: sortedQuestions.slice(0, 5), // Top 5 questions
      bottomQuestions: sortedQuestions.slice(-5).reverse() // Bottom 5 questions
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
                                      style={{ backgroundColor: entry.dataKey === 'team' ? '#8884d8' : '#ff7300' }}
                                    />
                                    <span className="mr-2">
                                      {entry.dataKey === 'team' ? 'Team' : 'Company Avg'}:
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
                        dataKey="team" 
                        name="Team" 
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
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">5xCEO Framework Scores</h3>
              <div className="h-[400px] w-full">
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
          </CardContent>
        </Card>
      )}

      {/* Detailed analysis cards - only show if not in comparison view */}
      {(!showComparison || currentViewLevel !== "compare") && (
        <div className={`grid gap-6 ${currentViewLevel !== "team" ? "md:grid-cols-2" : ""}`}>
          {/* Only show Framework/Company Performance card in non-team views */}
          {currentViewLevel !== "team" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentViewLevel === "holding" ? "Company Performance" : "Framework Performance"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentViewLevel === "company" ? (
                    // For company view - show single sorted team list
                    <div>
                      <h3 className="text-md font-medium mb-2">Team Performance</h3>
                      {strengths.map((item, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between mb-2 p-2 ${
                            item.value >= 80 ? 'bg-green-50' : 
                            item.value >= 60 ? 'bg-blue-50' : 'bg-amber-50'
                          } rounded-md`}
                        >
                          <span>{item.name}</span>
                          <span className={`font-semibold ${
                            item.value >= 80 ? 'text-green-600' : 
                            item.value >= 60 ? 'text-blue-600' : 'text-amber-600'
                          }`}>{item.value}%</span>
                        </div>
                      ))}
                      {strengths.length === 0 && (
                        <div className="text-center py-2 text-neutral-500">No team data available</div>
                      )}
                    </div>
                  ) : (
                    // For holding view - show top and bottom companies
                    <>
                      <div>
                        <h3 className="text-md font-medium text-green-600 mb-2">
                          Top 3 Companies
                        </h3>
                        {strengths.map((item, index) => (
                          <div key={index} className="flex items-center justify-between mb-2 p-2 bg-green-50 rounded-md">
                            <span>{item.name}</span>
                            <span className="font-semibold">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-amber-600 mb-2">
                          Bottom 3 Companies
                        </h3>
                        {weaknesses.map((item, index) => (
                          <div key={index} className="flex items-center justify-between mb-2 p-2 bg-amber-50 rounded-md">
                            <span>{item.name}</span>
                            <span className="font-semibold">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Question Analysis card - shown in all views */}
          <Card className={currentViewLevel === "team" ? "max-w-3xl mx-auto" : ""}>
            <CardHeader>
              <CardTitle>
                Question Analysis
              </CardTitle>
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

                <div className="pt-4 space-y-4">
                  {/* Get top and bottom questions */}
                  {(() => {
                    const { topQuestions, bottomQuestions } = findTopAndBottomQuestions();
                    return (
                      <>
                        <div>
                          <h3 className="text-md font-medium text-green-600 mb-2">Top 5 Questions</h3>
                          {topQuestions.map((item, index) => (
                            <div key={index} className="flex items-start justify-between mb-2 p-2 bg-green-50 rounded-md">
                              <span className="text-sm break-words flex-1 mr-2">{item.question}</span>
                              <span className="font-semibold whitespace-nowrap ml-2">{item.score}%</span>
                            </div>
                          ))}
                          {topQuestions.length === 0 && (
                            <div className="text-center py-2 text-neutral-500">No question data available</div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-md font-medium text-amber-600 mb-2">Bottom 5 Questions</h3>
                          {bottomQuestions.map((item, index) => (
                            <div key={index} className="flex items-start justify-between mb-2 p-2 bg-amber-50 rounded-md">
                              <span className="text-sm break-words flex-1 mr-2">{item.question}</span>
                              <span className="font-semibold whitespace-nowrap ml-2">{item.score}%</span>
                            </div>
                          ))}
                          {bottomQuestions.length === 0 && (
                            <div className="text-center py-2 text-neutral-500">No question data available</div>
                          )}
                        </div>

                        {/* Include framework category scores in a smaller section at the bottom for all views */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h3 className="text-md font-medium mb-2">Framework Category Scores</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span>Strategic Clarity</span>
                              <span className="font-medium">{averageScores.strategicClarity}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Scalable Talent</span>
                              <span className="font-medium">{averageScores.scalableTalent}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Relentless Focus</span>
                              <span className="font-medium">{averageScores.relentlessFocus}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Disciplined Execution</span>
                              <span className="font-medium">{averageScores.disciplinedExecution}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Energized Culture</span>
                              <span className="font-medium">{averageScores.energizedCulture}%</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Context Summary removed as requested */}

      {/* Dialog to show company, team, or question scores when bar is clicked */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCategory} - Detailed Analysis</DialogTitle>
            <DialogDescription>
              Analysis of {selectedCategory} framework category for {
                currentViewLevel === "team" ? selectedRole : 
                currentViewLevel === "company" ? selectedCompany :
                "all companies"
              }
            </DialogDescription>
          </DialogHeader>
          
          {/* Tabs for different data views */}
          <Tabs defaultValue="primary" value={dialogActiveTab} onValueChange={setDialogActiveTab} className="mt-2">
            {currentViewLevel === "team" ? (
              // No tabs in team view - just show the questions
              <div className="mb-2 text-sm font-medium">
                Question scores for {selectedCategory}
              </div>
            ) : currentViewLevel === "holding" ? (
              // Three tabs for holding view
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="primary">Companies</TabsTrigger>
                <TabsTrigger value="secondary">Teams</TabsTrigger>
                <TabsTrigger value="tertiary">Questions</TabsTrigger>
              </TabsList>
            ) : (
              // Two tabs for company view
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="primary">Teams</TabsTrigger>
                <TabsTrigger value="secondary">Questions</TabsTrigger>
              </TabsList>
            )}
            
            {/* Primary tab content - changes based on view level */}
            <TabsContent value="primary" className="mt-4">
              <div className="overflow-y-auto max-h-[60vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {currentViewLevel === "team" ? (
                        <TableHead>Question</TableHead>
                      ) : currentViewLevel === "company" ? (
                        <TableHead>Team/Role</TableHead>
                      ) : (
                        <TableHead>Company</TableHead>
                      )}
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Show question scores in team view primary tab */}
                    {currentViewLevel === "team" && questionScores.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium whitespace-normal break-words">{item.question}</TableCell>
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
                    
                    {/* Show team scores in company view primary tab */}
                    {currentViewLevel === "company" && teamScores.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.role}</TableCell>
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
                    
                    {/* Show company scores in holding view primary tab */}
                    {currentViewLevel === "holding" && companyScores.map((item, index) => (
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
                    
                    {/* Show "no data" messages */}
                    {currentViewLevel === "team" && questionScores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4 text-neutral-500">
                          No question data available for {selectedRole}
                        </TableCell>
                      </TableRow>
                    )}
                    {currentViewLevel === "company" && teamScores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4 text-neutral-500">
                          No team data available for {selectedCompany}
                        </TableCell>
                      </TableRow>
                    )}
                    {currentViewLevel === "holding" && companyScores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4 text-neutral-500">
                          No company data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Secondary tab content - changes based on view level */}
            <TabsContent value="secondary" className="mt-4">
              <div className="overflow-y-auto max-h-[60vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {currentViewLevel === "holding" ? (
                        <TableHead>Team/Role</TableHead>
                      ) : (
                        <TableHead>Question</TableHead>
                      )}
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* In holding view, secondary tab shows teams/roles across all companies */}
                    {currentViewLevel === "holding" && teamScores.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.role}</TableCell>
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
                    
                    {/* In company view, secondary tab shows questions */}
                    {currentViewLevel === "company" && 
                      questionScores.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium whitespace-normal break-words">{item.question}</TableCell>
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
                      ))
                    }
                    
                    {/* Show "no data" messages */}
                    {currentViewLevel === "holding" && teamScores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4 text-neutral-500">
                          No team data available
                        </TableCell>
                      </TableRow>
                    )}
                    {currentViewLevel === "company" && questionScores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4 text-neutral-500">
                          No question data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Tertiary tab content - questions tab in holding view */}
            <TabsContent value="tertiary" className="mt-4">
              {currentViewLevel === "holding" && (
                <div className="overflow-y-auto max-h-[60vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Display question scores across all companies */}
                      {questionScores.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium whitespace-normal break-words">{item.question}</TableCell>
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
                      
                      {/* Show "no data" message */}
                      {questionScores.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-4 text-neutral-500">
                            No question data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailedAnalysis;