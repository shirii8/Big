import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Initialize auth to use inside your proxy
const { auth } = NextAuth(authConfig);

export async function proxy(request: NextRequest) {
  // 1. Check if the user is authenticated within the proxy
  const session = await auth();
  const isLoggedIn = !!session;
  const { pathname } = request.nextUrl;

  // 2. Protect routes manually since we aren't using the default export
  const protectedRoutes = ["/checkout", "/orders", "/cart"];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. IMPORTANT: Ensure headers are passed so Next.js Link knows the auth state
  const response = NextResponse.next();
  return response;
}

// Next.js standard expects 'middleware' as the entry point 
// If your environment forces the name 'proxy', ensure your 
// engine is actually calling 'proxy'. 
// If it's a standard Next.js env, you MUST do this:
export default async function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};