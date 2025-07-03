export type FileCategory = "images" | "media" | "documents" | "others" | "all";

export type SortOrder = "ascending" | "descending";

export type SortCriteria = "name" | "size" | "category" | "date";

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

export interface FileType {
  id: string;
  mimeType: string;
  size: number;
  path: string;
  name: string;
  createdAt: Date;
  category: FileCategory;
  sharedUsers: UserType[];
}
