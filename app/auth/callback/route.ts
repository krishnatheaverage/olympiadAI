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

    // Token-hash flow handles both signup confirmation AND password recovery.
    // 'recovery' must redirect to the reset page so the user can set a new
    // password; everything else lands on the dashboard.
    if (token_hash && type) {
        await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'signup' | 'email' | 'recovery',
        });
        if (type === 'recovery') {
            return NextResponse.redirect(`${origin}/auth/reset-password`);
        }
    }

    // Code-exchange flow (OAuth / magic link / newer recovery)
    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        if (type === 'recovery') {
            return NextResponse.redirect(`${origin}/auth/reset-password`);
        }
    }

    return NextResponse.redirect(`${origin}/dashboard`);
}
