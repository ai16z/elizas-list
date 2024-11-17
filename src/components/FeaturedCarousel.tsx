'use client';

import { Project } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export function FeaturedCarousel({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [projects.length]);

  const project = projects[currentIndex];

  return (
    <div className="relative h-[500px] mb-12 rounded-xl overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
            <p className="text-lg mb-4">{project.description}</p>
            <button className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              View Project
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => {
          setDirection(-1);
          setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/40 transition-colors"
      >
        <FaChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => {
          setDirection(1);
          setCurrentIndex((prev) => (prev + 1) % projects.length);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/40 transition-colors"
      >
        <FaChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
} 