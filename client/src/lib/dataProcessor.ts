// Define types for our data
export type ViewLevelType = "team" | "company" | "holding" | "compare" | "all";

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
  questions?: {
    question: string;
    score: number;
    category?: string;
  }[];
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
  
  // For "all" view level, return all data (for admin only)
  if (viewLevel === "all") {
    return filtered;
  }

  // Apply company filter if applicable based on view level
  if ((viewLevel === "company" || viewLevel === "team" || viewLevel === "compare") && company) {
    filtered = filtered.filter(item => item.companyName === company);
  }

  // Apply role filter if applicable based on view level
  if (viewLevel === "team" && role) {
    filtered = filtered.filter(item => item.role === role);
  }

  // For compare view, we include team and company aggregate
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

// Data structure for team vs company comparison
export interface ComparisonData {
  subject: string;
  team: number;
  company: number;
  teamName?: string;
  companyName?: string;
}

// Create comparison data between team and company data
export function createComparisonData(teamData: SurveyData[], companyData: SurveyData[]): ComparisonData[] {
  // If no data is available, return empty array
  if (teamData.length === 0 || companyData.length === 0) {
    return [];
  }
  
  // Aggregate team scores
  const teamScores: CompanyScores = {
    strategicClarity: 0,
    scalableTalent: 0,
    relentlessFocus: 0,
    disciplinedExecution: 0,
    energizedCulture: 0,
    totalScore: 0
  };
  
  let teamName = "";
  
  teamData.forEach(team => {
    if (team.scores) {
      teamScores.strategicClarity += team.scores.strategicClarity;
      teamScores.scalableTalent += team.scores.scalableTalent;
      teamScores.relentlessFocus += team.scores.relentlessFocus;
      teamScores.disciplinedExecution += team.scores.disciplinedExecution;
      teamScores.energizedCulture += team.scores.energizedCulture;
      teamScores.totalScore += team.scores.totalScore;
      
      // Use the first team's role name for labeling
      if (!teamName && team.role) {
        teamName = team.role;
      }
    }
  });
  
  // Calculate average team scores
  const teamCount = teamData.length;
  if (teamCount > 0) {
    teamScores.strategicClarity = Math.round(teamScores.strategicClarity / teamCount);
    teamScores.scalableTalent = Math.round(teamScores.scalableTalent / teamCount);
    teamScores.relentlessFocus = Math.round(teamScores.relentlessFocus / teamCount);
    teamScores.disciplinedExecution = Math.round(teamScores.disciplinedExecution / teamCount);
    teamScores.energizedCulture = Math.round(teamScores.energizedCulture / teamCount);
    teamScores.totalScore = Math.round(teamScores.totalScore / teamCount);
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
      team: teamScores.strategicClarity,
      company: companyScores.strategicClarity,
      teamName,
      companyName
    },
    {
      subject: "Scalable Talent",
      team: teamScores.scalableTalent,
      company: companyScores.scalableTalent,
      teamName,
      companyName
    },
    {
      subject: "Relentless Focus",
      team: teamScores.relentlessFocus,
      company: companyScores.relentlessFocus,
      teamName,
      companyName
    },
    {
      subject: "Disciplined Execution",
      team: teamScores.disciplinedExecution,
      company: companyScores.disciplinedExecution,
      teamName,
      companyName
    },
    {
      subject: "Energized Culture",
      team: teamScores.energizedCulture,
      company: companyScores.energizedCulture,
      teamName,
      companyName
    },
    {
      subject: "Overall",
      team: teamScores.totalScore,
      company: companyScores.totalScore,
      teamName,
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