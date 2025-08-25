import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // Get token from cookie or Authorization header
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Protected routes that require authentication
  const protectedPaths = [
    '/dashboard',
    '/brief/',
    '/analysis/',
    '/moodboard/',
    '/layout/',
    '/boq/',
    '/renders/',
    '/consultation',
    '/palette',
    '/materials'
  ]

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // If accessing protected route without token, redirect to home
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If token exists, verify it
  if (token) {
    const payload = verifyToken(token)
    
    // If token is invalid, clear it and redirect to home
    if (!payload) {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // Add user info to request headers for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('user-id', payload.userId)
      requestHeaders.set('user-email', payload.email)
      requestHeaders.set('user-role', payload.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}