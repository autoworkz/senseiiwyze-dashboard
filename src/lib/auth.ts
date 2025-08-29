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
  ceo,
  worker,
  frontliner,
  learner,
  admin as adminRole,
  executive,
} from "./permissions";
import { eq } from "drizzle-orm";
import { profiles } from "../../lib/db/schema";
import { users } from "../../lib/db/schema";

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
        to: [user.email],
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
        // B2B2C primary roles
        ceo,
        worker,
        frontliner,
        // Legacy compatibility roles
        learner,
        admin: adminRole,
        executive,
      },
      // Organization configuration
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      creatorRole: "admin", // Workers can create organizations
      membershipLimit: 100,
      invitationExpiresIn: 48 * 60 * 60, // 48 hours
      cancelPendingInvitationsOnReInvite: true,
      invitationLimit: 50,
    }),

    // Admin plugin with B2B2C access control
    admin({
      ac,
      roles: {
        // B2B2C primary roles
        ceo,
        worker,
        frontliner,
        // Legacy compatibility roles
        learner,
        admin: adminRole,
        executive,
      },
      defaultRole: "learner", // Default new users to CEO/learner role
      adminRoles: ["worker", "frontliner", "admin", "executive"], // Who can perform admin actions
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

/**
 * B2B2C Role Mappings for Route Protection
 */
export const roleRouteMapping = {
  // CEO/learner routes - personal development
  learner: ["/me", "/me/goals", "/me/games", "/me/learn"],
  ceo: ["/me", "/me/goals", "/me/games", "/me/learn"],

  // Worker/admin routes - team management
  admin: [
    "/team",
    "/team/tasks",
    "/team/courses",
    "/team/messages",
    "/team/profile",
  ],
  worker: [
    "/team",
    "/team/tasks",
    "/team/courses",
    "/team/messages",
    "/team/profile",
  ],

  // Frontliner/executive routes - organizational oversight
  executive: ["/org", "/org/reports", "/org/presentation"],
  frontliner: ["/org", "/org/reports", "/org/presentation"],
};

/**
 * Check if user can access a specific route based on their role
 */
export async function canAccessRoute(pathname: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const userRoles = user.role?.split(",").map((r) => r.trim()) || [];

    // Check if any of the user's roles allow access to this route
    for (const role of userRoles) {
      const allowedRoutes =
        roleRouteMapping[role as keyof typeof roleRouteMapping] || [];
      if (allowedRoutes.some((route) => pathname.startsWith(route))) {
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


