'use client';
import React, { useState, useEffect } from 'react';
import { ResumeStatus, Resume } from '@/lib/types'
// In a real app, you would import the Supabase client
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// --- Mock Data (replace with actual Supabase fetch) ---
const mockUserResumes: Resume[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    file_path: 'storage/v1/object/public/resumes/user123/Software_Engineer_Resume.pdf',
    status: 'Approved',
    score: 92,
    notes: 'Great experience with React and Node.js. Strong project portfolio.',
    created_at: '2023-10-26T10:00:00Z',
    file_name: 'Software_Engineer_Resume.pdf'
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    file_path: 'storage/v1/object/public/resumes/user123/Product_Manager_Resume_v2.pdf',
    status: 'Needs Revision',
    score: null,
    notes: 'Please quantify your achievements with specific metrics. For example, instead of "improved user engagement", use "improved user engagement by 15% over 6 months".',
    created_at: '2023-10-25T15:30:00Z',
    file_name: 'Product_Manager_Resume_v2.pdf'
  },
  {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef2',
    file_path: 'storage/v1/object/public/resumes/user123/Data_Analyst_Resume.pdf',
    status: 'Pending',
    score: null,
    notes: null,
    created_at: '2023-10-27T11:00:00Z',
    file_name: 'Data_Analyst_Resume.pdf'
  },
];

// --- Helper Components ---

interface StatusBadgeProps {
  status: ResumeStatus;
}

// This can be moved to its own file in /components
const StatusBadge = ({ status }: StatusBadgeProps) => {
  const baseClasses = "px-3 py-1 text-xs font-bold leading-none rounded-full";
  
  const statusConfig: Record<ResumeStatus, { classes: string; label: string }> = {
    'Approved': {
      classes: 'bg-green-100 text-green-800',
      label: 'Approved'
    },
    'Needs Revision': {
      classes: 'bg-yellow-100 text-yellow-800',
      label: 'Needs Revision'
    },
    'Rejected': {
      classes: 'bg-red-100 text-red-800',
      label: 'Rejected'
    },
    'Pending': {
      classes: 'bg-gray-200 text-gray-800 animate-pulse',
      label: 'Pending Review'
    },
  };

  const config = statusConfig[status];

  return <span className={`${baseClasses} ${config.classes}`}>{config.label}</span>;
};


// --- Main Dashboard Page Component ---

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This is where you would fetch data from Supabase
    const fetchResumes = async () => {
      try {
        // const supabase = createClientComponentClient();
        // const { data: { user } } = await supabase.auth.getUser();
        // if (!user) throw new Error('User not authenticated');

        // const { data, error } = await supabase
        //   .from('resumes')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .order('created_at', { ascending: false });

        // if (error) throw error;
        
        // setResumes(data as Resume[]); // Type assertion

        // In place of the above, we use mock data for this example
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setResumes(mockUserResumes);

      } catch (err: any) {
        setError('Failed to load your resume submissions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  if (loading) {
    return (
        <div className="text-center p-10">
            <p className="text-gray-600">Loading your dashboard...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">{error}</p>
        </div>
    );
  }
  
  return (
    // Note: The main layout (header, nav) would typically be in a layout.tsx file
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="mt-1 text-md text-gray-600">Track the status of your resume submissions.</p>
        </div>
        <a href="/dashboard/upload" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          Upload New Resume
        </a>
      </header>
      
      <main>
        {resumes.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {resumes.map((resume) => (
                <li key={resume.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-grow">
                        <p className="font-semibold text-lg text-gray-800 truncate">{resume.file_name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted on: {new Date(resume.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                      <StatusBadge status={resume.status} />
                    </div>
                  </div>
                  {resume.notes && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Reviewer Feedback:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono">"{resume.notes}"</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-dashed">
            <h3 className="text-xl font-semibold text-gray-800">No Resumes Found</h3>
            <p className="mt-2 text-gray-500">You haven't uploaded any resumes yet.</p>
            <a href="/dashboard/upload" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Upload Your First Resume
            </a>
          </div>
        )}
      </main>
    </div>
  );
}


