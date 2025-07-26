"use client";

import React, { FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSignupForm } from '@/hooks/useSignupForm';
import { authClient } from '@/auth-client';

interface SignupPageProps {
  heading?: string;
  buttonText?: string;
  loginText?: string;
  loginUrl?: string;
}

const SignupPage: React.FC<SignupPageProps> = ({
  heading = "Create an Account",
  buttonText = "Sign Up",
  loginText = "Already have an account?",
  loginUrl = "/auth/login",
}) => {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    setErrors,
    setIsSubmitting,
    validateForm,
  } = useSignupForm();

  const router = useRouter();

  const handleInputChange = (field: 'name' | 'email' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateField(field, event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const signupResult = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      console.log('Signup successful:', signupResult);
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-background h-screen">
      <div className="flex h-full items-center justify-center">
        <form 
          onSubmit={handleSubmit}
          className="min-w-sm flex w-full max-w-sm flex-col items-center gap-y-4 px-6 py-12"
          noValidate
        >
          <h1 className="text-2xl font-semibold text-center">{heading}</h1>

          {errors.general && (
            <div className="w-full p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className={`text-sm ${errors.name ? 'border-red-500' : ''}`}
              value={formData.name}
              onChange={handleInputChange('name')}
              disabled={isSubmitting}
              required
            />
            {errors.name && <span className="text-sm text-red-600">{errors.name}</span>}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`text-sm ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={isSubmitting}
              required
            />
            {errors.email && <span className="text-sm text-red-600">{errors.email}</span>}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`text-sm ${errors.password ? 'border-red-500' : ''}`}
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={isSubmitting}
              required
            />
            {errors.password && <span className="text-sm text-red-600">{errors.password}</span>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              buttonText
            )}
          </Button>

          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{loginText}</p>
            <a href={loginUrl} className="text-primary font-medium hover:underline">
              Login
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignupPage; 