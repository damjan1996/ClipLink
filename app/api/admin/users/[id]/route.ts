import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clipperId = params.id;
    
    const clipper = await prisma.clipper.findUnique({
      where: { id: clipperId },
      include: {
        videos: {
          orderBy: { uploadDate: 'desc' },
          take: 50,
        },
        strikes_issued: {
          orderBy: { issuedDate: 'desc' },
          include: {
            video: {
              select: { filename: true, uploadDate: true },
            },
          },
        },
        activities: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
        paymentRecords: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!clipper) {
      return NextResponse.json(
        { success: false, error: 'Clipper not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const stats = {
      totalVideos: clipper.videos.length,
      approvedVideos: clipper.videos.filter(v => v.validationStatus === 'approved').length,
      rejectedVideos: clipper.videos.filter(v => v.validationStatus === 'rejected').length,
      pendingVideos: clipper.videos.filter(v => v.validationStatus === 'pending').length,
      manualReviewVideos: clipper.videos.filter(v => v.validationStatus === 'manual_review').length,
      totalEarnings: clipper.paymentRecords.reduce((sum, p) => sum + p.amount, 0),
      averageViews: clipper.videos.length > 0 
        ? clipper.videos.reduce((sum, v) => sum + v.viewCount, 0) / clipper.videos.length 
        : 0,
    };

    return NextResponse.json({
      success: true,
      clipper,
      stats,
    });
  } catch (error) {
    console.error('Get clipper details error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clipper details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clipperId = params.id;
    const body = await request.json();
    
    const updatedClipper = await prisma.clipper.update({
      where: { id: clipperId },
      data: {
        name: body.name,
        email: body.email,
        username: body.username,
        registeredChannels: body.registeredChannels,
        isActive: body.isActive,
        paymentBlocked: body.paymentBlocked,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        clipperId,
        type: 'admin_action',
        action: 'clipper_updated',
        description: `Clipper profile updated by admin`,
        metadata: body,
      },
    });

    return NextResponse.json({
      success: true,
      clipper: updatedClipper,
    });
  } catch (error) {
    console.error('Update clipper error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update clipper' },
      { status: 500 }
    );
  }
}