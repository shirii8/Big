// middleware.ts
export { auth as middleware } from "@/lib/auth"

export const config = {
  // Only protect these routes. Add more as needed.
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/api/cart/:path*",
    "/api/checkout/:path*",
  ],
}