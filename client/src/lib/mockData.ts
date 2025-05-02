export interface FrameworkCategory {
  id: string;
  name: string;
  description: string;
  avgImportance: number; // Scale of 1-5
  avgAgreement: number; // Scale of 1-5
  performance: number; // Percentage derived from importance and agreement
  improvementOpportunity: string;
  detailedInsights: string;
}

export interface AssessmentData {
  id: string;
  title: string;
  date: string;
  companyName: string;
  categories: FrameworkCategory[];
}

// This data structure represents the 5xCEO framework with mock data
export const assessmentData: AssessmentData = {
  id: "assessment-2025-05-02",
  title: "5xCEO Assessment",
  date: "May 2, 2025",
  companyName: "Acme Corporation",
  categories: [
    {
      id: "strategic-clarity",
      name: "Strategic Clarity",
      description: "The ability to develop and communicate a clear, compelling vision and strategy.",
      avgImportance: 4.8,
      avgAgreement: 4.3,
      performance: 89,
      improvementOpportunity: "Improve cascade of strategic priorities to all team members.",
      detailedInsights: "Your organization demonstrates strong strategic clarity at the leadership level. Executives and senior managers have a clear understanding of the company's vision and direction. However, there's an opportunity to better cascade these priorities to mid-level managers and individual contributors. Consider implementing quarterly strategic review sessions with broader team participation."
    },
    {
      id: "scalable-talent",
      name: "Scalable Talent",
      description: "The systems and processes for attracting, developing, and retaining exceptional people.",
      avgImportance: 4.6,
      avgAgreement: 4.0,
      performance: 87,
      improvementOpportunity: "Enhance leadership development programs for middle management.",
      detailedInsights: "Your talent acquisition processes are strong, bringing in high-quality candidates. Retention rates are above industry average, particularly for senior roles. The opportunity lies in developing a more robust leadership pipeline, especially at the middle management level. Consider implementing a formal mentorship program and creating more structured career progression paths."
    },
    {
      id: "relentless-focus",
      name: "Relentless Focus",
      description: "The discipline to concentrate resources on the highest-value activities and avoid distractions.",
      avgImportance: 4.5,
      avgAgreement: 3.5,
      performance: 77,
      improvementOpportunity: "Implement more rigorous project prioritization framework.",
      detailedInsights: "This is your most significant opportunity area. While the organization has a clear strategy, execution sometimes suffers from taking on too many initiatives simultaneously. Teams report feeling stretched across multiple priorities. Consider implementing a more rigorous project prioritization framework and be more selective about which opportunities to pursue."
    },
    {
      id: "disciplined-execution",
      name: "Disciplined Execution",
      description: "The ability to consistently meet or exceed commitments and drive results.",
      avgImportance: 4.7,
      avgAgreement: 4.1,
      performance: 87,
      improvementOpportunity: "Strengthen accountability mechanisms for key deliverables.",
      detailedInsights: "Your organization demonstrates strong execution capabilities, particularly in core business operations. Project delivery is generally on-time and within budget. The opportunity area is in strengthening accountability mechanisms for cross-functional initiatives where ownership can sometimes become diffused. Consider implementing a RACI matrix for major initiatives."
    },
    {
      id: "energized-culture",
      name: "Energized Culture",
      description: "The environment that fosters engagement, innovation, and high performance.",
      avgImportance: 4.5,
      avgAgreement: 3.9,
      performance: 87,
      improvementOpportunity: "Address work-life balance concerns in high-growth departments.",
      detailedInsights: "Your company culture is generally strong with high engagement scores. Employees report feeling aligned with the company mission and values. The main opportunity area is around work-life balance, particularly in high-growth departments where workload has increased significantly. Consider reviewing resource allocation and implementing more flexible work arrangements."
    }
  ]
};

export const getCategoryColor = (categoryId: string): { bg: string; text: string; border: string; accent: string } => {
  switch (categoryId) {
    case 'strategic-clarity':
      return { 
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-100',
        accent: 'bg-amber-500'
      };
    case 'scalable-talent':
      return { 
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-100',
        accent: 'bg-green-500'
      };
    case 'relentless-focus':
      return { 
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-100',
        accent: 'bg-red-500'
      };
    case 'disciplined-execution':
      return { 
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-100',
        accent: 'bg-blue-500'
      };
    case 'energized-culture':
      return { 
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-100',
        accent: 'bg-purple-500'
      };
    default:
      return { 
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-100',
        accent: 'bg-gray-500'
      };
  }
};

// Helper function to simulate AI interpretation (placeholder for GPT)
export const generateInterpretation = (categoryId: string): string => {
  const category = assessmentData.categories.find(c => c.id === categoryId);
  
  if (!category) {
    return "No interpretation available for this category.";
  }
  
  return `Based on the assessment data for ${category.name}, your organization is performing at ${category.performance}% effectiveness. 
  
The primary improvement opportunity is to ${category.improvementOpportunity.toLowerCase()}

${category.detailedInsights}`;
};