import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    // Check if clipper exists
    const clipper = await prisma.clipper.findUnique({
      where: { id: clipperId },
    });

    if (!clipper) {
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
    const existingVideo = await prisma.video.findFirst({
      where: {
        videoLink,
        isDeleted: false,
      },
    });

    if (existingVideo) {
      return NextResponse.json({ 
        success: false, 
        error: 'This video link has already been submitted' 
      }, { status: 409 });
    }

    // Create video record with pending status
    const video = await prisma.video.create({
      data: {
        clipperId,
        videoLink,
        platform,
        status: 'pending',
        viewCount: 0,
        bonusEligible: false,
        paidOut: false,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        clipperId,
        videoId: video.id,
        type: 'submission',
        action: 'video_link_submitted',
        description: `Video link submitted for platform: ${platform}`,
      },
    });

    // Add to manual review queue
    await prisma.manualReview.create({
      data: {
        videoId: video.id,
        reason: 'New video submission',
        priority: 'medium',
        reviewed: false,
      },
    });

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