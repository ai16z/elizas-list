import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TAG_CATEGORIES, TAG_METADATA } from '@/data/tags';
import { TagBadge } from './TagBadge';
import { calculateTagAnalytics } from '@/utils/tagAnalytics';
import { Project } from '@/types/project';

interface FilterBarProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  projects: Project[];
}

export function FilterBar({ selectedTags, onTagSelect, projects }: FilterBarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tagAnalytics = useMemo(() => calculateTagAnalytics(projects), [projects]);

  const categories = Object.values(TAG_CATEGORIES);
  const visibleCategories = showAll ? categories : categories.slice(0, 4);

  const filteredTags = useMemo(() => {
    let tags = activeCategory 
      ? TAG_CATEGORIES[activeCategory].tags 
      : visibleCategories.flatMap(cat => cat.tags);

    if (searchQuery) {
      tags = tags.filter(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        TAG_METADATA[tag]?.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return tags;
  }, [activeCategory, visibleCategories, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tags..."
          className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(
              activeCategory === category.id ? null : category.id
            )}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg 
              text-sm font-medium transition-colors
              ${activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
              }
            `}
          >
            {category.icon && <category.icon className="w-4 h-4" />}
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => onTagSelect(tag)}
          />
        ))}
        {!activeCategory && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Show All Categories
          </button>
        )}
      </div>
    </div>
  );
} 