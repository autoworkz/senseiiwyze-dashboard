"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { onboardingUtils } from '@/utils/onboarding';
import { useRouter } from 'next/navigation';

export function OnboardingHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear onboarding status from localStorage
    onboardingUtils.clearOnboardingStatus();
    
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/assets/images/logo.jpeg"
                alt="SenseiiWyze Logo"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <span className="font-semibold text-lg">SenseiiWyze</span>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Back to Home */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>

            {/* Logout */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
