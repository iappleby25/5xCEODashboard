import React from 'react';
import { BarChart2, ArrowUpDown, ExternalLink } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface FocusEffectivenessComparisonProps {
  primaryCompany: string;
  comparisonCompany: string;
  period: string;
  selectedCategory?: string;
}

const FocusEffectivenessComparison: React.FC<FocusEffectivenessComparisonProps> = ({
  primaryCompany,
  comparisonCompany,
  period,
  selectedCategory = 'strategic-clarity'
}) => {
  // Helper function to get title based on selected category
  const getComparisonTitle = () => {
    switch (selectedCategory) {
      case 'strategic-clarity':
        return 'Strategic Clarity Comparison';
      case 'scalable-talent':
        return 'Talent Scalability Comparison';
      case 'relentless-focus':
        return 'Focus Effectiveness Comparison';
      case 'disciplined-execution':
        return 'Execution Impact Comparison';
      case 'energized-culture':
        return 'Culture Value Comparison';
      default:
        return 'Focus Effectiveness Comparison';
    }
  };
  
  // Helper function to get description based on selected category
  const getComparisonDescription = () => {
    switch (selectedCategory) {
      case 'strategic-clarity':
        return 'Comparing vision alignment and strategic decision-making';
      case 'scalable-talent':
        return 'Comparing talent development and organizational capacity';
      case 'relentless-focus':
        return 'Comparing prioritization and resource allocation';
      case 'disciplined-execution':
        return 'Comparing operational efficiency and execution quality';
      case 'energized-culture':
        return 'Comparing cultural health and employee engagement';
      default:
        return 'Comparing prioritization and resource allocation';
    }
  };

  // Generate comparison data based on selected category
  const generateComparisonData = () => {
    // This would be dynamically generated from real data
    // Using mock data for demonstration purposes
    switch (selectedCategory) {
      case 'strategic-clarity':
        return [
          { 
            name: 'Vision Alignment', 
            [primaryCompany]: 78, 
            [comparisonCompany]: 65,
            fullMark: 100 
          },
          { 
            name: 'Decision Cohesion', 
            [primaryCompany]: 82, 
            [comparisonCompany]: 71,
            fullMark: 100 
          },
          { 
            name: 'Mission Understanding', 
            [primaryCompany]: 74, 
            [comparisonCompany]: 82,
            fullMark: 100 
          },
        ];
      case 'scalable-talent':
        return [
          { 
            name: 'Talent Retention', 
            [primaryCompany]: 79, 
            [comparisonCompany]: 73,
            fullMark: 100 
          },
          { 
            name: 'Leadership Pipeline', 
            [primaryCompany]: 68, 
            [comparisonCompany]: 79,
            fullMark: 100 
          },
          { 
            name: 'Skills Development', 
            [primaryCompany]: 77, 
            [comparisonCompany]: 72,
            fullMark: 100 
          },
        ];
      case 'relentless-focus':
        return [
          { 
            name: 'Resource Optimization', 
            [primaryCompany]: 83, 
            [comparisonCompany]: 71,
            fullMark: 100 
          },
          { 
            name: 'Project Completion', 
            [primaryCompany]: 76, 
            [comparisonCompany]: 68,
            fullMark: 100 
          },
          { 
            name: 'Strategic Capacity', 
            [primaryCompany]: 72, 
            [comparisonCompany]: 80,
            fullMark: 100 
          },
        ];
      case 'disciplined-execution':
        return [
          { 
            name: 'Process Efficiency', 
            [primaryCompany]: 81, 
            [comparisonCompany]: 69,
            fullMark: 100 
          },
          { 
            name: 'Quality Control', 
            [primaryCompany]: 85, 
            [comparisonCompany]: 71,
            fullMark: 100 
          },
          { 
            name: 'Deadline Achievement', 
            [primaryCompany]: 74, 
            [comparisonCompany]: 82,
            fullMark: 100 
          },
        ];
      case 'energized-culture':
        return [
          { 
            name: 'Employee Engagement', 
            [primaryCompany]: 74, 
            [comparisonCompany]: 83,
            fullMark: 100 
          },
          { 
            name: 'Collaboration Index', 
            [primaryCompany]: 79, 
            [comparisonCompany]: 75,
            fullMark: 100 
          },
          { 
            name: 'Innovation Index', 
            [primaryCompany]: 67, 
            [comparisonCompany]: 77,
            fullMark: 100 
          },
        ];
      default:
        return [
          { 
            name: 'Resource Optimization', 
            [primaryCompany]: 83, 
            [comparisonCompany]: 71,
            fullMark: 100 
          },
          { 
            name: 'Project Completion', 
            [primaryCompany]: 76, 
            [comparisonCompany]: 68,
            fullMark: 100 
          },
          { 
            name: 'Strategic Capacity', 
            [primaryCompany]: 72, 
            [comparisonCompany]: 80,
            fullMark: 100 
          },
        ];
    }
  };

  // Get the gap insight based on the category
  const getGapInsight = () => {
    switch (selectedCategory) {
      case 'strategic-clarity':
        return `${primaryCompany} shows stronger vision alignment (+13%), while ${comparisonCompany} has better mission understanding (+8%). Opportunity exists to share best practices in strategic communication.`;
      case 'scalable-talent':
        return `${primaryCompany} outperforms in talent retention (+6%), but ${comparisonCompany} has a more robust leadership pipeline (+11%). Consider exchanging leadership development approaches.`;
      case 'relentless-focus':
        return `${primaryCompany} excels at resource optimization (+12%), while ${comparisonCompany} demonstrates higher strategic capacity (+8%). There may be a tradeoff between efficiency and flexibility.`;
      case 'disciplined-execution':
        return `${primaryCompany} shows superior quality control (+14%), but ${comparisonCompany} has better deadline achievement (+8%). Consider adopting complementary execution frameworks.`;
      case 'energized-culture':
        return `${comparisonCompany} has significantly higher employee engagement (+9%), though ${primaryCompany} shows a stronger collaboration index (+4%). Investigate engagement drivers at ${comparisonCompany}.`;
      default:
        return `${primaryCompany} excels at resource optimization (+12%), while ${comparisonCompany} demonstrates higher strategic capacity (+8%). There may be a tradeoff between efficiency and flexibility.`;
    }
  };

  // Get the market position insight based on the category
  const getMarketPositionInsight = () => {
    switch (selectedCategory) {
      case 'strategic-clarity':
        return `Combined, both companies are in the top 15% of your industry for strategic clarity. The average competitor is 22% less effective in this area.`;
      case 'scalable-talent':
        return `${primaryCompany} is in the top 25% for talent development, while ${comparisonCompany} is in the top 20% for leadership pipeline strength, both above industry average.`;
      case 'relentless-focus':
        return `Both companies are in the top quartile for focus metrics, with a combined 32% advantage over the industry median in resource efficiency.`;
      case 'disciplined-execution':
        return `${primaryCompany} ranks in the 85th percentile for execution quality, while ${comparisonCompany} is in the 78th, both well above the industry average of 65%.`;
      case 'energized-culture':
        return `${comparisonCompany} is in the top 10% for cultural health, while ${primaryCompany} is in the top 30%, against an industry where 60% of companies struggle with engagement.`;
      default:
        return `Both companies are in the top quartile for focus metrics, with a combined 32% advantage over the industry median in resource efficiency.`;
    }
  };

  // Get comparison data
  const comparisonData = generateComparisonData();
  const comparisonTitle = getComparisonTitle();
  const comparisonDescription = getComparisonDescription();
  const gapInsight = getGapInsight();
  const marketPositionInsight = getMarketPositionInsight();

  // Calculate performance differential
  const getDifferential = () => {
    // Use Number() to ensure we're dealing with numeric values
    const averagePrimary = comparisonData.reduce((sum, item) => sum + Number(item[primaryCompany]), 0) / comparisonData.length;
    const averageComparison = comparisonData.reduce((sum, item) => sum + Number(item[comparisonCompany]), 0) / comparisonData.length;
    return {
      value: (averagePrimary - averageComparison).toFixed(1),
      isPositive: averagePrimary > averageComparison
    };
  };

  const differential = getDifferential();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{comparisonTitle}</h2>
          <p className="text-sm text-neutral-500">{comparisonDescription}</p>
        </div>
        <div className="bg-neutral-100 px-3 py-1 rounded-md text-sm font-medium">
          {period}
        </div>
        <div className="flex items-center">
          <span className="text-lg font-semibold">{primaryCompany}</span>
          <ArrowUpDown className="h-4 w-4 mx-2" />
          <span className="text-lg font-semibold">{comparisonCompany}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Comparative Metrics</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 10, left: 10, bottom: 30 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }}
                  height={60}
                />
                <YAxis hide />
                <Tooltip />
                <Bar 
                  dataKey={primaryCompany} 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  name={primaryCompany}
                />
                <Bar 
                  dataKey={comparisonCompany} 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                  name={comparisonCompany}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Performance Differential</h3>
              <div className={`flex items-center text-4xl font-bold ${differential.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {differential.isPositive ? '+' : ''}{differential.value}%
              </div>
              <p className="text-neutral-600 mt-2">
                Overall performance differential between {primaryCompany} and {comparisonCompany}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Gap Analysis</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
                <p className="text-sm">{gapInsight}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Market Position</h3>
              <div className="bg-purple-50 border border-purple-200 rounded-md p-4 text-purple-800">
                <p className="text-sm">{marketPositionInsight}</p>
              </div>
            </div>

            <div className="text-center">
              <button className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <span>View detailed comparison report</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusEffectivenessComparison;