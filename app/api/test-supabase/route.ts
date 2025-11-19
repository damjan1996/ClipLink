import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Get all clippers
    const { data: clippers, error } = await supabaseAdmin
      .from('clipper')
      .select('*');
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }
    
    console.log('Found clippers:', clippers);
    
    // If no clippers exist, create a test clipper
    if (!clippers || clippers.length === 0) {
      const { data: newClipper, error: createError } = await supabaseAdmin
        .from('clipper')
        .insert([{
          name: 'Test Clipper',
          email: 'test@clipper.com',
          username: 'testclipper',
          registeredChannels: ['youtube', 'tiktok']
        }])
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating clipper:', createError);
      } else {
        console.log('Created new test clipper:', newClipper);
        return NextResponse.json({
          success: true,
          clippers: [newClipper],
          message: 'Created new test clipper'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      clippers: clippers || []
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}