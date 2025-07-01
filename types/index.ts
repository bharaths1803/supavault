export interface LoginFormType {
  email: string;
}

export interface SignupFormType extends LoginFormType {
  username: string;
}

export interface UserType {
  username: string;
  email: string;
  id: string;
}

export interface UploadingFileType {
  id: string;
  status: "uploading" | "success" | "error";
  error?: string;
  fileFormData: FormData;
  progress: number;
}

export type FileCategory = "images" | "videos" | "documents" | "others" | "all";
