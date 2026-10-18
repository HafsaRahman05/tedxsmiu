import nodemailer from "nodemailer";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

function singleLine(value: string) {
  return value.replace(/[\r\n]/g, " ").trim();
}

export async function sendContactQuery(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL;
  const port = Number(process.env.SMTP_PORT || 587);

  if (!host || !user || !pass || !to) {
    const error = new Error("Contact email is not configured.") as Error & { statusCode?: number };
    error.statusCode = 503;
    throw error;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const name = singleLine(input.name);
  const subject = singleLine(input.subject);

  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to,
    replyTo: input.email,
    subject: `Contact query: ${subject}`,
    text: `Name: ${name}\nEmail: ${input.email}\nSubject: ${subject}\n\n${input.message}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>
    `,
  });
}
