import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FrameworkCategory } from '../lib/mockData';
import { getCategoryColor, generateInterpretation } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PanelViewProps {
  category: FrameworkCategory;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  viewMode: 'MyCEO' | '5xCEO';
}

const PanelView: React.FC<PanelViewProps> = ({
  category,
  onClose,
  onNext,
  onPrevious,
  viewMode,
}) => {
  const colorName = getCategoryColor(category.id);
  const interpretation = generateInterpretation(category, viewMode);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [showImproved, setShowImproved] = useState<boolean>(false);
  
  // Helper function to convert color code to Tailwind classes with improved colors
  const getColorClasses = (colorCode: string) => {
    const baseColor = colorCode === '#FF5722' ? 'orange' 
                    : colorCode === '#4CAF50' ? 'emerald' 
                    : colorCode === '#2196F3' ? 'sky' 
                    : colorCode === '#9C27B0' ? 'violet' 
                    : colorCode === '#FFC107' ? 'amber' 
                    : 'gray';
    
    return {
      bg: `bg-${baseColor}-50`,
      text: `text-${baseColor}-800`,
      border: `border-${baseColor}-200`,
      accent: `bg-${baseColor}-500`
    };
  };
  
  // Generate Actionable Solutions based on category with more compelling language
  const getTripleThreatSolutions = (categoryId: string) => {
    switch(categoryId) {
      case 'strategic-clarity':
        return [
          "Crystallize Vision: Develop a one-page strategic plan that translates complex goals into clear actions every employee can understand and champion",
          "Alignment Accelerator: Implement monthly cross-functional strategic sessions that eliminate silos and ensure all departments are moving in perfect concert",
          "Decision GPS: Create a real-time strategic dashboard that visualizes company-wide progress and empowers teams to make faster, better decisions"
        ];
      case 'relentless-focus':
        return [
          "Strategic Filter: Build a decision matrix that aligns every project with your core objectives, preventing the dilution of resources on non-essential activities",
          "Value Maximizer: Establish weekly focus audits that systematically eliminate low-impact work and redirect energy to breakthrough opportunities",
          "Productivity Spotlight: Deploy time analytics that identify exactly where high-value time is being consumed by low-value activities, increasing overall impact by 30%"
        ];
      case 'disciplined-execution':
        return [
          "Ownership Architecture: Implement a transparent accountability framework that creates crystal-clear ownership for every critical deliverable",
          "Execution Rhythm: Establish a cadence of results-focused reviews that use predefined metrics to maintain momentum and catch issues before they become problems",
          "Impact Recognition: Create a structured program that celebrates execution excellence, reinforcing a culture where follow-through becomes part of your competitive advantage"
        ];
      case 'scalable-talent':
        return [
          "Capability Mapping: Develop role-specific competency matrices with personalized growth pathways that connect individual development to company objectives", 
          "Growth Pulse Assessments: Implement quarterly capability reviews that identify skill gaps before they become performance issues and link directly to market opportunities",
          "Knowledge Acceleration Network: Create strategic cross-functional mentoring partnerships that break down silos and transfer critical institutional knowledge 5x faster than traditional methods"
        ];
      case 'energized-culture':
        return [
          "Engagement Ecosystem: Launch a structured feedback system that not only captures sentiment but transforms insights into concrete actions that visibly improve working conditions",
          "Culture Accelerators: Establish team-level champions with specific metrics who serve as catalysts for cultural transformation and accountability",
          "Values in Action: Design team experiences that transform abstract company values into lived experiences, strengthening emotional connection and reducing turnover by up to 40%"
        ];
      default:
        return [
          "Performance Visibility: Establish metrics that connect this area directly to business outcomes, making progress transparent and meaningful",
          "Momentum System: Create a structured review cadence that maintains focus and drives continuous improvement through regular accountability",
          "Change Catalyst: Appoint a dedicated champion who owns transformation in this area, ensuring initiatives receive the attention and resources they deserve"
        ];
    }
  };
  
  const tripleThreatSolutions = getTripleThreatSolutions(category.id);
  const colors = getColorClasses(colorName);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -50,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`w-full h-full p-6 rounded-xl shadow-lg ${colors.bg}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          className={`text-2xl font-bold ${colors.text}`}
          variants={itemVariants}
        >
          {category.name}
        </motion.h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            className="flex items-center"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>

      {/* Full-width Talent Optimization section at the top */}
      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        <div className={`p-4 rounded-lg bg-white border ${colors.border}`}>
          <h3 className="text-lg font-semibold mb-2">
            {category.id === 'strategic-clarity' && "Vision & Alignment"}
            {category.id === 'relentless-focus' && "Focus & Prioritization"}
            {category.id === 'disciplined-execution' && "Execution & Accountability"}
            {category.id === 'scalable-talent' && "Talent Optimization"}
            {category.id === 'energized-culture' && "Culture & Engagement"}
            {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && "Description"}
          </h3>
          <p className="text-neutral-700">
            {category.id === 'strategic-clarity' && 
              "When your entire organization has crystal-clear strategic direction, decisions happen faster, investments align with outcomes, and your competitive advantage grows daily. Right now, misalignment is silently eroding your market position."}
            {category.id === 'relentless-focus' && 
              "In today's overcrowded marketplace, organizations that relentlessly prioritize their highest-leverage activities outperform competitors by up to 4x. Your current resource allocation is spreading your team too thin across initiatives with vastly different values."}
            {category.id === 'disciplined-execution' && 
              "The gap between strategy and results is where most organizations fail. Systematic execution creates predictable outcomes that build both market trust and internal confidence. Your execution gaps are creating costly delays and missed opportunities."}
            {category.id === 'scalable-talent' && 
              "People aren't just resources—they're your competitive advantage. When the right people with the right capabilities thrive in the right roles, innovation accelerates and competitors fall behind. Your current talent strategy is leaving millions in potential untapped."}
            {category.id === 'energized-culture' && 
              "Culture isn't a soft metric—it's the invisible force that determines how decisions get made when no one is watching. A thriving culture creates resilience during challenges and attracts top talent. Your current engagement levels are limiting both creativity and retention."}
            {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && category.description}
          </p>
        </div>
      </motion.div>
      
      {/* Side-by-side Performance Assessment and Talent Acceleration Blueprint */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        variants={itemVariants}
      >
        {/* Left column - Performance Assessment */}
        <div className={`p-4 rounded-lg bg-white border ${colors.border}`}>
          <h3 className="text-lg font-semibold mb-2">Performance Assessment</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold">Overall Performance</span>
                <div className="flex items-center">
                  <span className={`text-sm font-bold ${
                    category.score < 60 ? 'text-red-700' : 
                    category.score < 75 ? 'text-amber-700' : 
                    category.score < 90 ? 'text-green-700' : 
                    'text-emerald-700'
                  }`}>{category.score}%</span>
                  <span className="text-xs ml-1 text-neutral-500">
                    ({
                      category.score < 60 ? 'Critical Gap' : 
                      category.score < 75 ? 'Needs Attention' : 
                      category.score < 90 ? 'Strong' : 
                      'Exceptional'
                    })
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className={`${colors.accent} h-2.5 rounded-full`} style={{ width: `${category.score}%` }}></div>
              </div>
            </div>

            {viewMode === 'MyCEO' && (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Leadership Effectiveness</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        Math.round(category.score * 0.9) < 60 ? 'text-red-600' : 
                        Math.round(category.score * 0.9) < 75 ? 'text-amber-600' : 
                        'text-green-600'
                      }`}>{Math.round(category.score * 0.9)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className={`${colors.accent} h-2.5 rounded-full`} style={{ width: `${Math.round(category.score * 0.9)}%`, opacity: 0.8 }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Team Effectiveness</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        Math.round(category.score * 0.85) < 60 ? 'text-red-600' : 
                        Math.round(category.score * 0.85) < 75 ? 'text-amber-600' : 
                        'text-green-600'
                      }`}>{Math.round(category.score * 0.85)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className={`${colors.accent} h-2.5 rounded-full`} style={{ width: `${Math.round(category.score * 0.85)}%`, opacity: 0.8 }}></div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-4 text-sm">
            <h4 className="font-medium mb-1 text-neutral-700">Key Insights</h4>
            <p className="whitespace-pre-line text-neutral-600">
              {category.id === 'strategic-clarity' && 
                `Your organization's ${category.score}% performance in Strategic Clarity indicates significant opportunity for alignment improvement. While foundational strategic elements exist, execution is hampered by inconsistent understanding across teams. This misalignment is creating friction in decision-making and reducing your competitive agility in key market segments.`}
              {category.id === 'relentless-focus' && 
                `At ${category.score}%, your Relentless Focus score reveals concerning resource dilution. Critical initiatives are competing with lower-value activities for attention and investment. This fragmentation is extending project timelines and reducing the impact of your highest-potential opportunities by an estimated 30%.`}
              {category.id === 'disciplined-execution' && 
                `Your ${category.score}% score in Disciplined Execution highlights inconsistent follow-through on strategic commitments. While some teams demonstrate strong accountability practices, execution velocity varies significantly across departments, resulting in missed market opportunities and internal frustration.`}
              {category.id === 'scalable-talent' && 
                `With a ${category.score}% in Scalable Talent, your organization has fundamental talent systems in place but lacks the strategic alignment and development pathways needed to fully leverage your human capital. Critical skills gaps are emerging in areas directly tied to your growth objectives, creating both performance and retention risks.`}
              {category.id === 'energized-culture' && 
                `Your ${category.score}% Culture score indicates moderate engagement but reveals concerning trends in psychological safety and innovation capacity. While core values are articulated, they're inconsistently lived in day-to-day operations, particularly during periods of stress or rapid change.`}
              {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && interpretation}
            </p>
            
            <p className="mt-3 mb-1 text-neutral-600">
              Based on the 5xCEO framework assessment, GlobalSolutions shows strengths in Strategic Clarity and Disciplined Execution, with opportunities for improvement in Relentless Focus.
            </p>
          </div>
        </div>

        {/* Right column - Blueprint Section */}
        <div className={`p-4 rounded-lg bg-white border ${colors.border}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              {category.id === 'strategic-clarity' && "Vision Acceleration Blueprint"}
              {category.id === 'relentless-focus' && "Priority Optimization Blueprint"}
              {category.id === 'disciplined-execution' && "Execution Excellence Blueprint"}
              {category.id === 'scalable-talent' && "Talent Acceleration Blueprint"}
              {category.id === 'energized-culture' && "Culture Transformation Blueprint"}
              {category.id !== 'strategic-clarity' && 
               category.id !== 'relentless-focus' && 
               category.id !== 'disciplined-execution' && 
               category.id !== 'scalable-talent' && 
               category.id !== 'energized-culture' && "Performance Optimization Blueprint"}
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">GPT-Powered</span>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            {category.id === 'strategic-clarity' && 
              "Your strategic clarity gap is costing you market share. This blueprint provides targeted interventions that will align your organization and accelerate decision-making."}
            {category.id === 'relentless-focus' && 
              "Diluted focus is draining your resources. These precision interventions will eliminate distractions and concentrate your team's energy on your highest-impact opportunities."}
            {category.id === 'disciplined-execution' && 
              "Execution inconsistency is undermining your strategy. These interventions will transform intentions into measurable outcomes through systematic accountability."}
            {category.id === 'scalable-talent' && 
              "Your talent gap is costing you millions in unrealized potential. This blueprint will unlock hidden capabilities and create sustainable competitive advantage."}
            {category.id === 'energized-culture' && 
              "Cultural erosion is silently driving talent loss. These targeted interventions will transform engagement and create an environment where innovation thrives."}
            {category.id !== 'strategic-clarity' && 
             category.id !== 'relentless-focus' && 
             category.id !== 'disciplined-execution' && 
             category.id !== 'scalable-talent' && 
             category.id !== 'energized-culture' && 
              "Based on current performance, these focused interventions will drive significant improvement in outcomes and competitive positioning."}
          </p>
          <div className="space-y-3">
            {tripleThreatSolutions.map((solution, index) => (
              <div key={index} className="flex items-start">
                <span className="text-neutral-400 mr-2">•</span>
                <p className="text-sm text-neutral-700">{solution}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strategic Impact Analysis - Full width landscape section */}
      <motion.div 
        className="mt-6"
        variants={itemVariants}
      >
        <div className={`p-4 rounded-lg bg-white border ${colors.border}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {category.id === 'strategic-clarity' && "Strategic Impact Analysis"}
              {category.id === 'relentless-focus' && "Focus Effectiveness Analysis"}
              {category.id === 'disciplined-execution' && "Execution Impact Analysis"}
              {category.id === 'scalable-talent' && "Talent Optimization Analysis"}
              {category.id === 'energized-culture' && "Culture Value Analysis"}
              {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && "Business Impact Analysis"}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-neutral-600">Q1 2025</span>
              <div className="company-name font-medium text-neutral-700">
                {category.company || "GlobalSolutions"}
              </div>
            </div>
          </div>

          {/* Performance Trajectory - Full Width Top Section */}
          <div className="mb-5">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Performance Trajectory</h4>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="relative h-32 flex items-end gap-8 pb-1">
                    {/* Bar chart showing score trend over last 4 quarters - larger size */}
                    <div className="flex-1 bg-gray-200 relative h-[65%] flex flex-col justify-end items-center">
                      <div 
                        className={`${colors.accent} w-full absolute bottom-0`} 
                        style={{ height: '65%', opacity: 0.7 }}
                        onMouseEnter={() => setHoveredMetric('Q2')}
                        onMouseLeave={() => setHoveredMetric(null)}
                      ></div>
                      <span className="text-xs font-medium absolute -bottom-6">Q2</span>
                      {hoveredMetric === 'Q2' && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-40">
                          <p className="text-xs font-semibold">Q2 Performance: 65%</p>
                          <p className="text-xs">Early strategic implementation phase</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 bg-gray-200 relative h-[70%] flex flex-col justify-end items-center">
                      <div 
                        className={`${colors.accent} w-full absolute bottom-0`} 
                        style={{ height: '70%', opacity: 0.8 }}
                        onMouseEnter={() => setHoveredMetric('Q3')}
                        onMouseLeave={() => setHoveredMetric(null)}
                      ></div>
                      <span className="text-xs font-medium absolute -bottom-6">Q3</span>
                      {hoveredMetric === 'Q3' && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-40">
                          <p className="text-xs font-semibold">Q3 Performance: 70%</p>
                          <p className="text-xs">Initial gains from implementation efforts</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 bg-gray-200 relative h-[78%] flex flex-col justify-end items-center">
                      <div 
                        className={`${colors.accent} w-full absolute bottom-0`} 
                        style={{ height: '78%', opacity: 0.9 }}
                        onMouseEnter={() => setHoveredMetric('Q4')}
                        onMouseLeave={() => setHoveredMetric(null)}
                      ></div>
                      <span className="text-xs font-medium absolute -bottom-6">Q4</span>
                      {hoveredMetric === 'Q4' && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-40">
                          <p className="text-xs font-semibold">Q4 Performance: 78%</p>
                          <p className="text-xs">Accelerated performance from system improvements</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 bg-gray-200 relative h-[85%] flex flex-col justify-end items-center">
                      <div 
                        className={`${colors.accent} w-full absolute bottom-0`} 
                        style={{ height: `${category.score}%` }}
                        onMouseEnter={() => setHoveredMetric('Q1')}
                        onMouseLeave={() => setHoveredMetric(null)}
                      ></div>
                      <span className="text-xs font-medium absolute -bottom-6">Q1</span>
                      {hoveredMetric === 'Q1' && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-40">
                          <p className="text-xs font-semibold">Q1 Performance: {category.score}%</p>
                          <p className="text-xs">Current performance level</p>
                        </div>
                      )}
                    </div>
                    {/* Current target line */}
                    <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-amber-400 flex justify-end">
                      <span className="bg-amber-400 text-white text-xs px-2 py-0.5 rounded">Target</span>
                    </div>
                  </div>
                </div>
                <div className="w-64 shrink-0 pl-8">
                  <p className="text-base mb-2">
                    <span className="font-medium">Trend analysis:</span> <span className="text-green-600 font-bold">+20%</span>
                  </p>
                  <p className="text-sm text-neutral-600">
                    improvement over last 3 quarters
                  </p>
                  <p className="text-sm text-neutral-600 mt-3">
                    {category.id === 'strategic-clarity' && "Accelerating alignment is creating increasingly visible market advantages"}
                    {category.id === 'relentless-focus' && "Progressive improvement in prioritization is freeing up strategic resources"}
                    {category.id === 'disciplined-execution' && "Consistent execution gains are translating to improved delivery predictability"}
                    {category.id === 'scalable-talent' && "Systematic talent development is reducing capability gaps in critical areas"}
                    {category.id === 'energized-culture' && "Cultural improvements are driving better retention and team performance"}
                    {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && "Consistent improvement showing positive trajectory toward target state"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle for Current/Improved view - only for relentless-focus in MyCEO view */}
          {viewMode === 'MyCEO' && category.id === 'relentless-focus' && (
            <div className="flex items-center mb-4">
              <Button
                variant={showImproved ? "default" : "outline"}
                size="sm"
                className={`transition-all duration-300 ease-in-out mr-2 ${showImproved ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-gray-600'}`}
                onClick={() => setShowImproved(!showImproved)}
              >
                {showImproved ? "Improved" : "Current"}
              </Button>
              <p className="text-xs text-gray-500">Compare performance impact before and after strategic optimization.</p>
            </div>
          )}
          
          {/* Business Impact & Benchmark Comparison Section - Side by side below */}
          <div className="grid grid-cols-2 gap-5">
            {/* Left side - Business Impact Metrics */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Business Impact Metrics</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category.id === 'strategic-clarity' ? 'Decision velocity' : 
                          category.id === 'relentless-focus' ? 'Resource optimization' :
                          category.id === 'disciplined-execution' ? 'Execution effectiveness' :
                          category.id === 'scalable-talent' ? 'Talent optimization' :
                          category.id === 'energized-culture' ? 'Employee engagement' : 'Primary metric'}</span>
                    <motion.span 
                      className="text-emerald-600 font-medium"
                      key={`primary-${showImproved}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                        (showImproved ? '+28%' : '+14%') : 
                        `+${Math.round(category.score / 5)}%`}
                    </motion.span>
                  </div>
                  <div 
                    className="w-full bg-gray-100 rounded-full h-3 relative"
                    onMouseEnter={() => setHoveredMetric('primary')}
                    onMouseLeave={() => setHoveredMetric(null)}
                  >
                    <motion.div 
                      className="bg-emerald-500 h-3 rounded-full" 
                      style={{ 
                        width: viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                          (showImproved ? '78%' : '64%') : 
                          `${category.score / 2 + 50}%` 
                      }}
                      initial={{ width: viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                        (showImproved ? '64%' : '78%') : 
                        `${category.score / 2 + 50}%` }}
                      animate={{ 
                        width: viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                          (showImproved ? '78%' : '64%') : 
                          `${category.score / 2 + 50}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {hoveredMetric === 'primary' && (
                      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                        <p className="text-xs font-semibold">Primary Metric Impact</p>
                        <p className="text-xs">Directly impacts your competitive positioning and market response capability</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category.id === 'strategic-clarity' ? 'Strategic alignment' : 
                           category.id === 'relentless-focus' ? 'Project completion rate' :
                           category.id === 'disciplined-execution' ? 'On-time delivery' :
                           category.id === 'scalable-talent' ? 'Leadership capability' :
                           category.id === 'energized-culture' ? 'Innovation index' : 'Secondary metric'}</span>
                    <motion.span 
                      className="text-blue-600 font-medium"
                      key={`secondary-${showImproved}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                        (showImproved ? '+23%' : '+11%') : 
                        `+${Math.round(category.score / 6)}%`}
                    </motion.span>
                  </div>
                  <div 
                    className="w-full bg-gray-100 rounded-full h-3 relative"
                    onMouseEnter={() => setHoveredMetric('secondary')}
                    onMouseLeave={() => setHoveredMetric(null)}
                  >
                    <motion.div 
                      className="bg-blue-500 h-3 rounded-full" 
                      style={{ 
                        width: viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                          (showImproved ? '73%' : '61%') : 
                          `${category.score / 2.2 + 45}%` 
                      }}
                      initial={{ width: viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                        (showImproved ? '61%' : '73%') : 
                        `${category.score / 2.2 + 45}%` }}
                      animate={{ 
                        width: viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                          (showImproved ? '73%' : '61%') : 
                          `${category.score / 2.2 + 45}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {hoveredMetric === 'secondary' && (
                      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                        <p className="text-xs font-semibold">Secondary Metric Impact</p>
                        <p className="text-xs">Supports operational excellence and team performance</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category.id === 'strategic-clarity' ? 'Investment efficiency' : 
                           category.id === 'relentless-focus' ? 'Strategic capacity' :
                           category.id === 'disciplined-execution' ? 'Quality index' :
                           category.id === 'scalable-talent' ? 'Retention rate' :
                           category.id === 'energized-culture' ? 'Team effectiveness' : 'Tertiary metric'}</span>
                    <motion.span 
                      className="text-purple-600 font-medium"
                      key={`tertiary-${showImproved}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                        (showImproved ? '+20%' : '+10%') : 
                        `+${Math.round(category.score / 7)}%`}
                    </motion.span>
                  </div>
                  <div 
                    className="w-full bg-gray-100 rounded-full h-3 relative"
                    onMouseEnter={() => setHoveredMetric('tertiary')}
                    onMouseLeave={() => setHoveredMetric(null)}
                  >
                    <motion.div 
                      className="bg-purple-500 h-3 rounded-full" 
                      style={{ 
                        width: viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                          (showImproved ? '70%' : '60%') : 
                          `${category.score / 2.5 + 40}%` 
                      }}
                      initial={{ width: viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                        (showImproved ? '60%' : '70%') : 
                        `${category.score / 2.5 + 40}%` }}
                      animate={{ 
                        width: viewMode === 'MyCEO' && category.id === 'relentless-focus' ? 
                          (showImproved ? '70%' : '60%') : 
                          `${category.score / 2.5 + 40}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {hoveredMetric === 'tertiary' && (
                      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                        <p className="text-xs font-semibold">Tertiary Metric Impact</p>
                        <p className="text-xs">Long-term strategic advantage driver for sustainable growth</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-amber-50 p-3 rounded border border-amber-200">
                  <motion.p 
                    className="text-sm text-amber-800 font-medium"
                    key={`value-${showImproved}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.id === 'strategic-clarity' && "Total estimated value: $3.5M annual impact through improved execution and market position"}
                    {category.id === 'relentless-focus' && viewMode === 'MyCEO' ? 
                      (showImproved ? 
                        "Total estimated value: $5.6M through capacity optimization and strategic acceleration" : 
                        "Total estimated value: $2.8M through capacity optimization and strategic acceleration"
                      ) : 
                      category.id === 'relentless-focus' && "Total estimated value: $2.8M through capacity optimization and strategic acceleration"}
                    {category.id === 'disciplined-execution' && "Total estimated value: $2.9M from market timing advantage and reduced delivery costs"}
                    {category.id === 'scalable-talent' && "Total estimated value: $2.3M from reduced talent costs and increased innovation value"}
                    {category.id === 'energized-culture' && "Total estimated value: $1.8M from enhanced retention and productivity gains"}
                    {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && "Total estimated value: $2.5M+ in combined business impact"}
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Right side - Competitive Benchmark */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Competitive Benchmark</h4>
              <div className="space-y-3">
                {/* Horizontal bar chart benchmark comparison */}
                <div className="flex items-center w-full">
                  <span className="text-sm w-32">Industry Average</span>
                  <div className="flex-1">
                    <div 
                      className="bg-gray-200 rounded-r-full h-5 relative"
                      onMouseEnter={() => setHoveredMetric('industry')}
                      onMouseLeave={() => setHoveredMetric(null)}
                    >
                      <div className="absolute inset-y-0 left-0 bg-neutral-400 rounded-r-full" style={{ width: '65%' }}></div>
                      <span className="absolute inset-y-0 right-3 flex items-center text-xs font-medium">65%</span>
                      {hoveredMetric === 'industry' && (
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                          <p className="text-xs font-semibold">Industry Average: 65%</p>
                          <p className="text-xs">Typical performance level across your industry sector</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center w-full">
                  <span className="text-sm w-32">Top Quartile</span>
                  <div className="flex-1">
                    <div 
                      className="bg-gray-200 rounded-r-full h-5 relative"
                      onMouseEnter={() => setHoveredMetric('topQuartile')}
                      onMouseLeave={() => setHoveredMetric(null)}
                    >
                      <div className="absolute inset-y-0 left-0 bg-neutral-500 rounded-r-full" style={{ width: '82%' }}></div>
                      <span className="absolute inset-y-0 right-3 flex items-center text-xs font-medium">82%</span>
                      {hoveredMetric === 'topQuartile' && (
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                          <p className="text-xs font-semibold">Top Quartile: 82%</p>
                          <p className="text-xs">Performance level of leading competitors in your space</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center w-full">
                  <span className="text-sm w-32">Your Company</span>
                  <div className="flex-1">
                    <div 
                      className="bg-gray-200 rounded-r-full h-5 relative"
                      onMouseEnter={() => setHoveredMetric('yourCompany')}
                      onMouseLeave={() => setHoveredMetric(null)}
                    >
                      <div className={`absolute inset-y-0 left-0 ${colors.accent} rounded-r-full`} style={{ width: `${category.score}%` }}></div>
                      <span className="absolute inset-y-0 right-3 flex items-center text-xs font-medium">{category.score}%</span>
                      {hoveredMetric === 'yourCompany' && (
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                          <p className="text-xs font-semibold">Your Company: {category.score}%</p>
                          <p className="text-xs">Your current performance level represents {Math.round(category.score * 100 / 82)}% of top quartile capability</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center w-full">
                  <span className="text-sm w-32">Target (2025)</span>
                  <div className="flex-1">
                    <div 
                      className="bg-gray-200 rounded-r-full h-5 relative"
                      onMouseEnter={() => setHoveredMetric('target')}
                      onMouseLeave={() => setHoveredMetric(null)}
                    >
                      <div className="absolute inset-y-0 left-0 bg-amber-400 rounded-r-full" style={{ width: `${Math.min(100, Math.round(category.score * 1.25))}%` }}></div>
                      <span className="absolute inset-y-0 right-3 flex items-center text-xs font-medium">{Math.min(100, Math.round(category.score * 1.25))}%</span>
                      {hoveredMetric === 'target' && (
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                          <p className="text-xs font-semibold">Target (2025): {Math.min(100, Math.round(category.score * 1.25))}%</p>
                          <p className="text-xs">Strategic target setting you ahead of current top quartile performance</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-amber-50 p-3 rounded border border-amber-200">
                  <p className="text-sm text-amber-800">
                    {category.id === 'strategic-clarity' && 
                      `Your organization is outperforming ${Math.round(category.score - 15)}% of your competitors, but there's a critical ${Math.min(100, Math.round(category.score * 1.25)) - category.score}% gap separating you from industry leadership. Companies who close this gap typically see 3-4x greater market share growth in key segments.`}
                    {category.id === 'relentless-focus' && 
                      `While you're more focused than ${Math.round(category.score - 15)}% of competitors, the highest-performing organizations are capturing 40% more value from their strategic initiatives. The focus gap is costing you millions in unrealized opportunity.`}
                    {category.id === 'disciplined-execution' && 
                      `Your execution velocity exceeds ${Math.round(category.score - 10)}% of the industry, but the execution gap between you and top performers is allowing competitors to respond to market shifts 30% faster. This timing advantage is worth an estimated $4.2M annually.`}
                    {category.id === 'scalable-talent' && 
                      `You've built stronger talent systems than ${Math.round(category.score - 5)}% of organizations, but elite companies are generating 2.5x more innovation from their teams. Your talent optimization gap is limiting your competitive ceiling.`}
                    {category.id === 'energized-culture' && 
                      `While your culture outperforms ${Math.round(category.score - 12)}% of organizations, the ${Math.min(100, Math.round(category.score * 1.25)) - category.score}% gap to your potential is creating a competitive vulnerability. Top-tier cultures report 44% higher resilience during market disruption.`}
                    {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && 
                      `Your performance places you above ${Math.round(category.score - 10)}% of organizations, but the ${Math.min(100, Math.round(category.score * 1.25)) - category.score}% gap to your full potential represents significant unrealized business value. Top performers in this area achieve 35% higher returns.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PanelView;