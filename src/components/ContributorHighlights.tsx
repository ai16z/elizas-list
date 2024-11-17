'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaTwitter, FaGlobe } from 'react-icons/fa';

interface Contributor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  github: string;
  twitter?: string;
  website?: string;
  contributions: {
    type: 'code' | 'design' | 'docs' | 'bug' | 'feature';
    count: number;
  }[];
  highlights: {
    title: string;
    description: string;
    date: string;
  }[];
}

export function ContributorHighlights() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);

  const contributionTypeIcons = {
    code: '💻',
    design: '🎨',
    docs: '📚',
    bug: '🐛',
    feature: '✨',
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Top Contributors</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contributors.map((contributor) => (
          <motion.div
            key={contributor.id}
            layoutId={contributor.id}
            onClick={() => setSelectedContributor(contributor.id)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={contributor.avatar}
                alt={contributor.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{contributor.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {contributor.bio}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {contributor.contributions.map((contribution) => (
                <span
                  key={contribution.type}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                >
                  {contributionTypeIcons[contribution.type]} {contribution.count}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedContributor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedContributor(null)}
          >
            <motion.div
              layoutId={selectedContributor}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Detailed contributor view */}
              {(() => {
                const contributor = contributors.find(c => c.id === selectedContributor)!;
                return (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div>
                        <h3 className="text-xl font-bold">{contributor.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {contributor.bio}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <a
                            href={contributor.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <FaGithub className="w-5 h-5" />
                          </a>
                          {contributor.twitter && (
                            <a
                              href={contributor.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              <FaTwitter className="w-5 h-5" />
                            </a>
                          )}
                          {contributor.website && (
                            <a
                              href={contributor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              <FaGlobe className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Contribution Highlights</h4>
                      {contributor.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-blue-500 pl-4 py-2"
                        >
                          <h5 className="font-medium">{highlight.title}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {highlight.description}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(highlight.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 