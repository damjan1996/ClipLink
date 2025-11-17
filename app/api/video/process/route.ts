import { NextRequest, NextResponse } from 'next/server';
import { prisma, updateVideo, issueStrike, addToReviewQueue } from '@/lib/db';
import { z } from 'zod';

// Mock duplicate checker function since the module doesn't exist
type DecisionType = 'auto_approve' | 'auto_reject' | 'manual_review';

async function checkForDuplicates(videoId: string, clipperId: string): Promise<{
  decision: DecisionType;
  confidence: number;
  duplicateOf: string | null;
}> {
  // This is a placeholder implementation
  // In a real system, you would implement actual duplicate detection logic
  return {
    decision: 'auto_approve' as DecisionType, // Always approve for now
    confidence: 0.95,
    duplicateOf: null,
  };
}

const ProcessSchema = z.object({
  videoId: z.string(),
  frameHashes: z.array(z.string()),
  audioFingerprint: z.string(),
  duration: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = ProcessSchema.parse(body);
    
    // Update video with processing results
    await updateVideo(data.videoId, {
      frameHashes: data.frameHashes,
      audioFingerprint: data.audioFingerprint,
      duration: data.duration,
    });
    
    // Get video to find clipper
    const video = await prisma.video.findUnique({
      where: { id: data.videoId },
    });
    
    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }
    
    // Check for duplicates
    const duplicateCheck = await checkForDuplicates(data.videoId, video.clipperId);
    
    // Update video status based on decision
    let status = duplicateCheck.decision === 'auto_approve' ? 'approved' : 
                 duplicateCheck.decision === 'auto_reject' ? 'rejected' : 
                 'manual_review';
    
    await updateVideo(data.videoId, {
      status: status,
      confidenceScore: duplicateCheck.confidence,
      duplicateOf: duplicateCheck.duplicateOf,
    });
    
    // Handle auto-reject: issue strike
    if (duplicateCheck.decision === 'auto_reject') {
      await issueStrike(
        video.clipperId,
        data.videoId,
        `Duplicate of video ${duplicateCheck.duplicateOf}`
      );
    }
    
    // Handle manual review: add to queue
    if (duplicateCheck.decision === 'manual_review') {
      await addToReviewQueue(
        data.videoId,
        duplicateCheck.confidence,
        duplicateCheck.duplicateOf || undefined
      );
    }
    
    // Calculate base payment for approved videos
    if (status === 'approved') {
      const basePayment = video.videoType === 'normal' ? 0.60 : 0.30;
      await updateVideo(data.videoId, { basePayment });
    }
    
    return NextResponse.json({
      success: true,
      status,
      confidence: duplicateCheck.confidence,
      decision: duplicateCheck.decision,
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Processing failed' },
      { status: 500 }
    );
  }
}