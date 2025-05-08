import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface CategoryAnalysisProps {
  category: string;
  company: string;
  period: string;
}

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({
  category,
  company,
  period
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
  
  // Generate trajectory data
  const trajectoryData = [
    { name: 'Q2', value: 60 },
    { name: 'Q3', value: 65 },
    { name: 'Q4', value: 70 },
    { name: 'Q1', value: category === 'disciplined-execution' ? 78 :
               category === 'strategic-clarity' ? 76 :
               category === 'scalable-talent' ? 65 :
               category === 'relentless-focus' ? 70 :
               category === 'energized-culture' ? 71 : 70 },
  ];

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
        <h3 className="text-lg font-medium mb-2">Performance Trajectory</h3>
        <div className="h-[240px] border-t border-b border-dashed border-neutral-200 py-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trajectoryData} margin={{ top: 20, right: 30, left: 30, bottom: 10 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis hide domain={[0, 100]} />
              <Bar dataKey="value" fill={categoryData.color} barSize={80} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2 text-amber-600 font-medium">Target</div>
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