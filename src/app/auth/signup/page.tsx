'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { supabase } from '@/lib/supabase';
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
import { useProfileLink } from '@/hooks/useProfileLink';

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
});

type FormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { ensureProfileLinked, isLinking, error: profileLinkError } = useProfileLink();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isPending && session?.user) {
      router.push('/app');
    }
  }, [session, isPending, router]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data: _data, error: authError } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.fullName,
        callbackURL: '/app',
      });

      if (authError) {
        throw new Error(authError.message || 'Failed to create account');
      }

      if (_data?.user) {
        const dbUserRole = 'admin-executive';
        await ensureProfileLinked({
          userId: _data.user.id,
          email: values.email,
          name: values.fullName,
        });
      }

      setSuccess('Account created successfully! Please check your email to verify your account.');

      setTimeout(() => {
        router.push('/auth/login?message=verify-email');
      }, 1000);

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
      
      // Use Better Auth's signIn.social method for signup
      await authClient.signIn.social({
        provider,
        callbackURL: '/app',
      });
      
    } catch (error) {
      console.error(`${provider} signup failed:`, error);
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
            <h1 className="text-2xl font-semibold">Sign Up</h1>

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

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <div className="flex w-full flex-col gap-2">
                  <Label>Full Name</Label>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="John Doe"
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
                {/* <div className="flex w-full flex-col gap-2">
                  <Label>Role</Label>
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">👥 Admin (Executive)</SelectItem>
                              <SelectItem value="team">🛠️ Team Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
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
                        <p className="text-xs text-muted-foreground">
                          Must contain 8+ characters with uppercase, lowercase, number, and special character.
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </Form>

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
            <p>Already have an account?</p>
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
