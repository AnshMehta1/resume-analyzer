'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    setUser(user)
                    
                    const { data, error } = await supabase
                        .from('users')
                        .select('name')
                        .eq('id', user.id)
                        .single();

                    if (error && error.code !== 'PGRST116') throw error;

                    if (data) {
                        setName(data.name || '');
                    }
                }
            } catch (err: any) {
                setError('Failed to load your profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [supabase]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (user) {
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ name })
                    .eq('id', user.id);

                if (updateError) throw updateError;
                setSuccess('Your username has been updated successfully!');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while saving your profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-4 transition-colors">
                    <ArrowLeftIcon />
                    Back to Dashboard
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
                <p className="mt-1 text-md text-gray-600">Manage your account details.</p>
            </header>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="mt-1 block w-full bg-gray-100 shadow-sm sm:text-sm border-gray-300 rounded-md cursor-not-allowed"
                        />
                        <p className="mt-2 text-xs text-gray-500">Your email address is linked to your account and cannot be changed.</p>
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., JaneDoe123"
                        />
                        <p className="mt-2 text-xs text-gray-500">This will be your public display name.</p>
                    </div>

                    {success && <div className="p-3 bg-green-50 text-green-800 rounded-md text-sm font-medium">{success}</div>}
                    {error && <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm font-medium">{error}</div>}

                    <div className="pt-2 text-right">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-opacity"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

