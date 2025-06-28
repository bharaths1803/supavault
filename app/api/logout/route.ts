import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  (await cookies()).set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
