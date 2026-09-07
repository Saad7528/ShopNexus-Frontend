import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guestId, items = [], appliedCoupon, discount = 0, customerName, customerEmail, customerPhone } = body;

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    const cartsCollection = db.collection('carts');
    const now = new Date();

    const subtotal = (items || []).reduce((acc: number, i: any) => acc + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const total = parseFloat(Math.max(0, subtotal - (Number(discount) || 0) + tax).toFixed(2));

    const cartDoc = {
      guestId: guestId || `guest_${Date.now()}`,
      customerName: customerName || 'Guest Shopper',
      customerEmail: customerEmail || 'shopper@tempmail.io',
      customerPhone: customerPhone || '+880 1700-000000',
      items: (items || []).map((i: any) => ({
        productId: i.productId || i.id || 'p-unknown',
        title: i.title || 'Product Item',
        price: Number(i.price) || 0,
        quantity: Math.max(1, Number(i.quantity) || 1),
        image: i.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        vendorName: i.vendorName || 'ShopNexus',
        variant: i.variant || '',
      })),
      subtotal,
      discount: Number(discount) || 0,
      appliedCoupon: appliedCoupon || null,
      tax,
      total,
      status: 'Uncontacted',
      updatedAt: now,
    };

    if (guestId) {
      await cartsCollection.updateOne(
        { guestId },
        { $set: cartDoc, $setOnInsert: { createdAt: now } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: 'Cart synced to MongoDB Atlas' });
  } catch (error: any) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}
