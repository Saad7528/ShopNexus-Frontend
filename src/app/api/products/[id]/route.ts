import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (db) {
      const productsColl = db.collection('products');
      const product = await productsColl.findOne({
        $or: [{ _id: id as any }, { id }, { slug: id }],
      });

      if (product) {
        return NextResponse.json({ success: true, data: product });
      }
    }

    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  } catch (error: any) {
    console.error('API Product GET by ID error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (db) {
      const productsColl = db.collection('products');
      await productsColl.updateOne(
        { $or: [{ _id: id as any }, { id }, { slug: id }] },
        { $set: { ...body, updatedAt: new Date() } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully', data: body });
  } catch (error: any) {
    console.error('API Product PUT error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (db) {
      const productsColl = db.collection('products');
      await productsColl.deleteOne({
        $or: [{ _id: id as any }, { id }, { slug: id }],
      });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('API Product DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}
