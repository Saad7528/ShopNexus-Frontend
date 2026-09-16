import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role = 'Telesales Executive' } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'All fields required' }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    const usersCollection = db.collection('users');
    const existing = await usersCollection.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    const doc = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: `${salt}:${passwordHash}`,
      role: 'admin',
      storeName: role,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(doc);

    return NextResponse.json({
      success: true,
      message: 'Staff created successfully',
      data: { ...doc, _id: result.insertedId },
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
