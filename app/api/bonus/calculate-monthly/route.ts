import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const month = searchParams.get('month') || new Date().getMonth() + 1;
    const year = searchParams.get('year') || new Date().getFullYear();

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    // Get all approved videos with 10k+ views that haven't been paid out
    const eligibleVideos = await prisma.video.findMany({
      where: {
        status: 'approved',
        bonusEligible: true,
        paidOut: false,
        submissionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        clipper: true,
      },
    });

    // Group by clipper
    const clipperBonuses = eligibleVideos.reduce((acc, video) => {
      if (!acc[video.clipperId]) {
        acc[video.clipperId] = {
          clipper: video.clipper,
          videos: [],
          totalBonus: 0,
        };
      }
      acc[video.clipperId].videos.push(video);
      acc[video.clipperId].totalBonus += video.bonusAmount || 10;
      return acc;
    }, {} as Record<string, any>);

    const summary = {
      month: `${year}-${String(month).padStart(2, '0')}`,
      totalVideos: eligibleVideos.length,
      totalBonus: eligibleVideos.reduce((sum, v) => sum + (v.bonusAmount || 10), 0),
      clipperBonuses: Object.values(clipperBonuses),
    };

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('Calculate monthly bonus error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate monthly bonuses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { month, year, clipperIds } = body;

    if (!clipperIds || clipperIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No clippers specified for payout' },
        { status: 400 }
      );
    }

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    // Process payouts for specified clippers
    const payoutResults = [];

    for (const clipperId of clipperIds) {
      // Get eligible videos for this clipper
      const videos = await prisma.video.findMany({
        where: {
          clipperId,
          status: 'approved',
          bonusEligible: true,
          paidOut: false,
          submissionDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      if (videos.length === 0) continue;

      const totalBonus = videos.reduce((sum, v) => sum + (v.bonusAmount || 10), 0);

      // Create payment record
      const paymentRecord = await prisma.paymentRecord.create({
        data: {
          clipperId,
          amount: totalBonus,
          type: 'bonus',
          status: 'pending',
          description: `Monthly bonus for ${month}/${year} - ${videos.length} videos`,
          metadata: {
            month,
            year,
            videoIds: videos.map(v => v.id),
            videoCount: videos.length,
          } as any,
        },
      });

      // Mark videos as paid
      await prisma.video.updateMany({
        where: {
          id: { in: videos.map(v => v.id) },
        },
        data: {
          paidOut: true,
        },
      });

      // Update clipper earnings
      await prisma.clipper.update({
        where: { id: clipperId },
        data: {
          totalEarnings: { increment: totalBonus },
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          clipperId,
          type: 'payment',
          action: 'monthly_bonus_processed',
          description: `Monthly bonus payment of €${totalBonus.toFixed(2)} for ${videos.length} videos`,
          metadata: paymentRecord as any,
        },
      });

      payoutResults.push({
        clipperId,
        videoCount: videos.length,
        totalBonus,
        paymentRecordId: paymentRecord.id,
      });
    }

    return NextResponse.json({ 
      success: true, 
      payouts: payoutResults,
      summary: {
        totalClippers: payoutResults.length,
        totalVideos: payoutResults.reduce((sum, p) => sum + p.videoCount, 0),
        totalAmount: payoutResults.reduce((sum, p) => sum + p.totalBonus, 0),
      }
    });

  } catch (error) {
    console.error('Process monthly payout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process monthly payouts' },
      { status: 500 }
    );
  }
}