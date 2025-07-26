import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Email must be in a valid format'
  );

// Password validation schema with comprehensive requirements
export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    'Password must contain at least one special character'
  );

// Login form schema
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Signup form schema
export const signupFormSchema = loginFormSchema.extend({
  name: z.string().min(1, 'Name is required'),
});

// Export types
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type LoginFormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

// https://everythingfits.notion.site/23827d855fa28035aec0fdf1c3a6c850?v=23827d855fa280a5a50d000c2c30cc80&source=copy_link