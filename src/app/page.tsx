'use client';

import { Project } from '@/types/project';
import projects from '@/data/projects.json';
import { ProjectCard } from '@/components/ProjectCard';
import { FilterBar } from '@/components/FilterBar';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatsBar } from '@/components/StatsBar';
import { ProjectModal } from '@/components/ProjectModal';
import { ProjectSkeleton } from '@/components/ProjectSkeleton';
import { SortControls } from '@/components/SortControls';
import { ShareButton } from '@/components/ShareButton';
import { sortProjects } from '@/utils/projectUtils';

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Get unique tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.projects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter projects based on search and tags
  const filteredProjects = useMemo(() => {
    return projects.projects.filter((project) => {
      const matchesSearch = search === '' || 
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase());

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every((tag) => project.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [search, selectedTags]);

  const handleFilterChange = (newSearch: string, newTags: string[]) => {
    setSearch(newSearch);
    setSelectedTags(newTags);
  };

  const sortedAndFilteredProjects = useMemo(() => {
    return sortProjects(filteredProjects, sortBy);
  }, [filteredProjects, sortBy]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
        >
          ELIZAS LIST
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 dark:text-gray-300 mb-12"
        >
          A curated collection of outstanding developer projects
        </motion.p>

        <StatsBar projects={projects.projects} />

        <div className="flex justify-between items-center mb-6">
          <FilterBar
            tags={allTags}
            onFilterChange={handleFilterChange}
          />
          <SortControls
            onSort={setSortBy}
            currentSort={sortBy}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}

        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </main>
  );
} 