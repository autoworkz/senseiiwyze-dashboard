import { NextResponse } from "next/server";
import { switchOrganizationAsSuper, canPerformSuperAdminActions } from "@/lib/super-admin";

export async function POST(req: Request) {
  try {
    // Check if user can perform super admin actions
    const canPerform = await canPerformSuperAdminActions();
    if (!canPerform) {
      return NextResponse.json(
        { error: "Unauthorized - Super admin access required" },
        { status: 403 }
      );
    }

    const { organizationId } = await req.json();

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Switch to the organization
    const success = await switchOrganizationAsSuper(organizationId);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to switch organization" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully switched organization",
      organizationId,
    });
  } catch (error) {
    console.error("Super admin switch organization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
