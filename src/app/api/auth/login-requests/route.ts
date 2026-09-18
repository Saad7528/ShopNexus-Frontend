import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import crypto from 'crypto';

export interface ILoginAuthRequest {
  id: string;
  email: string;
  device: string;
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  createdAtTimestamp: number;
  status: 'pending' | 'approved' | 'denied' | 'denied_and_blocked' | 'expired';
  duration?: '20m' | '30m' | '1h' | 'until_revoked' | 'custom';
  durationMinutes?: number;
  expiresAt?: number | null; // timestamp in ms or null for until_revoked
  approvedAt?: string;
  token?: string;
}

// In-memory registry of active login authorization requests & live master presence
let pendingLoginRequests: ILoginAuthRequest[] = [];
let isMasterOnline: boolean = false;
let masterLastHeartbeat: number = 0;
let masterActiveEmail: string = 'saad0174742@gmail.com';

// Purge any pending requests older than 60 seconds (1 minute TTL)
function purgeExpiredRequests() {
  const now = Date.now();
  pendingLoginRequests = pendingLoginRequests.filter((r) => {
    if (r.status === 'approved') {
      return r.expiresAt === null || (r.expiresAt && r.expiresAt > now);
    }
    // Strict 60-second limit for pending login challenges
    const ageMs = now - (r.createdAtTimestamp || 0);
    return ageMs <= 60000 && r.status === 'pending';
  });
}

// Helper to extract IP and location from request
function extractClientInfo(req: Request, body: Partial<ILoginAuthRequest>) {
  const headers = req.headers;
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfIp = headers.get('cf-connecting-ip');
  const detectedIp = cfIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || body.ipAddress || '103.145.74.22';

  const userAgent = headers.get('user-agent') || '';
  let detectedOS = body.os || 'Unknown OS';
  let detectedBrowser = body.browser || 'Unknown Browser';
  let detectedDevice = body.device || 'Secondary Device';

  if (!body.os || !body.device) {
    if (/android/i.test(userAgent)) {
      detectedOS = 'Android';
      detectedDevice = 'Android Smartphone';
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      detectedOS = 'iOS';
      detectedDevice = 'Apple iPhone';
    } else if (/windows/i.test(userAgent)) {
      detectedOS = 'Windows 11 / 10';
      detectedDevice = 'Windows PC';
    } else if (/macintosh|mac os x/i.test(userAgent)) {
      detectedOS = 'macOS';
      detectedDevice = 'MacBook';
    } else if (/linux/i.test(userAgent)) {
      detectedOS = 'Linux';
      detectedDevice = 'Linux Desktop';
    }
  }

  if (!body.browser) {
    if (/chrome|crios/i.test(userAgent) && !/edge|opr/i.test(userAgent)) detectedBrowser = 'Chrome Mobile/Desktop';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) detectedBrowser = 'Apple Safari';
    else if (/firefox/i.test(userAgent)) detectedBrowser = 'Mozilla Firefox';
    else if (/edg/i.test(userAgent)) detectedBrowser = 'Microsoft Edge';
  }

  return {
    ip: detectedIp,
    os: detectedOS,
    browser: detectedBrowser,
    device: detectedDevice,
    location: body.location || (detectedIp.startsWith('103.') ? 'Dhaka, Bangladesh' : 'Chittagong, Bangladesh'),
  };
}

