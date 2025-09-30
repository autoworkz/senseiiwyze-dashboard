import { Resend } from "resend";
import { emailLogger } from "@/lib/logger";
import {
  LoginCodeEmail,
  MagicLinkEmail,
  NewDeviceEmail,
  OrganizationInviteEmail,
  OrganizationMagicLinkEmail,
  SecurityAlertEmail,
  VerifyEmail,
  WelcomeEmail,
  MemberInviteCodeEmail,
} from "../../emails";

const FROM = process.env.EMAIL_OTP_FROM!;             
const REPLY_TO_EMAIL = "support@senseiwyze.com"; 

const resend = new Resend(process.env.RESEND_API_KEY!);

export interface EmailResponse { data?: { id: string } ; error?: Error }
export interface LoginCodeEmailOptions { email: string; code: string }
export interface VerificationEmailOptions { email: string; verificationLink: string }
export interface WelcomeEmailOptions { email: string; name?: string }
export interface NewDeviceEmailOptions { email: string; loginDate?: string; loginDevice?: string; loginLocation?: string; loginIp?: string }
export interface SecurityAlertEmailOptions {
  email: string; userName?: string;
  alertType: "suspicious_login" | "password_changed" | "failed_attempts";
  ipAddress?: string; location?: string; device?: string; timestamp?: string; securityLink?: string;
}
export interface MagicLinkEmailOptions { email: string; magicLink: string }
export interface OrganizationInviteEmailOptions {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  organizationName: string;
  inviteLink: string;
}
export interface OrganizationMagicLinkEmailOptions {
  email: string;
  magicLink: string;
  organizationName: string;
  invitedByUsername: string;
  invitedByEmail: string;
  inviteeEmail: string;
}

export interface MemberInviteCodeEmailOptions {
  email: string;
  organizationName: string;
  code: string;
}

export async function sendPasswordResetEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}): Promise<EmailResponse> {
  const { data, error } = await resend.emails.send({
    from: FROM,                                      
    to,
    subject,
    html: html ?? (text ? `<p>${text}</p>` : "<p></p>"),
    replyTo: replyTo ?? REPLY_TO_EMAIL,                
  });

  if (error) {
    emailLogger.error("Resend error (password reset)", error);
    return { error: error as Error };
  }
  emailLogger.info("Password reset email sent", { to });
  return { data: { id: data?.id as string } };
}

// ---- Other emails (unchanged behavior, unified client & error logging) ----
export async function sendLoginCodeEmail({ email, code }: LoginCodeEmailOptions): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM, to: email, subject: "Your login code",
      react: LoginCodeEmail({ validationCode: code }),
      headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
    });
    if (error) return logErr("login code", error);
    emailLogger.info("Login code email sent", { to: email });
    return { data };
  } catch (e: any) { return logCatch("login code", e); }
}

export async function sendVerificationEmail({ email, verificationLink }: VerificationEmailOptions): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM, to: email, subject: "Verify your email address",
      react: VerifyEmail({ verificationLink }),
      headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
    });
    if (error) return logErr("verification", error);
    emailLogger.info("Verification email sent", { to: email });
    return { data };
  } catch (e: any) { return logCatch("verification", e); }
}

export async function sendWelcomeEmail({ email, name }: WelcomeEmailOptions): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM, to: email, subject: "Welcome to SenseiiWyze!",
      react: WelcomeEmail({ name }),
      replyTo: REPLY_TO_EMAIL,
      headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
    });
    if (error) return logErr("welcome", error);
    emailLogger.info("Welcome email sent", { to: email, name });
    return { data };
  } catch (e: any) { return logCatch("welcome", e); }
}

export async function sendNewDeviceEmail(opts: NewDeviceEmailOptions): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM, to: opts.email, subject: "New device login",
      react: NewDeviceEmail(opts),
      headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
    });
    if (error) return logErr("new device", error);
    emailLogger.info("New device email sent", { to: opts.email });
    return { data };
  } catch (e: any) { return logCatch("new device", e); }
}

export async function sendSecurityAlertEmail(opts: SecurityAlertEmailOptions): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM, to: opts.email, subject: "Security alert for your account",
      react: SecurityAlertEmail({
        userEmail: opts.email,
        userName: opts.userName,
        alertType: opts.alertType,
        ipAddress: opts.ipAddress,
        location: opts.location,
        device: opts.device,
        timestamp: opts.timestamp,
        securityLink: opts.securityLink,
      }),
      headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
    });
    if (error) return logErr("security alert", error);
    emailLogger.info("Security alert email sent", { to: opts.email, alertType: opts.alertType });
    return { data };
  } catch (e: any) { return logCatch("security alert", e); }
}

