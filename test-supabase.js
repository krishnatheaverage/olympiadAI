import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrjhdokniecigtekmpjz.supabase.co';
const supabaseAnonKey = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('user_activity').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success. Data:', data);
  }
}

check();
