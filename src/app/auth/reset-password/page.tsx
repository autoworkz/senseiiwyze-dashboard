'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, Suspense, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authClient, useSession } from '@/lib/auth-client';

const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number')
    .regex(/(?=.*[@$!%*?&])/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'email' | 'password'>('email');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { data: session, isPending } = useSession();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isPending && session?.user && !token) {
      router.push('/dashboard');
    }
  }, [session, isPending, router]);

  // If we have a token, go directly to password reset step
  useEffect(() => {
    console.log("token", token);
    if (token) {
      setStep('password');
    }
  }, [token]);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onEmailSubmit(values: EmailFormData) {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use Better Auth to send reset password email
      const { error: authError } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (authError) {
        throw new Error(authError.message || 'Failed to send reset email');
      }

      setSuccess('Password reset instructions have been sent to your email address.');
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(values: PasswordFormData) {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use Better Auth to reset password with token
      const { error: authError } = await authClient.resetPassword({
        token,
        newPassword: values.password,
      });

      if (authError) {
        throw new Error(authError.message || 'Failed to reset password');
      }

      setSuccess('Password has been successfully reset. You can now log in with your new password.');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login?message=password-reset-success');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading while checking authentication
  if (isPending) {
    return (
      <section className="bg-background h-screen">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <div className="min-w-sm flex w-full max-w-sm flex-col items-center gap-y-4 px-6 py-12">
            {/* Logo */}
            <a href="/">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                alt="SenseiiWyze Logo"
                title="SenseiiWyze"
                className="h-10 dark:invert"
              />
            </a>
            <h1 className="text-2xl font-semibold">
              {step === 'email' ? 'Reset Password' : 'Set New Password'}
            </h1>

            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="w-full">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {step === 'email' ? (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <Form {...emailForm}>
                  <form
                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                    className="w-full space-y-4"
                  >
                    <div className="flex w-full flex-col gap-2">
                      <Label>Email</Label>
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email address"
                                className="text-sm"
                                {...field}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Enter your new password below.
                </p>
                
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="w-full space-y-4"
                  >
                    <div className="flex w-full flex-col gap-2">
                      <Label>New Password</Label>
                      <FormField
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter new password"
                                className="text-sm"
                                {...field}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      <Label>Confirm Password</Label>
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm new password"
                                className="text-sm"
                                {...field}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Remember your password?</p>
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <section className="bg-background h-screen">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </section>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}