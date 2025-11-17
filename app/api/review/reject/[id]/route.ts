import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const videoId = id;
    const body = await request.json();
    const { adminId, notes } = body;
    
    if (!notes) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      );
    }
    
    // Get video to find clipper
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });
    
    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }
    
    // Update video status to rejected
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'rejected',
        notes,
      },
    });
    
    // Create a strike for the clipper
    await prisma.strike.create({
      data: {
        clipperId: video.clipperId,
        videoId,
        reason: notes,
        type: 'policy_violation',
        severity: 'medium',
      },
    });
    
    // Update clipper strikes
    await prisma.clipper.update({
      where: { id: video.clipperId },
      data: {
        strikes: { increment: 1 },
      },
    });
    
    // Mark review as completed
    await prisma.manualReview.updateMany({
      where: { videoId, reviewed: false },
      data: {
        reviewed: true,
        reviewDecision: 'reject',
        reviewedAt: new Date(),
        reviewedBy: adminId,
        adminId,
        reviewNotes: notes,
      },
    });
    
    // Log activity
    await prisma.activity.create({
      data: {
        videoId,
        adminId,
        type: 'review',
        action: 'video_rejected',
        description: `Video rejected: ${notes}`,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rejection error:', error);
    return NextResponse.json(
      { success: false, error: 'Rejection failed' },
      { status: 500 }
    );
  }
}