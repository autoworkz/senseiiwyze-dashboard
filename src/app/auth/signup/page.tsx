'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod';
import { useState } from 'react';

import Logo from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { authClient } from '@/lib/auth-client';

const formSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  rememberMe: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  
  const router = useRouter();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use Better Auth to sign up
      const { data: _data, error: authError } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.fullName,
        callbackURL: '/dashboard',
      });

      if (authError) {
        throw new Error(authError.message || 'Failed to create account');
      }

      setSuccess('Account created successfully! Please check your email to verify your account.');

      // Redirect to login with verification notice
      setTimeout(() => {
        router.push('/auth/login?message=verify-email');
      }, 2000);

    } catch (error) {
      console.error('Signup error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      setLoadingProvider(provider);
      
      // Use Better Auth's signIn.social method
      await authClient.signIn.social({
        provider,
        callbackURL: '/dashboard',
      });
      
    } catch (error) {
      console.error(`${provider} signup failed:`, error);
      setLoadingProvider(null);
    }
  };

  return (
    <section className="container">
      <div className="border-x border-b p-12 md:p-20" />

      <div className="p-6 md:p-12 border-x">
        <div className="mx-auto max-w-3xl space-y-10">
          <div className="space-y-6">
            <Logo />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">
              Start your free trial
            </h1>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-10 space-y-6"
            >
              {/* Full Name Input */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nick@site.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must contain at least 8 characters with uppercase, lowercase, number, and special character.
                    </p>
                  </FormItem>
                )}
              />

              {/* Remember Me */}
              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="remember">Remember me</Label>
                    </div>
                  )}
                />
              </div>

              {/* Sign Up Button */}
              <Button type="submit" className="w-full rounded-sm" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create an account'}
              </Button>
            </form>
          </Form>

          {/* Social Logins */}
          <div className="flex flex-wrap gap-5">
            <Button
              variant="outline"
              className="flex-1 rounded-sm"
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={loadingProvider === 'github'}
            >
              <FaGithub className="size-5" />
              {loadingProvider === 'github' ? 'Connecting...' : 'Continue with Github'}
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-sm"
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={loadingProvider === 'google'}
            >
              <FcGoogle className="size-5" />
              {loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm font-medium">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-secondary hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
      <div className="border-x border-t p-12 md:p-20" />
    </section>
  );
}