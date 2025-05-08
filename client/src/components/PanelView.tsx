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
  
  // Helper function to convert color code to Tailwind classes
  const getColorClasses = (colorCode: string) => {
    const baseColor = colorCode === '#FF5722' ? 'orange' 
                    : colorCode === '#4CAF50' ? 'green' 
                    : colorCode === '#2196F3' ? 'blue' 
                    : colorCode === '#9C27B0' ? 'purple' 
                    : colorCode === '#FFC107' ? 'amber' 
                    : 'gray';
    
    return {
      bg: `bg-${baseColor}-50`,
      text: `text-${baseColor}-800`,
      border: `border-${baseColor}-300`,
      accent: `bg-${baseColor}-500`
    };
  };
  
  // Generate Triple Threat Solutions based on category
  const getTripleThreatSolutions = (categoryId: string) => {
    switch(categoryId) {
      case 'strategic-clarity':
        return [
          "Create a one-page strategic plan that every employee can understand and reference",
          "Schedule monthly strategic alignment sessions with all department heads",
          "Implement a strategic objectives dashboard visible to all team members"
        ];
      case 'relentless-focus':
        return [
          "Institute a project prioritization matrix that aligns with strategic objectives",
          "Conduct weekly focus review meetings to eliminate low-value activities",
          "Use time-tracking analytics to identify and reduce time spent on non-core activities"
        ];
      case 'disciplined-execution':
        return [
          "Implement a structured accountability framework with clear owners for each deliverable",
          "Establish a regular cadence of execution reviews with predefined metrics",
          "Create a recognition program specifically for execution excellence"
        ];
      case 'scalable-talent':
        return [
          "Develop skill matrices for each role with clear development pathways", 
          "Implement quarterly capability assessments tied to growth objectives",
          "Create cross-functional mentoring pairs to accelerate knowledge transfer"
        ];
      case 'energized-culture':
        return [
          "Launch a structured employee feedback program with action tracking",
          "Establish team-level culture champions with specific improvement metrics",
          "Create regular team-building activities aligned with company values"
        ];
      default:
        return [
          "Establish clear metrics to track progress in this area",
          "Schedule regular review sessions to evaluate improvement",
          "Designate a champion to lead initiatives in this category"
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
          {/* Triple Threat Solution Section - Moved up to align with Description */}
          <div className={`p-4 rounded-lg bg-white border ${colors.border}`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Triple Threat Solution</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>GPT-Powered</span>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Based on current performance, focus on {category.name.toLowerCase()} initiatives that will drive business growth and team alignment.
            </p>
            <div className="prose prose-sm">
              <ul className="space-y-2 list-disc pl-5">
                {tripleThreatSolutions.map((solution, index) => (
                  <li key={index} className="text-sm">{solution}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Dual Axis Performance Mockup - Added at the bottom */}
          <div className={`p-4 rounded-lg bg-white border ${colors.border}`}>
            <h3 className="text-lg font-semibold mb-2">Performance Impact</h3>
            
            <div className="company-name text-center font-medium text-neutral-700 mb-3">
              {category.company || "ABC Company"}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-center mb-2">Performance as-is</h4>
                <div className="bg-neutral-100 rounded-lg p-3 h-32 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center">
                    <span className="text-xl font-bold">{category.score}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-center mb-2">5x Solution</h4>
                <div className="bg-neutral-100 rounded-lg p-3 h-32 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-full ${colors.accent} flex items-center justify-center`}>
                    <span className="text-xl font-bold text-white">{Math.min(100, Math.round(category.score * 1.3))}%</span>
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