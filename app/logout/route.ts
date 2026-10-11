import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  for (const name of ['greenswap_session', 'greenswap_points', 'greenswap_activity', 'greenswap_settings']) {
    response.cookies.set(name, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  }
  return response;
}
