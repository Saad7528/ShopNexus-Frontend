import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protected paths requiring active authentication (Admin and Profile)
  // Note: /checkout is completely open for Guest Checkout without registration!
  const protectedPrefixes = ['/admin', '/profile'];
  const isProtectedPath = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};
