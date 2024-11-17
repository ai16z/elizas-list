'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECT_TAGS, getTagCategory } from '@/data/tags';

interface FilterBarProps {
  tags: string[];
  onFilterChange: (search: string, tags: string[]) => void;
}

export function FilterBar({ tags, onFilterChange }: FilterBarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const categories = Object.entries(PROJECT_TAGS);
  const visibleCategories = showAll ? categories : categories.slice(0, 4);

  const handleTagSelect = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onFilterChange(search, newTags);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(PROJECT_TAGS).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(activeCategory === category ? null : category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {(activeCategory ? PROJECT_TAGS[activeCategory] : visibleCategories.flatMap(([_, tags]) => tags))
          .map((tag) => (
            <motion.button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.button>
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