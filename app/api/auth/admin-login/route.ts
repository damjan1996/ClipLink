import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-auth';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Username and password are required' 
      }, { status: 400 });
    }

    // Get admin by username
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (adminError || !admin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json({ 
        success: false, 
        error: 'Your account is not active. Please contact a super admin.' 
      }, { status: 403 });
    }

    // Sign in with Supabase Auth using admin's email
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: admin.email,
      password: password
    });

    if (authError) {
      // If auth fails, it might be because the user doesn't exist in auth.users
      // Try to create the user first
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: admin.email,
        password: password,
        options: {
          data: {
            name: admin.username,
            role: 'admin'
          }
        }
      });

      if (signUpError) {
        return NextResponse.json({ 
          success: false, 
          error: 'Authentication failed' 
        }, { status: 500 });
      }

      // Update admin ID to match auth user ID
      await supabase
        .from('admins')
        .update({ id: signUpData.user!.id })
        .eq('email', admin.email);
    }

    // Update last login
    await supabase
      .from('admins')
      .update({ lastLogin: new Date().toISOString() })
      .eq('id', authData?.user?.id || admin.id);

    // Log activity
    await supabase
      .from('activities')
      .insert({
        adminId: authData?.user?.id || admin.id,
        type: 'auth',
        action: 'admin_login',
        description: `Admin ${admin.username} logged in`,
        metadata: {
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || 'unknown'
        }
      });

    return NextResponse.json({ 
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        isActive: admin.isActive
      },
      session: authData?.session
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Login failed' 
    }, { status: 500 });
  }
}