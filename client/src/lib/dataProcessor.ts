// Define types for our data
export type ViewLevelType = "individual" | "team" | "company" | "holding" | "compare";

// Company score categories based on the 5xCEO framework
export interface CompanyScores {
  strategicClarity: number;
  scalableTalent: number;
  relentlessFocus: number;
  disciplinedExecution: number;
  energizedCulture: number;
  totalScore: number;
}

export interface SurveyData {
  companyName: string;
  role: string;
  responses: {
    id: number;
    totalPoints: number;
    status: string;
  };
  scores?: CompanyScores;
  logo?: string;
}

// Define company data with 5xCEO framework scores
export interface CompanyData {
  id: number;
  name: string;
  logo: string;
  averageScore: number;
  scores: CompanyScores;
  insights: string[];
}

// Filter survey data based on selected filters
export function filterSurveyData(
  data: SurveyData[],
  viewLevel: ViewLevelType,
  company?: string,
  role?: string
): SurveyData[] {
  if (!data || data.length === 0) return [];

  let filtered = [...data];

  // Apply company filter if applicable based on view level
  if ((viewLevel === "company" || viewLevel === "team" || viewLevel === "compare") && company) {
    filtered = filtered.filter(item => item.companyName === company);
  }

  // Apply role filter if applicable based on view level
  if (viewLevel === "team" && role) {
    filtered = filtered.filter(item => item.role === role);
  }

  // For individual level, we'd typically filter by a specific user
  // This would be implemented when user data is available
  
  // For compare view, we include individuals and company aggregate
  if (viewLevel === "compare" && company) {
    // We're already filtered to the company by the code above
    // The DetailedAnalysis component will handle the comparison logic
  }

  return filtered;
}

// Get a list of unique companies from the survey data
export function getUniqueCompanies(data: SurveyData[]): string[] {
  if (!data || data.length === 0) return [];
  const companies = new Set<string>();
  data.forEach(item => {
    if (item.companyName) {
      companies.add(item.companyName);
    }
  });
  return Array.from(companies);
}

// Get a list of unique roles from the survey data
export function getUniqueRoles(data: SurveyData[]): string[] {
  if (!data || data.length === 0) return [];
  const roles = new Set<string>();
  data.forEach(item => {
    if (item.role) {
      roles.add(item.role);
    }
  });
  return Array.from(roles);
}

// Calculate color code based on score thresholds
export function getScoreColor(score: number): string {
  if (score >= 80) return "green";
  if (score >= 60) return "yellow";
  return "red";
}

// Get color class based on score thresholds (for tailwind)
export function getScoreColorClass(score: number): string {
  if (score >= 80) return "bg-green-100 border-green-500 text-green-800";
  if (score >= 60) return "bg-yellow-100 border-yellow-500 text-yellow-800";
  return "bg-red-100 border-red-500 text-red-800";
}

// Format radar chart data for recharts from CompanyScores
export function formatRadarData(scores: CompanyScores) {
  return [
    {
      subject: "Strategic Clarity",
      value: scores.strategicClarity,
      fullMark: 100,
    },
    {
      subject: "Scalable Talent",
      value: scores.scalableTalent,
      fullMark: 100,
    },
    {
      subject: "Relentless Focus",
      value: scores.relentlessFocus,
      fullMark: 100,
    },
    {
      subject: "Disciplined Execution",
      value: scores.disciplinedExecution,
      fullMark: 100,
    },
    {
      subject: "Energized Culture",
      value: scores.energizedCulture,
      fullMark: 100,
    },
  ];
}

