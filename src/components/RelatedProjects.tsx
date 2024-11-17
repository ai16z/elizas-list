'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/project';
import { FaStar, FaCodeBranch, FaArrowRight, FaSync } from 'react-icons/fa';
import Image from 'next/image';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface RelatedProjectsProps {
  currentProject: Project;
  onProjectClick: (project: Project) => void;
}

interface CachedProjects {
  [key: string]: {
    projects: Project[];
    timestamp: number;
  };
}

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function RelatedProjects({ currentProject, onProjectClick }: RelatedProjectsProps) {
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [cachedProjects, setCachedProjects] = useLocalStorage<CachedProjects>('related-projects-cache', {});

  const fetchRelatedProjects = useCallback(async (retry = false): Promise<void> => {
    if (retry) {
      setRetryCount(prev => prev + 1);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Check cache first
      const cached = cachedProjects[currentProject.id];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION && !retry) {
        setRelatedProjects(cached.projects);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/projects/${currentProject.id}/related`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      // Update cache
      setCachedProjects(prev => ({
        ...prev,
        [currentProject.id]: {
          projects: data,
          timestamp: Date.now()
        }
      }));

      setRelatedProjects(data);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching related projects:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load related projects: ${errorMessage}`);
      
      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          fetchRelatedProjects(true);
        }, RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
      }
    } finally {
      setLoading(false);
    }
  }, [currentProject.id, cachedProjects, retryCount, setCachedProjects]);

  useEffect(() => {
    fetchRelatedProjects();
  }, [fetchRelatedProjects]);

  const LoadingCard = () => (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-gray-200 dark:bg-gray-700 h-48" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      onClick={() => onProjectClick(project)}
    >
      <div className="relative aspect-video">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
          {project.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {project.metrics?.stars || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaCodeBranch className="text-gray-400" />
            {project.metrics?.forks || 0}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Related Projects</h2>
        {error && (
          <button
            onClick={() => fetchRelatedProjects(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FaSync className={retryCount > 0 ? 'animate-spin' : ''} />
            Retry
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[1, 2, 3, 4].map((i) => (
              <LoadingCard key={i} />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400"
          >
            {error}
          </motion.div>
        ) : relatedProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {relatedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-gray-500 dark:text-gray-400"
          >
            No related projects found
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 