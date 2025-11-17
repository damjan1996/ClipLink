import { NextRequest, NextResponse } from 'next/server';
import { getClipperById, getVideosByClipperId } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clipperId = id;
    
    const clipper = await getClipperById(clipperId);
    if (!clipper) {
      return NextResponse.json(
        { success: false, error: 'Clipper not found' },
        { status: 404 }
      );
    }
    
    const videos = await getVideosByClipperId(clipperId);
    
    return NextResponse.json({
      success: true,
      clipper,
      videos,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clipper data' },
      { status: 500 }
    );
  }
}