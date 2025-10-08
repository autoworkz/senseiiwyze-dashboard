'use server'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function logoutAction() {
  await auth.api.signOut({ headers: await headers() })
  revalidatePath('/')
}

// Note: localStorage clearing is handled client-side in the logout components
// since server actions can't access localStorage
