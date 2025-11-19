import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    // Try to find existing test clipper
    const { data: existingClipper, error: findError } = await supabaseAdmin
      .from('clipper')
      .select('*')
      .eq('email', 'test@clipper.com')
      .single();
    
    if (existingClipper && !findError) {
      return NextResponse.json({
        success: true,
        message: 'Test clipper already exists',
        clipper: existingClipper,
        clipperId: existingClipper.id
      });
    }
    
    // Create new test clipper
    const { data: newClipper, error: createError } = await supabaseAdmin
      .from('clipper')
      .insert([{
        name: 'Test Clipper',
        email: `test-${Date.now()}@clipper.com`,
        username: `testclipper-${Date.now()}`,
        registeredChannels: ['youtube', 'tiktok'],
        isActive: true,
        strikes: 0,
        paymentBlocked: false,
        totalEarnings: 0,
        totalViews: 0
      }])
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating clipper:', createError);
      return NextResponse.json({
        success: false,
        error: createError.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test clipper created successfully',
      clipper: newClipper,
      clipperId: newClipper.id
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}