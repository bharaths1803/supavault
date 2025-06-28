import { sendEmail } from "@/actions/email.action";
import EmailTemplate from "@/emails/Template";
import prisma from "@/lib/prisma";
import { generateOtp } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const otp = generateOtp();

  await sendEmail({
    to: email,
    subject: "🚀Your Magic Code Has Arrived!",
    react: EmailTemplate({
      username: user.username,
      otp,
    }),
  });

  await prisma.oTP.deleteMany({
    where: {
      email,
    },
  });

  const otpData = await prisma.oTP.create({
    data: {
      username: user.username,
      email,
      status: "PENDING",
      attempts: 0,
      otp,
    },
  });

  if (!otpData)
    return NextResponse.json({ error: "Failed logging in" }, { status: 400 });

  return NextResponse.json({
    success: true,
    id: otpData.id,
    username: user.username,
  });
}
