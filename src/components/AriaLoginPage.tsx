"use client";

import React, { FormEvent } from 'react';
import { AriaButton } from "@/components/ui/aria-button";
import { AriaInput } from "@/components/ui/aria-input";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useLoginForm } from '@/hooks/useLoginForm';
import { authService, SocialProvider } from '@/services/authService';
import { screenReaderUtils } from '@/lib/aria-utils';

// TypeScript interfaces for component props and form data
interface AriaLoginPageProps {
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

const AriaLoginPage: React.FC<AriaLoginPageProps> = ({
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

  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Announce validation errors to screen readers
      screenReaderUtils.announce("Please correct the errors in the form", "assertive");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Announce loading state
    screenReaderUtils.announce("Signing in...", "polite");

    try {
      // Call the onLogin prop if provided, otherwise use auth service
      if (onLogin) {
        await onLogin(formData.email, formData.password);
      } else {
        // Use auth service for login
        const result = await authService.login(formData.email, formData.password);
        console.log('Login successful:', result);
        
        // Announce success
        screenReaderUtils.announce("Login successful. Redirecting to dashboard...", "polite");
        
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      }
    } catch (error) {
      // Handle login errors
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setErrors({ general: errorMessage });
      
      // Announce error to screen readers
      screenReaderUtils.announce(`Login failed: ${errorMessage}`, "assertive");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle social login buttons
  const handleSocialLogin = async (provider: SocialProvider) => {
    setIsLoading(true);
    setErrors({});

    // Announce loading state
    screenReaderUtils.announce(`Signing in with ${provider}...`, "polite");

    try {
      // Call the onSocialLogin prop if provided, otherwise use auth service
      if (onSocialLogin) {
        await onSocialLogin(provider);
      } else {
        // Use auth service for social login
        const result = await authService.socialLogin(provider);
        console.log(`${provider} login successful:`, result);
        
        // Announce success
        screenReaderUtils.announce(`${provider} login successful. Redirecting to dashboard...`, "polite");
        
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${provider} login failed. Please try again.`;
      setErrors({ general: errorMessage });
      
      // Announce error to screen readers
      screenReaderUtils.announce(`${provider} login failed: ${errorMessage}`, "assertive");
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
            aria-label="Login form"
          >
            {/* Logo */}
            <a 
              href={logo.url} 
              className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              aria-label={`Go to ${logo.title || 'homepage'}`}
            >
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
              <div 
                className="w-full p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
                role="alert"
                aria-live="assertive"
              >
                {errors.general}
              </div>
            )}

            {/* Email field */}
            <AriaInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              isDisabled={isSubmitting || isLoading}
              isRequired
              error={errors.email}
              autoComplete="email"
              className="w-full"
            />

            {/* Password field */}
            <AriaInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => updateField('password', value)}
              isDisabled={isSubmitting || isLoading}
              isRequired
              error={errors.password}
              autoComplete="current-password"
              className="w-full"
            />

            {/* Login button */}
            <AriaButton 
              type="submit" 
              className="w-full" 
              isDisabled={isSubmitting || isLoading}
              isLoading={isSubmitting}
              loadingText="Signing in..."
              loadingIcon={<Loader2 className="h-4 w-4 animate-spin" />}
            >
              {buttonText}
            </AriaButton>

            {/* Divider */}
            <div className="flex w-full items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social login buttons */}
            <div className="flex w-full flex-col gap-2">
              <AriaButton 
                type="button" 
                className="w-full" 
                variant="outline"
                onPress={() => handleSocialLogin('google')}
                isDisabled={isSubmitting || isLoading}
                isLoading={isLoading}
                loadingText={`Signing in with ${googleText}...`}
                loadingIcon={<Loader2 className="size-5 animate-spin" />}
              >
                {!isLoading && (
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/google-icon.svg"
                    className="size-5"
                    alt=""
                    aria-hidden="true"
                  />
                )}
                Continue with {googleText}
              </AriaButton>
              
              <AriaButton 
                type="button" 
                className="w-full" 
                variant="outline"
                onPress={() => handleSocialLogin('facebook')}
                isDisabled={isSubmitting || isLoading}
                isLoading={isLoading}
                loadingText={`Signing in with ${facebookText}...`}
                loadingIcon={<Loader2 className="size-5 animate-spin" />}
              >
                {!isLoading && (
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/facebook-icon.svg"
                    className="size-5"
                    alt=""
                    aria-hidden="true"
                  />
                )}
                Continue with {facebookText}
              </AriaButton>
              
              <AriaButton 
                type="button" 
                className="w-full" 
                variant="outline"
                onPress={() => handleSocialLogin('github')}
                isDisabled={isSubmitting || isLoading}
                isLoading={isLoading}
                loadingText={`Signing in with ${githubText}...`}
                loadingIcon={<Loader2 className="size-5 animate-spin" />}
              >
                {!isLoading && (
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/github-icon.svg"
                    className="size-5"
                    alt=""
                    aria-hidden="true"
                  />
                )}
                Continue with {githubText}
              </AriaButton>
            </div>

            {/* Sign up link */}
            {signupText && signupUrl && (
              <p className="text-center text-sm text-muted-foreground">
                {signupText}{' '}
                <a 
                  href={signupUrl} 
                  className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                >
                  Sign up
                </a>
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default AriaLoginPage;

