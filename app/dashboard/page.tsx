'use client';
import React, { useState, useEffect } from 'react';
import { Resume, UserProfile } from '@/lib/types'
import { ResumeList } from '@/components/ResumeList'
import { EmptyState } from '@/components/EmptyState'
import { supabase } from '@/lib/supabaseClient'
import { UserProfileCard } from '@/components/UserProfileCard';


export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumesAndProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: resumeData, error: resumeError } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (resumeError) {
            throw resumeError;
          }

          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) {
            throw profileError
          }

          setResumes(resumeData as Resume[]);
          setProfile(profileData);
        }
      } catch (err: any) {
        setError('Failed to load your resume submissions or profile. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumesAndProfile();

  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 lg:sticky lg:top-8 self-start">
          <UserProfileCard profile={profile} resumeCount={resumes.length} loading={loading} />
        </aside>

        <main className="lg:col-span-3">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}


