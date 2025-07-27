import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

interface UpdateUserBody {
  role?: string | string[]
  password?: string
  banned?: boolean
  banReason?: string
  banExpiresIn?: number
}

/**
 * GET /api/auth/admin/users/[id] - Get user by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    
    // Use the admin helper to list users with filter
    // @ts-expect-error – admin helper provided by Better-Auth
    const users = await auth.admin(request).listUsers({
      filterField: 'id',
      filterValue: id,
      filterOperator: 'eq',
      limit: 1
    })
    
    if (!users || !users.users || users.users.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      )
    }
    
    return NextResponse.json({ user: users.users[0] })
  } catch (error: any) {
    const status = error?.status || 500
    return new NextResponse(
      JSON.stringify({ error: error?.message || 'Server error' }),
      { status }
    )
  }
}

/**
 * PATCH /api/auth/admin/users/[id] - Update user
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json() as UpdateUserBody
    
    // @ts-expect-error – admin helper provided by Better-Auth
    const adminHelper = auth.admin(request)
    
    // Handle role updates
    if (body.role !== undefined) {
      await adminHelper.setRole({
        userId: id,
        role: body.role
      })
    }
    
    // Handle password updates
    if (body.password) {
      await adminHelper.setUserPassword({
        userId: id,
        newPassword: body.password
      })
    }
    
    // Handle ban/unban
    if (body.banned !== undefined) {
      if (body.banned) {
        await adminHelper.banUser({
          userId: id,
          banReason: body.banReason || 'Banned by admin',
          banExpiresIn: body.banExpiresIn
        })
      } else {
        await adminHelper.unbanUser({
          userId: id
        })
      }
    }
    
    // Get updated user data
    const users = await adminHelper.listUsers({
      filterField: 'id',
      filterValue: id,
      filterOperator: 'eq',
      limit: 1
    })
    
    return NextResponse.json({ 
      message: 'User updated successfully',
      user: users.users?.[0] || null
    })
  } catch (error: any) {
    const status = error?.status || 500
    return new NextResponse(
      JSON.stringify({ error: error?.message || 'Server error' }),
      { status }
    )
  }
}

/**
 * DELETE /api/auth/admin/users/[id] - Delete user
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    
    // @ts-expect-error – admin helper provided by Better-Auth
    const result = await auth.admin(request).removeUser({
      userId: id
    })
    
    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedUser: result.deletedUser
    })
  } catch (error: any) {
    const status = error?.status || 500
    return new NextResponse(
      JSON.stringify({ error: error?.message || 'Server error' }),
      { status }
    )
  }
} 