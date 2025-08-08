import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export function withAuth<T extends (req: NextRequest, ctx: any) => Promise<NextResponse>>(handler: T) {
  return async (req: NextRequest, ctx: any) => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return handler(req, { ...ctx, session })
  }
}