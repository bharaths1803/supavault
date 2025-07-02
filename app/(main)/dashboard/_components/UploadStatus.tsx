"use client";

import { UploadingFileType } from "@/types";
import { AlertCircle, CheckCircle, File, Loader2, X } from "lucide-react";
import { BarLoader } from "react-spinners";

interface UploadStatusProps {
  uploadingFiles: UploadingFileType[];
  clearAllUploads: () => void;
  removeUploadingFile: (fileId: string) => void;
}

const UploadStatus = ({
  uploadingFiles,
  clearAllUploads,
  removeUploadingFile,
}: UploadStatusProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const uploadFilesCnt = uploadingFiles.filter(
    (file) => file.status === "uploading"
  ).length;
  const errorFilesCnt = uploadingFiles.filter(
    (file) => file.status === "error"
  ).length;
  const successFilesCnt = uploadingFiles.filter(
    (file) => file.status === "success"
  ).length;

  return (
    <div className="z-50 fixed bottom-4 right-4 w-80 rounded-lg shadow-xl border border-pink-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex justify-center items-center">
            <File className="h-3 w-3 text-white" />
          </div>
        </div>
        <button
          className="p-1 rounded-full transition-colors hover:bg-pink-200"
          onClick={clearAllUploads}
        >
          <X className="h-4 w-4 text-pink-400" />
        </button>
      </div>

      {/* File List */}
      <div className="max-h-64 overflow-y-auto">
        {uploadingFiles.map((file) => {
          return (
            <div key={file.id} className="p-3 border-b border-pink-50 w-full">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {file.status === "uploading" && (
                    <Loader2 className="w-4 h-4 text-pink-500 animate-spin" />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  {file.status === "success" && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="truncate text-sm font-medium text-gray-900">
                    {(file.fileFormData.get("file") as File).name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(
                      (file.fileFormData.get("file") as File).size
                    )}
                  </p>
                  {file.status === "uploading" && (
                    <BarLoader width={"100%"} color="#ec4899" />
                  )}
                  {file.status === "success" && (
                    <p className="text-xs text-green-600 mt-1">
                      Upload completed
                    </p>
                  )}
                  {file.status === "error" && (
                    <p className="text-xs text-red-600 mt-1">{file.error}</p>
                  )}
                </div>
                <button
                  className="p-1 rounded-full transition-colors hover:bg-pink-200"
                  onClick={() => removeUploadingFile(file.id)}
                >
                  <X className="h-4 w-4 text-pink-400" />
                </button>{" "}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      {uploadingFiles.length > 1 && (
        <div className="px-4 py-2 border-b border-pink-100 bg-gradient-to-r from-pink-50/50 to-rose-50/50">
          <div className="text-gray-600 text-xs flex justify-between items-center mb-1">
            <span>Overall Progress</span>
            <span>
              {successFilesCnt + errorFilesCnt} / {uploadingFiles.length} files
            </span>
          </div>
          <div className="w-full rounded-full bg-pink-100 h-1.5">
            <div
              className={`bg-gradient-to-r from-pink-500 to-rose-500 h-1.5 rounded-full transition-all duration-300`}
              style={{
                width: `${((successFilesCnt + errorFilesCnt) / uploadingFiles.length) * 100}%`,
              }}
            />
          </div>
          {(uploadFilesCnt > 0 || errorFilesCnt > 0) && (
            <div className="text-xs mt-1 flex justify-between items-center">
              {uploadFilesCnt > 0 && (
                <span className="text-pink-600">
                  {uploadFilesCnt} uploading
                </span>
              )}
              {errorFilesCnt > 0 && (
                <span className="text-red-600">{errorFilesCnt} failed</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadStatus;
