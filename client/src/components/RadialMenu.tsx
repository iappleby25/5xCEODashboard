import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FrameworkCategory } from '../lib/mockData';
import { getCategoryColor } from '../lib/mockData';

interface RadialMenuProps {
  categories: FrameworkCategory[];
  activeView: 'myCEO' | '5xCEO';
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
    const radius = 120; // Size of the radial menu
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
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
        const colors = getCategoryColor(category.id);
        const isHovered = hoverCategory === category.id;
        
        return (
          <motion.div
            key={category.id}
            className={`absolute z-10 w-24 h-24 rounded-full 
                      ${colors.bg} ${colors.border} border shadow-md
                      flex flex-col items-center justify-center cursor-pointer`}
            style={{
              left: `calc(50% + ${x}px - 3rem)`,
              top: `calc(50% + ${y}px - 3rem)`,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: isHovered ? 1.1 : 1,
              boxShadow: isHovered ? '0px 0px 15px rgba(0, 0, 0, 0.2)' : '0px 0px 5px rgba(0, 0, 0, 0.1)',
            }}
            transition={{ duration: 0.2 }}
            onHoverStart={() => setHoverCategory(category.id)}
            onHoverEnd={() => setHoverCategory(null)}
            onClick={() => onSelectCategory(category)}
          >
            <span className={`text-sm font-medium text-center px-1 ${colors.text}`}>
              {category.name}
            </span>
            <span className="mt-1 text-sm font-bold">{category.performance}%</span>
          </motion.div>
        );
      })}

      {/* Center Toggle Button (using a div wrapper to maintain position) */}
      <div className="absolute z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20">
        <motion.button
          className={`w-full h-full rounded-full 
                      flex items-center justify-center text-white font-bold shadow-lg
                      ${activeView === 'myCEO' ? 'bg-blue-600' : 'bg-orange-500'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={onToggleView}
        >
          {activeView === 'myCEO' ? 'myCEO' : '5xCEO'}
        </motion.button>
      </div>
    </div>
  );
};

export default RadialMenu;