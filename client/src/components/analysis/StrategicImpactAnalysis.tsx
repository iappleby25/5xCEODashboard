import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface StrategicImpactAnalysisProps {
  company: string;
  period: string;
}

const StrategicImpactAnalysis: React.FC<StrategicImpactAnalysisProps> = ({
  company,
  period
}) => {
  // Sample data for demonstration (would be fetched from API in a real app)
  const trajectoryData = [
    { name: 'Q2', value: 65 },
    { name: 'Q3', value: 68 },
    { name: 'Q4', value: 72 },
    { name: 'Q1', value: 76 },
  ];

  const benchmarkData = [
    { name: 'Industry Average', value: 65 },
    { name: 'Top Quartile', value: 82 },
    { name: 'Your Company', value: 76 },
    { name: 'Target (2025)', value: 95 },
  ];

  const impactMetrics = [
    { name: 'Decision velocity', value: 78, improvement: '+15%', color: '#10b981' },
    { name: 'Strategic alignment', value: 82, improvement: '+13%', color: '#3b82f6' },
    { name: 'Investment efficiency', value: 77, improvement: '+11%', color: '#8b5cf6' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Strategic Impact Analysis</h2>
        <div className="flex gap-2">
          <span className="text-neutral-500">{period}</span>
          <span className="text-neutral-700">{company}</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Performance Trajectory</h3>
          <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium">Target</div>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trajectoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis hide domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              <Bar dataKey="value" fill="#f97316" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-start gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-medium text-lg">Trend analysis: <span className="text-green-600">+20%</span></h4>
              <p className="text-neutral-600 text-sm">improvement over last 3 quarters</p>
            </div>
          </div>
          <p className="text-neutral-600">Accelerating alignment is creating increasingly visible market advantages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Business Impact Metrics</h3>
          <div className="space-y-4">
            {impactMetrics.map((metric) => (
              <div key={metric.name}>
                <div className="flex justify-between mb-1">
                  <span>{metric.name}</span>
                  <span className="text-green-600 font-medium">{metric.improvement}</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${metric.value}%`,
                      backgroundColor: metric.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800">
              <span className="font-medium">Total estimated value:</span> $3.5M annual impact through 
              improved execution and market position
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Competitive Benchmark</h3>
          <div className="h-[180px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={benchmarkData}
                layout="vertical"
                margin={{ left: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Bar 
                  dataKey="value" 
                  fill={(data) => data.name === 'Your Company' ? '#f97316' : 
                                data.name === 'Target (2025)' ? '#fbbf24' : 
                                '#6b7280'}
                  barSize={20} 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800 text-sm">
              Your organization is outperforming 61% of your competitors, but there's a critical 19% gap 
              separating you from industry leadership. Companies who close this gap typically see 3-4x greater 
              market share growth in key segments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicImpactAnalysis;