import { NextResponse } from 'next/server';

// Mock in-memory session registry (synced with MongoDB Atlas user telemetry)
let staffSessionsMap: Record<string, Array<{
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
}>> = {
  'st-0': [
    {
      id: 'sess-lead-1',
      device: 'MacBook Pro 16" (M3 Max)',
      os: 'macOS Sonoma 14.5',
      browser: 'Google Chrome 128.0',
      ipAddress: '103.145.74.22',
      location: 'Dhaka, Bangladesh',
      isCurrentSession: true,
      loginAt: '2026-09-18 09:30 AM',
      lastHeartbeat: 'Just now',
      riskScore: 'low',
    },
    {
      id: 'sess-lead-2',
      device: 'Dell XPS 15 (Windows 11)',
      os: 'Windows 11 Pro',
      browser: 'Microsoft Edge 126.0',
      ipAddress: '45.112.58.10',
      location: 'Chittagong, Bangladesh',
      isCurrentSession: false,
      loginAt: '2026-09-18 08:15 AM',
      lastHeartbeat: '12 mins ago',
      riskScore: 'high',
    },
  ],
  'st-1': [
    {
      id: 'sess-saad-1',
      device: 'Apple MacBook Pro',
      os: 'macOS 14.5',
      browser: 'Chrome 128',
      ipAddress: '103.145.74.22',
      location: 'Dhaka, Bangladesh',
      isCurrentSession: true,
      loginAt: '2026-09-18 10:00 AM',
      lastHeartbeat: 'Just now',
      riskScore: 'low',
    },
  ],
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');

    if (staffId && staffSessionsMap[staffId]) {
      return NextResponse.json({
        success: true,
        data: staffSessionsMap[staffId],
      });
    }

    return NextResponse.json({
      success: true,
      data: staffSessionsMap,
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
    const { action, staffId, sessionId } = body;

    if (!staffId) {
      return NextResponse.json(
        { success: false, message: 'staffId is required' },
        { status: 400 }
      );
    }

    if (action === 'revoke_session' && sessionId) {
      if (staffSessionsMap[staffId]) {
        staffSessionsMap[staffId] = staffSessionsMap[staffId].filter((s) => s.id !== sessionId);
      }
      return NextResponse.json({
        success: true,
        message: `Remote session ${sessionId} successfully revoked and logged out.`,
        remainingSessions: staffSessionsMap[staffId] || [],
      });
    }

    if (action === 'terminate_all_other') {
      if (staffSessionsMap[staffId]) {
        staffSessionsMap[staffId] = staffSessionsMap[staffId].filter((s) => s.isCurrentSession);
      }
      return NextResponse.json({
        success: true,
        message: 'All other remote sessions have been terminated immediately.',
        remainingSessions: staffSessionsMap[staffId] || [],
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
