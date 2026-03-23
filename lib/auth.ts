import { supabase } from './supabase';

function isValidEmail(email: string): boolean {
    // Must have @ with something before it, a domain with a dot, and a TLD of 2+ chars
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
}

export async function signUp(email: string, password: string) {
    if (!supabase) throw new Error('Supabase is not configured.');

    if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address (e.g. you@example.com).');
    }

    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: redirectUrl ? { emailRedirectTo: redirectUrl } : undefined
    });
    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function signOut() {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getUser() {
    if (!supabase) return null;

    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
}

export async function getSession() {
    if (!supabase) return null;

    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session;
}
