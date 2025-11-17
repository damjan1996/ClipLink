import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper Functions
export async function getClipperById(id: string) {
  return await prisma.clipper.findUnique({
    where: { id },
    include: {
      videos: true,
      strikes_issued: true,
    },
  });
}

export async function getVideoById(id: string) {
  return await prisma.video.findUnique({
    where: { id },
  });
}

export async function getVideosByClipperId(clipperId: string) {
  return await prisma.video.findMany({
    where: { clipperId },
    orderBy: { submissionDate: 'desc' },
  });
}

export async function createVideo(data: any) {
  return await prisma.video.create({ data });
}

export async function updateVideo(id: string, data: any) {
  return await prisma.video.update({
    where: { id },
    data,
  });
}

export async function issueStrike(clipperId: string, videoId: string, reason: string) {
  // Create strike
  await prisma.strike.create({
    data: {
      clipperId,
      videoId,
      reason,
    },
  });
  
  // Increment clipper strikes
  const clipper = await prisma.clipper.update({
    where: { id: clipperId },
    data: {
      strikes: { increment: 1 },
    },
  });
  
  // Block payment if 3+ strikes
  if (clipper.strikes >= 3) {
    await prisma.clipper.update({
      where: { id: clipperId },
      data: { paymentBlocked: true },
    });
  }
  
  return clipper;
}

export async function addToReviewQueue(
  videoId: string,
  confidenceScore: number,
  possibleDuplicateOf?: string
) {
  return await prisma.manualReview.create({
    data: {
      videoId,
      reason: `Manual review required. Confidence: ${confidenceScore}${possibleDuplicateOf ? `, possible duplicate of: ${possibleDuplicateOf}` : ''}`,
      priority: confidenceScore < 0.5 ? 'high' : confidenceScore < 0.8 ? 'medium' : 'low',
    },
  });
}

export async function getReviewQueue() {
  return await prisma.manualReview.findMany({
    where: { reviewed: false },
    include: {
      video: {
        include: {
          clipper: true,
        },
      },
    },
    orderBy: { addedToQueue: 'desc' },
  });
}