import { validateEmail, validatePassword, validateForm } from '../validation'

describe('Email Validation', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
        'test.email@subdomain.example.com',
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
        'test@',
        'test@.com',
        'test..test@example.com',
        'test@example..com',
      ]

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false)
      })
    })

    it('should handle edge cases', () => {
      expect(validateEmail('a@b.co')).toBe(true) // minimal valid email
      expect(validateEmail('test@example.com.')).toBe(false) // trailing dot
      expect(validateEmail('.test@example.com')).toBe(false) // leading dot
    })
  })
})

describe('Password Validation', () => {
  describe('validatePassword', () => {
    it('should return true for passwords meeting all requirements', () => {
      const validPasswords = [
        'Password123!',
        'MyP@ssw0rd',
        'Str0ng#P@ss',
        'C0mpl3x!P@ss',
        'S3cur3#P@ssw0rd',
      ]

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true)
      })
    })

    it('should return false for passwords missing requirements', () => {
      const invalidPasswords = [
        '', // empty
        'short', // too short
        'password', // missing uppercase, number, special char
        'PASSWORD', // missing lowercase, number, special char
        'Password', // missing number, special char
        'Password1', // missing special char
        'password1!', // missing uppercase
        'PASSWORD1!', // missing lowercase
        'Password!', // missing number
      ]

      invalidPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false)
      })
    })

    it('should handle special characters and unicode', () => {
      expect(validatePassword('P@ssw0rd')).toBe(true) // special characters
      expect(validatePassword('Pássw0rd!')).toBe(true) // unicode characters
      expect(validatePassword('🔒🔑🔐🗝️🔓🔒🔑🔐')).toBe(false) // emojis but missing requirements
    })
  })
})

describe('Form Validation', () => {
  describe('validateForm', () => {
    it('should return no errors for valid form data', () => {
      const formData = {
        email: 'test@example.com',
        password: 'Password123!',
      }

      const errors = validateForm(formData)
      expect(errors).toEqual({})
    })

    it('should return email error for invalid email', () => {
      const formData = {
        email: 'invalid-email',
        password: 'Password123!',
      }

      const errors = validateForm(formData)
      expect(errors.email).toBe('Please enter a valid email address')
      expect(errors.password).toBeUndefined()
    })

    it('should return password error for invalid password', () => {
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

    it('should return specific password requirement errors', () => {
      const formData = {
        email: 'test@example.com',
        password: 'password', // missing uppercase, number, special char
      }

      const errors = validateForm(formData)
      expect(errors.password).toBe('Password must contain at least one uppercase letter')
      expect(errors.email).toBeUndefined()
    })
  })
})