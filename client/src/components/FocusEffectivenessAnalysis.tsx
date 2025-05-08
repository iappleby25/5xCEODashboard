import React from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface FocusEffectivenessAnalysisProps {
  companyName: string;
  period: string;
  trendPercentage: number;
  resourceOptimization: number;
  projectCompletionRate: number;
  strategicCapacity: number;
  selectedCategory?: string; // Add selectedCategory prop
}

const FocusEffectivenessAnalysis: React.FC<FocusEffectivenessAnalysisProps> = ({
  companyName,
  period,
  trendPercentage,
  resourceOptimization,
  projectCompletionRate,
  strategicCapacity,
  selectedCategory = 'strategic-clarity'
}) => {
  // Sample data for the performance trajectory chart
  const trajectoryData = [
    { name: 'Q2', value: 65 },
    { name: 'Q3', value: 72 },
    { name: 'Q4', value: 78 },
    { name: 'Q1', value: 85 }
  ];

  // Helper function to get title based on selected category
  const getAnalysisTitle = () => {
    switch (selectedCategory) {
      case 'strategic-clarity':
        return 'Strategic Clarity Analysis';
      case 'scalable-talent':
        return 'Talent Scalability Analysis';
      case 'relentless-focus':
        return 'Focus Effectiveness Analysis';
      case 'disciplined-execution':
        return 'Execution Impact Analysis';
      case 'energized-culture':
        return 'Culture Value Analysis';
      default:
        return 'Focus Effectiveness Analysis';
    }
  };
  
  // Helper function to get description based on selected category
  const getAnalysisDescription = () => {
    switch (selectedCategory) {
      case 'strategic-clarity':
        return 'Measuring vision alignment and strategic decision-making';
      case 'scalable-talent':
        return 'Evaluating talent development and organizational capacity';
      case 'relentless-focus':
        return 'Analyzing prioritization and resource allocation';
      case 'disciplined-execution':
        return 'Measuring operational efficiency and execution quality';
      case 'energized-culture':
        return 'Assessing cultural health and employee engagement';
      default:
        return 'Analyzing prioritization and resource allocation';
    }
  };
  
  // Helper function to get metrics title based on selected category
  const getCategoryMetricsTitle = () => {
    switch (selectedCategory) {
      case 'strategic-clarity':
        return 'Strategic Alignment Metrics';
      case 'scalable-talent':
        return 'Talent Development Metrics';
      case 'relentless-focus':
        return 'Business Impact Metrics';
      case 'disciplined-execution':
        return 'Execution Quality Metrics';
      case 'energized-culture':
        return 'Cultural Health Metrics';
      default:
        return 'Business Impact Metrics';
    }
  };
  
  // Helper function to get value statement based on selected category
  const getValueStatement = () => {
    switch (selectedCategory) {
      case 'strategic-clarity':
        return 'strategic alignment and vision coherence';
      case 'scalable-talent':
        return 'leadership development and talent optimization';
      case 'relentless-focus':
        return 'capacity optimization and strategic acceleration';
      case 'disciplined-execution':
        return 'process efficiency and quality improvement';
      case 'energized-culture':
        return 'engagement enhancements and cultural innovation';
      default:
        return 'capacity optimization and strategic acceleration';
    }
  };

  // Get title and description for current analysis
  const analysisTitle = getAnalysisTitle();
  const analysisDescription = getAnalysisDescription();
  
  // Pre-calculate these values to avoid reference errors
  const metricsSectionTitle = getCategoryMetricsTitle();
  const valuePhrasing = getValueStatement();
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{analysisTitle}</h2>
          <p className="text-sm text-neutral-500">{analysisDescription}</p>
        </div>
        <div className="bg-neutral-100 px-3 py-1 rounded-md text-sm font-medium">
          {period}
        </div>
        <div className="text-lg font-semibold">{companyName}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Performance Trajectory</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trajectoryData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border-t border-dashed border-yellow-400 mt-2 pt-2 text-center text-sm text-yellow-600">
            Target
          </div>
        </div>

        <div>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-medium">Trend analysis: <span className="text-green-500">+{trendPercentage}%</span></h3>
            </div>
            <p className="text-neutral-600 mb-2">
              improvement over last 3 quarters
            </p>
            <p className="text-neutral-600">
              Progressive improvement in prioritization is freeing up strategic resources
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{metricsSectionTitle}</h3>
          <div className="space-y-4">
            {(() => {
              // Determine which metrics to show based on the selected category
              switch (selectedCategory) {
                case 'strategic-clarity':
                  return (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Vision alignment</span>
                          <span className="text-green-500">+{resourceOptimization + 3}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${(resourceOptimization + 3) * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Decision cohesion</span>
                          <span className="text-blue-500">+{projectCompletionRate - 2}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(projectCompletionRate - 2) * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Mission understanding</span>
                          <span className="text-purple-500">+{strategicCapacity + 4}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(strategicCapacity + 4) * 3}%` }}></div>
                        </div>
                      </div>
                    </>
                  );
                case 'scalable-talent':
                  return (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Talent retention</span>
                          <span className="text-green-500">+{resourceOptimization - 2}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(resourceOptimization - 2) * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Leadership pipeline</span>
                          <span className="text-blue-500">+{projectCompletionRate + 4}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(projectCompletionRate + 4) * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Skills development</span>
                          <span className="text-purple-500">+{strategicCapacity + 2}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(strategicCapacity + 2) * 3}%` }}></div>
                        </div>
                      </div>
                    </>
                  );
                case 'relentless-focus':
                  return (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Resource optimization</span>
                          <span className="text-green-500">+{resourceOptimization}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${resourceOptimization * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Project completion rate</span>
                          <span className="text-blue-500">+{projectCompletionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${projectCompletionRate * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Strategic capacity</span>
                          <span className="text-purple-500">+{strategicCapacity}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${strategicCapacity * 3}%` }}></div>
                        </div>
                      </div>
                    </>
                  );
                case 'disciplined-execution':
                  return (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Process efficiency</span>
                          <span className="text-green-500">+{resourceOptimization + 5}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(resourceOptimization + 5) * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Quality control</span>
                          <span className="text-blue-500">+{projectCompletionRate + 8}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(projectCompletionRate + 8) * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Deadline achievement</span>
                          <span className="text-purple-500">+{strategicCapacity + 3}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(strategicCapacity + 3) * 3}%` }}></div>
                        </div>
                      </div>
                    </>
                  );
                case 'energized-culture':
                  return (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Employee engagement</span>
                          <span className="text-green-500">+{resourceOptimization - 4}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(resourceOptimization - 4) * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Collaboration index</span>
                          <span className="text-blue-500">+{projectCompletionRate - 2}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(projectCompletionRate - 2) * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Innovation index</span>
                          <span className="text-purple-500">+{strategicCapacity - 1}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(strategicCapacity - 1) * 3}%` }}></div>
                        </div>
                      </div>
                    </>
                  );
                default:
                  return (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Resource optimization</span>
                          <span className="text-green-500">+{resourceOptimization}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${resourceOptimization * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Project completion rate</span>
                          <span className="text-blue-500">+{projectCompletionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${projectCompletionRate * 3}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Strategic capacity</span>
                          <span className="text-purple-500">+{strategicCapacity}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${strategicCapacity * 3}%` }}></div>
                        </div>
                      </div>
                    </>
                  );
              }
            })()}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4 text-amber-800">
              <p className="text-sm">
                Total estimated value: <span className="font-semibold">$2.8M</span> through {valuePhrasing}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Competitive Benchmark</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Industry Average</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                  <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Top Quartile</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                  <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <span className="text-sm font-medium">82%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Your Company</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm font-medium">80%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Target (2025)</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-sm font-medium">100%</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4 text-amber-800">
              <p className="text-sm">
                While you're more focused than 65% of competitors, the highest-performing organizations are capturing 40% more value from their strategic initiatives. The focus gap is costing you millions in unrealized opportunity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusEffectivenessAnalysis;