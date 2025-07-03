"use client";

import { deleteFile, getFiles } from "@/actions/file.actions";
import { FileCategory, FileType } from "@/types";
import {
  Archive,
  Download,
  Eye,
  File,
  FileText,
  Image,
  ImageIcon,
  Info,
  MoreVertical,
  Trash2,
  Video,
  VideoIcon,
} from "lucide-react";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import FileDetailsModal from "./FileDetailsModal";

interface FileGridProps {
  userFiles: Awaited<ReturnType<typeof getFiles>>;
}

const FileGrid = ({ userFiles }: FileGridProps) => {
  const [activeDropdownFileId, setActiveDropdownFileId] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteingFileName, setDeleteingFileName] = useState<string>("");
  const [deleteingfileId, setDeleteingFileId] = useState<string>("");

  const [fileDetails, setFileDetails] = useState<FileType | null>(null);
  const [showFileDetailsModal, setShowFileDetailsModal] =
    useState<boolean>(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

  const handleToggleDropDown = (fileId: string) => {
    setActiveDropdownFileId((p) => (p === fileId ? "" : fileId));
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

  const handleCloseDeleteModal = () => {
    setDeleteingFileName("");
    setShowDeleteModal(false);
  };

  const handleOpenDeleteModal = (fileName: string, fileId: string) => {
    setDeleteingFileName(fileName);
    setDeleteingFileId(fileId);
    setShowDeleteModal(true);
  };

  const handleCloseFileDetailsModal = () => {
    setFileDetails(null);
    setShowFileDetailsModal(false);
  };

  const handleOpenFileDetailsModal = (file: FileType) => {
    setFileDetails(file);
    setShowFileDetailsModal(true);
  };

  const getCategoryStyle = (category: FileCategory): string => {
    const categoryMap = {
      images: "bg-pink-100 text-pink-800",
      media: "bg-rose-100 text-rose-800",
      documents: "bg-pink-100 text-pink-700",
      others: "bg-pink-50 text-pink-600",
      all: "bg-pink-50 text-pink-600",
    };
    return categoryMap[category];
  };

  return (
    <>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userFiles.files.map((file) => (
          // File
          <div
            key={file.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg border-pink-100 hover:border-pink-200 transition-all duration-200 cursor-pointer group"
          >
            <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex justify-center items-center relative">
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
                <button
                  className="p-2 rounded-full text-pink-700 shadow-lg bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200"
                  onClick={() => handleOpenFileDetailsModal(file)}
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </h3>
                <div className="relative">
                  <button
                    onClick={() => handleToggleDropDown(file.id)}
                    className="p-1 rounded-full hover:bg-pink-50 transition-colors ml-2"
                  >
                    <MoreVertical className="text-pink-400 h-4 w-4" />
                  </button>

                  {activeDropdownFileId === file.id && (
                    <div className="absolute right-0 top-8 bg-white border border-pink-200 py-2 z-10 min-w-[160px] rounded-lg shadow-lg">
                      <button
                        className="px-4 py-2 hover:bg-pink-50 flex items-center space-x-2 text-gray-700 text-sm w-full"
                        onClick={() => handleOpenFileDetailsModal(file)}
                      >
                        <Info className="h-4 w-4 text-pink-400" />
                        <span>View Details</span>
                      </button>
                      <button
                        className="px-4 py-2 hover:bg-pink-50 flex items-center space-x-2 text-gray-700 text-sm w-full"
                        onClick={() => handleFilePreview(file.path)}
                      >
                        <Eye className="h-4 w-4 text-pink-400" />
                        <span>Preview</span>
                      </button>
                      <button
                        className="px-4 py-2 hover:bg-pink-50 flex items-center space-x-2 text-gray-700 text-sm w-full"
                        onClick={() =>
                          handleOpenDeleteModal(file.name, file.id)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-pink-400" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p>{formatFileSize(file.size)}</p>
                <p>{new Date(file.createdAt).toDateString()}</p>
              </div>
              <div className="mt-3">
                <span
                  className={`px-2 py-1 rounded-full inline-flex justify-center items-center text-xs font-medium ${getCategoryStyle(file.category)}`}
                >
                  {file.category.charAt(0).toUpperCase() +
                    file.category.slice(1, -1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && (
        <DeleteModal
          handleCloseDeleteModal={handleCloseDeleteModal}
          fileName={deleteingFileName}
          fileId={deleteingfileId}
        />
      )}
      {showFileDetailsModal && fileDetails && (
        <FileDetailsModal
          file={fileDetails}
          handleCloseFileDetailsModal={handleCloseFileDetailsModal}
          sharedUsers={fileDetails.sharedUsers}
        />
      )}
    </>
  );
};

export default FileGrid;
