import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    // Direct connection test
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    console.log('Testing Supabase connection...');
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Key available:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Test connection
    const { data: clippers, error } = await supabase
      .from('clipper')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 500 });
    }
    
    console.log('Found clippers:', clippers);
    
    return NextResponse.json({ 
      success: true,
      clippers,
      count: clippers?.length || 0,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}