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
          </motion.div>

          <motion.div 
            className={`p-4 rounded-lg bg-white border ${colors.border}`}
            variants={itemVariants}
          >
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
          
          {/* Dual Axis Performance Mockup - With more compelling and impactful language */}
          <div className={`p-4 rounded-lg bg-white border ${colors.border}`}>
            <h3 className="text-lg font-semibold mb-3">Performance Impact</h3>
            
            <div className="company-name text-center font-medium text-neutral-700 mb-4">
              {category.company || "ABC Company"}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <h4 className="text-sm font-medium text-center mb-1">Current State</h4>
                <p className="text-xs text-center mb-2 text-neutral-500">
                  {category.id === 'strategic-clarity' && "Competitive limitations"}
                  {category.id === 'relentless-focus' && "Resource dilution"}
                  {category.id === 'disciplined-execution' && "Missed opportunities"}
                  {category.id === 'scalable-talent' && "Talent drag"}
                  {category.id === 'energized-culture' && "Silent disengagement"}
                  {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && "Performance gap"}
                </p>
                <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <span className="text-2xl font-bold text-gray-700">{category.score}%</span>
                  </div>
                </div>
                <p className="text-xs mt-2 text-center text-neutral-500 px-2">
                  {category.id === 'strategic-clarity' && "Unclear priorities costing an estimated $1.2M in misdirected effort annually"}
                  {category.id === 'relentless-focus' && "Scattered resources leading to 32% capacity waste on low-value activities"}
                  {category.id === 'disciplined-execution' && "Delayed timelines costing approximately $850K in lost market opportunities"}
                  {category.id === 'scalable-talent' && "Talent gaps creating ~$2.3M in productivity losses and recruitment costs"}
                  {category.id === 'energized-culture' && "Engagement issues driving 24% higher turnover than industry benchmark"}
                  {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && "Performance challenges creating measurable business impact"}
                </p>
              </div>
              
              <div className="flex flex-col">
                <h4 className="text-sm font-medium text-center mb-1">Transformed State</h4>
                <p className="text-xs text-center mb-2 text-neutral-500">
                  {category.id === 'strategic-clarity' && "Unlocked potential"}
                  {category.id === 'relentless-focus' && "Optimal resource alignment"}
                  {category.id === 'disciplined-execution' && "Value maximization"}
                  {category.id === 'scalable-talent' && "Talent acceleration"}
                  {category.id === 'energized-culture' && "Peak engagement"}
                  {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && "Optimized performance"}
                </p>
                <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-amber-400 flex items-center justify-center border-4 border-amber-300 shadow-lg">
                    <span className="text-2xl font-bold text-white">{Math.min(100, Math.round(category.score * 1.25))}%</span>
                  </div>
                </div>
                <p className="text-xs mt-2 text-center text-neutral-600 font-medium px-2">
                  {category.id === 'strategic-clarity' && `Potential ${Math.min(100, Math.round(category.score * 1.25)) - category.score}% improvement unlocks ~$3.5M in value through aligned execution`}
                  {category.id === 'relentless-focus' && `Potential ${Math.min(100, Math.round(category.score * 1.25)) - category.score}% improvement releases 25% more capacity for high-value work`}
                  {category.id === 'disciplined-execution' && `Potential ${Math.min(100, Math.round(category.score * 1.25)) - category.score}% improvement accelerates time-to-market by up to 40%`}
                  {category.id === 'scalable-talent' && `Potential ${Math.min(100, Math.round(category.score * 1.25)) - category.score}% improvement drives innovation and reduces talent costs by 35%`}
                  {category.id === 'energized-culture' && `Potential ${Math.min(100, Math.round(category.score * 1.25)) - category.score}% improvement reduces attrition and creates ~$1.8M in retention value`}
                  {!['strategic-clarity', 'relentless-focus', 'disciplined-execution', 'scalable-talent', 'energized-culture'].includes(category.id) && `Potential ${Math.min(100, Math.round(category.score * 1.25)) - category.score}% improvement creates substantial business value`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PanelView;