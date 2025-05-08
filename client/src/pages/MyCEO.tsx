import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RadialMenu from '@/components/RadialMenu';
import PanelView from '@/components/PanelView';
import { assessmentData as frameworkCategories, FrameworkCategory } from '@/lib/mockData';

const MyCEO = () => {
  const [activeView, setActiveView] = useState<'MyCEO' | '5xCEO'>('MyCEO');
  const [selectedCategory, setSelectedCategory] = useState<FrameworkCategory | null>(null);

  const handleToggleView = () => {
    // In MyCEO page, this would navigate to 5xCEO page instead
    window.location.href = '/5xCEO';
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
            MyCEO Assessment Dashboard
          </h1>
          <p className="text-neutral-600 mt-2">
            Raw assessment data showing importance and agreement scores across the 5 framework categories.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Company: GlobalSolutions</h2>
              <div className="text-sm text-neutral-500">
                Assessment Date: Q1 2023
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {frameworkCategories.map((category) => (
                <div 
                  key={category.id}
                  className="bg-neutral-100 rounded-lg p-4 cursor-pointer hover:bg-neutral-200 transition-colors"
                  onClick={() => handleSelectCategory(category)}
                >
                  <h3 className="font-medium">{category.name}</h3>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>Score:</span>
                    <span className="font-medium">{category.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-center">Interactive 5xCEO Framework</h2>
            <RadialMenu
              categories={assessmentData}
              activeView={activeView}
              onToggleView={handleToggleView}
              onSelectCategory={handleSelectCategory}
            />
            <div className="text-center mt-6 text-sm text-neutral-500">
              Click on any category to view detailed metrics or click the center button to switch to 5xCEO view
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
                viewMode="MyCEO"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyCEO;