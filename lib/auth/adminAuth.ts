import crypto from 'crypto';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.FIREBASE_PRIVATE_KEY || 'tabl-secure-admin-secret-key-2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tabl.bistro';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TablAdmin2026!Secure';
const STAFF_PIN = process.env.STAFF_PIN || '7429';

export interface AdminSessionPayload {
  email: string;
  role: 'admin' | 'staff';
  iat: number;
  exp: number;
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 */
export function createAdminSessionToken(payload: { email: string; role: 'admin' | 'staff' }): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 24 * 60 * 60; // 24 hours validity

  const fullPayload: AdminSessionPayload = {
    ...payload,
    iat,
    exp,
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 session token.
 */
export function verifyAdminSessionToken(token: string): { valid: boolean; payload?: AdminSessionPayload; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing or invalid format' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid token structure' };
  }

  const [header, body, signature] = parts;

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const payload: AdminSessionPayload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      return { valid: false, error: 'Session expired' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Malformed token payload' };
  }
}

/**
 * Extracts and verifies the admin session from an incoming Next.js API request.
 * Checks Authorization header (Bearer <token>) and cookies.
 */
export function verifyAdminSession(req: NextRequest): { valid: boolean; user?: AdminSessionPayload; error?: string } {
  // 1. Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const result = verifyAdminSessionToken(token);
    if (result.valid && result.payload) {
      return { valid: true, user: result.payload };
    }
  }

  // 2. Check cookie
  const cookieToken = req.cookies.get('tabl_admin_session')?.value;
  if (cookieToken) {
    const result = verifyAdminSessionToken(cookieToken);
    if (result.valid && result.payload) {
      return { valid: true, user: result.payload };
    }
  }

  return { valid: false, error: 'Unauthorized: Valid staff/admin credentials required' };
}

/**
 * Validates staff/admin credentials during login.
 */
export function authenticateStaffCredentials(
  email?: string,
  password?: string,
  pin?: string
): { success: boolean; role?: 'admin' | 'staff'; userEmail?: string; error?: string } {
  // 1. PIN-based Staff Login
  if (pin && typeof pin === 'string') {
    const cleanPin = pin.trim();
    if (cleanPin === STAFF_PIN || (process.env.NODE_ENV !== 'production' && cleanPin === '7429')) {
      return {
        success: true,
        role: 'staff',
        userEmail: `staff-pin@tabl.local`,
      };
    }
    return { success: false, error: 'Invalid Staff Access PIN.' };
  }

  // 2. Email & Password Admin Login
  if (email && password) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPassword === ADMIN_PASSWORD) {
      return {
        success: true,
        role: 'admin',
        userEmail: cleanEmail,
      };
    }

    return { success: false, error: 'Invalid admin email or password.' };
  }

  return { success: false, error: 'Please provide either admin email & password, or staff PIN.' };
}
