"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createAutumnCheckout } from '@/lib/autumn-utils';
import { useSession } from '@/lib/auth-client';

export default function TestCheckoutPage() {
  const { data: session, isPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleTestCheckout = async (planId: string) => {
    if (!session?.user) {
      setError('Please sign in first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Testing checkout for plan:', planId);
      console.log('User:', session.user);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          planId: planId,
          companyName: 'Test Company',
          employeeCount: '1-10',
          metadata: {
            source: 'test_page',
            test: true,
          },
        }),
      });

      const result = await response.json();
      console.log('Checkout result:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      if (result.type === 'checkout' && result.checkoutUrl) {
        console.log('Redirecting to:', result.checkoutUrl);
        window.location.href = result.checkoutUrl;
      } else {
        setError(`Unexpected response: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error('Checkout test error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Autumn Checkout</h1>

      {/* Authentication Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          {session?.user ? (
            <div className="space-y-2">
              <p className="text-green-600">✅ Authenticated</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Name:</strong> {session.user.name || 'Not set'}</p>
              <p><strong>User ID:</strong> {session.user.id}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-red-600">❌ Not authenticated</p>
              <p>Please sign in first:</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/auth/login'}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/auth/signup'}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Checkout Buttons */}
      {session?.user && (
        <Card>
          <CardHeader>
            <CardTitle>Test Checkout Plans</CardTitle>
            <CardDescription>
              Test the Autumn checkout integration with different plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleTestCheckout('starter')}
                disabled={isLoading}
                variant="outline"
              >
                Test Starter Plan
              </Button>
              <Button
                onClick={() => handleTestCheckout('professional')}
                disabled={isLoading}
                variant="default"
              >
                Test Professional Plan
              </Button>
              <Button
                onClick={() => handleTestCheckout('enterprise')}
                disabled={isLoading}
                variant="outline"
              >
                Test Enterprise Plan
              </Button>
            </div>

            {error && (
              <Alert className="border-destructive/50 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <Alert>
                <AlertDescription>Creating checkout session...</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Environment Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <p><strong>Auth URL:</strong> {process.env.NEXT_PUBLIC_AUTH_URL || 'Not set'}</p>
            <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
