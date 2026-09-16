import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const { isFlaggedFraud } = body;

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    const usersCollection = db.collection('users');

    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }

    const existingUser = await usersCollection.findOne(query);
    if (!existingUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const nextStatus = typeof isFlaggedFraud === 'boolean' ? isFlaggedFraud : !existingUser.isFlaggedFraud;
    const lockUntil = nextStatus ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null;

    await usersCollection.updateOne(query, {
      $set: {
        isFlaggedFraud: nextStatus,
        lockUntil: lockUntil,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `User fraud status updated to ${nextStatus ? 'BLOCKED' : 'ACTIVE'}`,
      data: {
        id,
        isFlaggedFraud: nextStatus,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('Update fraud status error:', error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
