import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authkitProxy } from '@workos-inc/authkit-nextjs'

const workosConfigured = Boolean(process.env.WORKOS_CLIENT_ID && process.env.WORKOS_API_KEY)

const workosHandler = workosConfigured
  ? authkitProxy({
      middlewareAuth: {
        enabled: true,
        unauthenticatedPaths: ['/auth/callback'],
      },
    })
  : null

export default function proxy(request: NextRequest) {
  if (!workosHandler) {
    return NextResponse.next()
  }
  // authkitProxy returns a function matching Next.js proxy signature
  return (workosHandler as (req: NextRequest) => Promise<NextResponse>)(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
