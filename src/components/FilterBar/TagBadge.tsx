import { motion } from 'framer-motion';
import { TAG_METADATA } from '@/data/tags';

interface TagBadgeProps {
  tag: string;
  selected: boolean;
  onClick: () => void;
  showIcon?: boolean;
  showTrending?: boolean;
}

export function TagBadge({ 
  tag, 
  selected, 
  onClick, 
  showIcon = true,
  showTrending = true 
}: TagBadgeProps) {
  const metadata = TAG_METADATA[tag] || {};
  const Icon = metadata.icon;
  
  return (
    <motion.button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full
        text-sm font-medium transition-colors
        ${selected 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
        }
      `}
      style={{ 
        backgroundColor: selected ? metadata.color : undefined,
        color: selected ? '#fff' : undefined
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {showIcon && Icon && <Icon className="w-4 h-4" />}
      <span>{tag}</span>
      {showTrending && metadata.trending && (
        <span className="ml-1 text-xs font-normal opacity-75">🔥</span>
      )}
    </motion.button>
  );
} 