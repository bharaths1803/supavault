"use server";

import { getDbUserId } from "@/lib/getCurrentUser";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase-config";
import { categorizeFileType, extractSupabasePathFromUrl } from "@/lib/utils";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");

    const fileExtension = file.name.split(".").pop();
    const filePath = `${userId}/${randomUUID()}.${fileExtension}`;

    const { error } = await supabase.storage
      .from("user-uploads")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data: urlData } = await supabase.storage
      .from("user-uploads")
      .getPublicUrl(filePath);
    const url = urlData.publicUrl;

    await prisma.file.create({
      data: {
        ownerId: userId,
        name: file.name,
        bucket: "user-uploads",
        path: url,
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

export async function getFiles() {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");

    const files = await prisma.file.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        mimeType: true,
        size: true,
        path: true,
        name: true,
        createdAt: true,
      },
    });

    const filesWithCategory = files.map((file) => ({
      ...file,
      category: categorizeFileType(file.mimeType),
    }));

    const totalSize = files.reduce((s, file) => s + Number(file.size), 0);

    return { files: filesWithCategory, totalSize };
  } catch (error) {
    console.log("Error in get files action", error);
    throw new Error("Error in get files actions");
  }
}

export async function deleteFile(fileId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found!");

    const file = await prisma.file.findUnique({
      where: {
        ownerId: userId,
        id: fileId,
      },
    });

    if (!file) throw new Error("File not found!");

    const relativeFilePath = extractSupabasePathFromUrl(file.path);

    const { error } = await supabase.storage
      .from("user-uploads")
      .remove([relativeFilePath]);

    if (error) throw new Error(error.message);

    await prisma.file.delete({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("Error deleteing file", error);
    return { success: false, error };
  }
}
