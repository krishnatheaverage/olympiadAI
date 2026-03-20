import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrjhdokniecigtekmpjz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

// For admin privileges to bypass RLS for testing, ideally we'd use the service role key.
// But we'll try with anon first just to verify connectivity.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing connection to Supabase...');

    // Try to read from user_activity
    const { data, error } = await supabase.from('user_activity').select('*').limit(1);

    if (error) {
        console.error('Error reading user_activity:', error.message);
    } else {
        console.log('Successfully connected to user_activity table. Row count:', data.length);
    }
}

testConnection();
