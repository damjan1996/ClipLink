require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Using Supabase URL:', supabaseUrl);

async function getTestClipper() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get test clipper
  const { data: clippers, error } = await supabase
    .from('clipper')
    .select('*')
    .eq('email', 'test@clipper.com')
    .limit(1);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  if (clippers && clippers.length > 0) {
    console.log('Test Clipper ID:', clippers[0].id);
    console.log('Test Clipper Details:', clippers[0]);
  } else {
    console.log('No test clipper found');
  }
}

getTestClipper().catch(console.error);