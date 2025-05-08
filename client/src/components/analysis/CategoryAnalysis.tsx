import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

interface CategoryAnalysisProps {
  category: string;
  company: string;
  period: string;
  comparisonCompany?: string;
}

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({
  category,
  company,
  period,
  comparisonCompany = 'FusionDynamics'
}) => {
  // Data for each category (in real app would be fetched from API)
  const getCategoryData = () => {
    switch (category) {
      case 'strategic-clarity':
        return {
          title: 'Strategic Clarity Analysis',
          subtitle: 'Measuring vision alignment and strategic decision-making',
          trend: '+15%',
          insightText: 'Accelerating alignment is creating increasingly visible market advantages',
          metrics: [
            { name: 'Vision alignment', value: 75, improvement: '+17%' },
            { name: 'Decision cohesion', value: 68, improvement: '+9%' },
            { name: 'Mission understanding', value: 82, improvement: '+14%' },
          ],
          color: '#f97316' // orange
        };
      case 'scalable-talent':
        return {
          title: 'Talent Optimization Analysis',
          subtitle: 'Measuring talent development and organizational capacity',
          trend: '+20%',
          insightText: 'Systematic talent development is reducing capability gaps in critical areas',
          metrics: [
            { name: 'Talent optimization', value: 65, improvement: '+13%' },
            { name: 'Leadership capability', value: 72, improvement: '+11%' },
            { name: 'Retention rate', value: 68, improvement: '+9%' },
          ],
          color: '#10b981' // green
        };
      case 'relentless-focus':
        return {
          title: 'Focus Effectiveness Analysis',
          subtitle: 'Measuring prioritization and resource allocation efficiency',
          trend: '+12%',
          insightText: 'Progressive improvement in prioritization is freeing up strategic resources',
          metrics: [
            { name: 'Resource optimization', value: 70, improvement: '+14%' },
            { name: 'Project completion rate', value: 74, improvement: '+12%' },
            { name: 'Strategic capacity', value: 65, improvement: '+10%' },
          ],
          color: '#3b82f6' // blue
        };
      case 'disciplined-execution':
        return {
          title: 'Execution Impact Analysis',
          subtitle: 'Measuring operational efficiency and execution quality',
          trend: '+20%',
          insightText: 'Consistent execution gains are translating to improved delivery predictability',
          metrics: [
            { name: 'Execution effectiveness', value: 78, improvement: '+16%' },
            { name: 'On-time delivery', value: 75, improvement: '+13%' },
            { name: 'Quality index', value: 80, improvement: '+11%' },
          ],
          color: '#8b5cf6' // purple
        };
      case 'energized-culture':
        return {
          title: 'Culture Value Analysis',
          subtitle: 'Measuring cultural health and employee engagement',
          trend: '+20%',
          insightText: 'Cultural improvements are driving better retention and team performance',
          metrics: [
            { name: 'Employee engagement', value: 71, improvement: '+14%' },
            { name: 'Innovation index', value: 68, improvement: '+12%' },
            { name: 'Team effectiveness', value: 75, improvement: '+10%' },
          ],
          color: '#fbbf24' // amber
        };
      default:
        return {
          title: 'Strategic Clarity Analysis',
          subtitle: 'Measuring vision alignment and strategic decision-making',
          trend: '+15%',
          insightText: 'Accelerating alignment is creating increasingly visible market advantages',
          metrics: [
            { name: 'Vision alignment', value: 75, improvement: '+17%' },
            { name: 'Decision cohesion', value: 68, improvement: '+9%' },
            { name: 'Mission understanding', value: 82, improvement: '+14%' },
          ],
          color: '#f97316' // orange
        };
    }
  };

  const categoryData = getCategoryData();
  
  // State for hovering insights
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  // Generate comparison data
  const generateComparisonData = () => {
    // This would come from API in a real app
    switch (category) {
      case 'strategic-clarity':
        return [
          { 
            name: 'Vision alignment', 
            [company]: 75, 
            [comparisonCompany]: 68,
            insight: `${company} has stronger vision alignment with executives (+7%), leading to more cohesive strategic decisions across departments.`
          },
          { 
            name: 'Decision cohesion', 
            [company]: 68, 
            [comparisonCompany]: 71,
            insight: `${comparisonCompany} demonstrates better decision alignment (+3%) through their structured decision framework established in Q3 2024.`
          },
          { 
            name: 'Mission understanding', 
            [company]: 82, 
            [comparisonCompany]: 74,
            insight: `${company}'s company-wide mission training program launched in Q4 2024 has resulted in significantly higher mission understanding (+8%).`
          },
        ];
      case 'scalable-talent':
        return [
          { 
            name: 'Talent optimization', 
            [company]: 65, 
            [comparisonCompany]: 70,
            insight: `${comparisonCompany}'s talent development program is showing +5% better results through their structured mentorship approach.`
          },
          { 
            name: 'Leadership capability', 
            [company]: 72, 
            [comparisonCompany]: 65,
            insight: `${company}'s investment in leadership development is yielding +7% stronger results in leadership capabilities and decision making.`
          },
          { 
            name: 'Retention rate', 
            [company]: 68, 
            [comparisonCompany]: 76,
            insight: `${comparisonCompany} has implemented more effective retention strategies (+8%), particularly in offering career advancement opportunities.`
          },
        ];
      case 'relentless-focus':
        return [
          { 
            name: 'Resource optimization', 
            [company]: 70, 
            [comparisonCompany]: 64,
            insight: `${company} demonstrates stronger resource allocation efficiency (+6%) through their quarterly resource planning process.`
          },
          { 
            name: 'Project completion rate', 
            [company]: 74, 
            [comparisonCompany]: 78,
            insight: `${comparisonCompany} shows superior project completion metrics (+4%) with their agile methodology implementation.`
          },
          { 
            name: 'Strategic capacity', 
            [company]: 65, 
            [comparisonCompany]: 69,
            insight: `${comparisonCompany} has developed +4% more strategic capacity through effective delegation and workflow optimization.`
          },
        ];
      case 'disciplined-execution':
        return [
          { 
            name: 'Execution effectiveness', 
            [company]: 78, 
            [comparisonCompany]: 71,
            insight: `${company}'s execution framework produces +7% better results through enhanced accountability and milestone tracking.`
          },
          { 
            name: 'On-time delivery', 
            [company]: 75, 
            [comparisonCompany]: 80,
            insight: `${comparisonCompany} achieves +5% better on-time delivery through their predictive planning tools implemented in Q3 2024.`
          },
          { 
            name: 'Quality index', 
            [company]: 80, 
            [comparisonCompany]: 72,
            insight: `${company} maintains an +8% higher quality index through their comprehensive quality assurance program and feedback loops.`
          },
        ];
      case 'energized-culture':
        return [
          { 
            name: 'Employee engagement', 
            [company]: 71, 
            [comparisonCompany]: 82,
            insight: `${comparisonCompany} achieves significantly higher employee engagement (+11%) through their innovative recognition programs and flexible work policies.`
          },
          { 
            name: 'Innovation index', 
            [company]: 68, 
            [comparisonCompany]: 62,
            insight: `${company} shows +6% stronger innovation metrics from their dedicated innovation time and cross-department collaboration initiatives.`
          },
          { 
            name: 'Team effectiveness', 
            [company]: 75, 
            [comparisonCompany]: 71,
            insight: `${company} demonstrates +4% better team effectiveness through structured team-building and conflict resolution training.`
          },
        ];
      default:
        return [
          { 
            name: 'Vision alignment', 
            [company]: 75, 
            [comparisonCompany]: 68,
            insight: `${company} has stronger vision alignment with executives (+7%), leading to more cohesive strategic decisions across departments.`
          },
          { 
            name: 'Decision cohesion', 
            [company]: 68, 
            [comparisonCompany]: 71,
            insight: `${comparisonCompany} demonstrates better decision alignment (+3%) through their structured decision framework established in Q3 2024.`
          },
          { 
            name: 'Mission understanding', 
            [company]: 82, 
            [comparisonCompany]: 74,
            insight: `${company}'s company-wide mission training program launched in Q4 2024 has resulted in significantly higher mission understanding (+8%).`
          },
        ];
    }
  };

  const comparisonData = generateComparisonData();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-semibold">{categoryData.title}</h2>
          <p className="text-neutral-500 mt-1">{categoryData.subtitle}</p>
        </div>
        <div className="flex gap-4">
          <span className="bg-neutral-100 px-3 py-1 rounded text-neutral-700">{period}</span>
          <span className="font-medium">{company}</span>
        </div>
      </div>

      <div className="my-6">
        {comparisonCompany ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Company Comparison</h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>{company}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>{comparisonCompany}</span>
                </div>
              </div>
            </div>
            <div className="h-[280px] border-t border-b border-dashed border-neutral-200 py-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={comparisonData} 
                  margin={{ top: 20, right: 30, left: 50, bottom: 10 }}
                  barGap={10}
                  layout="horizontal"
                  onMouseMove={(data) => {
                    if (data.isTooltipActive && data.activePayload && data.activeLabel) {
                      setActiveMetric(data.activeLabel as string);
                    }
                  }}
                  onMouseLeave={() => setActiveMetric(null)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis type="number" domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    labelFormatter={(label) => `Metric: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey={company} 
                    name={company} 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey={comparisonCompany} 
                    name={comparisonCompany} 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {activeMetric && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md text-blue-800 transition-all duration-300">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Performance Insight</h4>
                    <p className="text-sm">
                      {comparisonData.find(d => d.name === activeMetric)?.insight || 
                       "Hover over a metric to see detailed performance insights."}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {!activeMetric && (
              <div className="mt-4 p-3 bg-neutral-50 border border-neutral-100 rounded-md text-neutral-500 text-sm text-center">
                Hover over metrics to view detailed performance insights
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Company Comparison</h3>
            <p className="text-gray-500 mb-4">Select a comparison company to view performance metrics</p>
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm">
              <Info className="h-4 w-4 mr-2" />
              <span>Use the dropdown at the top to select a company to compare with {company}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="text-lg font-medium">Trend analysis: <span className="text-green-500">{categoryData.trend}</span></span>
        </div>
        <p className="text-neutral-600">improvement over last 3 quarters</p>
        <p className="mt-2 text-neutral-700">{categoryData.insightText}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Strategic Alignment Metrics</h3>
        <div className="space-y-6">
          {categoryData.metrics.map((metric) => (
            <div key={metric.name}>
              <div className="flex justify-between mb-1">
                <span>{metric.name}</span>
                <span className="text-green-500 font-medium">{metric.improvement}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full" 
                  style={{ 
                    width: `${metric.value}%`,
                    backgroundColor: categoryData.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalysis;