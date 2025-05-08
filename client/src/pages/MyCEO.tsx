import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RadialMenu from '@/components/RadialMenu';
import PanelView from '@/components/PanelView';
import FocusEffectivenessAnalysis from '@/components/FocusEffectivenessAnalysis';
import FocusEffectivenessComparison from '@/components/FocusEffectivenessComparison';
import { assessmentData as frameworkCategories, FrameworkCategory, mockCompanies, getCategoryColor } from '@/lib/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MyCEO = () => {
  // User role simulation - in a real app, this would come from authentication context
  const [userRole, setUserRole] = useState<string>("PE & BOD"); // Options: "CEO", "PE & BOD", "LEADERSHIP TEAM", "COMPANY"
  
  const [activeView, setActiveView] = useState<'MyCEO' | '5xCEO'>('MyCEO');
  const [selectedCategory, setSelectedCategory] = useState<FrameworkCategory | null>(null);
  
  // State for analysis and comparison
  const [selectedAnalysisCategory, setSelectedAnalysisCategory] = useState<string>('relentless-focus');
  const [selectedCompany, setSelectedCompany] = useState<string>("GlobalSolutions");
  const [comparisonCompany, setComparisonCompany] = useState<string>("TechVision");

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
  
  // Handle analysis category selection
  const handleAnalysisCategoryChange = (categoryId: string) => {
    setSelectedAnalysisCategory(categoryId);
    console.log("Selected analysis category:", categoryId);
  };
  
  // Handle company selection change
  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company);
  };
  
  // Handle comparison company selection change
  const handleComparisonCompanyChange = (company: string) => {
    setComparisonCompany(company);
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
          
          {/* Role Selector - For Development Testing Only */}
          <div className="mt-4 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${userRole === "CEO" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setUserRole("CEO")}
              >
                CEO View
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${userRole === "PE & BOD" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setUserRole("PE & BOD")}
              >
                PE & BOD View
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${userRole === "LEADERSHIP TEAM" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setUserRole("LEADERSHIP TEAM")}
              >
                Leadership View
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${userRole === "COMPANY" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setUserRole("COMPANY")}
              >
                Company View
              </button>
            </div>
          </div>
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
              categories={frameworkCategories}
              activeView={activeView}
              onToggleView={handleToggleView}
              onSelectCategory={handleSelectCategory}
            />
            <div className="text-center mt-6 text-sm text-neutral-500">
              Click on any category to view detailed metrics or click the center button to switch to 5xCEO view
            </div>
          </div>
        </motion.div>
        
        {/* Company Selection and Comparison - Only visible for PE & BOD role */}
        {userRole === "PE & BOD" && (
          <>
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-xl font-semibold mb-4 sm:mb-0">Assessment Summary</h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-60">
                      <Select value={selectedCompany} onValueChange={handleCompanyChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCompanies.map((company) => (
                            <SelectItem key={company.id} value={company.name}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full sm:w-60">
                      <Select value={comparisonCompany} onValueChange={handleComparisonCompanyChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Compare with..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCompanies
                            .filter(company => company.name !== selectedCompany)
                            .map((company) => (
                              <SelectItem key={company.id} value={company.name}>
                                {company.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Assessment Summary blocks as buttons */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {frameworkCategories.map((category) => {
                    // Determine if this category is selected
                    const isSelected = selectedAnalysisCategory === category.id;
                    // Create dynamic styles based on selection state
                    const borderColor = getCategoryColor(category.id);
                    const blockClasses = isSelected 
                      ? "border-4 bg-neutral-50 cursor-pointer rounded-lg p-4 shadow-md transform scale-105 transition-all duration-200" 
                      : "border-2 bg-neutral-50 hover:bg-neutral-100 cursor-pointer rounded-lg p-4 transition-all duration-200";
                    
                    return (
                      <div 
                        key={category.id}
                        className={blockClasses}
                        style={{ borderColor: borderColor }}
                        onClick={() => handleAnalysisCategoryChange(category.id)}
                      >
                        <h3 className="font-medium">{category.name}</h3>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{ 
                                width: `${category.score}%`,
                                backgroundColor: getCategoryColor(category.id)
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-sm">
                            <span>Score:</span>
                            <span className="font-medium">{category.score}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
            
            {/* Company Compare Title Section - Only show when comparison company is selected */}
            {comparisonCompany && (
              <>
                <motion.div variants={itemVariants} className="mb-4 mt-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-neutral-900">Company Compare</h2>
                    <div className="text-sm text-neutral-500">
                      Data for Q1 2023
                    </div>
                  </div>
                  <p className="text-neutral-600 mt-1">
                    Compare performance metrics between companies across the selected framework category
                  </p>
                </motion.div>
                
                {/* Comparison Component */}
                <motion.div variants={itemVariants} className="mb-8">
                  <FocusEffectivenessComparison
                    primaryCompany={selectedCompany}
                    comparisonCompany={comparisonCompany}
                    period="Q1 2023"
                    selectedCategory={selectedAnalysisCategory}
                  />
                </motion.div>
              </>
            )}
          </>
        )}
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