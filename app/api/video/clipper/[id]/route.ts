import { NextRequest, NextResponse } from 'next/server';
import { getVideosByClipperId } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clipperId = params.id;
    
    const videos = await getVideosByClipperId(clipperId);
    
    return NextResponse.json({
      success: true,
      videos,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}