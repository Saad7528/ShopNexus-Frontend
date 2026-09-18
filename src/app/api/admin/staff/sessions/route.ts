import { NextResponse } from 'next/server';

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

// In-memory telemetry map keyed by staffId and email
let staffSessionsMap: Record<string, IStaffSessionData[]> = {
  'st-0': [
    {
      id: 'sess-lead-1',
      device: 'MacBook Pro 16" (M3 Max)',
      os: 'macOS Sonoma 14.5',
      browser: 'Google Chrome 128.0',
      ipAddress: '103.145.74.22',
      location: 'Dhaka, Bangladesh',
      isCurrentSession: true,
      loginAt: 'Today, 09:30 AM',
      lastHeartbeat: 'Just now',
      riskScore: 'low',
      validUntil: 'Permanent (Primary Device)',
      expiresAt: null,
    },
  ],
  'admin@shopnexus.io': [
    {
      id: 'sess-lead-1',
      device: 'MacBook Pro 16" (M3 Max)',
      os: 'macOS Sonoma 14.5',
      browser: 'Google Chrome 128.0',
      ipAddress: '103.145.74.22',
      location: 'Dhaka, Bangladesh',
      isCurrentSession: true,
      loginAt: 'Today, 09:30 AM',
      lastHeartbeat: 'Just now',
      riskScore: 'low',
      validUntil: 'Permanent (Primary Device)',
      expiresAt: null,
    },
  ],
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');
    const email = searchParams.get('email')?.toLowerCase();

    // Check if there are active 2FA approved requests from /api/auth/login-requests
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    let approved2FARequests: any[] = [];

    try {
      const authRes = await fetch(`${protocol}://${host}/api/auth/login-requests`);
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.success && Array.isArray(authData.data)) {
          approved2FARequests = authData.data.filter(
            (r: any) =>
              r.status === 'approved' &&
              (r.expiresAt === null || Number(r.expiresAt) > Date.now())
          );
        }
      }
    } catch {
      // Ignore internal fetch error
    }

    // Build session list for requested staff
    const targetKey = staffId || email || 'st-0';
    let sessions = staffSessionsMap[targetKey] || staffSessionsMap[email || ''] || [
      {
        id: `sess-primary-${targetKey}`,
        device: 'MacBook Pro 16" (Primary Trusted Device)',
        os: 'macOS Sonoma 14.5',
        browser: 'Google Chrome 128.0',
        ipAddress: '103.145.74.22',
        location: 'Dhaka, Bangladesh',
        isCurrentSession: true,
        loginAt: 'Today, 09:30 AM',
        lastHeartbeat: 'Just now',
        riskScore: 'low',
        validUntil: 'Permanent (Primary Device)',
        expiresAt: null,
      },
    ];

    // Merge in real approved 2FA sessions (e.g. from incognito, secondary browser, mobile)
    const matchingApproved = approved2FARequests.filter((r) => {
      if (!email && !staffId) return true;
      if (email && r.email?.toLowerCase() === email) return true;
      return true;
    });

    const approvedSessionObjects: IStaffSessionData[] = matchingApproved.map((r) => {
      let durationStr = '1 Hour';
      if (r.duration === 'until_revoked') durationStr = 'Until Blocked';
      else if (r.duration === '20m') durationStr = '20 Mins';
      else if (r.duration === '30m') durationStr = '30 Mins';
      else if (r.duration === 'custom') durationStr = `${r.durationMinutes} Mins`;

      return {
        id: r.id,
        device: `${r.device || 'Secondary Device'} (2FA Authorized)`,
        os: r.os || 'Unknown OS',
        browser: r.browser || 'Unknown Browser',
        ipAddress: r.ipAddress || '45.112.58.10',
        location: r.location || 'Chittagong, Bangladesh',
        isCurrentSession: false,
        loginAt: r.timestamp || 'Just now',
        lastHeartbeat: 'Active now',
        riskScore: 'low',
        validUntil: durationStr,
        duration: r.duration,
        expiresAt: r.expiresAt !== undefined ? r.expiresAt : null,
      };
    });

    // Deduplicate sessions
    const existingIds = new Set(sessions.map((s) => s.id));
    for (const appSess of approvedSessionObjects) {
      if (!existingIds.has(appSess.id)) {
        sessions = [sessions[0], appSess, ...sessions.slice(1)];
        existingIds.add(appSess.id);
      }
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

    const targetKey = staffId || email || 'st-0';

    if (action === 'revoke_session' && sessionId) {
      // Also notify /api/auth/login-requests if this was an approved 2FA session
      const protocol = req.headers.get('x-forwarded-proto') || 'http';
      const host = req.headers.get('host') || 'localhost:3000';
      try {
        await fetch(`${protocol}://${host}/api/auth/login-requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'revoke', requestId: sessionId }),
        });
      } catch {
        // ignore
      }

      if (staffSessionsMap[targetKey]) {
        staffSessionsMap[targetKey] = staffSessionsMap[targetKey].filter((s) => s.id !== sessionId);
      }

      return NextResponse.json({
        success: true,
        message: `Remote session ${sessionId} successfully revoked and logged out.`,
      });
    }

    if (action === 'terminate_all_other') {
      if (staffSessionsMap[targetKey]) {
        staffSessionsMap[targetKey] = staffSessionsMap[targetKey].filter((s) => s.isCurrentSession);
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
