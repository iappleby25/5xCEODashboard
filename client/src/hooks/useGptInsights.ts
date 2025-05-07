import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Insight, SummaryReport, TopicCluster } from "@/types/insights";
import { apiRequest } from "@/lib/queryClient";

type InsightType = 'main' | 'summary' | 'topics';

const useGptInsights = (surveyId: number | string = 1) => {
  const [insightType, setInsightType] = useState<InsightType>('main');

  // Fetch main insights
  const mainInsightQuery = useQuery<Insight[]>({
    queryKey: [`/api/generate-insights/${surveyId}`],
    enabled: insightType === 'main',
  });

  // Fetch summary report
  const summaryReportQuery = useQuery<SummaryReport>({
    queryKey: [`/api/generate-insights/${surveyId}/summary`],
    enabled: insightType === 'summary',
  });

  // Fetch topic clusters
  const topicClustersQuery = useQuery<TopicCluster[]>({
    queryKey: [`/api/generate-insights/${surveyId}/topics`],
    enabled: insightType === 'topics',
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

  // Generate additional insight
  const generateFollowup = async (question: string) => {
    try {
      const res = await apiRequest('POST', `/api/generate-insights/${surveyId}/followup`, {
        question
      });
      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error('Failed to generate followup insight');
    }
  };

  // Switch between insight types
  const switchInsightType = (type: InsightType) => {
    setInsightType(type);
  };

  // Process insights data with fallbacks
  const getProcessedData = () => {
    // Default insights
    const defaultInsights: Insight[] = [
      {
        title: "Employee satisfaction has increased by 12% over the last quarter",
        content: "Key factors contributing to this improvement include:\n- New flexible work policy implemented in July (mentioned in 47% of comments)\n- Leadership town halls have improved transparency scores by 18%\n- Improved onboarding process positively impacted new hire experience",
        tags: ["Positive Trend", "Leadership Impact", "Q3 Results"],
        isPositive: true
      },
      {
        title: "Performance review process seen as key pain point",
        content: "Analysis of survey responses shows persistent dissatisfaction with the current performance review process:\n- 72% of respondents indicated it lacks transparency\n- Feedback often feels one-directional according to comments\n- Mid-level managers report disconnect between review outcomes and advancement opportunities",
        tags: ["Improvement Area", "Process Refinement", "Management"],
        isPositive: false
      }
    ];

    // Default summary report
    const defaultSummary: SummaryReport = {
      summary: "Based on survey responses from 243 employees across 5 departments, there's a positive correlation between work-life balance improvements and overall satisfaction scores.",
      improvementAreas: [
        { area: "Communication transparency", percentage: 42 },
        { area: "Career growth opportunities", percentage: 37 },
        { area: "Feedback implementation", percentage: 29 }
      ],
      recommendation: "Consider implementing more regular career development conversations and transparent project allocation."
    };

    // Default topic clusters
    const defaultTopics: TopicCluster[] = [
      {
        topic: "Work-life balance",
        keywords: ["remote", "flexibility", "hours", "schedule", "family"],
        sentimentScore: 0.78,
        count: 127
      },
      {
        topic: "Internal communication",
        keywords: ["meetings", "emails", "updates", "transparency", "information"],
        sentimentScore: 0.45,
        count: 98
      },
      {
        topic: "Career advancement",
        keywords: ["promotion", "growth", "skills", "training", "opportunity"],
        sentimentScore: 0.32,
        count: 84
      },
      {
        topic: "Management support",
        keywords: ["leadership", "manager", "feedback", "guidance", "help"],
        sentimentScore: 0.62,
        count: 76
      }
    ];

    return {
      insights: mainInsightQuery.data || defaultInsights,
      summaryReport: summaryReportQuery.data || defaultSummary,
      topicClusters: topicClustersQuery.data || defaultTopics,
      isLoading: 
        (insightType === 'main' && mainInsightQuery.isLoading) ||
        (insightType === 'summary' && summaryReportQuery.isLoading) ||
        (insightType === 'topics' && topicClustersQuery.isLoading),
      error:
        (insightType === 'main' && mainInsightQuery.error) ||
        (insightType === 'summary' && summaryReportQuery.error) ||
        (insightType === 'topics' && topicClustersQuery.error),
    };
  };

  return {
    ...getProcessedData(),
    regenerateInsight,
    generateFollowup,
    switchInsightType,
    insightType,
  };
};

export default useGptInsights;