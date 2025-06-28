import { signJwt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { otpCode, username, otpId, email } = await req.json();
  const otpModal = await prisma.oTP.findUnique({
    where: {
      id: otpId,
    },
  });

  if (!otpModal)
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });

  const now = new Date();
  const diffMs = now.getTime() - new Date(otpModal.createdAt).getTime();
  const diffMins = diffMs / (60 * 1000);

  if (otpModal.attempts === 3 || diffMins > 10) {
    await prisma.oTP.deleteMany({
      where: {
        id: otpId,
        username,
        email,
      },
    });
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  if (
    username !== otpModal.username ||
    otpId !== otpModal.id ||
    email !== otpModal.email ||
    otpCode !== otpModal.otp ||
    diffMins > 10
  ) {
    await prisma.oTP.updateMany({
      where: {
        id: otpId,
        username,
        email,
      },
      data: {
        attempts: (otpModal?.attempts || 0) + 1,
      },
    });
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  await prisma.oTP.deleteMany({
    where: {
      id: otpId,
      username,
      email,
    },
  });

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user)
    user = await prisma.user.create({
      data: {
        username,
        email,
      },
    });

  const token = signJwt(user.id);

  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}
