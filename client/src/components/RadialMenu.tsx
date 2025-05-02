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

  // Calculate positions for the 5 panels in a pentagon shape with specific offsets
  const getPosition = (index: number, total: number) => {
    // Start at the top (270 degrees) and go clockwise with custom angles
    // Adjust angles to better match the design image
    const angles = [
      -Math.PI/2,      // top (Strategic Clarity)
      -Math.PI/6,      // top-right (Scalable Talent)
      Math.PI/3,       // bottom-right (Relentless Focus)
      2*Math.PI/3,     // bottom-left (Disciplined Execution)
      7*Math.PI/6      // top-left (Energized Culture)
    ];
    
    const radius = 95; // Distance from center
    const angle = angles[index];
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div ref={containerRef} className="relative w-[350px] h-[350px] mx-auto">
      {/* Removing connecting lines for a cleaner look to match design images */}
      
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
                      flex flex-col items-center cursor-pointer overflow-visible`}
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
            {/* Position content based on the node's position to match the design image */}
            <div className={`flex flex-col items-center justify-center w-full h-full
                          ${index === 0 ? 'pt-1 pb-7' : // top node (Strategic Clarity) - push content up
                             index === 1 ? 'pr-1 pl-5' : // top-right node (Scalable Talent) - push content right
                             index === 2 ? 'pb-1 pt-5' : // bottom-right node (Relentless Focus) - push content down
                             index === 3 ? 'pb-1 pt-5' : // bottom-left node (Disciplined Execution) - push content down
                             index === 4 ? 'pr-5 pl-1' : // top-left node (Energized Culture) - push content left
                             'justify-center'}`}>
              <span className={`text-sm font-medium text-center px-1 ${colors.text}`}>
                {category.name}
              </span>
              <span className="mt-1 text-sm font-bold">{category.performance}%</span>
            </div>
          </motion.div>
        );
      })}

      {/* Center Toggle Button (using a div wrapper to maintain position) */}
      <div className="absolute z-30 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28">
        <motion.button
          className={`w-full h-full rounded-full 
                      flex items-center justify-center text-white font-bold shadow-lg text-lg
                      ${activeView === 'MyCEO' ? 'bg-blue-600' : 'bg-orange-500'}`}
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
          {activeView === 'MyCEO' ? 'MyCEO' : '5xCEO'}
        </motion.button>
      </div>
    </div>
  );
};

export default RadialMenu;