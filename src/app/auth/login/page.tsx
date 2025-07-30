'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod';
import { useState, Suspense } from 'react';

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
import { SearchParamsHandler } from '@/components/auth/search-params-handler';

const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  
  const router = useRouter();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleMessageParam = (messageParam: string) => {
    if (messageParam === 'verify-email') {
      setMessage('Please check your email and click the verification link to activate your account.');
    }
  };

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setError('');

    try {
      // Use Better Auth to sign in
      const { data: _data, error: authError } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/dashboard',
      });

      if (authError) {
        throw new Error(authError.message || 'Invalid credentials');
      }

      // If successful, redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Invalid credentials. Please try again.');
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
      console.error(`${provider} login failed:`, error);
      setLoadingProvider(null);
    }
  };

  return (
    <section className="container">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsHandler onMessageParam={handleMessageParam} />
      </Suspense>
      
      <div className="border-x border-b p-12 md:p-20" />

      <div className="p-6 md:p-12 border-x">
        <div className="mx-auto max-w-3xl space-y-10">
          <div className="space-y-6">
            <Logo />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">
              Log In to SenseiiWyze
            </h1>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-10 space-y-6"
            >
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
                  </FormItem>
                )}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
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
                <Link
                  href="/auth/forgot-password"
                  className="text-secondary text-sm font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full rounded-sm" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log in'}
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

          {/* Sign Up Link */}
          <div className="text-center text-sm font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-secondary hover:underline">
              Sign Up
            </Link>
          </div>

          {/* Demo login buttons for testing */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Demo Accounts (for testing):
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  form.setValue('email', 'learner@demo.com');
                  form.setValue('password', 'Demo@123456710');
                }}
              >
                👨‍🎓 Learner Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  form.setValue('email', 'admin@demo.com');
                  form.setValue('password', 'Demo@123456710');
                }}
              >
                👥 Admin Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  form.setValue('email', 'executive@demo.com');
                  form.setValue('password', 'Demo@123456710');
                }}
              >
                📊 Executive Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-x border-t p-12 md:p-20" />
    </section>
  );
}