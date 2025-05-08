import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RadialMenu from '@/components/RadialMenu';
import PanelView from '@/components/PanelView';
import { assessmentData as frameworkCategories, FrameworkCategory, getCategoryColor } from '@/lib/mockData';

const FiveXCEO = () => {
  const [activeView, setActiveView] = useState<'MyCEO' | '5xCEO'>('5xCEO');
  const [selectedCategory, setSelectedCategory] = useState<FrameworkCategory | null>(null);

  const handleToggleView = () => {
    // Not used anymore since we only have one view
    console.log("Toggle view not implemented");
  };

  const handleSelectCategory = (category: FrameworkCategory) => {
    setSelectedCategory(category);
  };

  const handleClosePanel = () => {
    setSelectedCategory(null);
  };

  const handleNextCategory = () => {
    const currentIndex = frameworkCategories.findIndex(
      (cat) => cat.id === selectedCategory?.id
    );
    const nextIndex = (currentIndex + 1) % frameworkCategories.length;
    setSelectedCategory(frameworkCategories[nextIndex]);
  };

  const handlePreviousCategory = () => {
    const currentIndex = frameworkCategories.findIndex(
      (cat) => cat.id === selectedCategory?.id
    );
    const prevIndex = currentIndex === 0 
      ? frameworkCategories.length - 1 
      : currentIndex - 1;
    setSelectedCategory(frameworkCategories[prevIndex]);
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
            MyCEO
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Company: GlobalSolutions</h2>
              <div className="flex items-center space-x-3">
                <label htmlFor="quarterSelect" className="text-sm text-neutral-500 font-medium">Quarter:</label>
                <select 
                  id="quarterSelect" 
                  className="px-3 py-1 text-sm border border-neutral-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  defaultValue="Q1 2023"
                >
                  <option value="Q1 2023">Q1 2023</option>
                  <option value="Q2 2023">Q2 2023</option>
                  <option value="Q3 2023">Q3 2023</option>
                  <option value="Q4 2023">Q4 2023</option>
                  <option value="Q1 2024">Q1 2024</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <RadialMenu
              categories={frameworkCategories}
              activeView={activeView}
              onToggleView={handleToggleView}
              onSelectCategory={handleSelectCategory}
            />
            <div className="text-center mt-6 text-sm text-neutral-500">
              Click on any category to view detailed metrics
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Assessment Summary</h2>
            <p className="mb-4">
              Based on the 5xCEO framework assessment, GlobalSolutions shows strengths in Strategic Clarity 
              and Disciplined Execution, with opportunities for improvement in Relentless Focus.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {frameworkCategories.map((category) => {
                const colorName = getCategoryColor(category.id);
                
                // Map to more custom tailwind colors for consistency
                const baseColor = colorName === '#FF5722' ? 'orange' 
                               : colorName === '#4CAF50' ? 'emerald' 
                               : colorName === '#2196F3' ? 'sky' 
                               : colorName === '#9C27B0' ? 'violet' 
                               : colorName === '#FFC107' ? 'amber' 
                               : 'gray';
                
                const bgClass = `bg-${baseColor}-50`;
                const textClass = `text-${baseColor}-800`;
                const accentClass = `bg-${baseColor}-500`;
                const borderClass = `border-${baseColor}-200`;
                
                return (
                  <div 
                    key={category.id}
                    className={`${bgClass} border ${borderClass} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => handleSelectCategory(category)}
                  >
                    <h3 className={`font-medium ${textClass}`}>{category.name}</h3>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance:</span>
                        <span className="font-medium">{category.score}%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5">
                        <div className={`${accentClass} h-2.5 rounded-full`} style={{ width: `${category.score}%` }}></div>
                      </div>
                    </div>
                    <p className={`text-sm mt-2 ${textClass}`}>
                      {category.description}
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