"use server";

import { getDbUserId } from "@/lib/getCurrentUser";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase-config";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");

    console.log("Reached here");

    const fileExtension = file.name.split(".").pop();
    const filePath = `${userId}/${new Date()}-${randomUUID()}.${fileExtension}`;

    const { error } = await supabase.storage
      .from("user-uploads")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    await prisma.file.create({
      data: {
        ownerId: userId,
        name: file.name,
        bucket: "user-uploads",
        path: filePath,
        size: file.size,
        mimeType: file.type,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("Error in upload files action", error);
    return { success: false, error };
  }
}
