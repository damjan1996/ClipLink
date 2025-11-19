import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-auth';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get current user before logout
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Log activity
      await supabase
        .from('activities')
        .insert({
          clipperId: user.user_metadata?.role === 'clipper' ? user.id : null,
          adminId: user.user_metadata?.role === 'admin' ? user.id : null,
          type: 'auth',
          action: 'logout',
          description: `${user.user_metadata?.name || user.email} logged out`,
          metadata: {
            userAgent: req.headers.get('user-agent'),
            ip: req.headers.get('x-forwarded-for') || 'unknown'
          }
        });
    }
    
    // Sign out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Logout failed' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Logout failed' 
    }, { status: 500 });
  }
}