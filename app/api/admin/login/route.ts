import { NextRequest, NextResponse } from 'next/server';
import { authenticateStaffCredentials, createAdminSessionToken } from '@/lib/auth/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, pin } = body;

    const authResult = authenticateStaffCredentials(email, password, pin);

    if (!authResult.success || !authResult.role || !authResult.userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken({
      email: authResult.userEmail,
      role: authResult.role,
    });

    const user = {
      name: authResult.role === 'admin' ? 'Admin Manager' : 'Kitchen / Floor Staff',
      email: authResult.userEmail,
      role: authResult.role,
      token,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user,
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: 'tabl_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('[API /api/admin/login] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Login failed',
      },
      { status: 500 }
    );
  }
}
