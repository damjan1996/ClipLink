import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getVideoMetadata } from '@/lib/video-scraper';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing video ID' 
      }, { status: 400 });
    }

    // Get video record
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json({ 
        success: false, 
        error: 'Video not found' 
      }, { status: 404 });
    }

    // Scrape metadata
    const metadata = await getVideoMetadata(video.videoLink, video.platform);

    if (metadata.error) {
      return NextResponse.json({ 
        success: false, 
        error: metadata.error 
      }, { status: 500 });
    }

    // Update video record with metadata
    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        title: metadata.title,
        description: metadata.description,
        viewCount: metadata.viewCount,
        uploadDate: metadata.uploadDate,
        duration: metadata.duration,
        thumbnailUrl: metadata.thumbnailUrl,
        lastViewCheck: new Date(),
        // Check if eligible for bonus (10k+ views)
        bonusEligible: metadata.viewCount >= 10000,
        bonusAmount: metadata.viewCount >= 10000 ? 10.0 : null,
        metadata: metadata as any,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        videoId,
        type: 'metadata_update',
        action: 'video_metadata_scraped',
        description: `Views: ${metadata.viewCount}, Bonus eligible: ${metadata.viewCount >= 10000}`,
        metadata: metadata as any,
      },
    });

    return NextResponse.json({ 
      success: true, 
      video: updatedVideo,
      metadata,
    });

  } catch (error) {
    console.error('Scrape metadata error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to scrape video metadata' 
    }, { status: 500 });
  }
}