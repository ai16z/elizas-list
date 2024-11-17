'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export function EmailPreferences() {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState({
    newProjects: true,
    projectUpdates: true,
    weeklyDigest: false,
  });

  const handleToggle = async (key: keyof typeof preferences) => {
    if (!session) return;

    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    const response = await fetch('/api/user/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences: newPreferences }),
    });

    if (response.ok) {
      setPreferences(newPreferences);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Email Preferences</h3>
      
      <div className="space-y-2">
        {Object.entries(preferences).map(([key, value]) => (
          <label
            key={key}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value}
              onChange={() => handleToggle(key as keyof typeof preferences)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
} 