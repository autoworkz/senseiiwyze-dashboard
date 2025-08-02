'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers()
    })
    
    // Better Auth returns user object on success, or throws on error
    if (result) {
      redirect('/app')
    }
  } catch (error) {
    return { error: 'Authentication failed' }
  }
}

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers()
    })
    
    if (result) {
      redirect('/app')
    }
  } catch (error) {
    return { error: 'Registration failed' }
  }
}

export async function logoutAction() {
  try {
    await auth.api.signOut({
      headers: await headers()
    })
    redirect('/auth/login')
  } catch (error) {
    return { error: 'Logout failed' }
  }
}