import { FileCategory } from "@/types";

export function generateOtp() {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; ++i) {
    const randomIdx = Math.floor(Math.random() * 10);
    otp += digits[randomIdx];
  }
  return otp;
}

export function categorizeFileType(mimeType: string): FileCategory {
  if (mimeType.startsWith("image/")) return "images";
  if (mimeType.startsWith("video/") || mimeType.startsWith("audio/"))
    return "media";

  // Common document types
  const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "text/plain",
  ];

  if (documentTypes.includes(mimeType)) return "documents";

  return "others";
}

export function extractSupabasePathFromUrl(url: string): string {
  try {
    const parts = url.split("/object/public/user-uploads/");
    if (parts.length !== 2) return "";
    return parts[1]; // This is the path after bucket name
  } catch {
    return "";
  }
}
