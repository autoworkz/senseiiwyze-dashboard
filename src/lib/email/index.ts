import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'shehzerabbasi621@gmail.com',
    pass: 'qeoo ohxp clyz etvy'
  },
});

type InvitePayload = {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  organizationName: string;
  inviteLink: string;
};

export async function sendOrganizationInvitation(p: InvitePayload) {
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto">
      <h2>You’re invited to ${escapeHtml(p.organizationName)}</h2>
      <p>${escapeHtml(p.invitedByUsername)} (${escapeHtml(p.invitedByEmail)}) invited you.</p>
      <p>
        <a href="${p.inviteLink}"
           style="display:inline-block;padding:10px 16px;background:#000;color:#fff;border-radius:8px;text-decoration:none">
           Accept invitation
        </a>
      </p>
      <p>If the button doesn’t work, copy this URL:<br/>${p.inviteLink}</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to: p.email,
    subject: `Join ${p.organizationName} on Senseiiwyze`,
    html,
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]!));
}
