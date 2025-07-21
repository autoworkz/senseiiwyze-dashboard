export interface FormData {
  email: string;
  password: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

/**
 * Validates email format using regex pattern
 * @param email - Email string to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password meets minimum length requirement
 * @param password - Password string to validate
 * @returns boolean indicating if password is valid
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Validates entire form and returns error object
 * @param formData - Form data to validate
 * @returns Object containing validation errors
 */
export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};
  
  // Email validation
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters long';
  }

  return errors;
};