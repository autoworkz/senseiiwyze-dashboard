"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle, XCircle, User } from "lucide-react";

export default function InviteMismatch() {
  const sp = useSearchParams();
  const invited = sp.get("invited") ?? "";
  const current = sp.get("current") ?? "";
  const invitationId = sp.get("invitationId") ?? "";
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>("");

  async function resend() {
    if (!invited || !invitationId) {
      setStatus('error');
      setMessage("Missing invitation details. Please try again.");
      return;
    }

    setStatus('loading');
    setMessage("Sending magic link...");

    try {
      const res = await fetch("/api/organization/accept-invite/resend-magic-link", {
        method: "POST",
        body: JSON.stringify({ 
          email: invited,
          invitationId: invitationId,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage("Magic link sent! Check your email and click the link to sign in.");
      } else {
        setStatus('error');
        setMessage(data.error || "Failed to send magic link. Please try again.");
      }
    } catch (error) {
      setStatus('error');
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Email Mismatch</CardTitle>
          <CardDescription>
            This invitation is for a different email address
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Invitation sent to:</span>
            </div>
            <p className="font-medium text-foreground">{invited}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Currently signed in as:</span>
            </div>
            <p className="font-medium text-foreground">{current || "Unknown"}</p>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              To accept this invitation, we can send a magic link to <strong>{invited}</strong> 
              that will automatically sign you in with the correct account.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={resend} 
            disabled={status === 'loading'}
            className="w-full"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Magic Link...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Magic Link to {invited}
              </>
            )}
          </Button>

          {status === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>The magic link will expire in 15 minutes for security.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
