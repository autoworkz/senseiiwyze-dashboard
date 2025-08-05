export interface User {
  id: string
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  readinessScore: number
  lastActive: string
  avatar?: string
}

export interface CurrentUser {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}
