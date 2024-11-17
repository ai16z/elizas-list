'use client';

import { Project } from '@/types/project';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaGithub, FaTag } from 'react-icons/fa';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
      onClick={() => window.location.href = `/projects/${project.id}`}
    >
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 line-clamp-1">{project.name}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            >
              <FaTag className="mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <a
            href={project.author.github}
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`${project.author.github}.png`}
              alt={project.author.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            {project.author.name}
          </a>
          
          <a
            href={project.github}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
