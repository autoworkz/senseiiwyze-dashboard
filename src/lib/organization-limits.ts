import { db } from "../../lib/db";
import * as schema from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { authLogger } from "./logger";

/**
 * Check if user can create organization based on their role and current count
 */
export async function canUserCreateOrganization(userId: string, userRole: string): Promise<{ canCreate: boolean; reason?: string }> {
  try {
    const roles = String(userRole ?? "")
      .split(",")
      .map((r) => r.trim());

    // Super admins can create unlimited organizations
    if (roles.includes("super-admin")) {
      return { canCreate: true };
    }

    // Admin executives can create 1 organization
    if (roles.includes("admin-executive")) {
      // Check current organization count for this user
      const orgCount = await db
        .select()
        .from(schema.members)
        .where(eq(schema.members.userId, userId));

      if (orgCount.length >= 1) {
        return {
          canCreate: false,
          reason: "Admin executives are limited to 1 organization"
        };
      }

      return { canCreate: true };
    }

    // Admin managers cannot create organizations
    if (roles.includes("admin-manager")) {
      return {
        canCreate: false,
        reason: "Admin managers cannot create organizations"
      };
    }

    // Default: no permission
    return {
      canCreate: false,
      reason: "Insufficient permissions to create organization"
    };
  } catch (error) {
    authLogger.error("Error checking organization creation permissions", 
      error instanceof Error ? error : new Error(String(error))
    );
    return {
      canCreate: false,
      reason: "Error checking permissions"
    };
  }
}
