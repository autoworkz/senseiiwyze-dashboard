import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_OTP_FROM || 'no-reply@senseii.com', // 👈 must be a verified domain in Resend
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}
