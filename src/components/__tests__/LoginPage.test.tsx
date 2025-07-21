import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../LoginPage'
import { authService } from '../../services/authService'

// Mock the auth service
jest.mock('../../services/authService')
const mockAuthService = authService as jest.Mocked<typeof authService>

// Mock the validation utilities
jest.mock('../../utils/validation', () => ({
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
  validateForm: jest.fn(),
}))

import { validateEmail, validatePassword, validateForm } from '../../utils/validation'
const mockValidateEmail = validateEmail as jest.MockedFunction<typeof validateEmail>
const mockValidatePassword = validatePassword as jest.MockedFunction<typeof validatePassword>
const mockValidateForm = validateForm as jest.MockedFunction<typeof validateForm>

describe('LoginPage Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateEmail.mockReturnValue(true)
    mockValidatePassword.mockReturnValue(true)
    mockValidateForm.mockReturnValue({})
  })

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      render(<LoginPage />)

      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /facebook/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument()
    })

    it('should render with custom props', () => {
      const customProps = {
        heading: 'Custom Login',
        buttonText: 'Sign In',
        googleText: 'Login with Google',
      }

      render(<LoginPage {...customProps} />)

      expect(screen.getByRole('heading', { name: /custom login/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login with google/i })).toBeInTheDocument()
    })

    it('should render logo with correct attributes', () => {
      const customLogo = {
        url: 'https://example.com',
        src: 'https://example.com/logo.png',
        alt: 'Custom Logo',
        title: 'Custom Title',
      }

      render(<LoginPage logo={customLogo} />)

      const logoLink = screen.getByRole('link')
      const logoImage = screen.getByRole('img', { name: /custom logo/i })

      expect(logoLink).toHaveAttribute('href', 'https://example.com')
      expect(logoImage).toHaveAttribute('src', 'https://example.com/logo.png')
      expect(logoImage).toHaveAttribute('title', 'Custom Title')
    })
  })

  describe('Form Input Handling', () => {
    it('should update email field when user types', async () => {
      render(<LoginPage />)
      const emailInput = screen.getByLabelText(/email/i)

      await user.type(emailInput, 'test@example.com')

      expect(emailInput).toHaveValue('test@example.com')
    })

    it('should update password field when user types', async () => {
      render(<LoginPage />)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(passwordInput, 'password123')

      expect(passwordInput).toHaveValue('password123')
    })

    it('should clear field errors when user starts typing', async () => {
      mockValidateForm.mockReturnValue({ email: 'Invalid email' })
      
      render(<LoginPage />)
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      // Trigger validation error
      await user.click(submitButton)
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()

      // Clear error by typing
      mockValidateForm.mockReturnValue({})
      await user.type(emailInput, 'test@example.com')

      await waitFor(() => {
        expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    it('should show validation errors for invalid form', async () => {
      mockValidateForm.mockReturnValue({
        email: 'Please enter a valid email address',
        password: 'Password must be at least 8 characters long',
      })

      render(<LoginPage />)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      await user.click(submitButton)

      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument()
    })

    it('should not submit form when validation fails', async () => {
      mockValidateForm.mockReturnValue({ email: 'Invalid email' })

      render(<LoginPage />)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      await user.click(submitButton)

      expect(mockAuthService.login).not.toHaveBeenCalled()
    })

    it('should show required field errors for empty fields', async () => {
      mockValidateForm.mockReturnValue({
        email: 'Email is required',
        password: 'Password is required',
      })

      render(<LoginPage />)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      await user.click(submitButton)

      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      mockAuthService.login.mockResolvedValueOnce({
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com' },
      })

      render(<LoginPage />)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('should show loading state during submission', async () => {
      mockAuthService.login.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      render(<LoginPage />)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })

    it('should handle login errors', async () => {
      mockAuthService.login.mockRejectedValueOnce(new Error('Invalid credentials'))

      render(<LoginPage />)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })

    it('should call custom onLogin handler when provided', async () => {
      const mockOnLogin = jest.fn().mockResolvedValueOnce(undefined)

      render(<LoginPage onLogin={mockOnLogin} />)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockAuthService.login).not.toHaveBeenCalled()
    })
  })

  describe('Social Login', () => {
    it('should handle Google login', async () => {
      mockAuthService.socialLogin.mockResolvedValueOnce({
        token: 'google-token',
        user: { id: 1, email: 'test@gmail.com', provider: 'google' },
      })

      render(<LoginPage />)
      const googleButton = screen.getByRole('button', { name: /google/i })

      await user.click(googleButton)

      expect(mockAuthService.socialLogin).toHaveBeenCalledWith('google')
    })

    it('should handle Facebook login', async () => {
      mockAuthService.socialLogin.mockResolvedValueOnce({
        token: 'facebook-token',
        user: { id: 2, email: 'test@facebook.com', provider: 'facebook' },
      })

      render(<LoginPage />)
      const facebookButton = screen.getByRole('button', { name: /facebook/i })

      await user.click(facebookButton)

      expect(mockAuthService.socialLogin).toHaveBeenCalledWith('facebook')
    })

    it('should handle GitHub login', async () => {
      mockAuthService.socialLogin.mockResolvedValueOnce({
        token: 'github-token',
        user: { id: 3, email: 'test@github.com', provider: 'github' },
      })

      render(<LoginPage />)
      const githubButton = screen.getByRole('button', { name: /github/i })

      await user.click(githubButton)

      expect(mockAuthService.socialLogin).toHaveBeenCalledWith('github')
    })

    it('should show loading state during social login', async () => {
      mockAuthService.socialLogin.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      render(<LoginPage />)
      const googleButton = screen.getByRole('button', { name: /google/i })

      await user.click(googleButton)

      expect(googleButton).toBeDisabled()
      expect(screen.getByRole('button', { name: /^login$/i })).toBeDisabled()
    })

    it('should handle social login errors', async () => {
      mockAuthService.socialLogin.mockRejectedValueOnce(new Error('Google login failed'))

      render(<LoginPage />)
      const googleButton = screen.getByRole('button', { name: /google/i })

      await user.click(googleButton)

      await waitFor(() => {
        expect(screen.getByText(/google login failed/i)).toBeInTheDocument()
      })
    })

    it('should call custom onSocialLogin handler when provided', async () => {
      const mockOnSocialLogin = jest.fn().mockResolvedValueOnce(undefined)

      render(<LoginPage onSocialLogin={mockOnSocialLogin} />)
      const googleButton = screen.getByRole('button', { name: /google/i })

      await user.click(googleButton)

      expect(mockOnSocialLogin).toHaveBeenCalledWith('google')
      expect(mockAuthService.socialLogin).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for form fields', () => {
      mockValidateForm.mockReturnValue({
        email: 'Invalid email',
        password: 'Password too short',
      })

      render(<LoginPage />)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      fireEvent.click(submitButton)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
      expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error')
    })

    it('should have proper role attributes for error messages', () => {
      mockValidateForm.mockReturnValue({ email: 'Invalid email' })

      render(<LoginPage />)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      fireEvent.click(submitButton)

      const errorMessage = screen.getByText(/invalid email/i)
      expect(errorMessage).toHaveAttribute('role', 'alert')
    })

    it('should be keyboard navigable', async () => {
      render(<LoginPage />)

      // Tab through form elements
      await user.tab()
      expect(screen.getByRole('link')).toHaveFocus() // Logo link

      await user.tab()
      expect(screen.getByLabelText(/email/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/password/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: /^login$/i })).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('should handle form submission with Enter key', async () => {
      mockAuthService.login.mockResolvedValueOnce({
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com' },
      })

      render(<LoginPage />)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.keyboard('{Enter}')

      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('should prevent multiple simultaneous submissions', async () => {
      mockAuthService.login.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      render(<LoginPage />)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      
      // Click multiple times rapidly
      await user.click(submitButton)
      await user.click(submitButton)
      await user.click(submitButton)

      // Should only be called once
      expect(mockAuthService.login).toHaveBeenCalledTimes(1)
    })

    it('should handle network errors gracefully', async () => {
      mockAuthService.login.mockRejectedValueOnce(new Error('Network error'))

      render(<LoginPage />)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^login$/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument()
      })

      // Form should be re-enabled after error
      expect(submitButton).not.toBeDisabled()
    })
  })
})