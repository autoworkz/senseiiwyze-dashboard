import { createAuthClient } from "better-auth/client";
import { organizationClient, anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    plugins: [
        organizationClient(),
        anonymousClient()
    ]
});

// Export types for use throughout the app
export type AuthClient = typeof authClient;
export type Session = Awaited<ReturnType<typeof authClient.getSession>>;
export type User = NonNullable<Session>['user'];

// React hooks using the same client instance
export const useSignIn = () => authClient.signIn;
export const useSignUp = () => authClient.signUp;
export const useSignOut = () => authClient.signOut;
export const useSession = () => {
    // This would need to be implemented as a proper React hook
    // For now, return a simple wrapper
    return {
        data: null,
        isLoading: false,
        error: null
    };
};
