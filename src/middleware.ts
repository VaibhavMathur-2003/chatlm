import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  
  const publicRoutes = ['/', '/auth/login', '/auth/register']
  const publicApiRoutes = ['/api/auth/login', '/api/auth/register']

  
  if (publicRoutes.includes(pathname) || publicApiRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
