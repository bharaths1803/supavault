"use client";

import { getFiles } from "@/actions/file.actions";
import { FileType } from "@/types";
import {
  Archive,
  Download,
  Eye,
  File,
  FileText,
  Image,
  ImageIcon,
  Info,
  Video,
  VideoIcon,
} from "lucide-react";

interface FileGridProps {
  userFiles: Awaited<ReturnType<typeof getFiles>>;
}

const FileGrid = ({ userFiles }: FileGridProps) => {
  const getFileIcon = (file: FileType) => {
    switch (file.category) {
      case "images":
        return <Image className="w-8 h-8 text-pink-500" />;
      case "media":
        if (file.mimeType.startsWith("image/"))
          return <ImageIcon className="w-8 h-8 text-rose-500" />;
        else return <VideoIcon className="w-8 h-8 text-rose-500" />;
      case "documents":
        return <FileText className="w-8 h-8 text-pink-600" />;
      default:
        return <Archive className="w-8 h-8 text-pink-400" />;
    }
  };

  const handleFilePreview = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  if (userFiles.files.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-center py-12">
        <div className="w-24 h-24 flex justify-center items-center rounded-full bg-gradient-to-r from-pink-100 to-rose-100 mb-6">
          <File className="h-12 w-12 text-pink-400" />
        </div>
        <h3 className="text-lg text-gray-900 font-medium mb-2">
          No Files Found
        </h3>
        <p className="text-gray-900 max-w-md">
          Upload some files to get started or adjust your search criteria to
          find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userFiles.files.map((file) => (
          // File
          <div
            key={file.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg border-pink-100 hover:border-pink-200 transition-all duration-200 cursor-pointer relative group"
          >
            <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex justify-center items-center">
              <div className="h-full w-full flex justify-center items-center">
                {getFileIcon(file)}
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex justify-center items-center space-x-2">
                <button
                  className="p-2 rounded-full text-pink-700 shadow-lg bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200"
                  title="Preview"
                  onClick={() => handleFilePreview(file.path)}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-full text-pink-700 shadow-lg bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200">
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="mt-2">{file.name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default FileGrid;
