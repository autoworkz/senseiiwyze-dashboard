"use client";

import { useSession, signIn, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Example component demonstrating better-auth client usage
 * This shows how to use the configured auth client in your components
 */
export function AuthExample() {
    const { data: session, isPending, error } = useSession();

    const handleEmailSignIn = async () => {
        try {
            await signIn.email({
                email: "user@example.com",
                password: "password123",
            });
        } catch (error) {
            console.error("Sign in failed:", error);
        }
    };

    const handleGitHubSignIn = async () => {
        try {
            await signIn.social({
                provider: "github",
                callbackURL: "/dashboard",
            });
        } catch (error) {
            console.error("GitHub sign in failed:", error);
        }
    };

    const handleMagicLinkSignIn = async () => {
        try {
            await signIn.magicLink({
                email: "user@example.com",
                callbackURL: "/dashboard",
            });
        } catch (error) {
            console.error("Magic link sign in failed:", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    if (isPending) {
        return (
            <Card className="w-96">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="text-muted-foreground">Loading...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-96">
                <CardContent className="p-6">
                    <div className="text-destructive">
                        Error: {error.message}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Better Auth Example</CardTitle>
                <CardDescription>
                    Demonstration of better-auth client usage
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {session ? (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-foreground">Session Details</h3>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">User ID:</span>
                                    <Badge variant="secondary">{session.user.id}</Badge>
                                </div>
                                {session.user?.email && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Email:</span>
                                        <span className="text-sm text-foreground">{session.user.email}</span>
                                    </div>
                                )}
                                {session.user?.name && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Name:</span>
                                        <span className="text-sm text-foreground">{session.user.name}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Session ID:</span>
                                    <Badge variant="outline" className="font-mono text-xs">
                                        {session.session.id.slice(0, 8)}...
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={handleSignOut}
                            variant="outline"
                            className="w-full"
                        >
                            Sign Out
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-foreground mb-3">Sign In Options</h3>
                        </div>

                        <Button
                            onClick={handleEmailSignIn}
                            variant="default"
                            className="w-full"
                        >
                            Sign In with Email
                        </Button>

                        <Button
                            onClick={handleGitHubSignIn}
                            variant="secondary"
                            className="w-full"
                        >
                            Sign In with GitHub
                        </Button>

                        <Button
                            onClick={handleMagicLinkSignIn}
                            variant="outline"
                            className="w-full"
                        >
                            Send Magic Link
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 