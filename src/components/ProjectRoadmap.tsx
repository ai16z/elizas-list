'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  date: string;
  assignee?: {
    name: string;
    avatar: string;
  };
}

interface RoadmapProps {
  items: RoadmapItem[];
}

export function ProjectRoadmap({ items }: RoadmapProps) {
  const [filter, setFilter] = useState<RoadmapItem['status'] | 'all'>('all');

  const statusColors = {
    'planned': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
  };

  const filteredItems = items.filter(
    item => filter === 'all' || item.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Roadmap</h2>
        
        <div className="flex gap-2">
          {['all', 'planned', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-8 w-px bg-gray-200 dark:bg-gray-700" />
        
        <div className="space-y-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-16"
            >
              <div className="absolute left-6 top-3 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-600" />
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  
                  {item.assignee && (
                    <div className="flex items-center gap-2">
                      <img
                        src={item.assignee.avatar}
                        alt={item.assignee.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.assignee.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 