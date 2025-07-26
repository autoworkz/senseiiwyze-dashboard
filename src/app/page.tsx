import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function LandingPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Role-based routing
  switch (user.role) {
    case 'learner':
      redirect('/me')
    case 'admin':
      redirect('/team')
    case 'executive':
      redirect('/org')
    default:
      redirect('/login')
  }
}
