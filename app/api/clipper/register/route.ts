import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  registeredChannels: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = RegisterSchema.parse(body);
    
    const clipper = await prisma.clipper.create({
      data: {
        name: data.name,
        email: data.email,
        registeredChannels: data.registeredChannels || [],
      },
    });
    
    return NextResponse.json({ success: true, clipper });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 400 }
    );
  }
}