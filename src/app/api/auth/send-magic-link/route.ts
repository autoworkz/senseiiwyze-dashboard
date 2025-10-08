import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, redirectTo } = await req.json() as { 
      email: string; 
      redirectTo?: string; 
    };

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    // Use the provided redirectTo or default to app dashboard
    const callbackURL = redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/app`;

    const response = await auth.api.signInMagicLink({  
      headers: await headers(),
      body: {
        email,
        callbackURL,
        newUserCallbackURL: callbackURL, // works for both new & existing users
      },
    });

    if (!response.status) {
      return NextResponse.json(
        { error: "Failed to send magic link" },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Magic link sent successfully",
    });
  } catch (error) {
    console.error("Magic link generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
