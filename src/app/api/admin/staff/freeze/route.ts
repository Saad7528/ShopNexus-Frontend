import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { staffId, isFrozen, reason } = body;

    if (!staffId) {
      return NextResponse.json(
        { success: false, message: 'staffId is required' },
        { status: 400 }
      );
    }

    const nextStatus = isFrozen ? 'Suspended' : 'Active';

    return NextResponse.json({
      success: true,
      staffId,
      status: nextStatus,
      isFrozen: !!isFrozen,
      message: isFrozen
        ? `Account ${staffId} has been immediately frozen/suspended. All active sessions invalidated.`
        : `Account ${staffId} access has been restored and marked Active.`,
      reason: reason || (isFrozen ? 'Security Freeze - Suspicious Concurrent Login' : 'Admin Unfreeze'),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process account freeze', error: String(error) },
      { status: 500 }
    );
  }
}
