import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SocialLogin } from '@/components/auth/social-login'
import { authClient } from '@/lib/auth-client'

// Mock the auth client
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      social: jest.fn()
    }
  }
}))

describe('SocialLogin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render GitHub and Google login buttons', () => {
    render(<SocialLogin />)
    
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument()
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  it('should not render Discord login button', () => {
    render(<SocialLogin />)
    
    expect(screen.queryByText('Continue with Discord')).not.toBeInTheDocument()
  })

  it('should call Better Auth social login for GitHub', async () => {
    render(<SocialLogin />)
    
    const githubButton = screen.getByText('Continue with GitHub')
    fireEvent.click(githubButton)

    await waitFor(() => {
      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider: 'github',
        callbackURL: '/dashboard'
      })
    })
  })

  it('should call Better Auth social login for Google', async () => {
    render(<SocialLogin />)
    
    const googleButton = screen.getByText('Continue with Google')
    fireEvent.click(googleButton)

    await waitFor(() => {
      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider: 'google',
        callbackURL: '/dashboard'
      })
    })
  })

  it('should use custom callback URL when provided', async () => {
    render(<SocialLogin callbackURL="/custom-dashboard" />)
    
    const githubButton = screen.getByText('Continue with GitHub')
    fireEvent.click(githubButton)

    await waitFor(() => {
      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider: 'github',
        callbackURL: '/custom-dashboard'
      })
    })
  })

  it('should show loading state during sign in', async () => {
    // Mock a successful OAuth flow (which would redirect)
    (authClient.signIn.social as jest.Mock).mockImplementation(() => 
      new Promise(() => {
        // This promise never resolves because OAuth redirects the page
      })
    )

    render(<SocialLogin />)
    
    const githubButton = screen.getByText('Continue with GitHub')
    fireEvent.click(githubButton)

    // Should show loading state
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
    expect(screen.queryByText('Continue with GitHub')).not.toBeInTheDocument()
    expect(screen.getByText('Continue with Google')).toBeDisabled()
    
    // In a real OAuth flow, the page would redirect, so loading state persists
  })

  it('should handle OAuth errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(authClient.signIn.social as jest.Mock).mockRejectedValue(new Error('OAuth failed'))

    render(<SocialLogin />)
    
    const githubButton = screen.getByText('Continue with GitHub')
    fireEvent.click(githubButton)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('github login failed:', expect.any(Error))
      expect(screen.getByText('Continue with GitHub')).toBeInTheDocument()
      expect(screen.getByText('Continue with Google')).not.toBeDisabled()
    })

    consoleError.mockRestore()
  })

  it('should apply custom className when provided', () => {
    const { container } = render(<SocialLogin className="custom-class" />)
    
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })

  it('should disable all buttons when one provider is loading', async () => {
    (authClient.signIn.social as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<SocialLogin />)
    
    const githubButton = screen.getByText('Continue with GitHub')
    const googleButton = screen.getByText('Continue with Google')
    
    fireEvent.click(githubButton)

    // Both buttons should be disabled during loading
    expect(githubButton.closest('button')).toBeDisabled()
    expect(googleButton.closest('button')).toBeDisabled()
  })
})