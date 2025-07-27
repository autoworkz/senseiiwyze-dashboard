// import { cookies } from 'next/headers'
// import { auth } from './auth-config'

// export interface User {
//   id: string
//   name: string
//   email: string
//   role: 'learner' | 'admin' | 'executive'
// }

// export async function getCurrentUser(): Promise<User | null> {
//   try {
//     const cookieStore = await cookies()
    
//     // Convert cookies to Headers object for Better Auth
//     const headers = new Headers()
//     cookieStore.getAll().forEach(cookie => {
//       headers.append('Cookie', `${cookie.name}=${cookie.value}`)
//     })
    
//     // Use Better Auth to get the current session
//     const session = await auth.api.getSession({
//       headers
//     })

//     if (!session?.user) {
//       return null
//     }

//     // For now, determine role based on email for demo purposes
//     // In a real app, you would store role in the user record
//     let role: 'learner' | 'admin' | 'executive' = 'learner'
//     if (session.user.email.includes('admin')) {
//       role = 'admin'
//     } else if (session.user.email.includes('executive')) {
//       role = 'executive'
//     }

//     return {
//       id: session.user.id,
//       name: session.user.name,
//       email: session.user.email,
//       role
//     }
//   } catch (error) {
//     console.error('Error getting current user:', error)
//     return null
//   }
// }

// export function getUserByEmail(email: string): User | null {
//   // This is kept for backward compatibility with tests
//   // In a real app, you would query the database
//   const mockUsers: Record<string, User> = {
//     'learner@demo.com': {
//       id: '1',
//       name: 'Alex Johnson',
//       email: 'learner@demo.com',
//       role: 'learner'
//     },
//     'admin@demo.com': {
//       id: '2',
//       name: 'Sarah Chen',
//       email: 'admin@demo.com',
//       role: 'admin'
//     },
//     'executive@demo.com': {
//       id: '3',
//       name: 'Michael Rodriguez',
//       email: 'executive@demo.com',
//       role: 'executive'
//     }
//   }
//   return mockUsers[email] || null
// }