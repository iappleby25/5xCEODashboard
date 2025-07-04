import { CompanyData, SurveyData } from "./dataProcessor";

// 5xCEO Framework categories
export interface FrameworkCategory {
  id: string;
  name: string;
  description: string;
  questions: { id: string; text: string; }[];
  score: number;
  company?: string; // Optional company name property
}

export const getCategoryColor = (categoryId: string): string => {
  const colors: Record<string, string> = {
    'strategic-clarity': '#FF5722',  // Orange
    'scalable-talent': '#4CAF50',    // Green
    'relentless-focus': '#2196F3',   // Blue
    'disciplined-execution': '#9C27B0', // Purple
    'energized-culture': '#FFC107'   // Amber
  };
  
  return colors[categoryId] || '#757575'; // Default to gray
};

// Generate interpretation text based on score
export const generateInterpretation = (category: FrameworkCategory, viewMode: 'MyCEO' | '5xCEO'): string => {
  const { score, name } = category;
  
  if (viewMode === '5xCEO') {
    if (score >= 80) {
      return `Strong performance in ${name}. The company demonstrates excellent capabilities in this area.`;
    } else if (score >= 60) {
      return `Satisfactory performance in ${name}. There are some areas that could be improved.`;
    } else {
      return `Weak performance in ${name}. This area needs significant improvement and focus.`;
    }
  } else {
    // MyCEO view is more data-focused and less interpretive
    if (score >= 80) {
      return `Score of ${score}% indicates high performance in ${name}.`;
    } else if (score >= 60) {
      return `Score of ${score}% shows average performance in ${name}.`;
    } else {
      return `Score of ${score}% reveals challenges in ${name} that need to be addressed.`;
    }
  }
};

// Assessment data for the 5xCEO framework
export const assessmentData: FrameworkCategory[] = [
  {
    id: 'strategic-clarity',
    name: 'Strategic Clarity',
    description: 'Clear and compelling vision, strategy and plan that everyone understands',
    questions: [
      { id: 'sc1', text: 'How clear is the company vision to all employees?' },
      { id: 'sc2', text: 'Does the strategy align with market opportunities?' },
      { id: 'sc3', text: 'How effectively is the strategy communicated throughout the organization?' }
    ],
    score: 85,
    company: "GlobalSolutions"
  },
  {
    id: 'scalable-talent',
    name: 'Scalable Talent',
    description: 'Right people in the right roles with the right capabilities',
    questions: [
      { id: 'st1', text: 'Does the company attract and retain top talent?' },
      { id: 'st2', text: 'Are roles clearly defined with appropriate accountability?' },
      { id: 'st3', text: 'Does the company invest in employee development?' }
    ],
    score: 72,
    company: "GlobalSolutions"
  },
  {
    id: 'relentless-focus',
    name: 'Relentless Focus',
    description: 'Unwavering attention on the few things that matter most',
    questions: [
      { id: 'rf1', text: 'How effectively does the company prioritize initiatives?' },
      { id: 'rf2', text: 'Does the leadership team avoid distraction from core objectives?' },
      { id: 'rf3', text: 'Are resources allocated to support key priorities?' }
    ],
    score: 68,
    company: "GlobalSolutions"
  },
  {
    id: 'disciplined-execution',
    name: 'Disciplined Execution',
    description: 'Consistent and reliable delivery of results',
    questions: [
      { id: 'de1', text: 'Does the company consistently meet its targets?' },
      { id: 'de2', text: 'Are performance metrics clearly defined and tracked?' },
      { id: 'de3', text: 'Is there accountability for results throughout the organization?' }
    ],
    score: 79,
    company: "GlobalSolutions"
  },
  {
    id: 'energized-culture',
    name: 'Energized Culture',
    description: 'Environment that unleashes everyone\'s best work',
    questions: [
      { id: 'ec1', text: 'How engaged are employees on average?' },
      { id: 'ec2', text: 'Does the culture align with the company\'s values?' },
      { id: 'ec3', text: 'Is continuous improvement encouraged and rewarded?' }
    ],
    score: 81,
    company: "GlobalSolutions"
  }
];

