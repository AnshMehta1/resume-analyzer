'use client';
import React, { useState, useEffect } from 'react';
import { Resume } from '@/lib/types'
import { ResumeList } from '@/components/ResumeList'
import { EmptyState } from '@/components/EmptyState'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'


export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          setResumes(data as Resume[]);
        }
      } catch (err: any) {
        setError('Failed to load your resume submissions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const UpdateUserTable = async () => {
          const user = session.user
          const { data: ExistingProfile, error: selectError } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

          if (!ExistingProfile) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email,
              });
          }
        }

        UpdateUserTable();
      } else {
        router.replace('/')
      }
    });

    fetchResumes();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-10"><p className="text-gray-600">Loading your dashboard...</p></div>;
    }
    if (error) {
      return <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-700 font-semibold">{error}</p></div>;
    }
    if (resumes.length > 0) {
      return <ResumeList resumes={resumes} />;
    }
    return (
      <EmptyState
        title="No Resumes Found"
        message="You haven't uploaded any resumes yet."
        buttonText="Upload Your First Resume"
        buttonHref="/dashboard/upload"
      />
    );
  };

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
        {renderContent()}
      </main>
    </div>
  );
}


