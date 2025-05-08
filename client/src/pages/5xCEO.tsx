import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RadialMenu from '@/components/RadialMenu';
import PanelView from '@/components/PanelView';
import FocusEffectivenessAnalysis from '@/components/FocusEffectivenessAnalysis';
import FocusEffectivenessComparison from '@/components/FocusEffectivenessComparison';
import { 
  assessmentData as defaultFrameworkCategories, 
  FrameworkCategory, 
  getCategoryColor,
  mockCompanies 
} from '@/lib/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyData } from '@/lib/dataProcessor';
import { useAuth } from '@/context/AuthContext';

const FiveXCEO = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'MyCEO' | '5xCEO'>('5xCEO');
  const [selectedCategory, setSelectedCategory] = useState<FrameworkCategory | null>(null);
  const [selectedCompany, setSelectedCompany] = useState("GlobalSolutions");
  const [comparisonCompany, setComparisonCompany] = useState<string | null>(null);
  const [frameworkCategories, setFrameworkCategories] = useState<FrameworkCategory[]>(defaultFrameworkCategories);
  const [selectedPeriod, setSelectedPeriod] = useState("Q1 2025");

  // Check if user is PE & BOD or ADMIN to show comparison feature
  const canCompare = user?.role === 'PE & BOD' || user?.role === 'ADMIN';

  // Get available companies from mock data
  const availableCompanies = mockCompanies.map(company => company.name);

  // Handle company change
  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company);
    
    // Clear comparison company if the same as selected company
    if (comparisonCompany === company) {
      setComparisonCompany(null);
    }
    
    // Create a copy of the framework categories and update the company and scores
    const selectedCompanyData = mockCompanies.find(c => c.name === company);
    
    if (selectedCompanyData) {
      // Update framework categories with company-specific data
      const updatedCategories = defaultFrameworkCategories.map(category => {
        return {
          ...category,
          company: company,
          score: getCategoryScoreForCompany(category.id, selectedCompanyData)
        };
      });
      
      setFrameworkCategories(updatedCategories);
    }
  };
  
  // Handle comparison company change
  const handleComparisonChange = (company: string) => {
    setComparisonCompany(company === "none" ? null : company);
  };

  // Helper function to get the score for a specific category from company data
  const getCategoryScoreForCompany = (categoryId: string, companyData: any) => {
    switch (categoryId) {
      case 'strategic-clarity':
        return companyData.scores.strategicClarity;
      case 'scalable-talent':
        return companyData.scores.scalableTalent;
      case 'relentless-focus':
        return companyData.scores.relentlessFocus;
      case 'disciplined-execution':
        return companyData.scores.disciplinedExecution;
      case 'energized-culture':
        return companyData.scores.energizedCulture;
      default:
        return 70; // Default fallback score
    }
  };

  // Set initial company data on component mount
  useEffect(() => {
    handleCompanyChange(selectedCompany);
  }, []);

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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div>
                  <label className="text-sm text-neutral-500 font-medium mb-1 block">Company:</label>
                  <Select 
                    value={selectedCompany} 
                    onValueChange={handleCompanyChange}
                  >
                    <SelectTrigger className="h-9 w-[200px]">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCompanies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {canCompare && (
                  <div>
                    <label className="text-sm text-neutral-500 font-medium mb-1 block">Comparison:</label>
                    <Select 
                      value={comparisonCompany || "none"} 
                      onValueChange={handleComparisonChange}
                    >
                      <SelectTrigger className="h-9 w-[200px]">
                        <SelectValue placeholder="Compare with..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {availableCompanies
                          .filter(company => company !== selectedCompany)
                          .map((company) => (
                            <SelectItem key={company} value={company}>
                              {company}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
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
              Based on the 5xCEO framework assessment, {selectedCompany} shows strengths in 
              {(() => {
                const companyData = mockCompanies.find(c => c.name === selectedCompany);
                if (companyData) {
                  // Find the two highest scoring categories
                  const scores = [
                    { name: 'Strategic Clarity', score: companyData.scores.strategicClarity },
                    { name: 'Scalable Talent', score: companyData.scores.scalableTalent },
                    { name: 'Relentless Focus', score: companyData.scores.relentlessFocus },
                    { name: 'Disciplined Execution', score: companyData.scores.disciplinedExecution },
                    { name: 'Energized Culture', score: companyData.scores.energizedCulture }
                  ];
                  scores.sort((a, b) => b.score - a.score);
                  
                  // Find the lowest scoring category
                  const lowestCategory = [...scores].sort((a, b) => a.score - b.score)[0];
                  
                  return <> <span className="font-medium">{scores[0].name}</span> and <span className="font-medium">{scores[1].name}</span>, 
                  with opportunities for improvement in <span className="font-medium">{lowestCategory.name}</span>.</>;
                }
                return <> various categories.</>;
              })()}
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
              {(() => {
                const companyData = mockCompanies.find(c => c.name === selectedCompany);
                if (companyData) {
                  // Find the lowest scoring categories
                  const scores = [
                    { name: 'Strategic Clarity', key: 'strategicClarity', score: companyData.scores.strategicClarity },
                    { name: 'Scalable Talent', key: 'scalableTalent', score: companyData.scores.scalableTalent },
                    { name: 'Relentless Focus', key: 'relentlessFocus', score: companyData.scores.relentlessFocus },
                    { name: 'Disciplined Execution', key: 'disciplinedExecution', score: companyData.scores.disciplinedExecution },
                    { name: 'Energized Culture', key: 'energizedCulture', score: companyData.scores.energizedCulture }
                  ];
                  
                  // Sort scores from lowest to highest to identify areas needing improvement
                  scores.sort((a, b) => a.score - b.score);
                  
                  // Create recommendations based on the lowest scoring categories
                  const recommendations = [
                    {
                      category: 'strategicClarity',
                      text: 'Develop a clearer vision and strategy that is communicated effectively to all employees.'
                    },
                    {
                      category: 'scalableTalent',
                      text: 'Enhance leadership development programs for middle management to strengthen hiring and retention.'
                    },
                    {
                      category: 'relentlessFocus',
                      text: 'Implement more rigorous project prioritization framework to improve focus on key initiatives.'
                    },
                    {
                      category: 'disciplinedExecution',
                      text: 'Create more structured processes for tracking performance and ensuring accountability.'
                    },
                    {
                      category: 'energizedCulture',
                      text: 'Address work-life balance concerns and strengthen company culture to improve engagement.'
                    }
                  ];
                  
                  // Get recommendations for the lowest 3 categories
                  const topRecommendations = scores.slice(0, 3).map(score => {
                    const recommendation = recommendations.find(rec => rec.category === score.key);
                    return (
                      <li key={score.key}>
                        <span className="font-medium">{score.name}:</span> {recommendation?.text}
                      </li>
                    );
                  });
                  
                  return (
                    <ol className="list-decimal pl-5 space-y-2">
                      {topRecommendations}
                    </ol>
                  );
                }
                
                // Default fallback recommendations
                return (
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Implement more rigorous project prioritization framework to improve Relentless Focus.</li>
                    <li>Enhance leadership development programs for middle management to strengthen Scalable Talent.</li>
                    <li>Address work-life balance concerns in high-growth departments to sustain Energized Culture.</li>
                  </ol>
                );
              })()}
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