// Mock company logos (we'll use placeholder SVGs)
export const createCompanyLogo = (name: string, color: string): string => {
  // Create a simple SVG logo based on the first letter of the company name
  const firstLetter = name.charAt(0).toUpperCase();
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="10" fill="${color}" />
      <text x="50" y="55" font-family="Arial" font-size="50" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
    </svg>
  `;
};

// Create a data URL from SVG
export const svgToDataURL = (svg: string): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// Mock company data with 5xCEO framework scores
export const mockCompanies: CompanyData[] = [
  {
    id: 1,
    name: "EcoWave",
    logo: svgToDataURL(createCompanyLogo("EcoWave", "#4CAF50")),
    averageScore: 85,
    scores: {
      strategicClarity: 90,
      scalableTalent: 82,
      relentlessFocus: 88,
      disciplinedExecution: 85,
      energizedCulture: 80,
      totalScore: 85
    },
    insights: [
      "Strongest area is Strategic Clarity at 90%",
      "Area needing most improvement: Energized Culture at 80%",
      "Overall performance is excellent"
    ]
  },
  {
    id: 2,
    name: "GlobalSolutions",
    logo: svgToDataURL(createCompanyLogo("GlobalSolutions", "#2196F3")),
    averageScore: 72,
    scores: {
      strategicClarity: 76,
      scalableTalent: 65,
      relentlessFocus: 70,
      disciplinedExecution: 78,
      energizedCulture: 71,
      totalScore: 72
    },
    insights: [
      "Strongest area is Disciplined Execution at 78%",
      "Area needing most improvement: Scalable Talent at 65%",
      "Overall performance is satisfactory with room for improvement"
    ]
  },
  {
    id: 3,
    name: "TechVision",
    logo: svgToDataURL(createCompanyLogo("TechVision", "#9C27B0")),
    averageScore: 92,
    scores: {
      strategicClarity: 94,
      scalableTalent: 92,
      relentlessFocus: 90,
      disciplinedExecution: 93,
      energizedCulture: 91,
      totalScore: 92
    },
    insights: [
      "Strongest area is Strategic Clarity at 94%",
      "Area needing most improvement: Relentless Focus at 90%",
      "Overall performance is excellent"
    ]
  },
  {
    id: 4,
    name: "AlphaInnovate",
    logo: svgToDataURL(createCompanyLogo("AlphaInnovate", "#FF5722")),
    averageScore: 55,
    scores: {
      strategicClarity: 62,
      scalableTalent: 48,
      relentlessFocus: 53,
      disciplinedExecution: 59,
      energizedCulture: 53,
      totalScore: 55
    },
    insights: [
      "Strongest area is Strategic Clarity at 62%",
      "Area needing most improvement: Scalable Talent at 48%",
      "Overall performance needs significant improvement"
    ]
  },
  {
    id: 5,
    name: "QuantumCorp",
    logo: svgToDataURL(createCompanyLogo("QuantumCorp", "#673AB7")),
    averageScore: 68,
    scores: {
      strategicClarity: 71,
      scalableTalent: 65,
      relentlessFocus: 62,
      disciplinedExecution: 74,
      energizedCulture: 68,
      totalScore: 68
    },
    insights: [
      "Strongest area is Disciplined Execution at 74%",
      "Area needing most improvement: Relentless Focus at 62%",
      "Overall performance is satisfactory with room for improvement"
    ]
  },
  {
    id: 6,
    name: "MomentumFuel",
    logo: svgToDataURL(createCompanyLogo("MomentumFuel", "#FFC107")),
    averageScore: 78,
    scores: {
      strategicClarity: 80,
      scalableTalent: 76,
      relentlessFocus: 82,
      disciplinedExecution: 74,
      energizedCulture: 78,
      totalScore: 78
    },
    insights: [
      "Strongest area is Relentless Focus at 82%",
      "Area needing most improvement: Disciplined Execution at 74%",
      "Overall performance is satisfactory with room for improvement"
    ]
  },
  {
    id: 7,
    name: "NexaGrowth",
    logo: svgToDataURL(createCompanyLogo("NexaGrowth", "#00BCD4")),
    averageScore: 83,
    scores: {
      strategicClarity: 85,
      scalableTalent: 84,
      relentlessFocus: 80,
      disciplinedExecution: 82,
      energizedCulture: 84,
      totalScore: 83
    },
    insights: [
      "Strongest area is Strategic Clarity at 85%",
      "Area needing most improvement: Relentless Focus at 80%",
      "Overall performance is excellent"
    ]
  },
  {
    id: 8,
    name: "FusionDynamics",
    logo: svgToDataURL(createCompanyLogo("FusionDynamics", "#E91E63")),
    averageScore: 45,
    scores: {
      strategicClarity: 52,
      scalableTalent: 42,
      relentlessFocus: 38,
      disciplinedExecution: 49,
      energizedCulture: 44,
      totalScore: 45
    },
    insights: [
      "Strongest area is Strategic Clarity at 52%",
      "Area needing most improvement: Relentless Focus at 38%",
      "Overall performance needs significant improvement"
    ]
  },
  {
    id: 9,
    name: "VitalSync",
    logo: svgToDataURL(createCompanyLogo("VitalSync", "#8BC34A")),
    averageScore: 76,
    scores: {
      strategicClarity: 79,
      scalableTalent: 77,
      relentlessFocus: 75,
      disciplinedExecution: 72,
      energizedCulture: 77,
      totalScore: 76
    },
    insights: [
      "Strongest area is Strategic Clarity at 79%",
      "Area needing most improvement: Disciplined Execution at 72%",
      "Overall performance is satisfactory with room for improvement"
    ]
  }
];

// Add survey data points with question information
export function getMockSurveyData(): SurveyData[] {
  const companies = ["GlobalSolutions", "TechForward", "FinanceBlue", "RetailGiant", "ManufacturingCo"];
  const roles = ["CEO", "PE & BOD", "LEADERSHIP TEAM", "COMPANY"];
  
  // Sample questions for each category
  const questions = {
    strategicClarity: [
      "Our organization has a clear vision that guides decision-making.",
      "Leadership effectively communicates our strategic priorities.",
      "Our strategy is well-defined and understood by all employees.",
      "We have a robust process for adapting our strategy to market changes.",
      "Our organization aligns resources effectively with strategic priorities."
    ],
    scalableTalent: [
      "We have effective processes for recruiting top talent.",
      "Our organization develops employees to reach their full potential.",
      "We have a strong succession planning process in place.",
      "Our performance management systems are fair and transparent.",
      "Our compensation and benefits are competitive in the industry."
    ],
    relentlessFocus: [
      "Our organization maintains focus on key priorities without distraction.",
      "We effectively eliminate activities that don't add value.",
      "Decision-making is efficient and timely in our organization.",
      "We consistently meet our goals and targets.",
      "Our resources are allocated to the most important priorities."
    ],
    disciplinedExecution: [
      "We have clear accountability for results at all levels.",
      "Our organization implements change initiatives effectively.",
      "We deliver projects on time and within budget.",
      "Our processes are well-documented and consistently followed.",
      "We have effective systems for tracking performance and results."
    ],
    energizedCulture: [
      "Employees are highly engaged and motivated.",
      "Our workplace culture supports innovation and creativity.",
      "There is strong collaboration across departments and teams.",
      "Leadership behaviors consistently reflect our values.",
      "Employees feel empowered to make decisions in their roles."
    ]
  };
  
  const surveyData: SurveyData[] = [];
  
  // Generate data for each company
  companies.forEach((company, cIndex) => {
    // Generate data for each role
    roles.forEach((role, rIndex) => {
      // Generate consistent pseudo-random scores based on company and role
      // Create a hash value from the company name and role to ensure consistency
      const getHashValue = (str: string, seed: number = 0): number => {
        let hash = seed;
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i);
          hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
      };
      
      // Get deterministic values between 0-1 using the hash
      const companyHash = getHashValue(company); // company is a string
      const roleHash = getHashValue(role, companyHash);
      
      // Generate base score between 50-90 based on company and role
      const baseScore = 50 + (((companyHash + roleHash) % 1000) / 1000) * 40;
      const variance = 10;
      
      // Generate variance for each category in a deterministic way
      const strategicClarityVar = ((getHashValue(`${company}-${role}-strategic`) % 100) / 100) * variance * 2 - variance;
      const scalableTalentVar = ((getHashValue(`${company}-${role}-talent`) % 100) / 100) * variance * 2 - variance;
      const relentlessFocusVar = ((getHashValue(`${company}-${role}-focus`) % 100) / 100) * variance * 2 - variance;
      const disciplinedExecutionVar = ((getHashValue(`${company}-${role}-execution`) % 100) / 100) * variance * 2 - variance;
      const energizedCultureVar = ((getHashValue(`${company}-${role}-culture`) % 100) / 100) * variance * 2 - variance;
      
      // Apply the variance to the base score
      const strategicClarity = Math.min(100, Math.max(0, Math.round(baseScore + strategicClarityVar)));
      const scalableTalent = Math.min(100, Math.max(0, Math.round(baseScore + scalableTalentVar)));
      const relentlessFocus = Math.min(100, Math.max(0, Math.round(baseScore + relentlessFocusVar)));
      const disciplinedExecution = Math.min(100, Math.max(0, Math.round(baseScore + disciplinedExecutionVar)));
      const energizedCulture = Math.min(100, Math.max(0, Math.round(baseScore + energizedCultureVar)));
      
      const totalScore = Math.round((strategicClarity + scalableTalent + relentlessFocus + disciplinedExecution + energizedCulture) / 5);
      
      // Generate question scores for each category
      const questionItems: Array<{question: string; score: number; category: string}> = [];
      
      // Add questions with scores for each category
      Object.entries(questions).forEach(([category, categoryQuestions]) => {
        const categoryBaseScore = 
          category === 'strategicClarity' ? strategicClarity : 
          category === 'scalableTalent' ? scalableTalent :
          category === 'relentlessFocus' ? relentlessFocus :
          category === 'disciplinedExecution' ? disciplinedExecution : 
          energizedCulture;
        
        categoryQuestions.forEach((question, qIndex) => {
          // Generate consistent question score based on the question text
          const questionHash = getHashValue(`${company}-${role}-${category}-${qIndex}`);
          // Score varies a bit around the category base score (±8 points)
          const variance = ((questionHash % 100) / 100) * 16 - 8;
          const questionScore = Math.min(100, Math.max(0, Math.round(categoryBaseScore + variance)));
          
          questionItems.push({
            question,
            score: questionScore,
            category
          });
        });
      });
      
      surveyData.push({
        companyName: company,
        role,
        responses: {
          id: cIndex * 100 + rIndex,
          totalPoints: totalScore,
          status: "completed"
        },
        scores: {
          strategicClarity,
          scalableTalent,
          relentlessFocus,
          disciplinedExecution,
          energizedCulture,
          totalScore
        },
        questions: questionItems
      });
    });
  });
  
  return surveyData;
}

// Mock survey data for MyCEO view
export const mockSurveyData: SurveyData[] = [
  {
    companyName: "EcoWave",
    role: "LEADERSHIP TEAM",
    responses: {
      id: 1,
      totalPoints: 78,
      status: "complete"
    },
    scores: {
      strategicClarity: 85,
      scalableTalent: 78,
      relentlessFocus: 82,
      disciplinedExecution: 80,
      energizedCulture: 76,
      totalScore: 80
    },
    logo: mockCompanies[0].logo,
    questions: [
      { question: "Our organization has a clear vision that guides decision-making", score: 87, category: "strategicClarity" },
      { question: "Leadership effectively communicates our strategic priorities", score: 82, category: "strategicClarity" },
      { question: "We have effective processes for recruiting top talent", score: 76, category: "scalableTalent" },
      { question: "Our organization develops employees to reach their full potential", score: 80, category: "scalableTalent" },
      { question: "Decision-making is efficient and timely in our organization", score: 84, category: "relentlessFocus" },
      { question: "We deliver projects on time and within budget", score: 78, category: "disciplinedExecution" },
      { question: "Employees are highly engaged and motivated", score: 74, category: "energizedCulture" }
    ]
  },
  {
    companyName: "EcoWave",
    role: "CEO",
    responses: {
      id: 2,
      totalPoints: 92,
      status: "complete"
    },
    scores: {
      strategicClarity: 95,
      scalableTalent: 90,
      relentlessFocus: 93,
      disciplinedExecution: 92,
      energizedCulture: 88,
      totalScore: 92
    },
    logo: mockCompanies[0].logo
  },
  {
    companyName: "GlobalSolutions",
    role: "PE & BOD",
    responses: {
      id: 3,
      totalPoints: 85,
      status: "complete"
    },
    scores: mockCompanies[1].scores,
    logo: mockCompanies[1].logo
  },
  {
    companyName: "GlobalSolutions",
    role: "CEO",
    responses: {
      id: 4,
      totalPoints: 92,
      status: "complete"
    },
    scores: mockCompanies[1].scores,
    logo: mockCompanies[1].logo
  },
  {
    companyName: "GlobalSolutions",
    role: "LEADERSHIP TEAM",
    responses: {
      id: 5,
      totalPoints: 68,
      status: "complete"
    },
    scores: {
      strategicClarity: 70,
      scalableTalent: 62,
      relentlessFocus: 65,
      disciplinedExecution: 80,
      energizedCulture: 60,
      totalScore: 68
    },
    logo: mockCompanies[1].logo
  },
  {
    companyName: "TechVision",
    role: "LEADERSHIP TEAM",
    responses: {
      id: 6,
      totalPoints: 90,
      status: "complete"
    },
    scores: mockCompanies[2].scores,
    logo: mockCompanies[2].logo
  },
  {
    companyName: "AlphaInnovate",
    role: "CEO",
    responses: {
      id: 7,
      totalPoints: 55,
      status: "in_progress"
    },
    scores: mockCompanies[3].scores,
    logo: mockCompanies[3].logo
  }
];