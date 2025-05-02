import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RadialMenu from '@/components/RadialMenu';
import PanelView from '@/components/PanelView';
import { assessmentData, FrameworkCategory, getCategoryColor } from '@/lib/mockData';

const FiveXCEO = () => {
  const [activeView, setActiveView] = useState<'myCEO' | '5xCEO'>('5xCEO');
  const [selectedCategory, setSelectedCategory] = useState<FrameworkCategory | null>(null);

  const handleToggleView = () => {
    // In 5xCEO page, this would navigate to MyCEO page instead
    window.location.href = '/myCEO';
  };

  const handleSelectCategory = (category: FrameworkCategory) => {
    setSelectedCategory(category);
  };

  const handleClosePanel = () => {
    setSelectedCategory(null);
  };

  const handleNextCategory = () => {
    const currentIndex = assessmentData.categories.findIndex(
      (cat) => cat.id === selectedCategory?.id
    );
    const nextIndex = (currentIndex + 1) % assessmentData.categories.length;
    setSelectedCategory(assessmentData.categories[nextIndex]);
  };

  const handlePreviousCategory = () => {
    const currentIndex = assessmentData.categories.findIndex(
      (cat) => cat.id === selectedCategory?.id
    );
    const prevIndex = currentIndex === 0 
      ? assessmentData.categories.length - 1 
      : currentIndex - 1;
    setSelectedCategory(assessmentData.categories[prevIndex]);
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 bg-neutral-50 py-8 px-4 md:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">
            5xCEO Framework Dashboard
          </h1>
          <p className="text-neutral-600 mt-2">
            Interpreted assessment data with framework-driven insights and improvement opportunities.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-center">Interactive 5xCEO Framework</h2>
            <RadialMenu
              categories={assessmentData.categories}
              activeView={activeView}
              onToggleView={handleToggleView}
              onSelectCategory={handleSelectCategory}
            />
            <div className="text-center mt-6 text-sm text-neutral-500">
              Click on any category to view detailed metrics or click the center button to switch to myCEO view
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Assessment Summary</h2>
            <p className="mb-4">
              Based on the 5xCEO framework assessment, {assessmentData.companyName} shows strengths in Strategic Clarity 
              and Disciplined Execution, with opportunities for improvement in Relentless Focus.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {assessmentData.categories.map((category) => {
                const colors = getCategoryColor(category.id);
                return (
                  <div 
                    key={category.id}
                    className={`${colors.bg} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => handleSelectCategory(category)}
                  >
                    <h3 className={`font-medium ${colors.text}`}>{category.name}</h3>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance:</span>
                        <span className="font-medium">{category.performance}%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5">
                        <div className={`${colors.accent} h-2.5 rounded-full`} style={{ width: `${category.performance}%` }}></div>
                      </div>
                    </div>
                    <p className={`text-sm mt-2 ${colors.text}`}>
                      {category.improvementOpportunity}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Overall Recommendations</h2>
            <div className="space-y-4">
              <p>
                Based on the assessment data, focus on the following key improvement areas:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Implement more rigorous project prioritization framework to improve Relentless Focus.</li>
                <li>Enhance leadership development programs for middle management to strengthen Scalable Talent.</li>
                <li>Address work-life balance concerns in high-growth departments to sustain Energized Culture.</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Panel View Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <PanelView
                category={selectedCategory}
                onClose={handleClosePanel}
                onNext={handleNextCategory}
                onPrevious={handlePreviousCategory}
                viewMode="5xCEO"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FiveXCEO;