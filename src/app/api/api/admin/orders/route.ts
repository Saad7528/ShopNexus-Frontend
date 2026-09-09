import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (db) {
      const ordersColl = db.collection('orders');
      const orders = await ordersColl.find({}).sort({ createdAt: -1 }).limit(100).toArray();

      if (orders && orders.length > 0) {
        return NextResponse.json({
          success: true,
          count: orders.length,
          data: orders,
        });
      }
    }

    return NextResponse.json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    console.error('API Admin Orders GET error:', error);
    return NextResponse.json({ success: true, count: 0, data: [] });
  }
}
