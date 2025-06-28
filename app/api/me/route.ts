import { verifyJwt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const payload = verifyJwt(token);
  if (!payload) return new Response("Invalid token", { status: 401 });

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  if (!user) return new Response("User not found", { status: 404 });

  return Response.json(user);
}
