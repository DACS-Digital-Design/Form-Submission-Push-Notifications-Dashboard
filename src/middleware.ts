import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(req: NextRequest) {
  const sortCookie = req.cookies.get('sort')
  const archivedCookie = req.cookies.get('archived')

  // Check if both cookies already exist
  if (!sortCookie || !archivedCookie) {
    const res = NextResponse.next()

    // Only set the cookies if they don't exist
    if (!sortCookie) {
      res.cookies.set('sort', 'newest', {
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
      })
    }
    if (!archivedCookie) {
      res.cookies.set('archived', 'false', {
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
      })
    }

    return res
  }

  // If both cookies exist, proceed without modifying the response
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/', '/notifications'],
}
