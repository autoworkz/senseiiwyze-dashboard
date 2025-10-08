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
import { sendPasswordResetEmail, sendMagicLinkEmail, sendOrganizationMagicLinkEmail } from "@/lib/email";
import { getOrganizationInviteContext } from "@/lib/organization-invite-context";

// Import our B2B2C access control system
import {
  ac,
  adminManager,
  adminExecutive,
  superAdmin,
} from "./permissions";
import { eq } from "drizzle-orm";
import { profiles } from "../../lib/db/schema";
import { users } from "../../lib/db/schema";
import { canUserCreateOrganization } from "./organization-limits";
// import { sendOrganizationInviteEmail } from "@/lib/email"; // Disabled - using magic links instead

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
  redirectUrls: [
    "http://localhost:3000/auth/reset-password",
    "http://localhost:5173/auth/reset-password",
    "https://senseiiwyze.com/auth/reset-password"
  ],
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
        "admin-executive": adminExecutive,
        "admin-manager": adminManager,
        "super-admin": superAdmin,
      },
      allowUserToCreateOrganization: async (user:any) => {  // Use dedicated function
        const result = await canUserCreateOrganization(user.id, user.role);
        return result.canCreate;
      },       
      creatorRole: "admin-executive", // Default - will be updated post-creation for super-admins
      organizationLimit: 1, // Default limit for regular users
      membershipLimit: 100,
      invitationLimit: 50,
      invitationExpiresIn: 48 * 60 * 60,
      cancelPendingInvitationsOnReInvite: true,
      // Disabled - we handle email sending manually with magic links
      // async sendInvitationEmail(data) {
      //   // This callback is disabled because we send magic links manually
      //   // in the organization invitation API route
      // },
    }),

    // Admin plugin with B2B2C access control
    admin({
      ac,
      roles: {
        "admin-executive": adminExecutive,
        "admin-manager": adminManager,
        "super-admin": superAdmin,
      },
      defaultRole: "admin-executive",               // only admins self-serve sign-up
      adminRoles: ["admin-executive", "admin-manager", "super-admin"],
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
      expiresIn: 15 * 60,
      storeToken: "hashed",
      sendMagicLink: async ({ email, token, url }, request) => {        
        // Extract callback URL from magic link URL query parameters
        const urlObj = new URL(url);
        const callbackURL = urlObj.searchParams.get('callbackURL') || urlObj.searchParams.get('newUserCallbackURL');
        
        
        // Check if this is an organization invitation by examining the callback URL
        const isOrganizationInvite = callbackURL && (
          callbackURL.includes('/organization/accept-invite/') || 
          callbackURL.includes('/api/organization/accept-invite/')
        );
        
        
        if (isOrganizationInvite && callbackURL) {
          // Extract invitation ID from callback URL
          const inviteIdMatch = callbackURL.match(/accept-invite\/([^/?]+)/);
          const invitationId = inviteIdMatch?.[1];
          
          console.log('📋 [MagicLink] Processing organization invitation:', {
            invitationId,
            callbackURL,
            email
          });
          
          try {
            console.log('🔍 [MagicLink] Getting organization invitation context...');
            // Get organization invitation context using utility function
            const inviteContext = invitationId ? await getOrganizationInviteContext(invitationId) : null;
            
            console.log('📊 [MagicLink] Context retrieval result:', {
              hasContext: !!inviteContext,
              context: inviteContext
            });
            
            if (inviteContext) {
              console.log('📧 [MagicLink] Sending organization-specific magic link email...');
              // Send organization-specific magic link email
              await sendOrganizationMagicLinkEmail({
                email,
                magicLink: url,
                organizationName: inviteContext.organizationName,
                invitedByUsername: inviteContext.inviterName,
                invitedByEmail: inviteContext.inviterEmail,
                inviteeEmail: inviteContext.inviteeEmail,
              });
              
              console.log('✅ [MagicLink] Organization magic link email sent successfully!');
              authLogger.info("Organization magic link email sent", { 
                email, 
                organizationName: inviteContext.organizationName,
                invitationId,
              });
              return;
            } else {
              console.log('⚠️ [MagicLink] No context found, will fall back to generic email');
            }
          } catch (error) {
            console.error("💥 [MagicLink] Organization magic link error details:", {
              error,
              invitationId,
              callbackURL,
              email,
              errorMessage: error instanceof Error ? error.message : String(error),
              errorStack: error instanceof Error ? error.stack : undefined
            });
            authLogger.warn("Failed to send organization magic link email, falling back to generic", {
              email,
              invitationId,
              callbackURL,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        } else {
          console.log('📧 [MagicLink] Not an organization invitation, sending generic magic link email');
        }
        
        // Fallback to regular magic link email
        console.log('📧 [MagicLink] Sending generic magic link email...');
        await sendMagicLinkEmail({ email, magicLink: url });
        console.log('✅ [MagicLink] Generic magic link email sent successfully!');
        authLogger.info("Magic link sent via email", { email, url });
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
 * Check if user is a super admin
 */
export async function isSuperAdmin(userId?: string): Promise<boolean> {
  try {
    if (!userId) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      userId = session?.user?.id;
    }
    
    if (!userId) return false;

    const baUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (baUser.length === 0) return false;
    
    const userRoles = String(baUser[0].role ?? "")
      .split(",")
      .map((r) => r.trim());
    
    return userRoles.includes("super-admin");
  } catch (error) {
    authLogger.error("Error checking super admin status", error instanceof Error ? error : new Error(String(error)));
    return false;
  }
}

/**
 * Get all organizations for super admin
 */
export async function getAllOrganizations() {
  try {
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });
    return organizations;
  } catch (error) {
    authLogger.error("Error getting all organizations", error instanceof Error ? error : new Error(String(error)));
    return [];
  }
}

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

    // Check if user is super admin
    const isSuper = await isSuperAdmin(session.user.id);

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
      // Super admin flags
      isSuperAdmin: isSuper,
      canAccessAllOrganizations: isSuper,
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
  "super-admin": [
    "/org", "/org/settings", "/org/billing",
    "/team", "/reports", "/enterprise",
    "/admin", "/admin/organizations", "/admin/users" // Additional super-admin routes
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

    // Super admins have access to all routes
    if (user.isSuperAdmin) return true;

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


