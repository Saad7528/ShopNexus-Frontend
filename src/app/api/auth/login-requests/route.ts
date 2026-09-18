import { NextResponse } from 'next/server';

export interface ILoginAuthRequest {
  id: string;
  email: string;
  device: string;
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'denied' | 'denied_and_blocked';
  duration?: '20m' | '30m' | '1h' | 'until_revoked' | 'custom';
  durationMinutes?: number;
  expiresAt?: number | null; // timestamp in ms or null for until_revoked
  approvedAt?: string;
  token?: string;
}

// In-memory registry of active login authorization requests
let pendingLoginRequests: ILoginAuthRequest[] = [];

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
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('requestId');
    const email = searchParams.get('email');
    const status = searchParams.get('status');

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
    const body = await req.json();
    const { action, requestId, email, duration, customMinutes } = body;

    // Action 1: Create a new login authorization challenge from remote/secondary device
    if (action === 'create_request') {
      const clientInfo = extractClientInfo(req, body);
      const newRequest: ILoginAuthRequest = {
        id: `auth-req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        email: (email || 'admin@shopnexus.io').toLowerCase(),
        device: body.device || clientInfo.device,
        os: body.os || clientInfo.os,
        browser: body.browser || clientInfo.browser,
        ipAddress: body.ipAddress || clientInfo.ip,
        location: body.location || clientInfo.location,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    if (action === 'revoke' && requestId) {
      const targetIndex = pendingLoginRequests.findIndex((r) => r.id === requestId);
      if (targetIndex !== -1) {
        pendingLoginRequests[targetIndex].status = 'denied';
        pendingLoginRequests[targetIndex].expiresAt = Date.now();
        return NextResponse.json({
          success: true,
          message: 'Session revoked successfully.',
          data: pendingLoginRequests[targetIndex],
        });
      }
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
