import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

function formatRelativeTime(dateInput?: any): string {
  if (!dateInput) return 'Recently';
  const past = new Date(dateInput).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - past) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export async function GET(_req: NextRequest) {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    const cartsCollection = db.collection('carts');
    const carts = await cartsCollection
      .find({ 'items.0': { $exists: true } })
      .sort({ updatedAt: -1 })
      .limit(100)
      .toArray();

    const mappedCarts = carts.map((c: any) => ({
      id: c._id.toString(),
      customerName: c.customerName || 'Guest Shopper',
      customerEmail: c.customerEmail || 'shopper@tempmail.io',
      customerPhone: c.customerPhone && !c.customerPhone.includes('1700-000000') ? c.customerPhone : '',
      items: (c.items || []).map((i: any, idx: number) => ({
        id: i.productId ? i.productId.toString() : `item-${idx}`,
        title: i.title || 'Product Item',
        image: i.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        variant: i.variant || '',
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
      })),
      cartTotal: Number(c.total) || Number(c.subtotal) || 0,
      timeAgo: formatRelativeTime(c.updatedAt),
      status: c.status || 'Uncontacted',
      recoveryDiscountCode: c.recoveryDiscountCode || '',
      updatedAt: c.updatedAt,
    }));

    return NextResponse.json({ success: true, data: mappedCarts });
  } catch (error: any) {
    console.error('Fetch abandoned carts error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}
