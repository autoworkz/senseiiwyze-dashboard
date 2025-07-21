import { validateEmail, validatePassword, validateForm } from '../validation'

describe('Email Validation', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
      ]

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true)
      })
    })

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user@example',
        'user name@example.com',
      ]

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false)
      })
    })

    it('should handle edge cases', () => {
      expect(validateEmail('a@b.c')).toBe(true) // minimal valid email
      expect(validateEmail('test@example.com.')).toBe(false) // trailing dot
      expect(validateEmail('.test@example.com')).toBe(false) // leading dot
    })
  })
})

describe('Password Validation', () => {
  describe('validatePassword', () => {
    it('should return true for passwords with 8 or more characters', () => {
      const validPasswords = [
        'password',
        '12345678',
        'a'.repeat(8),
        'a'.repeat(100),
        'P@ssw0rd!',
      ]

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true)
      })
    })

    it('should return false for passwords with less than 8 characters', () => {
      const invalidPasswords = [
        '',
        '1234567',
        'a'.repeat(7),
        'short',
      ]

      invalidPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false)
      })
    })

    it('should handle special characters and unicode', () => {
      expect(validatePassword('pássw0rd')).toBe(true) // unicode characters
      expect(validatePassword('p@$$w0rd')).toBe(true) // special characters
      expect(validatePassword('🔒🔑🔐🗝️')).toBe(false) // emojis but too short
      expect(validatePassword('🔒🔑🔐🗝️🔓🔒🔑🔐')).toBe(true) // emojis and long enough
    })
  })
})

describe('Form Validation', () => {
  describe('validateForm', () => {
    it('should return no errors for valid form data', () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const errors = validateForm(formData)
      expect(errors).toEqual({})
    })

    it('should return email error for invalid email', () => {
      const formData = {
        email: 'invalid-email',
        password: 'password123',
      }

      const errors = validateForm(formData)
      expect(errors.email).toBe('Please enter a valid email address')
      expect(errors.password).toBeUndefined()
    })

    it('should return password error for short password', () => {
      const formData = {
        email: 'test@example.com',
        password: 'short',
      }

      const errors = validateForm(formData)
      expect(errors.password).toBe('Password must be at least 8 characters long')
      expect(errors.email).toBeUndefined()
    })

    it('should return both errors for invalid email and password', () => {
      const formData = {
        email: 'invalid-email',
        password: 'short',
      }

      const errors = validateForm(formData)
      expect(errors.email).toBe('Please enter a valid email address')
      expect(errors.password).toBe('Password must be at least 8 characters long')
    })

    it('should return required field errors for empty fields', () => {
      const formData = {
        email: '',
        password: '',
      }

      const errors = validateForm(formData)
      expect(errors.email).toBe('Email is required')
      expect(errors.password).toBe('Password is required')
    })

    it('should prioritize required field errors over format errors', () => {
      const formData = {
        email: '',
        password: '',
      }

      const errors = validateForm(formData)
      expect(errors.email).toBe('Email is required')
      expect(errors.password).toBe('Password is required')
    })
  })
})