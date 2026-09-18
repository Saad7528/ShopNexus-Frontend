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
}

// In-memory queue of pending login authorization requests
let pendingLoginRequests: ILoginAuthRequest[] = [
  {
    id: 'req-remote-1',
    email: 'admin@shopnexus.io',
    device: 'Dell XPS 15 (Windows Laptop)',
    os: 'Windows 11 Pro 64-bit',
    browser: 'Microsoft Edge 126.0',
    ipAddress: '45.112.58.10',
    location: 'Chittagong, Bangladesh',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'pending',
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const filtered = email
      ? pendingLoginRequests.filter((r) => r.email.toLowerCase() === email.toLowerCase())
      : pendingLoginRequests;

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
    const { action, requestId, email, device, os, browser, ipAddress, location } = body;

    // Action 1: Create a new login authorization challenge
    if (action === 'create_request') {
      const newRequest: ILoginAuthRequest = {
        id: `req-${Date.now()}`,
        email: email || 'admin@shopnexus.io',
        device: device || 'Windows PC (Chrome)',
        os: os || 'Windows 11',
        browser: browser || 'Google Chrome 128',
        ipAddress: ipAddress || '45.112.58.10',
        location: location || 'Chittagong, Bangladesh',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
      };

      pendingLoginRequests.unshift(newRequest);

      return NextResponse.json({
        success: true,
        message: 'Login authorization request dispatched to primary active device.',
        data: newRequest,
      });
    }

    // Action 2: Approve / Deny / Deny & Block
    if (action === 'respond' && requestId) {
      const decision = body.decision as 'approved' | 'denied' | 'denied_and_blocked';
      const targetIndex = pendingLoginRequests.findIndex((r) => r.id === requestId);

      if (targetIndex !== -1) {
        pendingLoginRequests[targetIndex].status = decision;
        const resolved = pendingLoginRequests[targetIndex];

        return NextResponse.json({
          success: true,
          message:
            decision === 'approved'
              ? 'Login request approved. Remote session initialized.'
              : decision === 'denied_and_blocked'
              ? 'Login request denied and IP address permanently blocked in Fraud Shield.'
              : 'Login request denied.',
          data: resolved,
        });
      }

      return NextResponse.json(
        { success: false, message: 'Request ID not found' },
        { status: 404 }
      );
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
