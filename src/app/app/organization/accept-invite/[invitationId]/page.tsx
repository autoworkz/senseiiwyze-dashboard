"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Users } from "lucide-react";


export default function AcceptInvitePage({ params }: { params: { invitationId: string } }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { refreshUser } = useUser();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'preparing'>('preparing');
  const [message, setMessage] = useState("Preparing…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for session to resolve
    if (session === undefined) return;

    // Clear any pending invitation from localStorage since we're now on the accept page
    localStorage.removeItem('pendingInvitation');

    // If not logged in, we need to handle invitation acceptance differently
    // Since admin-manager users can't sign up, we need to create them automatically
    if (!session) {
      const acceptInvitationForNewUser = async () => {
        try {
          setStatus('loading');
          setMessage("Creating your account and accepting invitation…");

          // Accept invitation - this should create the user automatically with admin-manager role
          const { error } = await authClient.organization.acceptInvitation({
            invitationId: params.invitationId,
          });

          if (error) {
            throw new Error(error.message || "Failed to accept invitation");
          }

          // Refresh user data to get the newly created user
          await refreshUser();

          // Make the newly joined org active
          try {
            const { data: orgs } = await authClient.organization.list();
            if (orgs && orgs.length === 1) {
              await authClient.organization.setActive({ organizationId: orgs[0].id });
            }
          } catch (orgError) {
            console.warn("Could not set active organization:", orgError);
          }

          setStatus('success');
          setMessage("Welcome to the team! Your account has been created and you've joined the organization.");

          // Redirect after a short delay to show success message
          setTimeout(() => {
            router.replace("/app");
          }, 2000);

        } catch (e: any) {
          console.error("Invitation acceptance error:", e);
          setStatus('error');
          setError(e?.message || "This invitation is invalid or has expired.");
          setMessage("Failed to accept invitation");
        }
      };

      acceptInvitationForNewUser();
      return;
    }

    // Accept the invitation for existing user
    const acceptInvitation = async () => {
      try {
        setStatus('loading');
        setMessage("Accepting your invitation…");

        // Skip getting invitation details for now - just accept the invitation

        // Accept the invitation
        const { error } = await authClient.organization.acceptInvitation({
          invitationId: params.invitationId,
        });

        if (error) {
          throw new Error(error.message || "Failed to accept invitation");
        }

        // Refresh user data to get updated organization membership
        await refreshUser();

        // Make the newly joined org active (if it's the user's first org)
        try {
          const { data: orgs } = await authClient.organization.list();
          if (orgs && orgs.length === 1) {
            await authClient.organization.setActive({ organizationId: orgs[0].id });
          }
        } catch (orgError) {
          console.warn("Could not set active organization:", orgError);
        }

        setStatus('success');
        setMessage("Welcome to the team! You've successfully joined the organization.");

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.replace("/app");
        }, 2000);

      } catch (e: any) {
        console.error("Invitation acceptance error:", e);
        setStatus('error');
        setError(e?.message || "This invitation is invalid or has expired.");
        setMessage("Failed to accept invitation");
      }
    };

    acceptInvitation();
  }, [session, params.invitationId, router, refreshUser]);

  const handleRetry = () => {
    setStatus('preparing');
    setError(null);
    setMessage("Preparing…");
    // Trigger the effect again
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {status === 'loading' && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle className="w-8 h-8 text-green-600" />}
            {status === 'error' && <XCircle className="w-8 h-8 text-red-600" />}
            {status === 'preparing' && <Users className="w-8 h-8 text-primary" />}
          </div>
          <CardTitle>
            {status === 'success' ? 'Invitation Accepted!' : 
             status === 'error' ? 'Invitation Failed' : 
             'Organization Invitation'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You're now a member of the organization. Redirecting you to the dashboard...
              </AlertDescription>
            </Alert>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex gap-2">
              <Button onClick={handleRetry} className="flex-1">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push('/app')} className="flex-1">
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
