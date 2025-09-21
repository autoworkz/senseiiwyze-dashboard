import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password: newPassword } = body

    if (!newPassword) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Validate password strength (same as signup)
    const passwordValidation = {
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    }

    const isPasswordValid = Object.values(passwordValidation).every(Boolean)
    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: 'Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character.',
        details: passwordValidation 
      }, { status: 400 })
    }

    // Use Better Auth's setPassword API - works because user is already authenticated via magic link
    await auth.api.setPassword({
      body: { newPassword },
      headers: await headers(), // carries the session from magic link
    })

    return NextResponse.json({
      success: true,
      message: 'Password created successfully',
    })

  } catch (error) {
    console.error('Set password error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to set password',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}
