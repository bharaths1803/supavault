"use server";

import { getDbUserId } from "@/lib/getCurrentUser";
import prisma from "@/lib/prisma";

export async function searchUsers(searchTerm: string) {
  try {
    const userId = await getDbUserId();

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: searchTerm,
          mode: "insensitive",
        },
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return users;
  } catch (error) {
    console.log("Error in search users actions", error);
  }
}
