import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Use service role client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Get all clippers directly
    const { data: clippers, error } = await supabase
      .from('clipper')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      clippers: clippers || []
    });
    
  } catch (error) {
    console.error('Get clippers error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      clippers: []
    }, { status: 500 });
  }
}