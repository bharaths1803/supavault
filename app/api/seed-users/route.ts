import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const users = [
      { email: "a@example.com", username: "Alice" },
      { email: "b@example.com", username: "Bob" },
      { email: "c@example.com", username: "Carol" },
      { email: "d@example.com", username: "Daniel" },
      { email: "e@example.com", username: "Eve" },
    ];

    await Promise.all(
      users.map((user) =>
        prisma.user.create({
          data: {
            username: user.username,
            email: user.email,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error seeding users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed users" },
      { status: 500 }
    );
  }
}
