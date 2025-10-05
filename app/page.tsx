'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth`,
                },
            });

            if (error) {
                throw error;
            }

            setMessage({
                type: 'success',
                content: 'Check your email for the magic link to sign in!',
            });

        } catch (error: any) {
            setMessage({
                type: 'error',
                content: error.message || 'An unexpected error occurred. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create or sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email to receive a magic link.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Magic Link'}
                        </button>
                    </div>
                </form>

                {message && (
                    <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.content}
                    </div>
                )}
            </div>
        </div>
    );
}

