import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiting map for edge/node middleware
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

function checkRateLimit(ip: string, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const current = rateLimitMap.get(ip);

  if (!current || now > current.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, reset: Math.ceil((now + windowMs) / 1000) };
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0, reset: Math.ceil(current.resetAt / 1000) };
  }

  current.count += 1;
  return { success: true, remaining: limit - current.count, reset: Math.ceil(current.resetAt / 1000) };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // 1. Force HTTPS in production
  const proto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host');
  if (process.env.NODE_ENV === 'production' && proto === 'http' && host && !host.includes('localhost')) {
    const httpsUrl = `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(httpsUrl, 301);
  }

  // 2. API Rate Limiting (100 req/min per IP)
  if (pathname.startsWith('/api/')) {
    const { success, remaining, reset } = checkRateLimit(ip, 100, 60000);
    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded. Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }
  }

  // 3. Move /admin check to middleware: if role != admin redirect /login
  if (pathname.startsWith('/admin')) {
    const roleCookie = request.cookies.get('user_role')?.value || request.cookies.get('sb-user-role')?.value;
    const authCookie = request.cookies.get('sb-access-token')?.value || 
                       request.cookies.get('supabase-auth-token')?.value ||
                       request.cookies.get('sb-refresh-token')?.value;

    const isAdmin = roleCookie === 'admin';

    if (!authCookie || !isAdmin) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  if (pathname.startsWith('/api/')) {
    response.headers.set('X-RateLimit-Limit', '100');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
