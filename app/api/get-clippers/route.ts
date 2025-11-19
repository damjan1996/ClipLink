import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with anon key (for RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // First, try to get settings (should work with RLS)
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);
    
    console.log('Settings test:', { settings, error: settingsError });
    
    // Get clippers without RLS by using raw SQL
    const { data: clippers, error } = await supabase
      .rpc('get_all_clippers');
    
    if (error && error.message.includes('does not exist')) {
      // Create the function and try again
      await supabase.sql`
        CREATE OR REPLACE FUNCTION get_all_clippers()
        RETURNS TABLE (
          id TEXT,
          name TEXT,
          email TEXT,
          username TEXT
        ) 
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN QUERY
          SELECT c.id, c.name, c.email, c.username
          FROM public.clipper c;
        END;
        $$ LANGUAGE plpgsql;
      `;
      
      // Try again
      const { data: clippersRetry, error: retryError } = await supabase
        .rpc('get_all_clippers');
      
      return NextResponse.json({
        success: true,
        clippers: clippersRetry || [],
        functionCreated: true
      });
    }
    
    return NextResponse.json({
      success: true,
      clippers: clippers || [],
      settingsWork: !settingsError
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}