import { ZodError } from 'zod';
import { loginFormSchema, LoginFormData, LoginFormErrors } from './validationSchema';

// Re-export types for backward compatibility
export type FormData = LoginFormData;
export type FormErrors = LoginFormErrors;

/**
 * Validates email format using Zod schema
 * @param email - Email string to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  try {
    loginFormSchema.shape.email.parse(email);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates password meets all requirements using Zod schema
 * @param password - Password string to validate
 * @returns boolean indicating if password is valid
 */
export const validatePassword = (password: string): boolean => {
  try {
    loginFormSchema.shape.password.parse(password);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates entire form and returns error object
 * @param formData - Form data to validate
 * @returns Object containing validation errors
 */
export const validateForm = (formData: FormData): FormErrors => {
  try {
    loginFormSchema.parse(formData);
    return {};
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: FormErrors = {};
      
      error.issues.forEach((err) => {
        if (err.path[0] === 'email' && !errors.email) {
          errors.email = err.message;
        } else if (err.path[0] === 'password' && !errors.password) {
          errors.password = err.message;
        }
      });
      
      return errors;
    }
    
    return { general: 'Validation failed' };
  }
};