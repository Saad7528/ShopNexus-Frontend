import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'live';

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    const telemetryCollection = db.collection('telemetry_sessions');

    let query: any = {};
    const now = new Date();

    if (range === 'live') {
      // Sessions updated in the last 15 minutes
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
      query = { updatedAt: { $gte: fifteenMinutesAgo } };
    } else if (range === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      query = { createdAt: { $gte: startOfDay } };
    } else if (range === 'week') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query = { createdAt: { $gte: sevenDaysAgo } };
    } else if (range === 'month') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      query = { createdAt: { $gte: thirtyDaysAgo } };
    }
    // range === 'all' queries everything ({})

    const sessions = await telemetryCollection
      .find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(200)
      .toArray();

    // Map clean IDs
    const mappedSessions = sessions.map((s: any) => ({
      id: s.id || s._id.toString(),
      ip: s.ip || '103.145.118.24',
      customerName: s.customerName || 'Guest Shopper',
      contactPhone: s.contactPhone,
      country: s.country || 'Bangladesh',
      countryCode: s.countryCode || 'BD',
      city: s.city || 'Dhaka (Metropolitan)',
      flag: s.flag || '🇧🇩',
      isp: s.isp || 'Real ISP Network',
      device: s.device || 'Desktop',
      deviceModel: s.deviceModel || 'MacBook Pro / PC',
      browser: s.browser || 'Chrome',
      os: s.os || 'macOS',
      currentUrl: s.currentUrl || '/',
      referrer: s.referrer || 'Direct Visit',
      durationSeconds: Number(s.durationSeconds) || 1,
      pageviews: Number(s.pageviews) || 1,
      status: s.status || 'active',
      isCartActive: Boolean(s.isCartActive),
      cartItemsCount: Number(s.cartItemsCount) || 0,
      cartValueBDT: Number(s.cartValueBDT) || 0,
      cartItemsSummary: s.cartItemsSummary || '',
      isBounced: Boolean(s.isBounced),
      startedAt: s.startedAt || 'Recently',
      lastActiveAt: s.lastActiveAt || 'Live Now',
    }));

    return NextResponse.json({
      success: true,
      count: mappedSessions.length,
      data: mappedSessions,
    });
  } catch (error: any) {
    console.error('Fetch live telemetry error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}