// Generate key insights based on scores
export function generateInsights(scores: CompanyScores): string[] {
  const insights: string[] = [];
  
  // Find strongest area
  const areas = [
    { name: "Strategic Clarity", score: scores.strategicClarity },
    { name: "Scalable Talent", score: scores.scalableTalent },
    { name: "Relentless Focus", score: scores.relentlessFocus },
    { name: "Disciplined Execution", score: scores.disciplinedExecution },
    { name: "Energized Culture", score: scores.energizedCulture },
  ];
  
  const strongest = [...areas].sort((a, b) => b.score - a.score)[0];
  const weakest = [...areas].sort((a, b) => a.score - b.score)[0];
  
  insights.push(`Strongest area is ${strongest.name} at ${strongest.score}%`);
  insights.push(`Area needing most improvement: ${weakest.name} at ${weakest.score}%`);
  
  if (scores.totalScore >= 80) {
    insights.push("Overall performance is excellent");
  } else if (scores.totalScore >= 60) {
    insights.push("Overall performance is satisfactory with room for improvement");
  } else {
    insights.push("Overall performance needs significant improvement");
  }
  
  return insights;
}

// Format data for company vs individual comparison
export interface ComparisonData {
  subject: string;
  individual: number;
  company: number;
  individualName?: string;
  companyName?: string;
}

// Create comparison data for individual vs company
export function createComparisonData(individualData: SurveyData[], companyData: SurveyData[]): ComparisonData[] {
  // Ensure we have data to compare
  if (!individualData?.length || !companyData?.length) return [];
  
  // Get the first individual (we'll just use the first one for this example)
  const individual = individualData[0];
  
  // Calculate the company average scores
  const companyScores: CompanyScores = {
    strategicClarity: 0,
    scalableTalent: 0,
    relentlessFocus: 0,
    disciplinedExecution: 0,
    energizedCulture: 0,
    totalScore: 0
  };
  
  // Sum all scores from company data
  companyData.forEach(company => {
    if (company.scores) {
      companyScores.strategicClarity += company.scores.strategicClarity;
      companyScores.scalableTalent += company.scores.scalableTalent;
      companyScores.relentlessFocus += company.scores.relentlessFocus;
      companyScores.disciplinedExecution += company.scores.disciplinedExecution;
      companyScores.energizedCulture += company.scores.energizedCulture;
      companyScores.totalScore += company.scores.totalScore;
    }
  });
  
  // Calculate averages
  const companyCount = companyData.length;
  if (companyCount > 0) {
    companyScores.strategicClarity /= companyCount;
    companyScores.scalableTalent /= companyCount;
    companyScores.relentlessFocus /= companyCount;
    companyScores.disciplinedExecution /= companyCount;
    companyScores.energizedCulture /= companyCount;
    companyScores.totalScore /= companyCount;
  }
  
  // Create comparison data array
  const comparisonData: ComparisonData[] = [];
  
  // Only proceed if the individual has scores
  if (individual.scores) {
    comparisonData.push(
      {
        subject: "Strategic Clarity",
        individual: individual.scores.strategicClarity,
        company: companyScores.strategicClarity,
        individualName: individual.role,
        companyName: individual.companyName
      },
      {
        subject: "Scalable Talent",
        individual: individual.scores.scalableTalent,
        company: companyScores.scalableTalent,
        individualName: individual.role,
        companyName: individual.companyName
      },
      {
        subject: "Relentless Focus",
        individual: individual.scores.relentlessFocus,
        company: companyScores.relentlessFocus,
        individualName: individual.role,
        companyName: individual.companyName
      },
      {
        subject: "Disciplined Execution",
        individual: individual.scores.disciplinedExecution,
        company: companyScores.disciplinedExecution,
        individualName: individual.role,
        companyName: individual.companyName
      },
      {
        subject: "Energized Culture",
        individual: individual.scores.energizedCulture,
        company: companyScores.energizedCulture,
        individualName: individual.role,
        companyName: individual.companyName
      },
      {
        subject: "Total Score",
        individual: individual.scores.totalScore,
        company: companyScores.totalScore,
        individualName: individual.role,
        companyName: individual.companyName
      }
    );
  }
  
  return comparisonData;
}