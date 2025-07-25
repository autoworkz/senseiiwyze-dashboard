import { createAuthClient } from "better-auth/client";
import { organizationClient, anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins: [
        organizationClient(),
        anonymousClient()
    ]
});
