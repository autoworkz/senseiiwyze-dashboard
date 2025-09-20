import { NextResponse } from "next/server";
import { getSuperAdminOrganizations, canPerformSuperAdminActions } from "@/lib/super-admin";

export async function GET() {
  try {
    // Check if user can perform super admin actions
    const canPerform = await canPerformSuperAdminActions();
    if (!canPerform) {
      return NextResponse.json(
        { error: "Unauthorized - Super admin access required" },
        { status: 403 }
      );
    }

    // Get all organizations
    const organizations = await getSuperAdminOrganizations();

    return NextResponse.json({
      organizations,
      count: organizations.length,
    });
  } catch (error) {
    console.error("Super admin organizations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
