import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import * as authSchema from "./auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...authSchema,
            // Map Better Auth tables to the generated schema
            user: authSchema.user,
            session: authSchema.session,
            account: authSchema.account,
            verification: authSchema.verification,
            // Organization plugin tables
            organization: authSchema.organization,
            member: authSchema.member,
            invitation: authSchema.invitation, // This maps to organization_invitation table
        },
    }),
    appName: "senseiiwyze-dashboard",
    secret: process.env.BETTER_AUTH_SECRET || "VCPPDj0m70w8DrUmMqOYlG5DhfOHsFtelazBsyOUiMI=",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
    },

    plugins: [
        nextCookies(),
        organization({
            // Allow users to create organizations
            allowUserToCreateOrganization: true,
            // Organization creation hooks
            organizationCreation: {
                disabled: false,
                beforeCreate: async ({ organization, user }, request) => {
                    // Run custom logic before organization is created
                    return {
                        data: {
                            ...organization,
                            metadata: {
                                createdBy: user.id,
                                createdAt: new Date().toISOString()
                            }
                        }
                    }
                },
                afterCreate: async ({ organization, member, user }, request) => {
                    // Run custom logic after organization is created
                    console.log(`Organization ${organization.name} created by user ${user.id}`);
                }
            }
        })
    ],
});
