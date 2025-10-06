'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/');
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile || !profile.is_admin) {
        router.replace('/');
        return;
      }
      
      setLoading(false);
    };

    checkAdminStatus();

  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 animate-pulse">Verifying administrator access...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export { AdminAuthGuard };

