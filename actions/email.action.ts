import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bharaths14051803@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"SupaVault" <bharaths14051803@gmail.com>',
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
}
