import {
  twoFactor,
  username,
  anonymous,
  magicLink,
  emailOTP,
  apiKey,
  admin,
  organization,
  multiSession,
  oAuthProxy,
  openAPI,
  jwt,
  createAuthMiddleware,
} from "better-auth/plugins";
import { sso } from "better-auth/plugins/sso";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { headers } from "next/headers";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../lib/db";
import * as schema from "../../lib/db/schema";
import { authLogger } from "@/lib/logger";
import { sendPasswordResetEmail } from "@/lib/email";
// import { autumn } from "autumn-js/better-auth";

// Import our B2B2C access control system
import {
  ac,
  adminManager,
  adminExecutive,
} from "./permissions";
import { eq } from "drizzle-orm";
import { profiles } from "../../lib/db/schema";
import { users } from "../../lib/db/schema";
import { sendOrganizationInviteEmail } from "@/lib/email";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    camelCase: false,
    schema: {
      user: schema.baUsers,
      session: schema.baSessions,
      account: schema.baAccounts,
      verification: schema.baVerifications,
      organization: schema.organization,
      member: schema.members,
      invitation: schema.invitations,
      apiKey: schema.apikeys,
      twoFactor: schema.twoFactors,
      ssoProvider: schema.ssoProvider,
      jwks: schema.jwks,
    },
  }),
  appName: "senseiiwyze-dashboard",
 
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
        
        if(ctx.path.startsWith("/sign-up")){
            const newSession = ctx.context.newSession;
            if(newSession){
            } else {
            }
        }
    }),
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 60 * 60,
    async sendResetPassword({ user, url, token }, request) {
      console.log("Sending reset password email", { user, url, token });
      await sendPasswordResetEmail({
        to: user.email,
        subject: "Reset your password",
        html: `Click here to reset your password: <a href="${url}">Reset Password</a>`,
      });
    },
    onPasswordReset: async ({ user }) => { console.log(`Password reset for ${user.email}`); },
  },
  socialProviders: {
    // GitHub OAuth (configuration pending)
    ...(process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_SECRET && {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }),
    // Google OAuth (configuration pending)
    ...(process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET && {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }),
  },
  plugins: [
    sso(),
    jwt(),
    openAPI(),
    oAuthProxy(),
    multiSession(),

    // Organization plugin with B2B2C access control
    organization({
      ac,
      roles: {
        "admin-executive": adminExecutive,
        "admin-manager": adminManager,
      },
      allowUserToCreateOrganization: async (user:any) => {  // only admins sign up; employees get invited
        const roles = String(user.role ?? "") 
          .split(",")
          .map((r) => r.trim());
        return roles.includes("admin-executive");
      },       
      creatorRole: "admin-executive",               // creator must be able to edit org & billing
      organizationLimit: 5,
      membershipLimit: 100,
      invitationLimit: 50,
      invitationExpiresIn: 48 * 60 * 60,
      cancelPendingInvitationsOnReInvite: true,
      async sendInvitationEmail(data) {
        // Build your accept link (route handles acceptInvitation by invitationId)
        const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/organization/accept-invite/${data.id}`;
        await sendOrganizationInviteEmail({
          email: data.email,  
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          organizationName: data.organization.name,
          inviteLink: acceptUrl,
        })
  
       
      },
    }),

    // Admin plugin with B2B2C access control
    admin({
      ac,
      roles: {
        "admin-executive": adminExecutive,
        "admin-manager": adminManager,
      },
      defaultRole: "admin-executive",               // only admins self-serve sign-up
      adminRoles: ["admin-executive", "admin-manager"],
    }),

    apiKey(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        // Send email with OTP
        authLogger.info("Sending OTP via email", {
          email,
          type,
          otpLength: otp.length,
        });
      },
    }),
    magicLink({
      sendMagicLink({ email, token, url }, request) {
        // Send email with magic link
        authLogger.info("Sending magic link via email", { email, url });
      },
    }),
    anonymous(),
    username(),
    twoFactor(),
    // autumn(), // Billing and subscription management
    nextCookies(), // Must be last
  ],
});


/**
 * Get the current authenticated user with their role and organization context
 * This function retrieves the user from Better Auth session and formats it
 * for use throughout the B2B2C application
 */
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    // Get linked profile information
    let profileData = null;
    if (session.user.id) {
      const baUser = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

      if (baUser.length > 0 && baUser[0].profileId) {
        const profile = await db
          .select()
          .from(profiles)
          .where(eq(profiles.id, baUser[0].profileId))
          .limit(1);

        if (profile.length > 0) {
          profileData = profile[0];
        }
      }
    }

    // Map Better Auth user to our application's user interface
    return {
      id: session.user.id,
      name: profileData?.name || session.user.name || session.user.email || "Unknown User",
      email: session.user.email,
      role: session.user.role || profileData?.userRole || "learner", // Default to CEO/learner role
      image: session.user.image,
      emailVerified: session.user.emailVerified,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
      // Profile-specific data
      profileId: profileData?.id,
      workplace: profileData?.workplace,
      jobTitle: profileData?.jobTitle,
      profilePhoto: profileData?.profilePhoto,
      isOnboarding: profileData?.isOnboarding ?? false, 
      onboardingStep: profileData?.onboardingStep ?? -1,
      // Organization context (if available)
      organizationId: session.session.activeOrganizationId,
    };
  } catch (error) {
    authLogger.error(
      "Error getting current user",
      error instanceof Error ? error : new Error(String(error)),
    );
    return null;
  }
}

/**
 * Check if the current user has specific permissions
 */
export async function checkUserPermission(
  resource: string,
  action: string,
): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const result = await auth.api.userHasPermission({
      body: {
        userId: user.id,
        permissions: {
          [resource]: [action],
        },
      },
    });

    return result.success;
  } catch (error) {
    authLogger.error(
      "Error checking user permission",
      error instanceof Error ? error : new Error(String(error)),
    );
    return false;
  }
}

/**
 * Check if the current user has a specific role
 */
export async function checkUserRole(expectedRole: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    // Handle both single role and multiple roles (comma-separated)
    const userRoles = user.role?.split(",").map((r) => r.trim()) || [];
    return userRoles.includes(expectedRole);
  } catch (error) {
    authLogger.error(
      "Error checking user role",
      error instanceof Error ? error : new Error(String(error)),
    );
    return false;
  }
}

export const roleRouteMapping = {
  "admin-executive": [
    "/org", "/org/settings", "/org/billing",
    "/team", "/reports", "/enterprise"
  ],
  "admin-manager": [
    "/team", "/reports"
  ],
} as const;

/**
 * Safe prefix match: exact "/route" or "/route/..."
 */
function pathStartsWithSegment(path: string, base: string) {
  if (base === "/") return true;
  return path === base || path.startsWith(base.endsWith("/") ? base : base + "/");
}


/**
 * Map aliases to canonical keys you actually maintain in roleRouteMapping.
 * (Keeps "learner" ↔ "ceo", "admin" ↔ "worker", "executive" ↔ "frontliner")
 */
const aliasToCanonical = {
  ceo: "ceo",
  learner: "ceo",
  worker: "worker",
  admin: "worker",
  frontliner: "frontliner",
  executive: "frontliner",
} as const;

function normalizePath(p: string) {
  // remove trailing slash (except root) and collapse duplicate slashes
  let x = p.replace(/\/{2,}/g, "/");
  if (x.length > 1 && x.endsWith("/")) x = x.slice(0, -1);
  return x;
}


/**
 * Check if user can access a specific route based on their (global) role
 * and minimal org guard for org-scoped paths.
 */
export async function canAccessRoute(pathname: string): Promise<boolean> {
  try {
    const path = normalizePath(pathname);
    const user = await getCurrentUser();
    if (!user) return false;

    // If the page is clearly org-scoped, require an active org on the session/user.
    const looksOrgScoped =
      pathStartsWithSegment(path, "/org") || pathStartsWithSegment(path, "/team");
    if (looksOrgScoped && !("activeOrganizationId" in user ? user.activeOrganizationId : undefined)) {
      return false; // no active org selected ⇒ block
    }

    // Parse roles robustly; accept string or array; handle commas/spaces.
    const rawRoles =
      Array.isArray(user.role) ? user.role : String(user.role ?? "")
        .split(",")
        .map(r => r.trim())
        .filter(Boolean);

    // Resolve aliases to canonical keys used in your mapping
    const canonicalRoles = rawRoles
      .map(r => (aliasToCanonical as any)[r] ?? r)
      .filter(Boolean);

    // Check allowed prefixes per role (segment-safe)
    for (const role of canonicalRoles) {
      const allowed = roleRouteMapping[role as keyof typeof roleRouteMapping] ?? [];
      if (allowed.some(route => pathStartsWithSegment(path, route))) {
        return true;
      }
    }

    return false;
  } catch (error) {
    authLogger.error(
      "Error checking route access",
      error instanceof Error ? error : new Error(String(error)),
    );
    return false;
  }
}


