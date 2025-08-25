import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";            // your Better Auth server instance
import { withAuth } from "@/lib/api/with-auth";
import { toSlug } from "@/lib/utils";

export const POST = withAuth(async (req: Request, { session }: { session: any }) => {
  try {
    const { companyName, employeeCount, selectedPlan } = await req.json();

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slug = toSlug(companyName);

    const data = await auth.api.createOrganization({
      headers: req.headers, 
      body: {
        name: companyName.trim(),
        slug,
        metadata: {
            industry: "other",
            sizeEstimate: employeeCount || 0,
            contact: { email: session.user.email },
            trial: { tier: "trial", startedAt: Date.now(), endsAt: Date.now() + 14*24*3600*1000 },
            featureFlags: { assessments: true, enterprise: false },
            createdVia: "onboarding",
        },
        keepCurrentActiveOrganization: false,
      },
    });

    if (!data?.id) {
      return NextResponse.json(
        { error: "Failed to create organization" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      organization: { id: data.id, name: data.name, slug: data.slug },
    });
  } catch (e: any) {
    const msg = String(e?.message ?? "");

    // If slug collided (unique index), Better Auth/DB will bubble a conflict or unique violation.
    if (/unique|slug|23505|conflict/i.test(msg)) {
      return NextResponse.json(
        { success: false, exists: true, error: "Organization URL is taken" },
        { status: 409 }
      );
    }

    console.error("Error creating organization via Better Auth:", e);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
});
