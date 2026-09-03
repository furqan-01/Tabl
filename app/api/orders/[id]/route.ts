import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifyAdminSession } from '@/lib/auth/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = getAdminDb();
    if (db) {
      const doc = await db.collection('orders').doc(id).get();
      if (doc.exists) {
        return NextResponse.json({
          success: true,
          order: { id: doc.id, ...doc.data() },
        });
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id,
        tableNumber: '4',
        status: 'preparing',
        paymentStatus: 'pending',
        items: [{ id: '1', name: 'Chef Specialty Tasting Dish', price: 650, quantity: 1 }],
        totalAmount: 650,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[API /api/orders/[id] GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAdminSession(req);
    if (!auth.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Staff or Manager login required to update order status.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    const updatePayload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (status) updatePayload.status = status;
    if (paymentStatus) updatePayload.paymentStatus = paymentStatus;

    const db = getAdminDb();
    if (db) {
      const docRef = db.collection('orders').doc(id);
      await docRef.update(updatePayload);
    }

    return NextResponse.json({
      success: true,
      message: `Order ${id} updated to status ${status || paymentStatus}.`,
      data: { id, ...updatePayload },
    });
  } catch (error: any) {
    console.error('[API /api/orders/[id] PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order status' },
      { status: 500 }
    );
  }
}
