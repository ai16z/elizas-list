'use client';

import { Project } from '@/types/project';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function ProjectAnalytics({ project }: { project: Project }) {
  return (
    <div className="mt-12 border-t dark:border-gray-700 pt-6">
      <h2 className="text-xl font-semibold mb-4">Project Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
            GitHub Activity
          </h3>
          {/* Activity graph */}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
            Contributors
          </h3>
          {/* Contributors list */}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
            Usage Statistics
          </h3>
          {/* Usage stats */}
        </div>
      </div>
    </div>
  );
} 