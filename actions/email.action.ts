import { Resend } from "resend";

interface SendEmailType {
  to: string;
  react: any;
  subject: string;
}

export async function sendEmail({ to, react, subject }: SendEmailType) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    console.log("To", to, subject);
    const data = await resend.emails.send({
      from: "TidyBin <onboarding@resend.dev>",
      to,
      subject,
      react,
    });

    console.log("Data in send email", data);
  } catch (error) {
    console.log("Error in sending email", error);
    return { success: false, error };
  }
}
