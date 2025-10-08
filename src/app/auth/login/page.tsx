'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, Suspense, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

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
import { supabase } from '@/lib/supabase';
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
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isPending && session?.user) {
      router.push('/app');
    }
  }, [session, isPending, router]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
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
      // Block mobile-only accounts (is_dashboard_user = false)
      const { data: userRow } = await (supabase as any)
        .from('ba_users')
        .select('is_dashboard_user')
        .eq('email', values.email)
        .maybeSingle();

      if (userRow && userRow.is_dashboard_user === false) {
        setError('Unauthorized');
        return;
      }
      // Use Better Auth to sign in with both client and server approach
      const { data: _data, error: authError } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/app',  // Updated to match our app structure
      });

      if (authError) {
        throw new Error(authError.message || 'Invalid credentials');
      }

      // If successful, redirect to app
      router.push('/app');
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
        callbackURL: '/app',
      });
      
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setLoadingProvider(null);
    }
  };

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
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsHandler onMessageParam={handleMessageParam} />
      </Suspense>
      
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
            <h1 className="text-2xl font-semibold">Login</h1>

            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="w-full">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <div className="flex w-full flex-col gap-2">
                  <Label>Email</Label>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email"
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
                  <Label>Password</Label>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
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
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </Form>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link
                href="/auth/reset-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* OAuth Options */}
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={loadingProvider === 'github'}
              >
                <FaGithub className="size-4" />
                {loadingProvider === 'github' ? 'Connecting...' : 'GitHub'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loadingProvider === 'google'}
              >
                <FcGoogle className="size-4" />
                {loadingProvider === 'google' ? 'Connecting...' : 'Google'}
              </Button>
            </div>
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Need an account?</p>
            <Link
              href="/auth/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}