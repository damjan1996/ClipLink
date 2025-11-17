import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;
    const body = await request.json();
    const { adminId, notes } = body;
    
    // Update video status to approved
    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'approved',
        notes,
      },
    });
    
    // Mark review as completed
    await prisma.manualReview.updateMany({
      where: { videoId, reviewed: false },
      data: {
        reviewed: true,
        reviewDecision: 'approve',
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
        action: 'video_approved',
        description: `Video approved${notes ? ' with notes' : ''}`,
      },
    });
    
    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { success: false, error: 'Approval failed' },
      { status: 500 }
    );
  }
}