export async function sendMagicLinkEmail({ email, magicLink }: MagicLinkEmailOptions): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM, to: email, subject: "Sign in to SenseiiWyze",
      react: MagicLinkEmail({ magicLink }),
      headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
    });
    if (error) return logErr("magic link", error);
    emailLogger.info("Magic link email sent", { to: email });
    return { data };
  } catch (e: any) { return logCatch("magic link", e); }
}

export async function sendOrganizationInviteEmail(opts: OrganizationInviteEmailOptions): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM, to: opts.email, subject: `Join ${opts.organizationName} on SenseiiWyze`,
      react: OrganizationInviteEmail({
        invitedByUsername: opts.invitedByUsername,
        invitedByEmail: opts.invitedByEmail,
        organizationName: opts.organizationName,
        inviteLink: opts.inviteLink,
      }),
      replyTo: REPLY_TO_EMAIL,
      headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
    });
    if (error) return logErr("organization invite", error);
    emailLogger.info("Organization invite email sent", { to: opts.email, organizationName: opts.organizationName });
    return { data };
  } catch (e: any) { return logCatch("organization invite", e); }
}

export async function sendOrganizationMagicLinkEmail(opts: OrganizationMagicLinkEmailOptions): Promise<EmailResponse> {
  try {
    console.log('📧 [Email] Sending organization magic link email:', {
      to: opts.email,
      organizationName: opts.organizationName,
      from: FROM,
      replyTo: REPLY_TO_EMAIL
    });

    const { data, error } = await resend.emails.send({
      from: FROM, 
      to: opts.email, 
      subject: `You're invited to join ${opts.organizationName}`,
      react: OrganizationMagicLinkEmail({
        magicLink: opts.magicLink,
        organizationName: opts.organizationName,
        invitedByUsername: opts.invitedByUsername,
        invitedByEmail: opts.invitedByEmail,
        inviteeEmail: opts.inviteeEmail,
      }),
      // Remove replyTo temporarily to test if this is the issue
      // replyTo: REPLY_TO_EMAIL,
      headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
    });

    console.log('📊 [Email] Resend API response:', {
      hasData: !!data,
      hasError: !!error,
      emailId: data?.id,
      error: error
    });

    if (error) {
      console.error('❌ [Email] Resend API error:', error);
      return logErr("organization magic link", error);
    }

    console.log('✅ [Email] Organization magic link email sent successfully:', {
      emailId: data?.id,
      to: opts.email,
      organizationName: opts.organizationName
    });

    emailLogger.info("Organization magic link email sent", { to: opts.email, organizationName: opts.organizationName });
    return { data };
  } catch (e: any) { 
    console.error('💥 [Email] Unexpected error:', e);
    return logCatch("organization magic link", e); 
  }
}

export async function sendMemberInviteCodeEmail(opts: MemberInviteCodeEmailOptions): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: opts.email,
      subject: `Your invite code for ${opts.organizationName}`,
      react: MemberInviteCodeEmail({ organizationName: opts.organizationName, code: opts.code }),
      headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
    });
    if (error) return logErr("member invite code", error);
    emailLogger.info("Member invite code email sent", { to: opts.email, organizationName: opts.organizationName });
    return { data };
  } catch (e: any) { return logCatch("member invite code", e); }
}

export async function sendBatchEmails(
  emails: Array<{ to: string; subject: string; react: React.ReactElement }>
): Promise<{ data?: any; error?: Error }> {
  try {
    const { data, error } = await resend.batch.send(
      emails.map(e => ({
        from: FROM, to: e.to, subject: e.subject, react: e.react,
        headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
      }))
    );
    if (error) return logErr("batch", error);
    emailLogger.info("Batch emails sent", { count: emails.length });
    return { data };
  } catch (e: any) { return logCatch("batch", e); }
}

// Optional quick config check (prefer sending to delivered@resend.dev)
export async function validateEmailConfig(): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: "delivered@resend.dev",   // test sink
      subject: "Resend config check",
      html: "<p>ok</p>",
    });
    if (error) { emailLogger.error("Resend test failed", error); return false; }
    return true;
  } catch (e) {
    emailLogger.error("Resend config test threw", e as Error);
    return false;
  }
}

// helpers
function logErr(kind: string, error: any) {
  emailLogger.error(`Error sending ${kind} email`, error instanceof Error ? error : new Error(String(error)));
  return { error: error as Error };
}
function logCatch(kind: string, e: any) {
  emailLogger.error(`Failed to send ${kind} email`, e instanceof Error ? e : new Error(String(e)));
  return { error: e as Error };
}