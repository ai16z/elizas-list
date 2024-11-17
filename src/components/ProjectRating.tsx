'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Rating {
  userId: string;
  rating: number;
}

export function ProjectRating({ 
  projectId, 
  initialRatings 
}: { 
  projectId: string;
  initialRatings: Rating[];
}) {
  const { data: session } = useSession();
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const averageRating = ratings.length 
    ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length 
    : 0;

  const userRating = session 
    ? ratings.find(r => r.userId === session.user.id)?.rating 
    : null;

  const handleRate = async (rating: number) => {
    if (!session) return;

    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        rating,
      }),
    });

    if (response.ok) {
      const newRating = await response.json();
      setRatings(prev => [
        ...prev.filter(r => r.userId !== session.user.id),
        newRating,
      ]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            className={`text-2xl ${
              (hoveredStar !== null ? star <= hoveredStar : star <= (userRating || averageRating))
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          >
            <FaStar />
          </motion.button>
        ))}
        <span className="ml-2 text-sm text-gray-500">
          ({ratings.length} ratings)
        </span>
      </div>
      
      <div className="text-sm text-gray-500">
        Average rating: {averageRating.toFixed(1)}
      </div>
    </div>
  );
}
