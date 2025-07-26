import { signIn, signOut } from '@/lib/auth-client'

export type SocialProvider = 'google' | 'github' | 'facebook'

interface LoginResponse {
  token: string
  user?: { email: string }
}

class AuthService {
  /** Email + Password login. Better-Auth performs the redirect automatically. */
  async login(email: string, password: string): Promise<LoginResponse> {
    await signIn.emailAndPassword({ email, password, callbackURL: '/' })
    return { token: '', user: { email } }
  }

  /** Social OAuth login (GitHub / Google) */
  async socialLogin(provider: SocialProvider): Promise<void> {
    await signIn.social({ provider, callbackURL: '/' })
  }

  /** Destroy the session and return to the login page. */
  async logout(): Promise<void> {
    await signOut({ callbackURL: '/auth/login' })
  }

  isAuthenticated(): boolean {
    return document.cookie.includes('better-auth')
  }
}

export const authService = new AuthService()