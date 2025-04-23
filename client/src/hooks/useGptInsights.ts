import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Insight {
  title: string;
  content: string;
  tags: string[];
  isPositive: boolean;
}

interface SummaryReport {
  summary: string;
  improvementAreas: {
    area: string;
    percentage: number;
  }[];
  recommendation: string;
}

/**
 * Custom hook for fetching GPT-powered insights
 * 
 * @param surveyId The ID of the survey to analyze
 * @returns Object with insight data and loading state
 */
const useGptInsights = (surveyId: number | string) => {
  const [insightType, setInsightType] = useState<'main' | 'summary'>('main');

  // Fetch main insights
  const mainInsightQuery = useQuery<Insight>({
    queryKey: [`/api/generate-insights/${surveyId}`],
    enabled: insightType === 'main',
  });

  // Fetch summary report
  const summaryReportQuery = useQuery<SummaryReport>({
    queryKey: [`/api/generate-insights/${surveyId}/summary`],
    enabled: insightType === 'summary',
  });

  // Generate a new insight
  const regenerateInsight = async () => {
    try {
      const res = await apiRequest('GET', `/api/generate-insights/${surveyId}?refresh=true`);
      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error('Failed to regenerate insight');
    }
  };

  // Switch between insight types
  const switchInsightType = (type: 'main' | 'summary') => {
    setInsightType(type);
  };

  return {
    insight: insightType === 'main' ? mainInsightQuery.data : null,
    summaryReport: insightType === 'summary' ? summaryReportQuery.data : null,
    isLoading: insightType === 'main' ? mainInsightQuery.isLoading : summaryReportQuery.isLoading,
    error: insightType === 'main' ? mainInsightQuery.error : summaryReportQuery.error,
    regenerateInsight,
    switchInsightType,
    insightType,
  };
};

export default useGptInsights;
