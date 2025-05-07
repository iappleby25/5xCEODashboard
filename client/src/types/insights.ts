// AI Insight Types
export interface Insight {
  id?: number;
  title: string;
  content: string;
  tags: string[];
  isPositive: boolean;
  surveyId?: number;
  createdAt?: string;
}

export interface SummaryReport {
  id?: number;
  summary: string;
  improvementAreas: {
    area: string;
    percentage: number;
  }[];
  recommendation: string;
  surveyId?: number;
  createdAt?: string;
}

export interface TopicCluster {
  topic: string;
  keywords: string[];
  sentimentScore: number;
  count: number;
}

export interface InsightAnalysis {
  insights: Insight[];
  summaryReport: SummaryReport;
  topicClusters: TopicCluster[];
}