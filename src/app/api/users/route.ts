import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET() {
  const session = await auth.api.getSession({
      headers: await headers()
    })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, name, email, user_role, created_at')

    if (error) {
      throw error
    }

    // Mocking some data that might not be in the profiles table yet
    const mockData = [
      { status: 'active', readinessScore: 92 },
      { status: 'active', readinessScore: 78 },
      { status: 'active', readinessScore: 85 },
      { status: 'inactive', readinessScore: 45 },
      { status: 'pending', readinessScore: 0 },
      { status: 'active', readinessScore: 67 },
    ]

    const formattedUsers = users.map((user, index) => ({
      id: user.id,
      name: user.name || 'No name provided',
      email: user.email,
      role: user.user_role || 'learner',
      status: mockData[index % mockData.length].status,
      readinessScore: mockData[index % mockData.length].readinessScore,
      lastActive: user.created_at ? new Date(user.created_at).toLocaleString() : 'Never',
      avatar: undefined, // avatar_url does not exist on profiles table
    }))

    return NextResponse.json(formattedUsers)
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
