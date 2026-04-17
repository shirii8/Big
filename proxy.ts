import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ["/checkout", "/orders"];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Check Kinde session
    const { isAuthenticated } = getKindeServerSession();
    const authed = await isAuthenticated();

    if (!authed) {
      // Redirect to Kinde login, then back to the original page
      return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

// Next.js 16 uses 'proxy' as the entry point, but also export as middleware
// for backward compatibility
export default async function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
