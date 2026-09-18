import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export interface IStaffSessionData {
  id: string;
  device: string;
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  isCurrentSession: boolean;
  loginAt: string;
  lastHeartbeat: string;
  riskScore: 'low' | 'medium' | 'high';
  validUntil?: string | null;
  duration?: string;
  expiresAt?: number | null; // timestamp in ms or null for permanent
}

// In-memory fallback map keyed by staffId and email
let staffSessionsMap: Record<string, IStaffSessionData[]> = {
  'st-0': [
    {
      id: 'sess-saad-primary',
      device: 'MacBook Pro (Primary Master Root)',
      os: 'macOS Sonoma 14.5',
      browser: 'Google Chrome 128.0',
      ipAddress: '103.145.74.22',
      location: 'Dhaka, Bangladesh',
      isCurrentSession: true,
      loginAt: 'Today, 10:00 AM',
      lastHeartbeat: 'Just now',
      riskScore: 'low',
      validUntil: 'Permanent (Primary Master Root)',
      expiresAt: null,
    },
  ],
  'saad0174742@gmail.com': [
    {
      id: 'sess-saad-primary',
      device: 'MacBook Pro (Primary Master Root)',
      os: 'macOS Sonoma 14.5',
      browser: 'Google Chrome 128.0',
      ipAddress: '103.145.74.22',
      location: 'Dhaka, Bangladesh',
      isCurrentSession: true,
      loginAt: 'Today, 10:00 AM',
      lastHeartbeat: 'Just now',
      riskScore: 'low',
      validUntil: 'Permanent (Primary Master Root)',
      expiresAt: null,
    },
  ],
};

async function getMongoCollection() {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return null;
    return db.collection('login_requests');
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');
    const email = searchParams.get('email')?.toLowerCase().trim();

    const targetKey = email || staffId || 'saad0174742@gmail.com';
    const now = Date.now();

    // 1. Fetch active approved 2FA sessions directly from MongoDB
    let approved2FARequests: any[] = [];
    const col = await getMongoCollection();

    if (col) {
      const query: Record<string, unknown> = {
        status: 'approved',
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: now } },
        ],
      };

      if (email && email !== 'admin@shopnexus.io') {
        query.email = email;
      }

      approved2FARequests = await col.find(query).sort({ createdAtTimestamp: -1 }).toArray();
    }

    // 2. Base Primary Master Session
    const primarySession: IStaffSessionData = {
      id: `sess-primary-${targetKey}`,
      device: 'MacBook Pro (Primary Trusted Device)',
      os: 'macOS Sonoma 14.5',
      browser: 'Google Chrome 128.0',
      ipAddress: '103.145.74.22',
      location: 'Dhaka, Bangladesh',
      isCurrentSession: true,
      loginAt: 'Today, 10:00 AM',
      lastHeartbeat: 'Just now',
      riskScore: 'low',
      validUntil: 'Permanent (Primary Device)',
      expiresAt: null,
    };

    let sessions: IStaffSessionData[] = [primarySession];

    // 3. Transform approved 2FA requests into session objects
    const seenIps = new Set<string>();
    const uniqueApproved = approved2FARequests.filter((r) => {
      const ip = r.ipAddress || r.id;
      if (seenIps.has(ip)) return false;
      seenIps.add(ip);
      return true;
    });

    const approvedSessionObjects: IStaffSessionData[] = uniqueApproved.map((r) => {
      let durationStr = '1 Hour';
      if (r.duration === 'until_revoked') durationStr = 'Until Blocked';
      else if (r.duration === '20m') durationStr = '20 Mins';
      else if (r.duration === '30m') durationStr = '30 Mins';
      else if (r.duration === 'custom') durationStr = `${r.durationMinutes || 60} Mins`;

      return {
        id: r.id,
        device: `${r.device || 'Secondary Device'} (2FA Authorized)`,
        os: r.os || 'Android / iOS',
        browser: r.browser || 'Mobile / Desktop Browser',
        ipAddress: r.ipAddress || '104.28.240.85',
        location: r.location || 'Dhaka, Bangladesh',
        isCurrentSession: false,
        loginAt: r.timestamp || 'Just now',
        lastHeartbeat: 'Active now',
        riskScore: 'low',
        validUntil: durationStr,
        duration: r.duration,
        expiresAt: r.expiresAt !== undefined ? r.expiresAt : null,
      };
    });

    for (const appSess of approvedSessionObjects) {
      sessions.push(appSess);
    }

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sessions telemetry', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, staffId, email, sessionId } = body;
    const col = await getMongoCollection();

    if (action === 'revoke_session' && sessionId) {
      if (col) {
        await col.updateOne({ id: sessionId }, { $set: { status: 'denied', expiresAt: Date.now() } }).catch(() => null);
      }

      return NextResponse.json({
        success: true,
        message: `Remote session ${sessionId} successfully revoked and logged out.`,
      });
    }

    if (action === 'terminate_all_other') {
      const targetEmail = (email || 'saad0174742@gmail.com').toLowerCase().trim();
      if (col) {
        await col.updateMany({ email: targetEmail }, { $set: { status: 'denied', expiresAt: Date.now() } }).catch(() => null);
      }

      return NextResponse.json({
        success: true,
        message: 'All other remote sessions have been terminated immediately.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to execute session revocation', error: String(error) },
      { status: 500 }
    );
  }
}
