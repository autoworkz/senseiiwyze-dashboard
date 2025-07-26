import { cookies } from 'next/headers'

export interface User {
  id: string
  name: string
  email: string
  role: 'learner' | 'admin' | 'executive'
}

// Mock user data for development
const mockUsers: Record<string, User> = {
  'learner@demo.com': {
    id: '1',
    name: 'Alex Johnson',
    email: 'learner@demo.com',
    role: 'learner'
  },
  'admin@demo.com': {
    id: '2',
    name: 'Sarah Chen',
    email: 'admin@demo.com',
    role: 'admin'
  },
  'executive@demo.com': {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'executive@demo.com',
    role: 'executive'
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return null
    }
    
    const userData = JSON.parse(userCookie.value)
    return userData as User
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export function getUserByEmail(email: string): User | null {
  return mockUsers[email] || null
}

export function validateCredentials(email: string, password: string): User | null {
  // Simple validation for demo purposes
  if (password === 'demo123' && mockUsers[email]) {
    return mockUsers[email]
  }
  return null
}
