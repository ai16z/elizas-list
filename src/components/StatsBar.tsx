'use client';

import { motion } from 'framer-motion';
import { FaCode, FaUsers, FaTags } from 'react-icons/fa';
import { Project } from '@/types/project';

interface StatsBarProps {
  projects: Project[];
}

export function StatsBar({ projects }: StatsBarProps) {
  const uniqueAuthors = new Set(projects.map(p => p.author.github)).size;
  const uniqueTags = new Set(projects.flatMap(p => p.tags)).size;

  const stats = [
    { icon: FaCode, label: 'Projects', value: projects.length },
    { icon: FaUsers, label: 'Contributors', value: uniqueAuthors },
    { icon: FaTags, label: 'Technologies', value: uniqueTags },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <stat.icon className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 