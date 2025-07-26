import { createAuthClient } from "better-auth/react";
import type { Auth } from "./auth";

export const authClient = createAuthClient<Auth>({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
});

// Export hooks for React components
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;