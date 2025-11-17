import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';

    const videos = await prisma.video.findMany({
      where: {
        status: status as any,
        isDeleted: false,
      },
      include: {
        clipper: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        submissionDate: 'desc',
      },
    });

    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}