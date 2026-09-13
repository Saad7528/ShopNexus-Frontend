import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

interface CartDocItem {
  productId?: unknown;
  title?: string;
  image?: string;
  variant?: string;
  price?: number | string;
  quantity?: number | string;
}

interface CartDoc {
  _id: unknown;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items?: CartDocItem[];
  total?: number | string;
  subtotal?: number | string;
  status?: string;
  recoveryDiscountCode?: string;
  updatedAt?: string | Date;
}

function formatRelativeTime(dateInput?: string | Date | number | null): string {
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
    const carts = (await cartsCollection
      .find({ 'items.0': { $exists: true } })
      .sort({ updatedAt: -1 })
      .limit(100)
      .toArray()) as unknown as CartDoc[];

    const mappedCarts = carts.map((c) => ({
      id: String(c._id),
      customerName: c.customerName || 'Guest Shopper',
      customerEmail: c.customerEmail || 'shopper@tempmail.io',
      customerPhone: c.customerPhone && !c.customerPhone.includes('1700-000000') ? c.customerPhone : '',
      items: (c.items || []).map((i, idx: number) => ({
        id: i.productId ? String(i.productId) : `item-${idx}`,
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('Fetch abandoned carts error:', error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
