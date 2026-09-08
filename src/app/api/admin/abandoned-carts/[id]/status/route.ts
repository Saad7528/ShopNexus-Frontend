import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

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

    const query = objectId ? { _id: objectId } : { guestId: id };
    const result = await cartsCollection.updateOne(
      query,
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Cart status updated successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Abandoned cart status update error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
