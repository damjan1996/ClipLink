import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [
      totalClippers,
      totalVideos,
      pendingReviews,
      approvedVideos,
      rejectedVideos,
      totalStrikes,
    ] = await Promise.all([
      prisma.clipper.count(),
      prisma.video.count(),
      prisma.manualReview.count({ where: { reviewed: false } }),
      prisma.video.count({ where: { validationStatus: 'approved' } }),
      prisma.video.count({ where: { validationStatus: 'rejected' } }),
      prisma.strike.count(),
    ]);
    
    return NextResponse.json({
      success: true,
      stats: {
        totalClippers,
        totalVideos,
        pendingReviews,
        approvedVideos,
        rejectedVideos,
        totalStrikes,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}