import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Cart ID is required for recovery' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    const cartsCollection = db.collection('carts');
    let objectId: mongoose.Types.ObjectId | null = null;
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (_e) {}

    const query = objectId ? { $or: [{ _id: objectId }, { guestId: id }] } : { guestId: id };
    const cart = await cartsCollection.findOne(query);

    if (!cart) {
      return NextResponse.json(
        { success: false, message: 'Cart session not found or expired' },
        { status: 404 }
      );
    }

    // Return mapped cart items ready for zustand useCartStore
    const items = (cart.items || []).map((i: any, idx: number) => ({
      productId: i.productId ? i.productId.toString() : `item-${idx}`,
      title: i.title || 'Product Item',
      price: Number(i.price) || 0,
      quantity: Math.max(1, Number(i.quantity) || 1),
      image: i.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      vendorName: i.vendorName || 'ShopNexus Official',
      variant: i.variant || '',
      stock: 99,
    }));

    return NextResponse.json({
      success: true,
      message: 'Cart session recovered successfully',
      data: {
        id: cart._id.toString(),
        items,
        couponCode: cart.recoveryDiscountCode || cart.appliedCoupon || '',
        discount: Number(cart.discount) || 0,
        customerName: cart.customerName || '',
        customerEmail: cart.customerEmail || '',
        customerPhone: cart.customerPhone || '',
      },
    });
  } catch (error: any) {
    console.error('Cart recovery error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
