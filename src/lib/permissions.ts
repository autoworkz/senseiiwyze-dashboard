import { createAccessControl } from "better-auth/plugins/access";

// 1) Vocabulary the app understands
export const statement = {
  organization: ["view", "update", "manage"],                // settings, profile, metadata
  team: ["view", "manage"],                                  // people, groups, invites
  billing: ["view", "manage", "invoice", "subscription"],    // treat "billing.*" as these
  assessment: ["assign", "view"],                            // assessments administration
  reports: ["view"],                                         // analytics/reports access
  enterprise: ["sso", "scim", "contracts", "security"],      // enterprise features
  user: ["view", "create", "update", "delete"],   
  invitation: ["create"],             
} as const;

export const ac = createAccessControl(statement);

// 2) Role definitions the client asked for

// Full organization control, billing, contracts
export const adminExecutive = ac.newRole({
  organization: ["view", "update", "manage"],
  team: ["view", "manage"],
  billing: ["view", "manage", "invoice", "subscription"],
  reports: ["view"],
  enterprise: ["sso", "scim", "contracts", "security"],
  user: ["view", "create", "update", "delete"], // optional
  invitation: ["create"],  
});

// HR operations, employee management, assessment admin, reports
export const adminManager = ac.newRole({
  organization: ["view"],     // can see org settings but not change them
  team: ["view", "manage"],   // hiring, invites, role changes in org scope
  assessment: ["assign", "view"],
  reports: ["view"],
});

// Platform super admin - access to all organizations, for developers/owners only
export const superAdmin = ac.newRole({
  organization: ["view", "update", "manage"],
  team: ["view", "manage"],
  billing: ["view", "manage", "invoice", "subscription"],
  reports: ["view"],
  enterprise: ["sso", "scim", "contracts", "security"],
  assessment: ["assign", "view"],
  user: ["view", "create", "update", "delete"],
  invitation: ["create"],
});

// 3) (Optional) legacy aliases if any old code still references them
export const roles = { 
  "admin-executive": adminExecutive, 
  "admin-manager": adminManager,
  "super-admin": superAdmin 
};
export type RoleKey = keyof typeof roles;
