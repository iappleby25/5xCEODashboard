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
}

const FocusEffectivenessAnalysis: React.FC<FocusEffectivenessAnalysisProps> = ({
  companyName,
  period,
  trendPercentage,
  resourceOptimization,
  projectCompletionRate,
  strategicCapacity
}) => {
  // Sample data for the performance trajectory chart
  const trajectoryData = [
    { name: 'Q2', value: 65 },
    { name: 'Q3', value: 72 },
    { name: 'Q4', value: 78 },
    { name: 'Q1', value: 85 }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Focus Effectiveness Analysis</h2>
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
          <h3 className="text-lg font-medium mb-4">Business Impact Metrics</h3>
          <div className="space-y-4">
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4 text-amber-800">
              <p className="text-sm">
                Total estimated value: <span className="font-semibold">$2.8M</span> through capacity optimization and strategic acceleration
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