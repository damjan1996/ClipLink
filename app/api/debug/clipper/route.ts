import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-auth';

export async function GET() {
  try {
    const supabase = createSupabaseServiceClient();
    
    // Get all clippers
    const { data: clippers, error } = await supabase
      .from('clipper')
      .select('*');
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      clippers,
      count: clippers?.length || 0
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch clippers' 
    }, { status: 500 });
  }
}