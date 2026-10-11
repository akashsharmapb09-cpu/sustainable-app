import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'greenswap_session';

export function proxy(request: NextRequest) {
  if (request.cookies.get(SESSION_COOKIE)?.value === 'demo-session-v1') return NextResponse.next();
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ['/dashboard/:path*'] };
