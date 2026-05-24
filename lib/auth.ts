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

    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

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

export async function requestPasswordReset(email: string) {
    if (!supabase) throw new Error('Supabase is not configured.');

    if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address.');
    }

    // Send the user to /auth/callback?type=recovery → callback routes them
    // to /auth/reset-password with a valid recovery session.
    const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
    });
    if (error) throw error;
}

export async function updatePassword(newPassword: string) {
    if (!supabase) throw new Error('Supabase is not configured.');
    if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters.');
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
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
