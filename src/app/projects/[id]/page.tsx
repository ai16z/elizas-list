'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaGlobe, FaEthereum } from 'react-icons/fa';
import { RelatedProjects } from '@/components/RelatedProjects';
import Link from 'next/link';
import { ProjectSkeleton } from '@/components/ProjectSkeleton';
import { useRouter } from 'next/navigation';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // For now, we'll fetch from our local data
    const projects = require('@/data/projects.json').projects;
    const foundProject = projects.find((p: Project) => p.id === params.id);
    setProject(foundProject || null);
    setLoading(false);
  }, [params.id]);

  if (loading) return <ProjectSkeleton />;
  if (!project) return <div>Project not found</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          ← Back to Projects
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl">
          {/* Project content here */}
        </div>

        <div className="mt-12">
          <RelatedProjects 
            currentProject={project}
            onProjectClick={(relatedProject) => {
              router.push(`/projects/${relatedProject.id}`);
            }}
          />
        </div>
      </div>
    </main>
  );
} 