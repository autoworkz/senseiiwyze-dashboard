import { autumnHandler } from "autumn-js/next";
import { auth } from "@/lib/auth";

export const { GET, POST } = autumnHandler({
  identify: async (request) => {

    const org = await auth.api.getFullOrganization({ headers: request.headers });
    const session = await auth.api.getSession({
      headers: request.headers
  })
  console.log("session", session);
    // Fallback: block if there's no org (onboarding Step 1 must be done)
    if (!org?.id) return { customerId: undefined as any };

    return {
      customerId: org.id,                         //<---billing is org-based
      customerData: {
        name: org.name,
        email: session?.user?.email,
      },
    };
  },
});
