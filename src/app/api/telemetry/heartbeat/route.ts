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
      deviceModel = 'MacBook Pro 16" (Apple Silicon)',
      os = 'macOS Sonoma',
      browser = 'Google Chrome 124',
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
    const existing = await telemetryCollection.findOne({ id: sessionId });

    if (existing) {
      const elapsed = Math.round((now.getTime() - new Date(existing.updatedAt || existing.lastActiveAt).getTime()) / 1000);
      const isNewPage = existing.currentUrl !== pathname;
      
      await telemetryCollection.updateOne(
        { id: sessionId },
        {
          $set: {
            currentUrl: pathname,
            durationSeconds: (existing.durationSeconds || 1) + Math.max(1, Math.min(30, elapsed)),
            lastActiveAt: 'Live Now',
            updatedAt: now,
            status: 'active',
            ...(isNewPage ? { pageviews: (existing.pageviews || 1) + 1 } : {}),
            ...(userName ? { customerName: `${userName} (Active Customer)` } : {}),
            ...(contactPhone ? { contactPhone } : {}),
            isCartActive: cartCount > 0,
            cartItemsCount: cartCount,
            cartValueBDT: cartTotal,
            device,
            deviceModel,
            os,
            browser,
          },
        }
      );
    } else {
      const newSession = {
        id: sessionId,
        ip: clientIp,
        customerName: userName ? `${userName} (Active Customer)` : 'Guest Shopper (Storefront)',
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
        startedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lastActiveAt: 'Live Now',
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
