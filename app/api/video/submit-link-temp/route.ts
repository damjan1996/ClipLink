import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clipperId, videoLink, platform } = body;

    if (!clipperId || !videoLink || !platform) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Use service client to bypass RLS for testing
    const supabase = createSupabaseServiceClient();

    // Check if clipper exists
    const { data: clipper, error: clipperError } = await supabase
      .from('clipper')
      .select('*')
      .eq('id', clipperId)
      .single();

    if (clipperError || !clipper) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid clipper ID' 
      }, { status: 404 });
    }

    // Check if clipper is active
    if (!clipper.isActive) {
      return NextResponse.json({ 
        success: false, 
        error: 'Your account is not active. Please contact support.' 
      }, { status: 403 });
    }

    // Check if payment is blocked
    if (clipper.paymentBlocked) {
      return NextResponse.json({ 
        success: false, 
        error: 'Your account has been blocked from receiving payments. Please contact support.' 
      }, { status: 403 });
    }

    // Check for duplicate link submission
    const { data: existingVideos, error: checkError } = await supabase
      .from('videos')
      .select('id')
      .eq('videoLink', videoLink)
      .eq('isDeleted', false)
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingVideos && existingVideos.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'This video link has already been submitted' 
      }, { status: 409 });
    }

    // Create video record
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .insert([{
        clipperId,
        videoLink,
        platform,
      }])
      .select()
      .single();

    if (videoError) {
      throw videoError;
    }

    // Log activity
    await supabase
      .from('activities')
      .insert([{
        clipperId,
        videoId: video.id,
        type: 'submission',
        action: 'video_link_submitted',
        description: `Video link submitted for platform: ${platform}`,
      }]);

    // Add to manual review queue
    await supabase
      .from('manual_review_queue')
      .insert([{
        videoId: video.id,
        reason: 'New video submission',
        priority: 'medium',
      }]);

    return NextResponse.json({ 
      success: true, 
      videoId: video.id,
      message: 'Video link submitted successfully' 
    });

  } catch (error) {
    console.error('Submit link error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit video link' 
    }, { status: 500 });
  }
}