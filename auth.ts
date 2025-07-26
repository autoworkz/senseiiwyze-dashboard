import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import * as betterAuthSchema from "./src/lib/db/better-auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        // Better Auth tables live under the pgSchema we expose from `better-auth-schema.ts`
        schema: betterAuthSchema,
    }),
    appName: "senseiiwyze-dashboard",
    secret: process.env.BETTER_AUTH_SECRET || "VCPPDj0m70w8DrUmMqOYlG5DhfOHsFtelazBsyOUiMI=",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true if you want email verification
    },
    session: {
        strategy: "jwt",
        expiresIn: 60 * 60 * 24 * 7, // 7 days
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    plugins: [
        nextCookies(),
        organization({
            // Map Better-Auth organization models to existing MakerKit tables
            schema: {
                organization: {
                    modelName: "accounts",
                },
                member: {
                    modelName: "accounts_memberships",
                    fields: {
                        organizationId: "account_id",
                        userId: "user_id",
                        role: "account_role",
                    },
                },
                invitation: {
                    modelName: "invitations",
                    fields: {
                        organizationId: "account_id",
                        inviterId: "invited_by",
                    },
                },
            },

            allowUserToCreateOrganization: true,

            organizationCreation: {
                disabled: false,
                beforeCreate: async ({ organization, user }) => ({
                    data: {
                        ...organization,
                        metadata: {
                            createdBy: user.id,
                            createdAt: new Date().toISOString(),
                        },
                    },
                }),
                afterCreate: async ({ organization, user }) => {
                    console.log(`Organization ${organization.name} created by user ${user.id}`)
                },
            },
        })
    ],
});

export type Auth = typeof auth;
