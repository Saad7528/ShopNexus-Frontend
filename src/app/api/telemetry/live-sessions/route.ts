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
    const now = new Date();

    let query: any = {};

    if (range === 'live') {
      // Strict 10-second instant live threshold
      const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);
      query = { updatedAt: { $gte: tenSecondsAgo } };
    } else if (range === 'today') {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      query = { createdAt: { $gte: startOfDay } };
    } else if (range === 'week') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query = { createdAt: { $gte: sevenDaysAgo } };
    } else if (range === 'month') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      query = { createdAt: { $gte: thirtyDaysAgo } };
    }
    // range === 'all' queries everything ({})

    const rawSessions = await telemetryCollection
      .find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(300)
      .toArray();

    // Group & Deduplicate strictly by IP
    const ipMap = new Map<string, any>();

    for (const s of rawSessions) {
      const ipKey = s.ip || '103.145.118.24';
      if (!ipMap.has(ipKey)) {
        ipMap.set(ipKey, s);
      } else {
        // Aggregate hits/pageviews and merge routeHistory into the existing IP record
        const existing = ipMap.get(ipKey);
        existing.pageviews = (existing.pageviews || 1) + (s.pageviews || 1);
        existing.durationSeconds = (existing.durationSeconds || 1) + (s.durationSeconds || 1);
        if (s.isCartActive) existing.isCartActive = true;
        
        // Merge route histories
        const existingRoutes = existing.routeHistory || [];
        const newRoutes = s.routeHistory || [];
        const mergedRoutes = [...existingRoutes];
        
        for (const nr of newRoutes) {
          const idx = mergedRoutes.findIndex((r: any) => r.path === nr.path);
          if (idx >= 0) {
            mergedRoutes[idx].durationSeconds += nr.durationSeconds || 1;
          } else {
            mergedRoutes.push(nr);
          }
        }
        existing.routeHistory = mergedRoutes;
        ipMap.set(ipKey, existing);
      }
    }

    const uniqueSessions = Array.from(ipMap.values());

    const mappedSessions = uniqueSessions.map((s: any) => {
      const isCurrentlyOnline = range === 'live' || (s.updatedAt && now.getTime() - new Date(s.updatedAt).getTime() <= 10000);

      // Default route history if empty
      const defaultRoutes = [
        {
          path: s.currentUrl || '/',
          durationSeconds: Number(s.durationSeconds) || 1,
          lastVisitedAt: s.startedAt || 'Recently',
        }
      ];

      return {
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
        browser: s.browser || 'Google Chrome',
        os: s.os || 'macOS',
        currentUrl: s.currentUrl || '/',
        referrer: s.referrer || 'Direct Visit',
        durationSeconds: Number(s.durationSeconds) || 1,
        pageviews: Number(s.pageviews) || 1,
        status: isCurrentlyOnline ? 'active' : (s.isBounced ? 'bounced' : 'idle'),
        isCartActive: Boolean(s.isCartActive),
        cartItemsCount: Number(s.cartItemsCount) || 0,
        cartValueBDT: Number(s.cartValueBDT) || 0,
        cartItemsSummary: s.cartItemsSummary || '',
        isBounced: Boolean(s.isBounced),
        startedAt: s.startedAt || 'Recently',
        lastActiveAt: isCurrentlyOnline ? 'Live Now' : (s.updatedAt ? new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Offline'),
        routeHistory: (Array.isArray(s.routeHistory) && s.routeHistory.length > 0) ? s.routeHistory : defaultRoutes,
        updatedAt: s.updatedAt,
      };
    });

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
