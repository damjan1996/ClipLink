import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-auth';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    // Check if user is a clipper
    const { data: clipper, error: clipperError } = await supabase
      .from('clipper')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (clipperError || !clipper) {
      await supabase.auth.signOut();
      return NextResponse.json({ 
        success: false, 
        error: 'Not authorized as clipper' 
      }, { status: 403 });
    }

    // Check if clipper is active
    if (!clipper.isActive) {
      await supabase.auth.signOut();
      return NextResponse.json({ 
        success: false, 
        error: 'Your account is not active. Please contact support.' 
      }, { status: 403 });
    }

    // Check if payment is blocked
    if (clipper.paymentBlocked) {
      await supabase.auth.signOut();
      return NextResponse.json({ 
        success: false, 
        error: 'Your account has been blocked from receiving payments. Please contact support.' 
      }, { status: 403 });
    }

    // Update last activity
    await supabase
      .from('clipper')
      .update({ lastActivity: new Date().toISOString() })
      .eq('id', authData.user.id);

    // Log activity
    await supabase
      .from('activities')
      .insert({
        clipperId: authData.user.id,
        type: 'auth',
        action: 'login',
        description: 'Clipper logged in',
        metadata: {
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || 'unknown'
        }
      });

    return NextResponse.json({ 
      success: true,
      user: {
        id: clipper.id,
        email: clipper.email,
        name: clipper.name,
        username: clipper.username,
        strikes: clipper.strikes,
        totalEarnings: clipper.totalEarnings,
        totalViews: clipper.totalViews
      },
      session: authData.session
    });

  } catch (error) {
    console.error('Clipper login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Login failed' 
    }, { status: 500 });
  }
}