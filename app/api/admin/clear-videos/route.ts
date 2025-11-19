import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-auth';

export async function POST() {
  try {
    const supabase = createSupabaseServiceClient();
    
    // Get all video IDs first
    const { data: videos, error: fetchError } = await supabase
      .from('videos')
      .select('id');
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!videos || videos.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No videos to clear' 
      });
    }
    
    const videoIds = videos.map(v => v.id);
    
    // Clear related data first
    await supabase
      .from('manual_review_queue')
      .delete()
      .in('videoId', videoIds);
      
    await supabase
      .from('activities')
      .delete()
      .in('videoId', videoIds);
    
    // Then clear videos
    const { error: videosError } = await supabase
      .from('videos')
      .delete()
      .in('id', videoIds);
    
    if (videosError) {
      throw videosError;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'All videos and related data cleared successfully' 
    });
    
  } catch (error) {
    console.error('Clear videos error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to clear videos' 
    }, { status: 500 });
  }
}