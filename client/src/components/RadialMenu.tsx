import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FrameworkCategory } from '../lib/mockData';
import { getCategoryColor } from '../lib/mockData';

interface RadialMenuProps {
  categories: FrameworkCategory[];
  activeView: 'MyCEO' | '5xCEO';
  onToggleView: () => void;
  onSelectCategory: (category: FrameworkCategory) => void;
}

const RadialMenu: React.FC<RadialMenuProps> = ({
  categories,
  activeView,
  onToggleView,
  onSelectCategory,
}) => {
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 });
  
  // Update center point when component mounts or window resizes
  useEffect(() => {
    const updateCenterPoint = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCenterPoint({
          x: rect.width / 2,
          y: rect.height / 2
        });
      }
    };
    
    updateCenterPoint();
    window.addEventListener('resize', updateCenterPoint);
    
    return () => {
      window.removeEventListener('resize', updateCenterPoint);
    };
  }, []);

  // Calculate positions for the 5 panels in a pentagon shape
  const getPosition = (index: number, total: number) => {
    // Start at the top (270 degrees) and go clockwise
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 105; // Reduced radius to allow center node to overlap
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  // Helper function to convert color code to Tailwind classes with improved colors
  const getColorClasses = (colorCode: string) => {
    const baseColor = colorCode === '#FF5722' ? 'orange' 
                    : colorCode === '#4CAF50' ? 'green' 
                    : colorCode === '#2196F3' ? 'blue' 
                    : colorCode === '#9C27B0' ? 'purple' 
                    : colorCode === '#FFC107' ? 'amber' 
                    : 'gray';
    
    // Map to more custom tailwind colors for consistency and better appearance
    return {
      bg: baseColor === 'orange' ? 'bg-orange-50' 
         : baseColor === 'green' ? 'bg-emerald-50'
         : baseColor === 'blue' ? 'bg-sky-50'
         : baseColor === 'purple' ? 'bg-violet-50'
         : baseColor === 'amber' ? 'bg-amber-50'
         : 'bg-gray-50',
      text: baseColor === 'orange' ? 'text-orange-800' 
          : baseColor === 'green' ? 'text-emerald-800'
          : baseColor === 'blue' ? 'text-sky-800'
          : baseColor === 'purple' ? 'text-violet-800'
          : baseColor === 'amber' ? 'text-amber-800'
          : 'text-gray-800',
      border: baseColor === 'orange' ? 'border-orange-300' 
            : baseColor === 'green' ? 'border-emerald-300'
            : baseColor === 'blue' ? 'border-sky-300'
            : baseColor === 'purple' ? 'border-violet-300'
            : baseColor === 'amber' ? 'border-amber-300'
            : 'border-gray-300',
      accent: baseColor === 'orange' ? 'bg-orange-500' 
             : baseColor === 'green' ? 'bg-emerald-500'
             : baseColor === 'blue' ? 'bg-sky-500'
             : baseColor === 'purple' ? 'bg-violet-500'
             : baseColor === 'amber' ? 'bg-amber-500'
             : 'bg-gray-500'
    };
  };

  return (
    <div ref={containerRef} className="relative w-[350px] h-[350px] mx-auto">
      {/* SVG Background for connecting lines */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <g transform={`translate(${centerPoint.x}, ${centerPoint.y})`}>
          {categories.map((category, index) => {
            const pos = getPosition(index, categories.length);
            return (
              <line
                key={`line-${category.id}`}
                x1="0"
                y1="0"
                x2={pos.x}
                y2={pos.y}
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeDasharray="5,5"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </svg>
      
      {/* Radial Panels */}
      {categories.map((category, index) => {
        const { x, y } = getPosition(index, categories.length);
        const colorName = getCategoryColor(category.id);
        const colors = getColorClasses(colorName);
        const isHovered = hoverCategory === category.id;
        
        // Determine if this is Strategic Clarity or Relentless Focus for enhanced styling
        const isHighlightCategory = category.id === 'strategic-clarity' || category.id === 'relentless-focus';
        
        return (
          <motion.div
            key={category.id}
            className={`absolute z-10 w-24 h-24 rounded-full 
                      ${colors.bg} ${colors.border} border 
                      ${isHighlightCategory ? 'shadow-lg border-2' : 'shadow-md'}
                      flex flex-col items-center justify-center cursor-pointer`}
            style={{
              left: `calc(50% + ${x}px - 3rem)`,
              top: `calc(50% + ${y}px - 3rem)`,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: isHovered ? 1.1 : (isHighlightCategory ? 1.05 : 1),
              boxShadow: isHovered 
                ? '0px 0px 15px rgba(0, 0, 0, 0.2)' 
                : (isHighlightCategory ? '0px 0px 10px rgba(0, 0, 0, 0.15)' : '0px 0px 5px rgba(0, 0, 0, 0.1)'),
            }}
            transition={{ duration: 0.2 }}
            onHoverStart={() => setHoverCategory(category.id)}
            onHoverEnd={() => setHoverCategory(null)}
            onClick={() => onSelectCategory(category)}
          >
            <span className={`text-sm font-medium text-center px-1 ${colors.text} ${isHighlightCategory ? 'font-bold' : ''}`}>
              {category.name}
            </span>
            <span className={`mt-1 text-sm ${isHighlightCategory ? 'font-extrabold' : 'font-bold'}`}>
              {category.score}%
            </span>
            {isHighlightCategory && (
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${colors.accent} animate-pulse`}></div>
            )}
          </motion.div>
        );
      })}

      {/* Center Button (using a div wrapper to maintain position) */}
      <div className="absolute z-30 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24">
        <motion.button
          className="w-full h-full rounded-full 
                    flex items-center justify-center text-white font-bold shadow-lg text-lg
                    bg-amber-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 1 }}
          animate={{ 
            scale: 1,
            boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.25)'
          }}
          transition={{ duration: 0.2 }}
          onClick={onToggleView}
        >
          MyCEO
        </motion.button>
      </div>
    </div>
  );
};

export default RadialMenu;