import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { getLiveRestaurantContext } from '@/lib/firebase/menuService';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import type { Query } from 'firebase-admin/firestore';
import { OrderItem, OrderRecord } from '@/types/restaurant';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tableNumber, items, customerName, customerPhone, specialInstructions } = body;

    if (!tableNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'tableNumber is required to place a table order.',
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order must contain at least one item.',
        },
        { status: 400 }
      );
    }

    // Fetch live canonical menu context to validate real server prices and availability
    const context = await getLiveRestaurantContext();
    const menuMap = new Map(context.menu.map((m) => [m.id, m]));
    const dealsMap = new Map(context.deals.map((d) => [d.id, d]));

    const verifiedItems: OrderItem[] = [];

    for (const rawItem of items) {
      const itemId = String(rawItem.id || '').trim();
      const requestedQty = Math.max(1, Math.min(Number(rawItem.quantity) || 1, 50)); // Bound quantity

      // 1. Check against standard Menu Items
      const canonicalMenu = menuMap.get(itemId) || context.menu.find((m) => m.name.toLowerCase() === String(rawItem.name || '').trim().toLowerCase());
      if (canonicalMenu) {
        if (!canonicalMenu.isAvailable) {
          return NextResponse.json(
            {
              success: false,
              error: `"${canonicalMenu.name}" is currently 86'd / out of stock and cannot be ordered.`,
            },
            { status: 400 }
          );
        }

        verifiedItems.push({
          id: canonicalMenu.id,
          name: canonicalMenu.name,
          price: Number(canonicalMenu.price), // Server-enforced true price
          quantity: requestedQty,
          notes: rawItem.notes ? String(rawItem.notes).slice(0, 200) : undefined,
          spiceLevel: typeof rawItem.spiceLevel === 'number' ? rawItem.spiceLevel : canonicalMenu.spiceLevel,
        });
        continue;
      }

      // 2. Check against Deals / Promotions
      const canonicalDeal = dealsMap.get(itemId) || context.deals.find((d) => d.title.toLowerCase() === String(rawItem.name || '').trim().toLowerCase());
      if (canonicalDeal && canonicalDeal.isActive) {
        verifiedItems.push({
          id: canonicalDeal.id,
          name: canonicalDeal.title,
          price: Number(canonicalDeal.discountedPrice || 0), // Server-enforced deal price
          quantity: requestedQty,
          notes: rawItem.notes ? String(rawItem.notes).slice(0, 200) : undefined,
        });
        continue;
      }

      // 3. Fallback for custom or unmatched item - reject to prevent arbitrary price injection
      return NextResponse.json(
        {
          success: false,
          error: `Item "${rawItem.name || rawItem.id}" was not recognized in the official menu catalog.`,
        },
        { status: 400 }
      );
    }

    // Calculate subtotal, estimated tax (e.g. 5%), and total strictly on the server
    const subtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + tax;

    const orderData: Omit<OrderRecord, 'id'> = {
      tableNumber: String(tableNumber).trim(),
      items: verifiedItems,
      subtotal,
      tax,
      total,
      status: 'pending',
      paymentStatus: 'pay-at-waiter', // Direct policy: Pay waiter at table
      createdAt: new Date().toISOString(),
      customerName: customerName ? String(customerName).trim().slice(0, 80) : undefined,
      customerPhone: customerPhone ? String(customerPhone).trim().slice(0, 30) : undefined,
      specialInstructions: specialInstructions ? String(specialInstructions).trim().slice(0, 300) : undefined,
    };

    const db = getAdminDb();

    if (!db) {
      // Local fallback simulation when Firestore credentials are not set
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const simulatedOrder: OrderRecord = {
        id: orderId,
        ...orderData,
      };

      return NextResponse.json(
        {
          success: true,
          message: 'Order received and routed to Kitchen Display System (Pay at waiter upon conclusion).',
          order: simulatedOrder,
        },
        { status: 201 }
      );
    }

    const docRef = await db.collection('orders').add(orderData);

    const savedOrder: OrderRecord = {
      id: docRef.id,
      ...orderData,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully. Routed to Kitchen Display System (Pay at table).',
        order: savedOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API /api/orders POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to submit table order',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tableNumber = searchParams.get('tableNumber');
    const status = searchParams.get('status');

    // If querying ALL orders without a tableNumber filter, require valid admin/staff session
    if (!tableNumber) {
      const auth = verifyAdminSession(req);
      if (!auth.valid) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized: Staff or Manager login required to view full order queue.',
          },
          { status: 401 }
        );
      }
    }

    const db = getAdminDb();

    if (!db) {
      return NextResponse.json({
        success: true,
        orders: [],
        message: 'Firestore connection inactive. Provide Firebase credentials to query stored live orders.',
      });
    }

    let query: Query = db.collection('orders').orderBy('createdAt', 'desc').limit(50);

    if (tableNumber) {
      query = query.where('tableNumber', '==', tableNumber);
    }
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const orders: OrderRecord[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<OrderRecord, 'id'>),
    }));

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error('[API /api/orders GET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}
