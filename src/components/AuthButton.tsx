'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <img
          src={session.user?.image!}
          alt={session.user?.name!}
          className="w-8 h-8 rounded-full"
        />
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
    >
      <FaGithub className="w-5 h-5" />
      Sign in with GitHub
    </button>
  );
}
