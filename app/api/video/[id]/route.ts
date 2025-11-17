import { NextRequest, NextResponse } from 'next/server';
import { getVideoById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const videoId = id;
    
    const video = await getVideoById(videoId);
    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      video,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video data' },
      { status: 500 }
    );
  }
}