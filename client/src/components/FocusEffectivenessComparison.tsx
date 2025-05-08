import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { CompanyData } from '@/lib/dataProcessor';
import { BarChart3 } from 'lucide-react';

interface FocusEffectivenessComparisonProps {
  mainCompany: CompanyData;
  comparisonCompany: CompanyData;
  period: string;
}

const FocusEffectivenessComparison: React.FC<FocusEffectivenessComparisonProps> = ({
  mainCompany,
  comparisonCompany,
  period
}) => {
  // Format data for radar chart
  const radarData = [
    { subject: 'Strategic Clarity', mainCompany: mainCompany.scores.strategicClarity, comparisonCompany: comparisonCompany.scores.strategicClarity },
    { subject: 'Scalable Talent', mainCompany: mainCompany.scores.scalableTalent, comparisonCompany: comparisonCompany.scores.scalableTalent },
    { subject: 'Relentless Focus', mainCompany: mainCompany.scores.relentlessFocus, comparisonCompany: comparisonCompany.scores.relentlessFocus },
    { subject: 'Disciplined Execution', mainCompany: mainCompany.scores.disciplinedExecution, comparisonCompany: comparisonCompany.scores.disciplinedExecution },
    { subject: 'Energized Culture', mainCompany: mainCompany.scores.energizedCulture, comparisonCompany: comparisonCompany.scores.energizedCulture }
  ];

  // Generate insights from comparison
  const generateComparativeInsights = () => {
    // Find biggest difference areas (both positive and negative)
    const differences = Object.keys(mainCompany.scores)
      .filter(key => key !== 'totalScore')
      .map(key => {
        const scoreKey = key as keyof typeof mainCompany.scores;
        const mainScore = mainCompany.scores[scoreKey];
        const comparisonScore = comparisonCompany.scores[scoreKey];
        const difference = mainScore - comparisonScore;
        const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
        
        return {
          category: formattedKey,
          difference,
          mainScore,
          comparisonScore
        };
      })
      .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));

    // Generate insights for top 3 differences
    return differences.slice(0, 3).map((diff, index) => {
      const isPositive = diff.difference > 0;
      return (
        <div key={index} className={`p-3 rounded-md ${isPositive ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'} mb-2`}>
          <p className="text-sm">
            <span className="font-medium">{diff.category}:</span> {isPositive 
              ? `${mainCompany.name} outperforms ${comparisonCompany.name} by ${Math.abs(diff.difference).toFixed(0)}%. This suggests stronger ${diff.category.toLowerCase()} practices.` 
              : `${comparisonCompany.name} outperforms ${mainCompany.name} by ${Math.abs(diff.difference).toFixed(0)}%. Consider studying their ${diff.category.toLowerCase()} approach.`
            }
          </p>
        </div>
      );
    });
  };

  // Calculate overall comparative metrics
  const overallDifference = mainCompany.averageScore - comparisonCompany.averageScore;
  const isOverallBetter = overallDifference > 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Focus Effectiveness Comparison</h2>
        <div className="bg-neutral-100 px-3 py-1 rounded-md text-sm font-medium">
          {period}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Framework Performance Comparison</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name={mainCompany.name}
                  dataKey="mainCompany"
                  stroke="#2196F3"
                  fill="#2196F3"
                  fillOpacity={0.5}
                />
                <Radar
                  name={comparisonCompany.name}
                  dataKey="comparisonCompany"
                  stroke="#FF5722"
                  fill="#FF5722"
                  fillOpacity={0.5}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Comparative Insights</h3>
          
          <div className={`p-4 mb-4 rounded-md ${isOverallBetter ? 'bg-blue-50 border border-blue-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-center mb-2">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-700" />
              <h4 className="font-medium">Overall Performance</h4>
            </div>
            <p className="text-sm">
              {isOverallBetter 
                ? `${mainCompany.name} scores ${Math.abs(overallDifference).toFixed(0)}% higher overall than ${comparisonCompany.name} across all framework categories.`
                : `${comparisonCompany.name} scores ${Math.abs(overallDifference).toFixed(0)}% higher overall than ${mainCompany.name} across all framework categories.`
              }
            </p>
          </div>
          
          <div className="space-y-2">
            {generateComparativeInsights()}
          </div>
          
          <div className="mt-4 p-4 bg-neutral-50 rounded-md border border-neutral-200">
            <h4 className="font-medium mb-2">Recommendation</h4>
            <p className="text-sm text-neutral-700">
              {isOverallBetter 
                ? `Continue to leverage your strengths in ${radarData.sort((a, b) => b.mainCompany - a.mainCompany)[0].subject} while learning from ${comparisonCompany.name}'s approach to ${radarData.sort((a, b) => b.comparisonCompany - a.mainCompany)[0].subject}.`
                : `Consider adopting some of ${comparisonCompany.name}'s practices for ${radarData.sort((a, b) => b.comparisonCompany - a.mainCompany)[0].subject} to improve overall performance.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusEffectivenessComparison;