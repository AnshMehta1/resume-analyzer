import React from 'react';
import { UserProfileCardProps } from '@/lib/types';

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile, resumeCount, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse border border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="border-t border-gray-200 my-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="border-t border-gray-200 my-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 truncate">{profile.name || 'Welcome!'}</h2>
      <p className="text-sm text-gray-500 mt-1 truncate">{profile.email}</p>
      
      <div className="mt-4 border-t border-gray-200 pt-4">
        <dl>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <dt>Total Submissions</dt>
            <dd className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{resumeCount}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <a href="/dashboard/profile" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-150">
          Edit Profile
        </a>
      </div>
    </div>
  );
};

export { UserProfileCard };

