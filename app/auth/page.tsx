'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'


export default function Auth() {

    const router = useRouter();

    useEffect(() => {

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                const AuthenticateUser = async () => {
                    const user = session.user
                    const { data: ExistingProfile, error: selectError } = await supabase
                        .from('users')
                        .select('id, is_admin')
                        .eq('id', user.id)
                        .maybeSingle();

                    if (!ExistingProfile) {
                        const { error: insertError } = await supabase
                            .from('users')
                            .insert({
                                id: user.id,
                                email: user.email,
                            });

                        router.replace('/dashboard')
                    } else {
                        if (ExistingProfile.is_admin) {
                            router.replace('/admin')
                        } else {
                            router.replace('/dashboard')
                        }
                    }
                }

                AuthenticateUser();
            } else {
                router.replace('/')
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

}


