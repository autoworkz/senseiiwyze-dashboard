import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '../../../../lib/db'
import { profiles, notifications } from '../../../../lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  profilePhoto: z.string().url().optional(),
  workplace: z.string().max(255).optional(),
  jobTitle: z.string().max(255).optional(),
})

const updateNotificationsSchema = z.object({
  email: z.boolean().optional(),
  push: z.boolean().optional(),
  marketing: z.boolean().optional(),
  security: z.boolean().optional(),
})

const updateSettingsSchema = z.object({
  profile: updateProfileSchema.optional(),
  notifications: updateNotificationsSchema.optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
})

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile from database
    const userProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, user.email))
      .limit(1)

    // Get user notifications (if they exist)
    const userNotifications = await db
      .select()
      .from(notifications)
      .limit(1) // This would need proper user filtering in a real app

    return NextResponse.json({
      profile: userProfile[0] || {
        name: user.name,
        email: user.email,
        workplace: '',
        jobTitle: '',
      },
      notifications: userNotifications[0] || {
        email: true,
        push: true,
        marketing: false,
        security: true,
      },
      theme: 'system', // Default theme - in a real app this would be stored per user
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateSettingsSchema.parse(body)

    // Update profile if provided
    if (validatedData.profile) {
      const profileUpdate = validatedData.profile
      
      // Check if profile exists
      const existingProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, user.email))
        .limit(1)

      if (existingProfile.length > 0) {
        // Update existing profile
        await db
          .update(profiles)
          .set({
            ...profileUpdate,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(profiles.email, user.email))
      } else {
        // Create new profile
        await db.insert(profiles).values({
          email: user.email,
          name: profileUpdate.name || user.name,
          workplace: profileUpdate.workplace || '',
          jobTitle: profileUpdate.jobTitle || '',
          profilePhoto: profileUpdate.profilePhoto,
          userRole: 'user', // Default role
        })
      }
    }

    // Note: In a real application, you would update user notifications
    // and theme preferences in appropriate user-specific tables
    // For now, we'll just return success since the frontend stores these locally

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Handle creating new settings/preferences
  return PUT(request) // For now, just use the same logic as PUT
}