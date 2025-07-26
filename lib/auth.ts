import { betterAuth } from "better-auth";
// import { github, google } from "better-auth/plugins/oauth";
import { magicLink } from "better-auth/plugins/magic-link";
import { sendMagicLinkEmail, sendVerificationEmail } from "../src/lib/email";
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