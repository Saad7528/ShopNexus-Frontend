import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { orderStatus, status } = body;

    const newStatus = (orderStatus || status || '').toLowerCase();
    if (!newStatus) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const ordersColl = db.collection('orders');

    let query: Record<string, unknown> = { trackingNumber: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { trackingNumber: id }] };
    }

    const result = await ordersColl.updateOne(query, {
      $set: {
        orderStatus: newStatus,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      orderStatus: newStatus,
    });
  } catch (error: unknown) {
    console.error('API Admin Order Status Update PATCH error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Server error',
      },
      { status: 500 }
    );
  }
}
