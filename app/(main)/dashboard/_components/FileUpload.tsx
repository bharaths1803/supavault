"use client";

import { UploadingFileType } from "@/types";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { uploadFile } from "@/actions/file.actions";
import UploadStatus from "./UploadStatus";
import toast from "react-hot-toast";

const FileUpload = () => {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFileType[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    setIsDraggingOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleUploadFile(droppedFiles);
  }, []);

  const removeUploadingFile = (fileId: string) => {
    setUploadingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const clearAllUploads = () => {
    setUploadingFiles([]);
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleUploadFile(files);
      e.target.value = "";
    }
  };

  const handleUploadFile = async (files: File[]) => {
    const largeFilesCount = files.filter(
      (file) => file.size > 10 * 1024 * 1024
    ).length;
    if (largeFilesCount > 0) {
      toast.error("One or more files exceed 10mb");
      return;
    }
    setIsUploading(true);
    const newUploadingFiles: UploadingFileType[] = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return {
        id: `${new Date()}-${Math.random()}`,
        status: "uploading",
        progress: 0,
        fileFormData: formData,
      };
    });

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    const uploadPromises = newUploadingFiles.map(async (uploadingFile, idx) => {
      try {
        await uploadFile(uploadingFile.fileFormData);

        setUploadingFiles((prev) =>
          prev.map((file) =>
            file.id === uploadingFile.id
              ? { ...file, status: "success", progress: 100 }
              : file
          )
        );
      } catch (error) {
        setUploadingFiles((prev) =>
          prev.map((file) =>
            file.id === uploadingFile.id
              ? { ...file, status: "error", error: "Upload Failed!" }
              : file
          )
        );
      }
    });

    await Promise.allSettled(uploadPromises);

    setTimeout(() => {
      setUploadingFiles((prev) =>
        prev.filter((file) => file.status !== "success")
      );
    }, 3000);
    setIsUploading(false);
  };

  return (
    <>
      <div className="p-6">
        {/* Upload Area */}
        {isUploading && <p className="mt-3 text-gray-900">Uploading files</p>}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative p-8 border-2 border-dashed rounded-lg text-center transition-all duration-200 ${isDraggingOver ? "border-pink-400 bg-pink-50 scale-105" : "border-gray-300 hover:border-pink-400 hover:bg-pink-50"}`}
        >
          <input
            type="file"
            multiple
            accept="*/*"
            className="absolute inset-0 w-full h-full opacity-0"
            onChange={handleSelectFile}
          />
          <div className="pointer-events-none">
            <Upload
              className={`h-12 w-12 mx-auto mb-4 transition-colors ${isDraggingOver ? "text-pink-500" : "text-gray-400"}`}
            />
            <p
              className={`text-lg font-medium mb-2 transition-colors ${isDraggingOver ? "text-pink-700" : "text-gray-900"}`}
            >
              {isDraggingOver ? "Drop your files here" : "Upload your files"}
            </p>
            <p className="text-gray-500 mb-5">
              Drag and drop multiple files here, or click to browse
            </p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Maximum file size: 10MB per file</p>
              <p>Supported formats: Images, Videos, Documents, and more</p>
            </div>
          </div>
        </div>
        {uploadingFiles.length > 0 && (
          <UploadStatus
            uploadingFiles={uploadingFiles}
            clearAllUploads={clearAllUploads}
            removeUploadingFile={removeUploadingFile}
          />
        )}
      </div>
    </>
  );
};

export default FileUpload;
