import { Resend } from "resend";

export async function sendMail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return false;
  const resend = new Resend(key);
  const result = await resend.emails.send({ from, to, subject, html });
  return !result.error;
}
