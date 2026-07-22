import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/checkout', '/profile', '/cart']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (isProtected) {
    // Check for user in cookie (set after OTP verify)
    const userId = req.cookies.get('cloakyard-user-id')
    if (!userId) {
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/:path*', '/profile/:path*', '/cart/:path*'],
}
