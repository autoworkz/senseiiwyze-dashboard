"use client";

import React, { FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useLoginForm } from '@/hooks/useLoginForm';
import { authService, SocialProvider } from '@/services/authService';

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
  // Use custom hook for form state management
  const {
    formData,
    errors,
    isSubmitting,
    isLoading,
    updateField,
    setErrors,
    setIsSubmitting,
    setIsLoading,
    validateForm,
  } = useLoginForm();

  // Handle input field changes
  const handleInputChange = (field: 'email' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateField(field, event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Call the onLogin prop if provided, otherwise simulate login
      if (onLogin) {
        await onLogin(formData.email, formData.password);
      } else {
        // Use auth service for login
        const result = await authService.login(formData.email, formData.password);
        console.log('Login successful:', result);
        alert('Login successful! (This is a demo)');
      }
    } catch (error) {
      // Handle login errors
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle social login buttons
  const handleSocialLogin = async (provider: SocialProvider) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Call the onSocialLogin prop if provided, otherwise log to console
      if (onSocialLogin) {
        await onSocialLogin(provider);
      } else {
        // Use auth service for social login
        const result = await authService.socialLogin(provider);
        console.log(`${provider} login successful:`, result);
        alert(`${provider} login clicked! (This is a demo)`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${provider} login failed. Please try again.`;
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
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
            {errors.general && (
              <div className="w-full p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {errors.general}
              </div>
            )}

            {/* Email field */}
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`text-sm ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.email}
                onChange={handleInputChange('email')}
                disabled={isSubmitting || isLoading}
                required
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="text-sm text-red-600" role="alert">
                  {errors.email}
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
                className={`text-sm ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.password}
                onChange={handleInputChange('password')}
                disabled={isSubmitting || isLoading}
                required
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <span id="password-error" className="text-sm text-red-600" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Login button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
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
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
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
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
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
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
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