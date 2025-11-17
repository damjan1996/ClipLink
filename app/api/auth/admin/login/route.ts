import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = LoginSchema.parse(body);
    
    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });
    
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // In production: use proper password hashing (bcrypt)
    if (admin.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });
    
    // Log activity
    await prisma.activity.create({
      data: {
        adminId: admin.id,
        type: 'auth',
        action: 'admin_login',
        description: `Admin ${admin.username} logged in`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });
    
    // Return admin data (without password)
    const { password: _, ...adminData } = admin;
    
    return NextResponse.json({
      success: true,
      admin: adminData,
      // In production: return JWT token
      token: `mock_token_${admin.id}`,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}