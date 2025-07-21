'use client';

import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// TypeScript interfaces for component props and form data
interface LoginPageProps {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  googleText?: string;
  githubText?: string;
  facebookText?: string;
  signupText?: string;
  signupUrl?: string;
  onLogin?: (email: string, password: string) => Promise<void>;
  onSocialLogin?: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface FormState {
  data: FormData;
  errors: FormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({
  heading = "Login",
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg",
    alt: "logo",
    title: "shadcnblocks.com",
  },
  buttonText = "Login",
  facebookText = "Facebook",
  googleText = "Google",
  githubText = "GitHub",
  signupText = "Need an account?",
  signupUrl = "https://shadcnblocks.com",
  onLogin,
  onSocialLogin,
}) => {
  // State management for form data, errors, and loading states
  const [formState, setFormState] = useState<FormState>({
    data: {
      email: '',
      password: '',
    },
    errors: {},
    isLoading: false,
    isSubmitting: false,
  });

  // Email validation using regex pattern
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation - minimum 8 characters
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Form validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Email validation
    if (!formState.data.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formState.data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formState.data.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formState.data.password)) {
      errors.password = 'Password must be at least 8 characters long';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // Handle input field changes
  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
      // Clear field-specific error when user starts typing
      errors: {
        ...prev.errors,
        [field]: undefined,
        general: undefined,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, errors: {} }));

    try {
      // Call the onLogin prop if provided, otherwise simulate login
      if (onLogin) {
        await onLogin(formState.data.email, formState.data.password);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Login successful:', formState.data.email);
        alert('Login successful! (This is a demo)');
      }
    } catch (error) {
      // Handle login errors
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setFormState(prev => ({
        ...prev,
        errors: { general: errorMessage },
      }));
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle social login buttons
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setFormState(prev => ({ ...prev, isLoading: true, errors: {} }));

    try {
      // Call the onSocialLogin prop if provided, otherwise log to console
      if (onSocialLogin) {
        await onSocialLogin(provider);
      } else {
        // Simulate social login
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`${provider} login clicked`);
        alert(`${provider} login clicked! (This is a demo)`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${provider} login failed. Please try again.`;
      setFormState(prev => ({
        ...prev,
        errors: { general: errorMessage },
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <section className="bg-background h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <form 
            onSubmit={handleSubmit}
            className="min-w-sm flex w-full max-w-sm flex-col items-center gap-y-4 px-6 py-12"
            noValidate
          >
            {/* Logo */}
            <a href={logo.url} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
              <img
                src={logo.src}
                alt={logo.alt}
                title={logo.title}
                className="h-10 dark:invert"
              />
            </a>
            
            {/* Heading */}
            {heading && (
              <h1 className="text-2xl font-semibold text-center">
                {heading}
              </h1>
            )}

            {/* General error message */}
            {formState.errors.general && (
              <div className="w-full p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {formState.errors.general}
              </div>
            )}

            {/* Email field */}
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`text-sm ${formState.errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formState.data.email}
                onChange={handleInputChange('email')}
                disabled={formState.isSubmitting || formState.isLoading}
                required
                aria-describedby={formState.errors.email ? "email-error" : undefined}
              />
              {formState.errors.email && (
                <span id="email-error" className="text-sm text-red-600" role="alert">
                  {formState.errors.email}
                </span>
              )}
            </div>

            {/* Password field */}
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`text-sm ${formState.errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formState.data.password}
                onChange={handleInputChange('password')}
                disabled={formState.isSubmitting || formState.isLoading}
                required
                aria-describedby={formState.errors.password ? "password-error" : undefined}
              />
              {formState.errors.password && (
                <span id="password-error" className="text-sm text-red-600" role="alert">
                  {formState.errors.password}
                </span>
              )}
            </div>

            {/* Login button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={formState.isSubmitting || formState.isLoading}
            >
              {formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                buttonText
              )}
            </Button>

            {/* Social login buttons */}
            <div className="flex w-full flex-col gap-2">
              <Button 
                type="button" 
                className="w-full" 
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                disabled={formState.isSubmitting || formState.isLoading}
              >
                {formState.isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/google-icon.svg"
                    className="size-5"
                    alt="Google"
                  />
                )}
                {googleText}
              </Button>
              
              <Button 
                type="button" 
                className="w-full" 
                variant="outline"
                onClick={() => handleSocialLogin('facebook')}
                disabled={formState.isSubmitting || formState.isLoading}
              >
                {formState.isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/facebook-icon.svg"
                    className="size-5"
                    alt="Facebook"
                  />
                )}
                {facebookText}
              </Button>
              
              <Button 
                type="button" 
                className="w-full" 
                variant="outline"
                onClick={() => handleSocialLogin('github')}
                disabled={formState.isSubmitting || formState.isLoading}
              >
                {formState.isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/github-icon.svg"
                    className="size-5"
                    alt="GitHub"
                  />
                )}
                {githubText}
              </Button>
            </div>

            {/* Sign up link */}
            <div className="text-muted-foreground flex justify-center gap-1 text-sm">
              <p>{signupText}</p>
              <a
                href={signupUrl}
                className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;