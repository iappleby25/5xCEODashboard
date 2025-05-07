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

// Data structure for individual vs company comparison
export interface ComparisonData {
  subject: string;
  individual: number;
  company: number;
  individualName?: string;
  companyName?: string;
}

// Create comparison data between individual and company data
export function createComparisonData(individualData: SurveyData[], companyData: SurveyData[]): ComparisonData[] {
  // If no data is available, return empty array
  if (individualData.length === 0 || companyData.length === 0) {
    return [];
  }
  
  // Aggregate individual scores
  const individualScores: CompanyScores = {
    strategicClarity: 0,
    scalableTalent: 0,
    relentlessFocus: 0,
    disciplinedExecution: 0,
    energizedCulture: 0,
    totalScore: 0
  };
  
  let individualName = "";
  
  individualData.forEach(individual => {
    if (individual.scores) {
      individualScores.strategicClarity += individual.scores.strategicClarity;
      individualScores.scalableTalent += individual.scores.scalableTalent;
      individualScores.relentlessFocus += individual.scores.relentlessFocus;
      individualScores.disciplinedExecution += individual.scores.disciplinedExecution;
      individualScores.energizedCulture += individual.scores.energizedCulture;
      individualScores.totalScore += individual.scores.totalScore;
      
      // Use the first individual's name for labeling
      if (!individualName && individual.role) {
        individualName = individual.role;
      }
    }
  });
  
  // Calculate average individual scores
  const individualCount = individualData.length;
  if (individualCount > 0) {
    individualScores.strategicClarity = Math.round(individualScores.strategicClarity / individualCount);
    individualScores.scalableTalent = Math.round(individualScores.scalableTalent / individualCount);
    individualScores.relentlessFocus = Math.round(individualScores.relentlessFocus / individualCount);
    individualScores.disciplinedExecution = Math.round(individualScores.disciplinedExecution / individualCount);
    individualScores.energizedCulture = Math.round(individualScores.energizedCulture / individualCount);
    individualScores.totalScore = Math.round(individualScores.totalScore / individualCount);
  }
  
  // Aggregate company scores
  const companyScores: CompanyScores = {
    strategicClarity: 0,
    scalableTalent: 0,
    relentlessFocus: 0,
    disciplinedExecution: 0,
    energizedCulture: 0,
    totalScore: 0
  };
  
  let companyName = "";
  
  companyData.forEach(company => {
    if (company.scores) {
      companyScores.strategicClarity += company.scores.strategicClarity;
      companyScores.scalableTalent += company.scores.scalableTalent;
      companyScores.relentlessFocus += company.scores.relentlessFocus;
      companyScores.disciplinedExecution += company.scores.disciplinedExecution;
      companyScores.energizedCulture += company.scores.energizedCulture;
      companyScores.totalScore += company.scores.totalScore;
      
      // Use the company name for labeling
      if (!companyName && company.companyName) {
        companyName = company.companyName;
      }
    }
  });
  
  // Calculate average company scores
  const companyCount = companyData.length;
  if (companyCount > 0) {
    companyScores.strategicClarity = Math.round(companyScores.strategicClarity / companyCount);
    companyScores.scalableTalent = Math.round(companyScores.scalableTalent / companyCount);
    companyScores.relentlessFocus = Math.round(companyScores.relentlessFocus / companyCount);
    companyScores.disciplinedExecution = Math.round(companyScores.disciplinedExecution / companyCount);
    companyScores.energizedCulture = Math.round(companyScores.energizedCulture / companyCount);
    companyScores.totalScore = Math.round(companyScores.totalScore / companyCount);
  }
  
  // Create comparison data array
  return [
    {
      subject: "Strategic Clarity",
      individual: individualScores.strategicClarity,
      company: companyScores.strategicClarity,
      individualName,
      companyName
    },
    {
      subject: "Scalable Talent",
      individual: individualScores.scalableTalent,
      company: companyScores.scalableTalent,
      individualName,
      companyName
    },
    {
      subject: "Relentless Focus",
      individual: individualScores.relentlessFocus,
      company: companyScores.relentlessFocus,
      individualName,
      companyName
    },
    {
      subject: "Disciplined Execution",
      individual: individualScores.disciplinedExecution,
      company: companyScores.disciplinedExecution,
      individualName,
      companyName
    },
    {
      subject: "Energized Culture",
      individual: individualScores.energizedCulture,
      company: companyScores.energizedCulture,
      individualName,
      companyName
    },
    {
      subject: "Overall",
      individual: individualScores.totalScore,
      company: companyScores.totalScore,
      individualName,
      companyName
    }
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

// No duplicated content - removed