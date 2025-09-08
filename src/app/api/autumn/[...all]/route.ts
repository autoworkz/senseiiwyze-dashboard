import { autumnHandler } from "autumn-js/next";
import { auth } from "@/lib/auth";

export const { GET, POST } = autumnHandler({
  identify: async (request) => {

    const org = await auth.api.getFullOrganization({ headers: request.headers });
    // Fallback: block if there's no org (onboarding Step 1 must be done)
    if (!org?.id) return { customerId: undefined as any };

    return {
      customerId: org.id,                         //<---billing is org-based
      customerData: {
        name: org.name,
        email: org.metadata?.contact?.email,
      },
    };
  },
});
