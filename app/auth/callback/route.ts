import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const code = searchParams.get('code');
    const origin = req.nextUrl.origin;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Handle token_hash flow (email confirmation links)
    if (token_hash && type) {
        await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'signup' | 'email',
        });
    }

    // Handle code exchange flow (OAuth / magic link)
    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to dashboard after confirming
    return NextResponse.redirect(`${origin}/dashboard`);
}
