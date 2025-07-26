import { cookies } from 'next/headers'
import { auth } from '../../lib/auth'

export async function getCurrentUser() {
  const cookieHeader = { cookie: cookies().toString() }
  const session = await auth.api.getSession({ headers: cookieHeader })
  return session?.user ?? null
}