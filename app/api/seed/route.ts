import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { FALLBACK_MENU_ITEMS, FALLBACK_DEALS, FALLBACK_RESTAURANT_INFO } from '@/lib/firebase/menuService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleSeed(req);
}

export async function POST(req: NextRequest) {
  return handleSeed(req);
}

async function handleSeed(req: NextRequest) {
  try {
    const auth = verifyAdminSession(req);
    if (!auth.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Staff or Manager login required to seed the database.' },
        { status: 401 }
      );
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Firebase Admin not configured in environment.' },
        { status: 503 }
      );
    }

    const batch = db.batch();

    // 1. Seed Menu Items
    for (const item of FALLBACK_MENU_ITEMS) {
      const docRef = db.collection('menu').doc(item.id);
      batch.set(docRef, item, { merge: true });
    }

    // 2. Seed Deals
    for (const deal of FALLBACK_DEALS) {
      const docRef = db.collection('deals').doc(deal.id);
      batch.set(docRef, deal, { merge: true });
    }

    // 3. Seed Restaurant Info
    const infoRef = db.collection('settings').doc('info');
    batch.set(infoRef, FALLBACK_RESTAURANT_INFO, { merge: true });

    await batch.commit();

    return NextResponse.json({
      success: true,
      count: FALLBACK_MENU_ITEMS.length + FALLBACK_DEALS.length + 1,
      message: `Successfully seeded ${FALLBACK_MENU_ITEMS.length} dishes, ${FALLBACK_DEALS.length} deals, and restaurant info directly to Firestore!`,
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Seeding error' },
      { status: 500 }
    );
  }
}
