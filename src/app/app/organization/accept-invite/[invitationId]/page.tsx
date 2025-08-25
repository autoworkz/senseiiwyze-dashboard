"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AcceptInvitePage({
  params,
}: { params: { invitationId: string } }) {
  const router = useRouter();
  const { data: session } = authClient.useSession(); // undefined while loading
  const [msg, setMsg] = useState("Preparing…");

  useEffect(() => {
    // wait for session to resolve
    if (session === undefined) return;

    // if not logged in, send to your login page and come back here
    if (!session) {
      const back = encodeURIComponent(`/organization/accept-invite/${params.invitationId}`);
      router.replace(`/auth/login?next=${back}`);
      return;
    }

    // accept the invitation
    (async () => {
      try {
        setMsg("Accepting your invitation…");
        const { error } = await authClient.organization.acceptInvitation({
          invitationId: params.invitationId,
        });
        if (error) throw error;

        // (Optional) make the newly joined org active for first-timers
        try {
          const { data: orgs } = await authClient.organization.list();
          if (orgs && orgs.length === 1) {
            await authClient.organization.setActive({ organizationId: orgs[0].id });
          }
        } catch {
          /* ignore if your client version doesn't expose .list() */
        }

        router.replace("/org"); // or wherever your org dashboard lives
      } catch (e: any) {
        setMsg(e?.message || "This invitation is invalid or has expired.");
      }
    })();
  }, [session, params.invitationId, router]);

  return <p>{msg}</p>;
}
