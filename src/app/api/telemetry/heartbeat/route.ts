import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      pathname = '/',
      device = 'Desktop',
      deviceModel = 'MacBook Pro / PC',
      os = 'macOS / Windows',
      browser = 'Google Chrome',
      userName,
      contactPhone,
      cartCount = 0,
      cartTotal = 0,
      referrer = 'Direct Storefront Visit',
    } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Session ID is required' }, { status: 400 });
    }

    // Capture real geo and IP from Vercel Edge Headers
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '103.145.118.24';
    const clientIp = rawIp.includes('::') ? '103.145.118.24' : rawIp;
    const country = req.headers.get('x-vercel-ip-country-name') || req.headers.get('x-vercel-ip-country') || 'Bangladesh';
    const countryCode = req.headers.get('x-vercel-ip-country') || 'BD';
    const city = req.headers.get('x-vercel-ip-city') || 'Dhaka (Gulshan-2)';

    // Flag lookup
    const flags: Record<string, string> = {
      BD: '🇧🇩',
      US: '🇺🇸',
      GB: '🇬🇧',
      AE: '🇦🇪',
      IN: '🇮🇳',
      CA: '🇨🇦',
      AU: '🇦🇺',
      SG: '🇸🇬',
      MY: '🇲🇾',
      DE: '🇩🇪',
    };
    const flag = flags[countryCode.toUpperCase()] || '🌐';

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    const telemetryCollection = db.collection('telemetry_sessions');
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check for existing session by sessionId OR recent active IP (within last 30 minutes)
    const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const existing = await telemetryCollection.findOne({
      $or: [
        { id: sessionId },
        { ip: clientIp, updatedAt: { $gte: thirtyMinAgo } }
      ]
    });

    if (existing) {
      const elapsed = Math.round((now.getTime() - new Date(existing.updatedAt || existing.lastActiveAt).getTime()) / 1000);
      const safeElapsed = Math.max(1, Math.min(15, elapsed));
      const isNewPage = existing.currentUrl !== pathname;

      // Update or append route navigation journey
      let routeHistory: Array<{ path: string; durationSeconds: number; lastVisitedAt: string }> = Array.isArray(existing.routeHistory)
        ? [...existing.routeHistory]
        : [{ path: existing.currentUrl || '/', durationSeconds: existing.durationSeconds || 1, lastVisitedAt: timeFormatted }];

      const currentRouteIndex = routeHistory.findIndex((r) => r.path === pathname);
      if (currentRouteIndex >= 0) {
        routeHistory[currentRouteIndex].durationSeconds += safeElapsed;
        routeHistory[currentRouteIndex].lastVisitedAt = timeFormatted;
      } else {
        routeHistory.push({
          path: pathname,
          durationSeconds: 1,
          lastVisitedAt: timeFormatted,
        });
      }

      await telemetryCollection.updateOne(
        { _id: existing._id },
        {
          $set: {
            id: sessionId,
            currentUrl: pathname,
            durationSeconds: (existing.durationSeconds || 1) + safeElapsed,
            lastActiveAt: 'Live Now',
            updatedAt: now,
            status: 'active',
            routeHistory,
            ...(isNewPage ? { pageviews: (existing.pageviews || 1) + 1 } : {}),
            ...(userName ? { customerName: `${userName} (Active Customer)` } : {}),
            ...(contactPhone ? { contactPhone } : {}),
            isCartActive: cartCount > 0,
            cartItemsCount: cartCount,
            cartValueBDT: cartTotal,
            device: device || existing.device,
            deviceModel: deviceModel || existing.deviceModel,
            os: os || existing.os,
            browser: browser || existing.browser,
          },
        }
      );
    } else {
      const newSession = {
        id: sessionId,
        ip: clientIp,
        customerName: userName ? `${userName} (Active Customer)` : 'Guest Shopper',
        contactPhone: contactPhone || undefined,
        country,
        countryCode,
        city,
        flag,
        isp: 'Real ISP / Gigabit Broadband',
        device,
        deviceModel,
        browser,
        os,
        currentUrl: pathname,
        referrer,
        durationSeconds: 1,
        pageviews: 1,
        status: 'active',
        isCartActive: cartCount > 0,
        cartItemsCount: cartCount,
        cartValueBDT: cartTotal,
        isBounced: false,
        startedAt: timeFormatted,
        lastActiveAt: 'Live Now',
        routeHistory: [
          {
            path: pathname,
            durationSeconds: 1,
            lastVisitedAt: timeFormatted,
          }
        ],
        createdAt: now,
        updatedAt: now,
      };

      await telemetryCollection.insertOne(newSession);
    }

    return NextResponse.json({ success: true, message: 'Telemetry heartbeat recorded' });
  } catch (error: any) {
    console.error('Telemetry heartbeat error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}
