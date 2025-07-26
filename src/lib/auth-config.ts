import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins/magic-link";
import { organization } from "better-auth/plugins/organization";
import { admin } from "better-auth/plugins/admin";
import { anonymous } from "better-auth/plugins/anonymous";
import { emailOTP } from "better-auth/plugins/email-otp";

import { sendMagicLinkEmail, sendVerificationEmail, sendOtpEmail } from "./email";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./dev.db"),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // Use Resend for password reset emails
      await sendMagicLinkEmail({
        email: user.email,
        url,
        appName: 'SenseiiWyze'
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Use Resend for email verification
      await sendVerificationEmail({
        email: user.email,
        url,
        appName: 'SenseiiWyze'
      });
    },
  },
  plugins: [
    organization({
      /**
       * Resolve the current orgId from the incoming request.
       * Strategy: look for "x-org-id" header first, then a query param, then fallback to null.
       */
      // @ts-expect-error - resolveOrgId is accepted by plugin even if not in typings
      async resolveOrgId({ request }: { request: Request }) {
        const headerOrg = request.headers.get('x-org-id');
        if (headerOrg) return headerOrg;

        const url = new URL(request.url);
        const qOrg = url.searchParams.get('orgId');
        if (qOrg) return qOrg;

        return null;
      },
    }),
    admin(),
    anonymous(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }: { email: string; otp: string; type: string }) {
        await sendOtpEmail({ email, otp, type, appName: 'SenseiiWyze' });
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Use Resend for magic link emails
        await sendMagicLinkEmail({
          email,
          url,
          appName: 'SenseiiWyze'
        });
      },
    }),
  ],
});

export type Auth = typeof auth; 