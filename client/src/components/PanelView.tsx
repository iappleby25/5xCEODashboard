import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FrameworkCategory } from '../lib/mockData';
import { getCategoryColor, generateInterpretation } from '../lib/mockData';
import { Button } from '@/components/ui/button';

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

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <div className="space-y-4">
          <motion.div 
            className={`p-4 rounded-lg bg-white border ${colors.border}`}
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p>{category.description}</p>
          </motion.div>

          <motion.div 
            className={`p-4 rounded-lg bg-white border ${colors.border}`}
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold mb-2">Performance Summary</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Performance</span>
                  <span className="text-sm font-medium">{category.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`${colors.accent} h-2.5 rounded-full`} style={{ width: `${category.score}%` }}></div>
                </div>
              </div>

              {viewMode === 'MyCEO' && (
                <>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Leadership Rating</span>
                      <span className="text-sm font-medium">{Math.round(category.score * 0.9)}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`${colors.accent} h-2.5 rounded-full`} style={{ width: `${Math.round(category.score * 0.9)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Team Rating</span>
                      <span className="text-sm font-medium">{Math.round(category.score * 0.85)}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`${colors.accent} h-2.5 rounded-full`} style={{ width: `${Math.round(category.score * 0.85)}%` }}></div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-3 text-sm text-neutral-600">
              <p className="whitespace-pre-line">{interpretation}</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          {/* Solution Blueprint Section */}
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
          
          {/* Dual Axis Performance Mockup - Improved design based on screenshot */}
          <div className={`p-4 rounded-lg bg-white border ${colors.border}`}>
            <h3 className="text-lg font-semibold mb-3">Performance Impact</h3>
            
            <div className="company-name text-center font-medium text-neutral-700 mb-4">
              {category.company || "ABC Company"}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-center mb-3">Performance as-is</h4>
                <div className="bg-gray-50 rounded-lg p-4 h-36 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">{category.score}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-center mb-3">5x Solution</h4>
                <div className="bg-gray-50 rounded-lg p-4 h-36 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-amber-400 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{Math.min(100, Math.round(category.score * 1.25))}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PanelView;