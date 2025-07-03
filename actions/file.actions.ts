"use server";

import { getDbUserId } from "@/lib/getCurrentUser";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase-config";
import { categorizeFileType, extractSupabasePathFromUrl } from "@/lib/utils";
import { UserType } from "@/types";
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
        OR: [
          { ownerId: userId },
          {
            sharedUsers: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        mimeType: true,
        size: true,
        path: true,
        name: true,
        createdAt: true,
        sharedUsers: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const filesWithCategory = files.map((file) => ({
      ...file,
      category: categorizeFileType(file.mimeType),
    }));

    const totalSize = files.reduce((s, file) => s + Number(file.size), 0);

    console.log("Files", filesWithCategory);

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
        id: fileId,
      },
      include: {
        sharedUsers: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!file) throw new Error("File not found!");

    if (
      !file.sharedUsers.some((user) => user.id === userId) &&
      file.ownerId !== userId
    )
      throw new Error("Unauthorized!");

    const relativeFilePath = extractSupabasePathFromUrl(file.path);

    const { error } = await supabase.storage
      .from("user-uploads")
      .remove([relativeFilePath]);

    if (error) throw new Error(error.message);

    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("Error deleteing file", error);
    return { success: false, error };
  }
}

export async function renameFile(fileId: string, newFileName: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found!");

    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
      include: {
        sharedUsers: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!file) throw new Error("File not found!");

    if (
      !file.sharedUsers.some((user) => user.id === userId) &&
      file.ownerId !== userId
    )
      throw new Error("Unauthorized!");

    await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        name: newFileName,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("Error updating file", error);
    return { success: false, error };
  }
}

export async function shareFiles(users: UserType[], fileId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");

    await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        sharedUsers: {
          set: users.map((user) => ({ id: user.id })),
        },
      },
    });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.log("Share files action error", error);
    return { success: false };
  }
}