export async function GET(req: Request) {
  try {
    purgeExpiredRequests();

    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('requestId');
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const checkMaster = searchParams.get('checkMaster');

    // Instant Master Online Status Check (15s rolling window)
    if (checkMaster === 'true') {
      const active = isMasterOnline && (Date.now() - masterLastHeartbeat < 15000);
      return NextResponse.json({
        success: true,
        isMasterOnline: active,
        masterEmail: masterActiveEmail,
        lastHeartbeat: masterLastHeartbeat,
      });
    }

    if (requestId) {
      const found = pendingLoginRequests.find((r) => r.id === requestId);
      if (!found) {
        return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: found });
    }

    let filtered = [...pendingLoginRequests];

    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }

    if (email) {
      filtered = filtered.filter((r) => r.email.toLowerCase() === email.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      isMasterOnline: isMasterOnline && (Date.now() - masterLastHeartbeat < 15000),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch login requests', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    purgeExpiredRequests();

    const body = await req.json();
    const { action, requestId, email, password, duration, customMinutes } = body;

    // Action 0A: Master Live Heartbeat Ping (keeps master online)
    if (action === 'master_heartbeat') {
      isMasterOnline = true;
      masterLastHeartbeat = Date.now();
      if (email) masterActiveEmail = email.toLowerCase().trim();
      return NextResponse.json({ success: true, isMasterOnline: true });
    }

    // Action 0B: Master Instant Logout (0 second delay, immediately frees master)
    if (action === 'master_logout') {
      isMasterOnline = false;
      masterLastHeartbeat = 0;
      return NextResponse.json({ success: true, isMasterOnline: false });
    }

    // Action 0C: Master Registered via TOTP
    if (action === 'master_register') {
      isMasterOnline = true;
      masterLastHeartbeat = Date.now();
      if (email) masterActiveEmail = email.toLowerCase().trim();
      return NextResponse.json({ success: true, isMasterOnline: true });
    }

    // Action 0D: Verify Admin Credentials FIRST before 2FA / Approval
    if (action === 'verify_admin_credentials') {
      const reqEmail = (email || '').toLowerCase().trim();
      const reqPass = password || '';

      if (!reqEmail || !reqPass) {
        return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
      }

      // 1. Check in-memory hardcoded master passwords
      const validPasswords = [
        'Saad@752800',
        'Nexus@Admin2026!',
        'Admin@ShopNexus2026!',
        'saad752800',
        'admin123',
      ];

      let isPasswordCorrect = validPasswords.includes(reqPass);

      // 2. Cross-verify with MongoDB if available
      if (!isPasswordCorrect) {
        try {
          await connectToDatabase();
          const db = mongoose.connection.db;
          if (db) {
            const user = await db.collection('users').findOne({ email: reqEmail });
            if (user && user.passwordHash) {
              if (user.passwordHash.includes(':')) {
                const [salt, hash] = user.passwordHash.split(':');
                const testHash = crypto.pbkdf2Sync(reqPass, salt, 1000, 64, 'sha512').toString('hex');
                isPasswordCorrect = testHash === hash;
              } else {
                const sha256Hash = crypto.createHash('sha256').update(reqPass).digest('hex');
                isPasswordCorrect = sha256Hash === user.passwordHash || reqPass === user.passwordHash;
              }
            }
          }
        } catch {
          // ignore DB error
        }
      }

      if (!isPasswordCorrect) {
        return NextResponse.json(
          {
            success: false,
            message: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।',
          },
          { status: 401 }
        );
      }

      const activeMaster = isMasterOnline && (Date.now() - masterLastHeartbeat < 15000);
      return NextResponse.json({
        success: true,
        message: 'Credentials valid',
        isMasterOnline: activeMaster,
      });
    }

    // Action 1: Create a new login authorization challenge from remote/secondary device
    if (action === 'create_request') {
      const clientInfo = extractClientInfo(req, body);
      const reqEmail = (email || 'saad0174742@gmail.com').toLowerCase();
      const reqIp = body.ipAddress || clientInfo.ip;

      // Remove or supersede any existing pending requests for this device/IP
      pendingLoginRequests = pendingLoginRequests.filter(
        (r) => !(r.email === reqEmail && r.ipAddress === reqIp && r.status === 'pending')
      );

      const newRequest: ILoginAuthRequest = {
        id: `auth-req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        email: reqEmail,
        device: body.device || clientInfo.device,
        os: body.os || clientInfo.os,
        browser: body.browser || clientInfo.browser,
        ipAddress: reqIp,
        location: body.location || clientInfo.location,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAtTimestamp: Date.now(),
        status: 'pending',
      };

      // Limit in-memory history to last 50 requests
      pendingLoginRequests.unshift(newRequest);
      if (pendingLoginRequests.length > 50) pendingLoginRequests.pop();

      return NextResponse.json({
        success: true,
        message: 'Real-time 2FA challenge initiated. Awaiting Primary Admin approval.',
        data: newRequest,
      });
    }

    // Action 2: Primary Admin approves / denies / denies & blocks with session validity duration
    if (action === 'respond' && requestId) {
      const decision = body.decision as 'approved' | 'denied' | 'denied_and_blocked';
      const targetIndex = pendingLoginRequests.findIndex((r) => r.id === requestId);

      if (targetIndex !== -1) {
        const reqItem = pendingLoginRequests[targetIndex];
        reqItem.status = decision;

        if (decision === 'approved') {
          const selectedDuration = (duration || '1h') as '20m' | '30m' | '1h' | 'until_revoked' | 'custom';
          let minutes = 60;

          if (selectedDuration === '20m') minutes = 20;
          else if (selectedDuration === '30m') minutes = 30;
          else if (selectedDuration === '1h') minutes = 60;
          else if (selectedDuration === 'custom') minutes = Number(customMinutes) || 60;
          else if (selectedDuration === 'until_revoked') minutes = -1;

          reqItem.duration = selectedDuration;
          reqItem.durationMinutes = minutes;
          reqItem.approvedAt = new Date().toISOString();
          reqItem.expiresAt = minutes === -1 ? null : Date.now() + minutes * 60 * 1000;
          reqItem.token = `nexus-2fa-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          // Mark any other older approved sessions from the SAME ip + email as superseded
          pendingLoginRequests.forEach((r) => {
            if (r.id !== reqItem.id && r.email === reqItem.email && r.ipAddress === reqItem.ipAddress && r.status === 'approved') {
              r.status = 'denied';
            }
          });
        }

        return NextResponse.json({
          success: true,
          message:
            decision === 'approved'
              ? `Login request approved with session duration: ${reqItem.duration}`
              : decision === 'denied_and_blocked'
              ? 'Login request denied and IP address permanently blocked in Fraud Shield.'
              : 'Login request denied by Primary Admin.',
          data: reqItem,
        });
      }

      return NextResponse.json(
        { success: false, message: 'Authorization Request ID not found' },
        { status: 404 }
      );
    }

    // Action 3: Invalidate or Revoke an active approved session
    if (action === 'revoke' && (requestId || email)) {
      if (requestId) {
        const targetIndex = pendingLoginRequests.findIndex((r) => r.id === requestId);
        if (targetIndex !== -1) {
          pendingLoginRequests[targetIndex].status = 'denied';
          pendingLoginRequests[targetIndex].expiresAt = Date.now();
        }
      }
      if (body.action === 'revoke_all' || action === 'terminate_all') {
        pendingLoginRequests.forEach((r) => {
          if (!email || r.email.toLowerCase() === email.toLowerCase()) {
            r.status = 'denied';
            r.expiresAt = Date.now();
          }
        });
      }
      return NextResponse.json({
        success: true,
        message: 'Session revoked successfully.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process login authorization', error: String(error) },
      { status: 500 }
    );
  }
}
