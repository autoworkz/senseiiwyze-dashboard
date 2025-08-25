"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, ArrowRight, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function OnboardingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [error, setError] = useState<string>('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setIsVerifying(false);
      return;
    }

    // Verify the payment session
    const verifyPayment = async () => {
      try {
        // Give a brief delay to ensure webhook processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const result = await response.json();

        if (response.ok && result.verified) {
          setVerificationComplete(true);
        } else {
          setError(result.error || 'Payment verification failed');
        }
      } catch (err) {
        setError('Failed to verify payment');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Verifying your payment...</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your subscription.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild>
                <Link href="/onboarding">Try Again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome to SenseiiWyze! 🎉</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your subscription has been activated successfully.
            </p>
          </motion.div>

          {/* Next Steps Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Import Your Team
                </CardTitle>
                <CardDescription>
                  Add your team members to get started with personalized learning paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-primary text-white hover:bg-primary/90">
                  <Link href="/onboarding?step=3">
                    Import Team Members
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Explore Dashboard
                </CardTitle>
                <CardDescription>
                  Start exploring your new dashboard and discover all the features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-custom-blue/5 border border-custom-blue/20 rounded-lg p-6"
          >
            <h3 className="font-semibold text-custom-blue mb-2">What happens next?</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✅ Your subscription is now active</p>
              <p>✅ You'll receive a confirmation email shortly</p>
              <p>✅ Access to all premium features is unlocked</p>
              <p>✅ Our support team is ready to help you get started</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
