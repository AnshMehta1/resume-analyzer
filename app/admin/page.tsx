'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ResumeTable } from '../../components/ResumeTable';
import { ReviewPanel } from '../../components/ReviewPanel';
import { ResumeWithProfile } from '../../lib/types';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { LogoutButton } from '@/components/LogoutButton';

function AdminDashboard() {
  const [resumes, setResumes] = useState<ResumeWithProfile[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchAllResumes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select(`
          *,
          users (
            email,
            name
          )
        `)
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data as ResumeWithProfile[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch resumes.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAllResumes();
  }, [fetchAllResumes]);

  const handleSelectResume = (resume: ResumeWithProfile) => {
    setSelectedResume(resume);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading all submissions...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-1 text-md text-gray-600">Review and manage all candidate submissions.</p>
        </div>
        <LogoutButton />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {resumes.length > 0 ? (
            <ResumeTable
              resumes={resumes}
              onSelectResume={handleSelectResume}
              selectedResumeId={selectedResume?.id}
            />
          ) : (
            <div className="bg-white text-center p-12 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">No Submissions Yet</h3>
              <p className="text-gray-500 mt-2">When candidates upload resumes, they will appear here.</p>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          {selectedResume ? (
            <ReviewPanel resume={selectedResume} onUpdate={fetchAllResumes} />
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center sticky top-8">
              <h3 className="font-semibold">Select a Resume</h3>
              <p className="text-sm text-gray-500 mt-2">Click on a resume from the list to view its details and update its status.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  );
}
