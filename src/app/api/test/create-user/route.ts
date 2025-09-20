import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Test endpoint to create users with specific roles
 * ONLY FOR TESTING - REMOVE IN PRODUCTION
 */
export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Email, password, name, and role are required" },
        { status: 400 }
      );
    }

    // Create user using Better Auth
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role, // This will set the role
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.user?.id,
        email: user.user?.email,
        name: user.user?.name,
        role: user.user?.role,
      },
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
