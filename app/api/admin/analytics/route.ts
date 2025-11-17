import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30'; // days
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    // Get comprehensive statistics
    const [
      totalStats,
      recentStats,
      platformStats,
      statusStats,
      topClippers,
      recentActivity,
      paymentStats,
      dailyUploads
    ] = await Promise.all([
      // Total statistics
      prisma.$transaction([
        prisma.clipper.count(),
        prisma.clipper.count({ where: { isActive: true } }),
        prisma.video.count(),
        prisma.video.count({ where: { status: 'approved' } }),
        prisma.video.count({ where: { status: 'rejected' } }),
        prisma.video.count({ where: { status: 'pending' } }),
        prisma.strike.count(),
        prisma.manualReview.count({ where: { reviewed: false } }),
      ]),

      // Recent period statistics
      prisma.$transaction([
        prisma.clipper.count({ where: { createdAt: { gte: startDate } } }),
        prisma.video.count({ where: { submissionDate: { gte: startDate } } }),
        prisma.strike.count({ where: { issuedDate: { gte: startDate } } }),
      ]),

      // Platform distribution
      prisma.video.groupBy({
        by: ['platform'],
        _count: { _all: true },
        where: { platform: { not: undefined } },
      }),

      // Status distribution
      prisma.video.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),

      // Top performing clippers
      prisma.clipper.findMany({
        take: 10,
        orderBy: [
          { totalEarnings: 'desc' },
          { totalViews: 'desc' },
        ],
        select: {
          id: true,
          name: true,
          email: true,
          totalEarnings: true,
          totalViews: true,
          strikes: true,
          _count: {
            select: { videos: true },
          },
        },
      }),

      // Recent activity
      prisma.activity.findMany({
        take: 20,
        orderBy: { timestamp: 'desc' },
        where: { timestamp: { gte: startDate } },
        include: {
          clipper: {
            select: { name: true, email: true },
          },
          video: {
            select: { videoLink: true },
          },
        },
      }),

      // Payment statistics
      prisma.paymentRecord.aggregate({
        _sum: { amount: true },
        _count: { _all: true },
        where: {
          createdAt: { gte: startDate },
          status: 'processed',
        },
      }),

      // Daily uploads for chart  
      prisma.video.groupBy({
        by: ['submissionDate', 'status'],
        _count: { _all: true },
        where: { 
          submissionDate: { gte: startDate } 
        },
        orderBy: { submissionDate: 'desc' },
      }),
    ]);

    // Format the response
    const analytics = {
      overview: {
        total: {
          clippers: totalStats[0],
          activeClippers: totalStats[1],
          videos: totalStats[2],
          approvedVideos: totalStats[3],
          rejectedVideos: totalStats[4],
          pendingReviews: totalStats[5],
          strikes: totalStats[6],
          pendingManualReviews: totalStats[7],
        },
        recent: {
          newClippers: recentStats[0],
          newVideos: recentStats[1],
          newStrikes: recentStats[2],
          periodDays: parseInt(period),
        },
        payments: {
          totalAmount: paymentStats._sum.amount || 0,
          totalTransactions: paymentStats._count || 0,
        },
      },
      distributions: {
        platforms: platformStats.map(p => ({
          platform: p.platform,
          count: p._count._all,
        })),
        statuses: statusStats.map(s => ({
          status: s.status,
          count: s._count._all,
        })),
      },
      topClippers: topClippers.map(clipper => ({
        ...clipper,
        videoCount: clipper._count.videos,
      })),
      recentActivity: recentActivity.map(activity => ({
        ...activity,
        clipperName: activity.clipper?.name,
        videoLink: activity.video?.videoLink,
      })),
      charts: {
        dailyUploads: dailyUploads.map(item => ({
          date: item.submissionDate.toISOString().split('T')[0],
          count: item._count._all,
          status: item.status,
        })),
      },
    };

    return NextResponse.json({
      success: true,
      analytics,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}