import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    const clippers = await prisma.clipper.findMany();
    console.log('Found clippers:', clippers);
    
    return NextResponse.json({
      success: true,
      clippers: clippers
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database error'
    });
  }
}