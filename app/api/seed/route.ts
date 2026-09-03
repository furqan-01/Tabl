import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/firebase/menuService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const result = await seedDatabase();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

export async function POST(req: NextRequest) {
  const result = await seedDatabase();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
