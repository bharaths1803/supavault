import { sendEmail } from "@/actions/email.action";
import EmailTemplate from "@/emails/Template";
import prisma from "@/lib/prisma";
import { generateOtp } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, username } = await req.json();

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser)
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );

  const otp = generateOtp();

  await sendEmail({
    to: email,
    subject: "🚀Your Magic Code Has Arrived!",
    react: EmailTemplate({
      username,
      otp,
    }),
  });

  await prisma.oTP.deleteMany({
    where: {
      username,
      email,
    },
  });

  const otpData = await prisma.oTP.create({
    data: {
      username,
      email,
      status: "PENDING",
      attempts: 0,
      otp,
    },
  });

  if (!otpData)
    return NextResponse.json({ error: "Failed signing up" }, { status: 400 });

  return NextResponse.json({ success: true, id: otpData.id });
}
