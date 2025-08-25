import authClient from "../auth-client";

export interface CreateOrganizationData {
  companyName: string;
  employeeCount: string;
}
export interface OrganizationResponse {
  success: boolean;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  error?: string;
  exists?: boolean;
}

function coerceMeta(meta: unknown): Record<string, any> {
  if (!meta) return {};
  if (typeof meta === "string") {
    try { return JSON.parse(meta); } catch { return {}; }
  }
  if (typeof meta === "object") return meta as Record<string, any>;
  return {};
}


// Check if organization exists and create if it doesn't
export async function createOrganization(data: CreateOrganizationData): Promise<OrganizationResponse> {
  try {
    const response = await fetch('/api/orgs/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create organization');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
}

export async function savePlan(selectedPlan: string) {

  const { data: org, error: readErr } = await authClient.organization.getFullOrganization();
  if (readErr) throw readErr;
  if (!org?.id) throw new Error("No active organization selected");

  const prev = coerceMeta(org.metadata);
  const nextMeta = { ...prev, plan: selectedPlan };

  // 3) Update via Better Auth (omit organizationId to target the active org)
  const { error: updateErr } = await authClient.organization.update({
    data: { metadata: nextMeta },
    organizationId: org.id,
  });
  if (updateErr) throw updateErr;

  return { success: true, organizationId: org.id, plan: selectedPlan }
}