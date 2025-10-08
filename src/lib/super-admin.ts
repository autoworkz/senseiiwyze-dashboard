import { auth, isSuperAdmin } from "./auth";
import { headers } from "next/headers";
import { authLogger } from "./logger";

/**
 * Switch to a specific organization as super admin
 */
export async function switchOrganizationAsSuper(organizationId: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return false;
    }

    // Verify user is super admin
    const isSuper = await isSuperAdmin(session.user.id);
    if (!isSuper) {
      authLogger.warn("Non-super admin attempted organization switch", { 
        userId: session.user.id, 
        organizationId 
      });
      return false;
    }

    // Switch to the organization
    try {
      const result = await auth.api.setActiveOrganization({
        body: { organizationId },
        headers: await headers(),
      });

      if (!result) {
        authLogger.error("Failed to switch organization for super admin - no result", { 
          userId: session.user.id, 
          organizationId 
        });
        return false;
      }
    } catch (error) {
      authLogger.error("Failed to switch organization for super admin", { 
        error, 
        userId: session.user.id, 
        organizationId 
      });
      return false;
    }

    authLogger.info("Super admin switched organization", { 
      userId: session.user.id, 
      organizationId 
    });
    return true;
  } catch (error) {
    authLogger.error("Error switching organization for super admin", 
      error instanceof Error ? error : new Error(String(error))
    );
    return false;
  }
}

/**
 * Get all organizations accessible to super admin
 */
export async function getSuperAdminOrganizations() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return [];
    }

    // Verify user is super admin
    const isSuper = await isSuperAdmin(session.user.id);
    if (!isSuper) {
      return [];
    }

    // Get all organizations
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return organizations || [];
  } catch (error) {
    authLogger.error("Error getting organizations for super admin", 
      error instanceof Error ? error : new Error(String(error))
    );
    return [];
  }
}

/**
 * Check if current user can perform super admin actions
 */
export async function canPerformSuperAdminActions(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return false;
    }

    return await isSuperAdmin(session.user.id);
  } catch (error) {
    authLogger.error("Error checking super admin permissions", 
      error instanceof Error ? error : new Error(String(error))
    );
    return false;
  }
}
