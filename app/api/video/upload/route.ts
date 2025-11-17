import { NextRequest, NextResponse } from 'next/server';
import { prisma, createVideo } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clipperId = formData.get('clipperId') as string;
    const uploadLink = formData.get('uploadLink') as string;
    const platform = formData.get('platform') as string;
    const videoType = formData.get('videoType') as string;
    
    if (!file || !clipperId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // For testing: Skip actual file upload to Vercel Blob
    console.log('📁 File received:', file.name, 'Size:', file.size);
    
    // Create video record (without actual upload)
    const video = await createVideo({
      clipperId,
      videoLink: uploadLink || file.name,
      uploadLink,
      platform,
      videoType: videoType || 'normal',
      blobUrl: `/uploads/${file.name}`, // Local path
      fileSize: file.size,
      status: 'pending',
    });
    
    return NextResponse.json({
      success: true,
      videoId: video.id,
      blobUrl: `/uploads/${file.name}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}