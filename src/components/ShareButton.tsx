'use client';

import { useState } from 'react';
import { FaShare, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  project: {
    name: string;
    github: string;
  };
}

export function ShareButton({ project }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `Check out ${project.name} on ELIZAS LIST`,
      text: `I found this awesome project on ELIZAS LIST: ${project.name}`,
      url: project.github,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(project.github);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Share project"
    >
      <AnimatePresence>
        {shared ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <FaCheck className="text-green-500" />
          </motion.span>
        ) : (
          <FaShare />
        )}
      </AnimatePresence>
    </button>
  );
} 