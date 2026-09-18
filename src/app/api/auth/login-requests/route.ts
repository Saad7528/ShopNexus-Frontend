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

// In-memory fallback layer for local dev & instant cache
let pendingLoginRequests: ILoginAuthRequest[] = [];
let isMasterOnline: boolean = false;
let masterLastHeartbeat: number = 0;
let masterActiveEmail: string = 'saad0174742@gmail.com';

// Database helper
async function getMongoCollections() {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return null;
    return {
      requests: db.collection('login_requests'),
      presence: db.collection('admin_presences'),
      users: db.collection('users'),
    };
  } catch {
    return null;
  }
}

// Purge in-memory list
function purgeExpiredInMemoryRequests() {
  const now = Date.now();
  pendingLoginRequests = pendingLoginRequests.filter((r) => {
    if (r.status === 'approved') {
      return r.expiresAt === null || (r.expiresAt && r.expiresAt > now);
    }
    const ageMs = now - (r.createdAtTimestamp || 0);
    return ageMs <= 60000 && r.status === 'pending';
  });
}

// Helper to extract IP and dynamic location from request
async function extractClientInfoAsync(req: Request, body: Partial<ILoginAuthRequest>) {
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

  // 1. Check Vercel & Cloudflare Geo-IP Headers
  let detectedLocation = body.location;
  const vercelCity = headers.get('x-vercel-ip-city');
  const vercelCountry = headers.get('x-vercel-ip-country');
  const cfCity = headers.get('cf-ipcity');
  const cfCountry = headers.get('cf-ipcountry');

  const city = vercelCity || cfCity;
  const countryCode = vercelCountry || cfCountry;
  const countryName = countryCode === 'BD' ? 'Bangladesh' : countryCode || 'Bangladesh';

  if (!detectedLocation && city) {
    detectedLocation = `${decodeURIComponent(city)}, ${countryName}`;
  }

  // 2. Fast server-side GeoIP lookup fallback
  if (!detectedLocation) {
    try {
      if (detectedIp && !detectedIp.startsWith('127.') && !detectedIp.startsWith('192.168.') && detectedIp !== '::1') {
        const geoRes = await fetch(`http://ip-api.com/json/${detectedIp}?fields=status,city,regionName,country`, {
          signal: AbortSignal.timeout(1200),
        }).catch(() => null);

        if (geoRes && geoRes.ok) {
          const geoData = await geoRes.json().catch(() => null);
          if (geoData && geoData.status === 'success' && geoData.city) {
            detectedLocation = `${geoData.city}, ${geoData.country || 'Bangladesh'}`;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  if (!detectedLocation) {
    detectedLocation = 'Dhaka, Bangladesh';
  }

  return {
    ip: detectedIp,
    os: detectedOS,
    browser: detectedBrowser,
    device: detectedDevice,
    location: detectedLocation,
  };
}

export async function GET(req: Request) {
  try {
    purgeExpiredInMemoryRequests();
    const cols = await getMongoCollections();

    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('requestId');
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const checkMaster = searchParams.get('checkMaster');

    // 1. Instant Master Online Status Check (25s rolling window for network resilience)
    if (checkMaster === 'true') {
      let active = false;
      let targetEmail = masterActiveEmail;
      let lastHb = masterLastHeartbeat;

      if (cols) {
        const pres = await cols.presence.findOne({ email: masterActiveEmail });
        if (pres) {
          lastHb = pres.lastHeartbeat || 0;
          active = pres.isMasterOnline && (Date.now() - lastHb < 25000);
          targetEmail = pres.email || masterActiveEmail;
        }
      } else {
        active = isMasterOnline && (Date.now() - masterLastHeartbeat < 25000);
      }

      return NextResponse.json({
        success: true,
        isMasterOnline: active,
        masterEmail: targetEmail,
        lastHeartbeat: lastHb,
      });
    }

    // 2. Query single request by requestId
    if (requestId) {
      if (cols) {
        const found = (await cols.requests.findOne({ id: requestId })) as unknown as ILoginAuthRequest | null;
        if (found) {
          return NextResponse.json({ success: true, data: found });
        }
      }

      // Memory fallback
      const memFound = pendingLoginRequests.find((r) => r.id === requestId);
      if (memFound) {
        return NextResponse.json({ success: true, data: memFound });
      }

      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }

    // 3. Query list of requests (e.g. pending requests for primary admin)
    if (cols) {
      const now = Date.now();
      const query: Record<string, unknown> = {};

      if (status === 'pending') {
        query.status = 'pending';
        // Only return challenges created within the last 60 seconds
        query.createdAtTimestamp = { $gte: now - 60000 };
      } else if (status) {
        query.status = status;
      }

      if (email) {
        query.email = email.toLowerCase().trim();
      }

      const dbList = (await cols.requests.find(query).sort({ createdAtTimestamp: -1 }).limit(50).toArray()) as unknown as ILoginAuthRequest[];
      
      let isOnline = isMasterOnline && (Date.now() - masterLastHeartbeat < 25000);
      const pres = await cols.presence.findOne({ email: masterActiveEmail });
      if (pres) {
        isOnline = pres.isMasterOnline && (Date.now() - (pres.lastHeartbeat || 0) < 25000);
      }

      return NextResponse.json({
        success: true,
        data: dbList,
        isMasterOnline: isOnline,
      });
    }

    // In-memory fallback if MongoDB connection is pending
    let filtered = [...pendingLoginRequests];
    if (status) filtered = filtered.filter((r) => r.status === status);
    if (email) filtered = filtered.filter((r) => r.email.toLowerCase() === email.toLowerCase());

    return NextResponse.json({
      success: true,
      data: filtered,
      isMasterOnline: isMasterOnline && (Date.now() - masterLastHeartbeat < 25000),
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
    purgeExpiredInMemoryRequests();
    const cols = await getMongoCollections();

    const body = await req.json();
    const { action, requestId, email, password, duration, customMinutes } = body;

    // Action 0A: Master Live Heartbeat Ping (keeps master online across all serverless instances)
    if (action === 'master_heartbeat') {
      const targetEmail = (email || masterActiveEmail).toLowerCase().trim();
      isMasterOnline = true;
      masterLastHeartbeat = Date.now();
      masterActiveEmail = targetEmail;

      if (cols) {
        await cols.presence.updateOne(
          { email: targetEmail },
          { $set: { email: targetEmail, isMasterOnline: true, lastHeartbeat: Date.now(), updatedAt: new Date() } },
          { upsert: true }
        ).catch(() => null);
      }

      return NextResponse.json({ success: true, isMasterOnline: true });
    }

    // Action 0B: Master Instant Logout (0-second sync, immediately marks master offline everywhere)
    if (action === 'master_logout') {
      const targetEmail = (email || masterActiveEmail).toLowerCase().trim();
      isMasterOnline = false;
      masterLastHeartbeat = 0;

      if (cols) {
        await cols.presence.updateOne(
          { email: targetEmail },
          { $set: { isMasterOnline: false, lastHeartbeat: 0, updatedAt: new Date() } },
          { upsert: true }
        ).catch(() => null);
      }

      return NextResponse.json({ success: true, isMasterOnline: false });
    }

    // Action 0C: Master Registered via TOTP
    if (action === 'master_register') {
      const targetEmail = (email || masterActiveEmail).toLowerCase().trim();
      isMasterOnline = true;
      masterLastHeartbeat = Date.now();
      masterActiveEmail = targetEmail;

      if (cols) {
        await cols.presence.updateOne(
          { email: targetEmail },
          { $set: { email: targetEmail, isMasterOnline: true, lastHeartbeat: Date.now(), updatedAt: new Date() } },
          { upsert: true }
        ).catch(() => null);
      }

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
        'SAADNEXUS234567M',
        'Nexus@Admin2026!',
        'Admin@ShopNexus2026!',
        'saad752800',
        'admin123',
      ];

      let isPasswordCorrect = validPasswords.includes(reqPass);

      // 2. Cross-verify with MongoDB if available
      if (!isPasswordCorrect && cols) {
        try {
          const user = await cols.users.findOne({ email: reqEmail });
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

      let activeMaster = isMasterOnline && (Date.now() - masterLastHeartbeat < 25000);
      if (cols) {
        const pres = await cols.presence.findOne({ email: masterActiveEmail });
        if (pres) {
          activeMaster = pres.isMasterOnline && (Date.now() - (pres.lastHeartbeat || 0) < 25000);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Credentials valid',
        isMasterOnline: activeMaster,
      });
    }

    // Action 1: Create a new login authorization challenge from remote/secondary device
    if (action === 'create_request') {
      const clientInfo = await extractClientInfoAsync(req, body);
      const reqEmail = (email || 'saad0174742@gmail.com').toLowerCase().trim();
      const reqIp = body.ipAddress || clientInfo.ip;

      // Remove or supersede any existing pending requests for this device/IP in memory
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

      pendingLoginRequests.unshift(newRequest);
      if (pendingLoginRequests.length > 50) pendingLoginRequests.pop();

      // Persist directly in MongoDB collection
      if (cols) {
        await cols.requests.deleteMany({ email: reqEmail, ipAddress: reqIp, status: 'pending' }).catch(() => null);
        await cols.requests.insertOne({ ...newRequest }).catch(() => null);
      }

      return NextResponse.json({
        success: true,
        message: 'Real-time 2FA challenge initiated. Awaiting Primary Admin approval.',
        data: newRequest,
      });
    }

    // Action 2: Primary Admin approves / denies / denies & blocks with session validity duration
    if (action === 'respond' && requestId) {
      const decision = body.decision as 'approved' | 'denied' | 'denied_and_blocked';
      const selectedDuration = (duration || '1h') as '20m' | '30m' | '1h' | 'until_revoked' | 'custom';
      let minutes = 60;

      if (selectedDuration === '20m') minutes = 20;
      else if (selectedDuration === '30m') minutes = 30;
      else if (selectedDuration === '1h') minutes = 60;
      else if (selectedDuration === 'custom') minutes = Number(customMinutes) || 60;
      else if (selectedDuration === 'until_revoked') minutes = -1;

      const updateFields: Partial<ILoginAuthRequest> = {
        status: decision,
        duration: selectedDuration,
        durationMinutes: minutes,
        approvedAt: new Date().toISOString(),
        expiresAt: minutes === -1 ? null : Date.now() + minutes * 60 * 1000,
        token: `nexus-2fa-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // 1. Update in MongoDB
      if (cols) {
        await cols.requests.updateOne({ id: requestId }, { $set: updateFields }).catch(() => null);
      }

      // 2. Update in Memory
      const targetIndex = pendingLoginRequests.findIndex((r) => r.id === requestId);
      let resItem: ILoginAuthRequest | null = null;
      if (targetIndex !== -1) {
        pendingLoginRequests[targetIndex] = { ...pendingLoginRequests[targetIndex], ...updateFields };
        resItem = pendingLoginRequests[targetIndex];
      } else if (cols) {
        resItem = (await cols.requests.findOne({ id: requestId })) as unknown as ILoginAuthRequest | null;
      }

      return NextResponse.json({
        success: true,
        message:
          decision === 'approved'
            ? `Login request approved with session duration: ${selectedDuration}`
            : decision === 'denied_and_blocked'
            ? 'Login request denied and IP address permanently blocked in Fraud Shield.'
            : 'Login request denied by Primary Admin.',
        data: resItem || updateFields,
      });
    }

    // Action 3: Invalidate or Revoke an active approved session
    if (action === 'revoke' && (requestId || email)) {
      if (requestId) {
        if (cols) {
          await cols.requests.updateOne({ id: requestId }, { $set: { status: 'denied', expiresAt: Date.now() } }).catch(() => null);
        }
        const targetIndex = pendingLoginRequests.findIndex((r) => r.id === requestId);
        if (targetIndex !== -1) {
          pendingLoginRequests[targetIndex].status = 'denied';
          pendingLoginRequests[targetIndex].expiresAt = Date.now();
        }
      }
      if (body.action === 'revoke_all' || action === 'terminate_all') {
        const query = email ? { email: email.toLowerCase().trim() } : {};
        if (cols) {
          await cols.requests.updateMany(query, { $set: { status: 'denied', expiresAt: Date.now() } }).catch(() => null);
        }
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
